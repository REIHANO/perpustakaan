<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    public static function forRole(string $role): Collection
    {
        return static::query()
            ->select('permissions.*')
            ->join('role_permissions', 'permissions.id', '=', 'role_permissions.permission_id')
            ->where('role_permissions.role', $role)
            ->orderBy('permissions.name')
            ->get();
    }

    public static function roleHasPermission(string $role, string $permissionSlug): bool
    {
        return static::query()
            ->join('role_permissions', 'permissions.id', '=', 'role_permissions.permission_id')
            ->where('role_permissions.role', $role)
            ->where('permissions.slug', $permissionSlug)
            ->exists();
    }

    public static function syncRole(string $role, array $permissionIds): void
    {
        DB::transaction(function () use ($role, $permissionIds): void {
            $normalizedPermissionIds = static::normalizeRolePermissionIds($permissionIds);

            DB::table('role_permissions')->where('role', $role)->delete();

            $rows = collect($normalizedPermissionIds)
                ->filter()
                ->unique()
                ->map(fn ($permissionId) => [
                    'role' => $role,
                    'permission_id' => $permissionId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
                ->values()
                ->all();

            if ($rows !== []) {
                DB::table('role_permissions')->insert($rows);
            }
        });
    }

    public static function normalizeRolePermissionIds(array $permissionIds): array
    {
        $ids = collect($permissionIds)
            ->filter()
            ->unique()
            ->values();

        $circulationId = static::query()->where('slug', 'manage-circulation')->value('id');
        $setFineId = static::query()->where('slug', 'set-fine')->value('id');

        if (! $circulationId || ! $setFineId) {
            return $ids->all();
        }

        if ($ids->contains($setFineId) && ! $ids->contains($circulationId)) {
            $ids->push($circulationId);
        }

        if (! $ids->contains($circulationId)) {
            $ids = $ids->reject(fn ($id) => (int) $id === (int) $setFineId)->values();
        }

        return $ids->all();
    }

    public static function makeSlug(string $name): string
    {
        return Str::slug($name);
    }
}
