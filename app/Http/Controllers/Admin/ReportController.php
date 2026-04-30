<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Borrowing;
use App\Models\Category;
use App\Models\Book;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reports/Index', [
            'summary' => [
                'totalBorrowings' => Borrowing::count(),
                'activeBorrowings' => Borrowing::active()->count(),
                'returnedBorrowings' => Borrowing::returned()->count(),
                'totalFine' => (float) Borrowing::sum('fine_amount'),
            ],
            'mostBorrowedBooks' => Book::query()
                ->withCount('borrowings')
                ->orderByDesc('borrowings_count')
                ->limit(7)
                ->get(),
            'categoryCounts' => Category::query()
                ->withCount('books')
                ->orderByDesc('books_count')
                ->get(),
            'overdueBorrowings' => Borrowing::query()
                ->with(['user', 'book.category'])
                ->active()
                ->orderBy('borrow_date')
                ->get()
                ->filter(fn (Borrowing $borrowing) => $borrowing->is_overdue)
                ->values(),
        ]);
    }
}
