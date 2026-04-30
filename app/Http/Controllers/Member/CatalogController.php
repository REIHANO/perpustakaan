<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $books = Book::query()
            ->with('category')
            ->latest()
            ->get();

        return Inertia::render('Member/Catalog/Index', [
            'books' => $books,
            'categories' => Category::query()->orderBy('name')->get(),
            'filters' => [
                'search' => $request->string('search')->toString(),
                'category' => $request->string('category')->toString(),
            ],
        ]);
    }

    public function show(Request $request, Book $book)
    {
        $book->load('category');

        return Inertia::render('Member/Catalog/Show', [
            'book' => $book,
            'activeBorrowing' => Borrowing::query()
                ->where('user_id', $request->user()->id)
                ->where('book_id', $book->id)
                ->active()
                ->first(),
            'relatedBooks' => Book::query()
                ->with('category')
                ->where('category_id', $book->category_id)
                ->whereKeyNot($book->id)
                ->limit(4)
                ->get(),
        ]);
    }
}
