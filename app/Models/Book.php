<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'title',
        'author',
        'isbn',
        'stock',
        'cover',
    ];

    protected $casts = [
        'stock' => 'integer',
    ];

    protected $appends = [
        'is_available',
        'cover_url',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function borrowings(): HasMany
    {
        return $this->hasMany(Borrowing::class);
    }

    public function getIsAvailableAttribute(): bool
    {
        return $this->stock > 0;
    }

    public function getCoverUrlAttribute(): ?string
    {
        if (! $this->cover) {
            return null;
        }

       return asset('storage/' . $this->cover);
    }
}
