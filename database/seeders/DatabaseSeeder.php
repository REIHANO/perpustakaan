<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Category;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'Super Admin', 'slug' => User::ROLE_SUPER_ADMIN, 'description' => 'Akses penuh sistem', 'is_system' => true],
            ['name' => 'Admin', 'slug' => User::ROLE_ADMIN, 'description' => 'Kelola katalog dan sirkulasi', 'is_system' => true],
            ['name' => 'Member', 'slug' => User::ROLE_MEMBER, 'description' => 'Akses katalog dan peminjaman', 'is_system' => true],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }

        $permissions = [
            ['name' => 'Manage Users', 'slug' => 'manage-users', 'description' => 'Mengelola user sistem'],
            ['name' => 'Manage Permissions', 'slug' => 'manage-permissions', 'description' => 'Mengatur permission per role'],
            ['name' => 'Manage Books', 'slug' => 'manage-books', 'description' => 'Mengelola data buku'],
            ['name' => 'Manage Categories', 'slug' => 'manage-categories', 'description' => 'Mengelola kategori buku'],
            ['name' => 'Manage Circulation', 'slug' => 'manage-circulation', 'description' => 'Mengelola peminjaman dan pengembalian'],
            ['name' => 'Set Fine', 'slug' => 'set-fine', 'description' => 'Mengatur nominal denda manual'],
            ['name' => 'View Reports', 'slug' => 'view-reports', 'description' => 'Melihat laporan sistem'],
            ['name' => 'Borrow Books', 'slug' => 'borrow-books', 'description' => 'Meminjam buku'],
            ['name' => 'Reserve Books', 'slug' => 'reserve-books', 'description' => 'Mereservasi buku'],
            ['name' => 'Manage Profile', 'slug' => 'manage-profile', 'description' => 'Mengubah profil member'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }

        Permission::syncRole(User::ROLE_SUPER_ADMIN, Permission::pluck('id')->all());

        Permission::syncRole(User::ROLE_ADMIN, Permission::whereIn('slug', [
            'manage-books',
            'manage-categories',
            'manage-circulation',
            'set-fine',
            'view-reports',
        ])->pluck('id')->all());

        Permission::syncRole(User::ROLE_MEMBER, Permission::whereIn('slug', [
            'borrow-books',
            'reserve-books',
            'manage-profile',
        ])->pluck('id')->all());

        User::updateOrCreate(
            ['email' => 'superadmin@perpustakaan.test'],
            [
                'name' => 'Super Administrator',
                'password' => 'password123',
                'role' => User::ROLE_SUPER_ADMIN,
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@perpustakaan.test'],
            [
                'name' => 'Administrator',
                'password' => 'password123',
                'role' => User::ROLE_ADMIN,
            ]
        );

        User::updateOrCreate(
            ['email' => 'member@perpustakaan.test'],
            [
                'name' => 'Member Contoh',
                'password' => 'password123',
                'role' => User::ROLE_MEMBER,
            ]
        );

        $categories = [
            'Fiksi',
            'Teknologi',
            'Bisnis',
        ];

        foreach ($categories as $categoryName) {
            Category::updateOrCreate(
                ['slug' => Str::slug($categoryName)],
                ['name' => $categoryName]
            );
        }

        $fiction = Category::where('slug', 'fiksi')->firstOrFail();
        $technology = Category::where('slug', 'teknologi')->firstOrFail();
        $business = Category::where('slug', 'bisnis')->firstOrFail();

        Book::updateOrCreate(
            ['isbn' => '9786020332950'],
            [
                'category_id' => $fiction->id,
                'title' => 'Laskar Pelangi',
                'author' => 'Andrea Hirata',
                'stock' => 5,
                'cover' => null,
            ]
        );

        Book::updateOrCreate(
            ['isbn' => '9786234001234'],
            [
                'category_id' => $technology->id,
                'title' => 'Laravel untuk Pemula',
                'author' => 'Tim Developer',
                'stock' => 7,
                'cover' => null,
            ]
        );

        Book::updateOrCreate(
            ['isbn' => '9786020251234'],
            [
                'category_id' => $business->id,
                'title' => 'Dasar-dasar Manajemen',
                'author' => 'Budi Santoso',
                'stock' => 4,
                'cover' => null,
            ]
        );
    }
}
