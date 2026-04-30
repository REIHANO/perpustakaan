<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class BorrowingController extends Controller
{
    public function index(Request $request)
    {
        $borrowings = Borrowing::query()
            ->with(['book.category'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return Inertia::render('Member/Borrowings/Index', [
            'borrowings' => $borrowings,
        ]);
    }

    public function show(Request $request, Borrowing $borrowing)
    {
        $this->assertOwnership($request, $borrowing);

        return response()->json($borrowing->load(['book.category', 'user']));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'book_id' => ['required', 'integer', 'exists:books,id'],
        ]);

        $borrowing = DB::transaction(function () use ($request, $validated) {
            $book = Book::query()->lockForUpdate()->findOrFail($validated['book_id']);

            if ($this->hasActiveTransaction($request->user()->id, $book->id)) {
                throw ValidationException::withMessages([
                    'book_id' => 'Buku ini masih aktif dipinjam atau direservasi.',
                ]);
            }

            if ($book->stock < 1) {
                throw ValidationException::withMessages([
                    'book_id' => 'Stok buku habis. Tidak bisa melakukan peminjaman.',
                ]);
            }

            $borrowing = Borrowing::create([
                'user_id' => $request->user()->id,
                'book_id' => $book->id,
                'borrow_date' => today(),
                'return_date' => null,
                'status' => Borrowing::STATUS_BORROWED,
                'fine_amount' => 0,
            ]);

            $book->decrement('stock');

            return $borrowing->load(['book.category', 'user']);
        });

        return back()->with('success', 'Buku berhasil dipinjam.');
    }

    public function returnBook(Request $request, Borrowing $borrowing): RedirectResponse
    {
        $this->assertOwnership($request, $borrowing);

        $result = DB::transaction(function () use ($borrowing) {
            $borrowing = Borrowing::query()->lockForUpdate()->findOrFail($borrowing->id);

            if (! $borrowing->isBorrowed() && $borrowing->status !== Borrowing::STATUS_OVERDUE) {
                throw ValidationException::withMessages([
                    'borrowing' => 'Hanya peminjaman aktif yang bisa dikembalikan.',
                ]);
            }

            $book = Book::query()->lockForUpdate()->findOrFail($borrowing->book_id);
            $returnedAt = today();
            $fineAmount = $borrowing->calculateFine($returnedAt);

            $borrowing->update([
                'return_date' => $returnedAt,
                'status' => Borrowing::STATUS_RETURNED,
                'fine_amount' => $fineAmount,
            ]);

            $book->increment('stock');

            return $borrowing->fresh()->load(['book.category', 'user']);
        });

        return back()->with('success', 'Buku berhasil dikembalikan.');
    }

    private function hasActiveTransaction(int $userId, int $bookId): bool
    {
        return Borrowing::query()
            ->where('user_id', $userId)
            ->where('book_id', $bookId)
            ->whereIn('status', Borrowing::ACTIVE_STATUSES)
            ->lockForUpdate()
            ->first() !== null;
    }

    private function assertOwnership(Request $request, Borrowing $borrowing): void
    {
        if ($borrowing->user_id !== $request->user()->id) {
            abort(403, 'Anda tidak memiliki akses ke data ini.');
        }
    }
}
