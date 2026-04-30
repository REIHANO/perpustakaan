<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::query()
            ->with('category')
            ->latest()
            ->get();

        return Inertia::render('Admin/Books/Index', [
            'books' => $books,
            'categories' => Category::query()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'isbn' => ['required', 'string', 'max:50', 'unique:books,isbn'],
            'stock' => ['required', 'integer', 'min:0'],
            'cover' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);
        if ($request->hasFile('cover')) { 
        $path = $request->file('cover')->store('covers', 'public');
        $validated['cover'] = $path;
    }
        $book = Book::create($validated);

        return back()->with('success', 'Buku berhasil dibuat.');
    }

    public function show(Book $book)
    {
        return response()->json($book->load('category'));
    }

    public function update(Request $request, Book $book): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'title' => ['nullable', 'string', 'max:255'],
            'author' => ['nullable', 'string', 'max:255'],
            'isbn' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('books', 'isbn')->ignore($book->id),
            ],
            'stock' => ['nullable', 'integer', 'min:0'],
            'cover' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);
        if ($request->hasFile('cover')) {
  
    if ($book->cover) {
        Storage::disk('public')->delete($book->cover);
    }
    $validated['cover'] = $request->file('cover')->store('covers', 'public');
}

        $book->update($validated);

        return back()->with('success', 'Buku berhasil diperbarui.');
    }

    public function destroy(Book $book): RedirectResponse
    {
        if ($book->borrowings()->exists()) {
            return back()->with('error', 'Buku tidak bisa dihapus karena sudah memiliki riwayat peminjaman.');
        }

        $book->delete();

        return back()->with('success', 'Buku berhasil dihapus.');
    }
}
