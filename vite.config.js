import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/scss/volt.scss', 'resources/js/app.jsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                // Memberitahu Sass untuk mencari ke folder node_modules
                includePaths: ['node_modules'],
                // Mengabaikan peringatan tilde jika ada library lain yang memakainya
                quietDeps: true,
                // Menggunakan API modern Sass
                api: 'modern-compiler' 
            },
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});