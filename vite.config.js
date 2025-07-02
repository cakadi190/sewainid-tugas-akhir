import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';
import fs from 'fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('C:/laragon/etc/ssl/localhost/localhost.key.pem'),
      cert: fs.readFileSync('C:/laragon/etc/ssl/localhost/localhost.crt.pem'),
    },
    host: 'localhost',
    port: 5174,
    cors: {
      origin: [
        'https://sewain.local.id'
      ]
    },
  },
  plugins: [
    laravel({
      input: 'resources/js/app.tsx',
      refresh: true,
    }),
    react(),
    UnoCSS(),
  ],
});

