<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('SuperAdmin/Dashboard', [
            'stats' => [
                'users' => User::count(),
                'superAdmins' => User::where('role', User::ROLE_SUPER_ADMIN)->count(),
                'admins' => User::where('role', User::ROLE_ADMIN)->count(),
                'members' => User::where('role', User::ROLE_MEMBER)->count(),
                'permissions' => Permission::count(),
                'roles' => Role::count(),
                'customRoles' => Role::where('is_system', false)->count(),
            ],
            'rolesSummary' => [
                [
                    'role' => User::ROLE_SUPER_ADMIN,
                    'label' => 'Super Admin',
                    'users' => User::where('role', User::ROLE_SUPER_ADMIN)->count(),
                    'permissions' => Permission::forRole(User::ROLE_SUPER_ADMIN)->count(),
                ],
                [
                    'role' => User::ROLE_ADMIN,
                    'label' => 'Admin',
                    'users' => User::where('role', User::ROLE_ADMIN)->count(),
                    'permissions' => Permission::forRole(User::ROLE_ADMIN)->count(),
                ],
                [
                    'role' => User::ROLE_MEMBER,
                    'label' => 'Member',
                    'users' => User::where('role', User::ROLE_MEMBER)->count(),
                    'permissions' => Permission::forRole(User::ROLE_MEMBER)->count(),
                ],
            ],
        ]);
    }
}
