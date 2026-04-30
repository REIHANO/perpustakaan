<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::query()->orderBy('name')->get();

        return Inertia::render('SuperAdmin/Permissions/Index', [
            'permissions' => $permissions,
            'roles' => [
                User::ROLE_ADMIN,
                User::ROLE_MEMBER,
            ],
            'rolePermissions' => [
                User::ROLE_ADMIN => Permission::forRole(User::ROLE_ADMIN)->pluck('id')->all(),
                User::ROLE_MEMBER => Permission::forRole(User::ROLE_MEMBER)->pluck('id')->all(),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:permissions,slug'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        Permission::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'] ?: Permission::makeSlug($validated['name']),
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('success', 'Permission berhasil ditambahkan.');
    }

    public function update(Request $request, Permission $permission): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('permissions', 'slug')->ignore($permission->id)],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $permission->update($validated);

        return back()->with('success', 'Permission berhasil diperbarui.');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $permission->delete();

        return back()->with('success', 'Permission berhasil dihapus.');
    }

    public function syncRolePermissions(Request $request, string $role): RedirectResponse
    {
        abort_unless(in_array($role, [User::ROLE_ADMIN, User::ROLE_MEMBER], true), 404);

        $validated = $request->validate([
            'permission_ids' => ['array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        Permission::syncRole($role, Permission::normalizeRolePermissionIds($validated['permission_ids'] ?? []));

        return back()->with('success', 'Permission role berhasil diperbarui.');
    }
}
