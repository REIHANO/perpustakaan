<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $reservations = Borrowing::query()
            ->with(['book.category'])
            ->where('user_id', $request->user()->id)
            ->where('status', Borrowing::STATUS_RESERVED)
            ->latest()
            ->get();

        return Inertia::render('Member/Reservations/Index', [
            'reservations' => $reservations,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'book_id' => ['required', 'integer', 'exists:books,id'],
        ]);

        $reservation = DB::transaction(function () use ($request, $validated) {
            $book = Book::query()->lockForUpdate()->findOrFail($validated['book_id']);

            if ($this->hasActiveTransaction($request->user()->id, $book->id)) {
                throw ValidationException::withMessages([
                    'book_id' => 'Buku ini sudah memiliki transaksi aktif.',
                ]);
            }

            $reservation = Borrowing::create([
                'user_id' => $request->user()->id,
                'book_id' => $book->id,
                'borrow_date' => today(),
                'return_date' => null,
                'status' => Borrowing::STATUS_RESERVED,
                'fine_amount' => 0,
            ]);

            return $reservation->load(['book.category', 'user']);
        });

        return back()->with('success', 'Buku berhasil direservasi.');
    }

    public function show(Request $request, Borrowing $reservation)
    {
        $this->assertOwnership($request, $reservation);

        if (! $reservation->isReserved()) {
            return back()->with('error', 'Data ini bukan reservasi aktif.');
        }

        return response()->json($reservation->load(['book.category', 'user']));
    }

    public function borrow(Request $request, Borrowing $reservation): RedirectResponse
    {
        $this->assertOwnership($request, $reservation);

        $result = DB::transaction(function () use ($reservation) {
            $reservation = Borrowing::query()->lockForUpdate()->findOrFail($reservation->id);

            if (! $reservation->isReserved()) {
                throw ValidationException::withMessages([
                    'reservation' => 'Hanya reservasi aktif yang bisa diubah menjadi peminjaman.',
                ]);
            }

            $book = Book::query()->lockForUpdate()->findOrFail($reservation->book_id);

            if ($book->stock < 1) {
                throw ValidationException::withMessages([
                    'book_id' => 'Stok buku habis. Reservasi belum bisa diubah menjadi peminjaman.',
                ]);
            }

            $reservation->update([
                'borrow_date' => today(),
                'return_date' => null,
                'status' => Borrowing::STATUS_BORROWED,
                'fine_amount' => 0,
            ]);

            $book->decrement('stock');

            return $reservation->fresh()->load(['book.category', 'user']);
        });

        return back()->with('success', 'Reservasi berhasil diubah menjadi peminjaman.');
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
