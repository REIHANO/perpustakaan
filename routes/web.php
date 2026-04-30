<?php

use App\Http\Controllers\Admin\BookController as AdminBookController;
use App\Http\Controllers\Admin\CirculationController as AdminCirculationController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BorrowingController;
use App\Http\Controllers\Member\CatalogController;
use App\Http\Controllers\Member\DashboardController as MemberDashboardController;
use App\Http\Controllers\Member\ProfileController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperAdminDashboardController;
use App\Http\Controllers\SuperAdmin\PermissionController as SuperAdminPermissionController;
use App\Http\Controllers\SuperAdmin\RoleController as SuperAdminRoleController;
use App\Http\Controllers\SuperAdmin\UserController as SuperAdminUserController;
use App\Http\Controllers\ReservationController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
});

Route::get('/login', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : Inertia::render('Auth/Login');
})->name('login.form');

Route::get('/register', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : Inertia::render('Auth/Register');
})->name('register.form');

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::middleware('auth')->group(function (): void {
    Route::get('/dashboard', function () {
        return auth()->user()->isSuperAdmin()
            ? redirect()->route('super-admin.dashboard')
            : (auth()->user()->canPermission('manage-books') || auth()->user()->canPermission('manage-categories') || auth()->user()->canPermission('manage-circulation') || auth()->user()->canPermission('set-fine') || auth()->user()->canPermission('view-reports')
            ? redirect()->route('admin.dashboard')
            : redirect()->route('member.dashboard'));
    })->name('dashboard');

    Route::prefix('super-admin')
        ->as('super-admin.')
        ->middleware('role:super-admin')
        ->group(function (): void {
            Route::get('/dashboard', [SuperAdminDashboardController::class, 'index'])->name('dashboard');

            Route::get('/users', [SuperAdminUserController::class, 'index'])->name('users.index');
            Route::post('/users', [SuperAdminUserController::class, 'store'])->name('users.store');
            Route::patch('/users/{user}', [SuperAdminUserController::class, 'update'])->name('users.update');
            Route::delete('/users/{user}', [SuperAdminUserController::class, 'destroy'])->name('users.destroy');

            Route::get('/permissions', [SuperAdminPermissionController::class, 'index'])->name('permissions.index');
            Route::post('/permissions', [SuperAdminPermissionController::class, 'store'])->name('permissions.store');
            Route::patch('/permissions/{permission}', [SuperAdminPermissionController::class, 'update'])->name('permissions.update');
            Route::delete('/permissions/{permission}', [SuperAdminPermissionController::class, 'destroy'])->name('permissions.destroy');
            Route::patch('/permissions/roles/{role}', [SuperAdminPermissionController::class, 'syncRolePermissions'])->name('permissions.sync-role');

            Route::get('/roles', [SuperAdminRoleController::class, 'index'])->name('roles.index');
            Route::post('/roles', [SuperAdminRoleController::class, 'store'])->name('roles.store');
            Route::patch('/roles/{role}', [SuperAdminRoleController::class, 'update'])->name('roles.update');
            Route::delete('/roles/{role}', [SuperAdminRoleController::class, 'destroy'])->name('roles.destroy');
        });

    Route::prefix('admin')
        ->as('admin.')
        ->group(function (): void {
            Route::get('/dashboard', [AdminDashboardController::class, 'index'])
                ->middleware('permission:manage-books,manage-categories,manage-circulation,set-fine,view-reports')
                ->name('dashboard');

            Route::get('/circulation', [AdminCirculationController::class, 'index'])
                ->middleware('permission:manage-circulation')
                ->name('circulation');
            Route::post('/circulation', [AdminCirculationController::class, 'store'])
                ->middleware('permission:manage-circulation')
                ->name('circulation.store');
            Route::patch('/circulation/{borrowing}/return', [AdminCirculationController::class, 'returnBook'])
                ->middleware('permission:manage-circulation')
                ->name('circulation.return');

            Route::get('/reports', [AdminReportController::class, 'index'])
                ->middleware('permission:view-reports')
                ->name('reports');

            Route::apiResource('categories', AdminCategoryController::class)
                ->middleware('permission:manage-categories');
            Route::apiResource('books', AdminBookController::class)
                ->middleware('permission:manage-books');
        });

    Route::prefix('member')
        ->as('member.')
        ->group(function (): void {
            Route::get('/dashboard', [MemberDashboardController::class, 'index'])
                ->middleware('permission:borrow-books,reserve-books,manage-profile')
                ->name('dashboard');
            Route::get('/catalog', [CatalogController::class, 'index'])
                ->middleware('permission:borrow-books,reserve-books')
                ->name('catalog.index');
            Route::get('/catalog/{book}', [CatalogController::class, 'show'])
                ->middleware('permission:borrow-books,reserve-books')
                ->name('catalog.show');
            Route::get('/history', [BorrowingController::class, 'index'])
                ->middleware('permission:borrow-books')
                ->name('history');
            Route::post('/borrowings', [BorrowingController::class, 'store'])
                ->middleware('permission:borrow-books')
                ->name('borrowings.store');
            Route::patch('/borrowings/{borrowing}/return', [BorrowingController::class, 'returnBook'])
                ->middleware('permission:borrow-books')
                ->name('borrowings.return');
            Route::get('/reservations', [ReservationController::class, 'index'])
                ->middleware('permission:reserve-books')
                ->name('reservations.index');
            Route::post('/reservations', [ReservationController::class, 'store'])
                ->middleware('permission:reserve-books')
                ->name('reservations.store');
            Route::patch('/reservations/{reservation}/borrow', [ReservationController::class, 'borrow'])
                ->middleware('permission:reserve-books')
                ->name('reservations.borrow');
            Route::get('/profile', [ProfileController::class, 'edit'])
                ->middleware('permission:manage-profile')
                ->name('profile.edit');
            Route::patch('/profile', [ProfileController::class, 'update'])
                ->middleware('permission:manage-profile')
                ->name('profile.update');

            Route::get('/borrowings/{borrowing}', [BorrowingController::class, 'show'])
                ->middleware('permission:borrow-books')
                ->name('borrowings.show');
            Route::get('/reservations/{reservation}', [ReservationController::class, 'show'])
                ->middleware('permission:reserve-books')
                ->name('reservations.show');
        });
});
