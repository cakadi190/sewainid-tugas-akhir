# SewainID - Platform Sewa Mobil

**SewainID** adalah aplikasi web untuk penyewaan mobil yang dikembangkan sebagai bagian dari Tugas Akhir. Aplikasi ini memudahkan pengguna dalam mencari, memesan, dan mengelola sewa mobil secara online.

## 🚗 Fitur Utama

- **Autentikasi Pengguna**: Registrasi, login, dan logout.
- **Daftar Mobil**: Tampilkan semua mobil yang tersedia untuk disewa.
- **Penyewaan Mobil**: Formulir penyewaan mobil dengan informasi lengkap.
- **Manajemen Mobil**: Tambah, ubah, dan hapus data mobil (khusus admin).
- **Riwayat Transaksi**: Pengguna dapat melihat histori penyewaannya.
- **Dashboard Admin**: Untuk mengelola data mobil dan transaksi.

## 🛠️ Teknologi yang Digunakan

- **Backend**: Laravel
- **Frontend**: Inertia.js + Vue.js
- **UI Framework**: Bootstrap 5
- **Database**: MySQL
- **Build Tools**: Vite

## 🚀 Instalasi

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/cakadi190/sewainid-tugas-akhir.git
   cd sewainid-tugas-akhir
   ```

2. **Instalasi dependensi backend:**
   ```bash
   composer install
   ```

3. **Instalasi dependensi frontend:**
   ```bash
   npm install
   ```

4. **Salin file `.env.example` ke `.env` dan atur konfigurasi:**
   ```bash
   cp .env.example .env
   ```

5. **Generate key aplikasi:**
   ```bash
   php artisan key:generate
   ```

6. **Migrasi database dan (opsional) seed data:**
   ```bash
   php artisan migrate --seed
   ```

7. **Jalankan server:**
   ```bash
   php artisan serve
   ```

8. **Jalankan dev server frontend (Vite):**
   ```bash
   npm run dev
   ```

## 🗂️ Struktur Direktori Penting

```
├── app/
├── resources/js/Pages/        # Halaman-halaman Inertia
├── resources/views/           # View root Inertia
├── routes/web.php             # Routing utama
├── public/
└── ...
```

## 🤝 Kontribusi

Pull request dan saran sangat diterima. Silakan fork repositori ini, buat cabang baru, dan ajukan PR!

## 📄 Lisensi

Proyek ini menggunakan lisensi [MIT](LICENSE).
