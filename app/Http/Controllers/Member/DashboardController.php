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

    // Filter activeBorrowings benar-benar hanya yang statusnya dipinjam/telat
    $activeBorrowings = Borrowing::query()
        ->with(['book.category'])
        ->where('user_id', $userId)
        ->whereIn('status', ['borrowed', 'overdue']) // Pastikan 'returned' tidak masuk
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
            ->filter(function ($borrowing) {
                // Notifikasi hanya muncul jika jatuh tempo dalam 7 hari ke depan atau sudah lewat
                return now()->startOfDay()->diffInDays($borrowing->due_date, false) <= 7;
            })
            ->map(function (Borrowing $borrowing) {
                return [
                    'id' => $borrowing->id,
                    'title' => $borrowing->book->title,
                    'dueDate' => $borrowing->due_date->format('Y-m-d'),
                    'isOverdue' => $borrowing->is_overdue,
                    'daysLeft' => now()->startOfDay()->diffInDays($borrowing->due_date, false),
                ];
            })
            ->values(),
        'recommendedBooks' => Book::query()
            ->with('category')
            ->where('stock', '>', 0)
            ->limit(4)
            ->get(),
    ]);
}
}
