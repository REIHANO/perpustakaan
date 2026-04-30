<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $activeBorrowings = Borrowing::query()
            ->with(['book.category'])
            ->where('user_id', $userId)
            ->active()
            ->latest()
            ->get();

        return Inertia::render('Member/Dashboard', [
            'stats' => [
                'activeBorrowings' => $activeBorrowings->count(),
                'historyCount' => Borrowing::where('user_id', $userId)->count(),
                'reservations' => Borrowing::where('user_id', $userId)->reserved()->count(),
                'availableBooks' => Book::where('stock', '>', 0)->count(),
            ],
            'activeBorrowings' => $activeBorrowings,
            'notifications' => $activeBorrowings
                ->map(function (Borrowing $borrowing) {
                    $daysLeft = now()->startOfDay()->diffInDays($borrowing->borrow_date->copy()->addDays(Borrowing::LOAN_PERIOD_DAYS), false);

                    return [
                        'id' => $borrowing->id,
                        'title' => $borrowing->book->title,
                        'dueDate' => $borrowing->due_date,
                        'isOverdue' => $borrowing->is_overdue,
                        'daysLeft' => $daysLeft,
                    ];
                })
                ->values(),
            'recommendedBooks' => Book::query()
                ->with('category')
                ->where('stock', '>', 0)
                ->orderByDesc('stock')
                ->limit(4)
                ->get(),
        ]);
    }
}
