// Vercel Serverless Function - CTF Web Exploitation
// Soal: Manipulasi Request Body JSON untuk menjadi admin
//
// Tujuan pembelajaran:
// - Peserta belajar bahwa kredensial di sisi client (request body) dapat
//   dimanipulasi. Field "is_admin" yang dikirim dari client tidak boleh
//   dipercaya begitu saja di aplikasi nyata.

// Flag kustom untuk soal CTF ini.
// Di dunia nyata, jangan pernah hardcode flag/sensitive value langsung
// di source code. Untuk CTF ini sengaja dibuat demikian agar sederhana.
const CTF_FLAG = "FLAG{m4n1pul451_b0dy_v3rc3l_ok}";

// Handler utama Vercel API Route.
// Vercel otomatis memetakan file ini ke endpoint: POST /api/login
export default function handler(req, res) {
  // 1. Hanya menerima HTTP Method POST.
  // Metode lain (GET, PUT, DELETE, dll) ditolak dengan 405 Method Not Allowed.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed. Soal ini hanya menerima request POST.",
    });
  }

  // 2. Baca request body berbentuk JSON.
  // Vercel sudah mem-parse body JSON ke req.body secara otomatis,
  // tapi kita tetap validasi untuk jaga-jaga (mis. body kosong / bukan object).
  const body = req.body;

  if (
    body === undefined ||
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Request body harus berupa JSON object yang valid, contoh: {\"username\": \"...\", \"is_admin\": true}",
    });
  }

  // Ambil field yang relevan dari body.
  // Catatan: di aplikasi nyata, verifikasi admin HARUS dilakukan di server
  // (mis. via session/token), bukan dari field "is_admin" yang dikirim client.
  const { username, is_admin } = body;

  // 3. Cek kondisi sukses: username == "admin" DAN is_admin == true.
  // Gunakan perbandingan ketat (===) untuk tipe data yang konsisten.
  const isAdminValid = username === "admin" && is_admin === true;

  if (isAdminValid) {
    // Kembalikan status 200 OK beserta flag.
    return res.status(200).json({
      success: true,
      message:
        "Selamat! Kamu berhasil login sebagai admin dengan memanipulasi request body. Inilah flag-mu:",
      flag: CTF_FLAG,
    });
  }

  // 4. Jika input salah / user biasa, kembalikan 403 Forbidden
  //    dengan pesan interaktif petunjuk agar peserta mencoba manipulasi body.
  return res.status(403).json({
    success: false,
    message:
      "Login sukses sebagai guest. Tapi kamu bukan admin! Akses flag ditolak. Coba manipulasi request body JSON Anda menjadi admin dengan is_admin true!",
    hint: {
      expected_username: "admin",
      expected_is_admin: true,
    },
  });
}
