<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('SuperAdmin/Roles/Index', [
            'roles' => Role::query()
                ->withCount('users')
                ->orderBy('name')
                ->get()
                ->map(fn (Role $role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'slug' => $role->slug,
                    'description' => $role->description,
                    'is_system' => $role->is_system,
                    'users_count' => $role->users_count,
                    'permission_ids' => $role->permissionIds()->all(),
                ]),
            'permissions' => Permission::query()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:roles,slug'],
            'description' => ['nullable', 'string', 'max:1000'],
            'permission_ids' => ['array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $permissionIds = Permission::normalizeRolePermissionIds($validated['permission_ids'] ?? []);

        $role = Role::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'] ?: Role::makeSlug($validated['name']),
            'description' => $validated['description'] ?? null,
            'is_system' => false,
        ]);

        $role->syncPermissions($permissionIds);

        return back()->with('success', 'Role baru berhasil ditambahkan.');
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'permission_ids' => ['array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $permissionIds = Permission::normalizeRolePermissionIds($validated['permission_ids'] ?? []);

        $role->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        $role->syncPermissions($permissionIds);

        return back()->with('success', 'Role berhasil diperbarui.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if (! $role->canDelete()) {
            return back()->with('error', 'Role sistem atau role yang masih dipakai user tidak bisa dihapus.');
        }

        DB::transaction(function () use ($role): void {
            User::query()
                ->where('role', $role->slug)
                ->update(['role' => User::ROLE_MEMBER]);

            Permission::syncRole($role->slug, []);
            $role->delete();
        });

        return back()->with('success', 'Role berhasil dihapus.');
    }
}
