<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Category;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'books' => Book::count(),
                'categories' => Category::count(),
                'members' => User::where('role', User::ROLE_MEMBER)->count(),
                'borrowings' => Borrowing::count(),
                'activeBorrowings' => Borrowing::active()->count(),
                'overdue' => Borrowing::active()->whereDate('borrow_date', '<', now()->subDays(Borrowing::LOAN_PERIOD_DAYS))->count(),
            ],
            'recentBorrowings' => Borrowing::query()
                ->with(['book.category', 'user'])
                ->latest()
                ->limit(5)
                ->get(),
            'lowStockBooks' => Book::query()
                ->with('category')
                ->where('stock', '<=', 3)
                ->orderBy('stock')
                ->limit(5)
                ->get(),
        ]);
    }
}
