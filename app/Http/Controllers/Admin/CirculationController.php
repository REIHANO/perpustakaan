<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CirculationController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Admin/Circulation/Index', [
            'canSetFine' => $request->user()->canPermission('set-fine'),
            'members' => User::query()
                ->whereHas('roleRecord', function ($query): void {
                    $query->where('slug', User::ROLE_MEMBER);
                })
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
            'books' => Book::query()
                ->with('category')
                ->orderBy('title')
                ->get(),
            'borrowings' => Borrowing::query()
                ->with(['user', 'book.category'])
                ->latest()
                ->limit(20)
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'book_id' => ['required', 'integer', 'exists:books,id'],
        ]);

        DB::transaction(function () use ($validated) {
            $book = Book::query()->lockForUpdate()->findOrFail($validated['book_id']);

            $hasActiveBorrowing = Borrowing::query()
                ->where('user_id', $validated['user_id'])
                ->where('book_id', $book->id)
                ->whereIn('status', Borrowing::ACTIVE_STATUSES)
                ->lockForUpdate()
                ->exists();

            if ($hasActiveBorrowing) {
                throw ValidationException::withMessages([
                    'book_id' => 'Member sudah memiliki transaksi aktif untuk buku ini.',
                ]);
            }

            if ($book->stock < 1) {
                throw ValidationException::withMessages([
                    'book_id' => 'Stok buku habis.',
                ]);
            }

            Borrowing::create([
                'user_id' => $validated['user_id'],
                'book_id' => $book->id,
                'borrow_date' => today(),
                'return_date' => null,
                'status' => Borrowing::STATUS_BORROWED,
                'fine_amount' => 0,
            ]);

            $book->decrement('stock');
        });

        return back()->with('success', 'Peminjaman berhasil diproses.');
    }

    public function returnBook(Request $request, Borrowing $borrowing): RedirectResponse
    {
        $validated = $request->validate([
            'fine_amount' => ['nullable', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($borrowing, $request, $validated) {
            $borrowing = Borrowing::query()->lockForUpdate()->findOrFail($borrowing->id);

            if (! in_array($borrowing->status, [Borrowing::STATUS_BORROWED, Borrowing::STATUS_OVERDUE], true)) {
                throw ValidationException::withMessages([
                    'borrowing' => 'Transaksi ini tidak bisa dikembalikan.',
                ]);
            }

            $book = Book::query()->lockForUpdate()->findOrFail($borrowing->book_id);
            $fineAmount = $request->filled('fine_amount') && $request->user()->canPermission('set-fine')
                ? (float) $validated['fine_amount']
                : $borrowing->calculateFine(today());

            $borrowing->update([
                'return_date' => today(),
                'status' => Borrowing::STATUS_RETURNED,
                'fine_amount' => $fineAmount,
            ]);

            $book->increment('stock');
        });

        return back()->with('success', 'Buku berhasil dikembalikan.');
    }
}
