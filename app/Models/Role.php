<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_system',
    ];

    protected $casts = [
        'is_system' => 'boolean',
    ];

    public static function makeSlug(string $name): string
    {
        return Str::slug($name);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'role', 'slug');
    }

    public function permissionIds(): Collection
    {
        return Permission::forRole($this->slug)->pluck('id');
    }

    public function syncPermissions(array $permissionIds): void
    {
        Permission::syncRole($this->slug, $permissionIds);
    }

    public function canDelete(): bool
    {
        return ! $this->is_system && $this->users()->doesntExist();
    }
}
