<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Borrowing extends Model
{
    use HasFactory;

    public const STATUS_RESERVED = 'reserved';

    public const STATUS_BORROWED = 'borrowed';

    public const STATUS_RETURNED = 'returned';

    public const STATUS_OVERDUE = 'overdue';

    public const LOAN_PERIOD_DAYS = 7;

    public const FINE_PER_DAY = 1000;

    public const ACTIVE_STATUSES = [
        self::STATUS_RESERVED,
        self::STATUS_BORROWED,
        self::STATUS_OVERDUE,
    ];

    protected $fillable = [
        'user_id',
        'book_id',
        'borrow_date',
        'return_date',
        'status',
        'fine_amount',
    ];

    protected $casts = [
        'borrow_date' => 'date',
        'return_date' => 'date',
        'fine_amount' => 'decimal:2',
    ];

    protected $appends = [
        'due_date',
        'is_overdue',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function isReserved(): bool
    {
        return $this->status === self::STATUS_RESERVED;
    }

    public function isBorrowed(): bool
    {
        return $this->status === self::STATUS_BORROWED;
    }

    public function isReturned(): bool
    {
        return $this->status === self::STATUS_RETURNED;
    }

    public function calculateFine(Carbon $returnedAt): float
    {
        $dueDate = $this->borrow_date->copy()->addDays(self::LOAN_PERIOD_DAYS);

        if ($returnedAt->lessThanOrEqualTo($dueDate)) {
            return 0.0;
        }

        return (float) $dueDate->diffInDays($returnedAt) * self::FINE_PER_DAY;
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', self::ACTIVE_STATUSES);
    }

    public function scopeReserved($query)
    {
        return $query->where('status', self::STATUS_RESERVED);
    }

    public function scopeReturned($query)
    {
        return $query->where('status', self::STATUS_RETURNED);
    }

    public function getDueDateAttribute(): string
    {
        return $this->borrow_date->copy()->addDays(self::LOAN_PERIOD_DAYS)->toDateString();
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->status !== self::STATUS_RETURNED
            && now()->startOfDay()->greaterThan($this->borrow_date->copy()->addDays(self::LOAN_PERIOD_DAYS));
    }
}
