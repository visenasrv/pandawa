# PANDUAN MENYIAPKAN FONNTE
### Agar PANDAWA bisa mengirim notifikasi WhatsApp

Perkiraan waktu: **10–15 menit.**

---

## BACA DULU SEBELUM MENDAFTAR

Tiga hal ini penting diketahui supaya tidak menyesal di kemudian hari.

### 1. Fonnte adalah layanan WhatsApp "tidak resmi"

Fonnte bekerja dengan cara menyambungkan nomor WhatsApp Bapak/Ibu
seperti WhatsApp Web, lalu mengirim pesan atas nama nomor itu. Ini
**bukan** WhatsApp Business API resmi dari Meta.

Konsekuensinya: **ada kemungkinan nomor diblokir WhatsApp** kalau
dianggap mengirim pesan massal atau mencurigakan. Risiko ini kecil
untuk pemakaian seperti PANDAWA (beberapa pesan per hari ke nomor
sendiri), tapi tetap ada.

### 2. JANGAN pakai nomor WhatsApp pribadi

Gunakan **nomor khusus** untuk sekolah — bisa kartu perdana baru yang
murah. Alasannya:
- Kalau sampai diblokir, yang hilang bukan nomor pribadi Bapak/Ibu
- Nomor itu harus tetap tersambung terus-menerus
- Lebih profesional kalau pesan datang dari nomor resmi sekolah

### 3. Nomor pengirim harus tetap "hidup"

Nomor yang disambungkan ke Fonnte harus tetap tersambung di dashboard
Fonnte. Kalau HP-nya mati lama, kehabisan kuota internet, atau
WhatsApp-nya logout, **pesan tidak akan terkirim** meski pengaturan di
PANDAWA sudah benar.

---

## BAGIAN A — MENDAFTAR

### A.1 Buat akun

1. Buka **https://fonnte.com**
2. Klik **Daftar** / **Register** di kanan atas.
3. Isi nama, email, dan nomor WhatsApp, lalu buat password.
4. Verifikasi sesuai petunjuk yang dikirim.
5. Masuk (login) ke dashboard.

### A.2 Paket gratis vs berbayar

Fonnte punya paket gratis yang bisa langsung dipakai:

| | Paket Gratis | Berbayar (mulai ±Rp25.000/bulan) |
|---|---|---|
| Kuota pesan | ±1.000 pesan | lebih besar / unlimited |
| Watermark di pesan | **ada** | tidak ada |
| Kirim lampiran/gambar | tidak bisa | bisa |

**Untuk PANDAWA, paket gratis sudah cukup** — notifikasi pendaftar
hanya berupa teks, dan 1.000 pesan itu sangat banyak untuk kebutuhan
pendaftaran sekolah.

Satu-satunya kekurangan: ada tulisan kecil watermark Fonnte di setiap
pesan. Kalau terganggu, baru pertimbangkan paket Lite.

> Harga dan kuota bisa berubah sewaktu-waktu. Cek langsung di
> **fonnte.com** bagian harga untuk angka terbaru.

---

## BAGIAN B — MEMBUAT DEVICE & MENYAMBUNGKAN NOMOR

**Device** = nomor WhatsApp yang akan menjadi pengirim pesan.

### B.1 Tambah device

1. Di dashboard Fonnte, buka menu **Device** (biasanya di menu kiri).
2. Klik **Add Device** / **Tambah Device**.
3. Isi:
   - **Device name**: bebas, misalnya `PANDAWA PKBM`
   - **Nomor WhatsApp**: nomor khusus sekolah tadi
4. Simpan.

### B.2 Sambungkan dengan QR

1. Klik device yang baru dibuat → cari tombol **Connect** / **Scan QR**.
2. Akan muncul kode QR di layar komputer.
3. Di **HP yang berisi nomor tersebut**, buka WhatsApp:
   - Ketuk titik tiga (⋮) di kanan atas
   - Pilih **Perangkat Tertaut** (Linked Devices)
   - Ketuk **Tautkan Perangkat**
   - Arahkan kamera ke QR di layar komputer
4. Tunggu sampai status device di Fonnte berubah jadi
   **Connected** (hijau).

> Prosesnya persis seperti memakai WhatsApp Web.

### B.3 Ambil Token

1. Masih di halaman **Device**, cari bagian **Token**.
2. Klik ikon salin, atau blok tulisannya lalu **Ctrl + C**.
3. Simpan sementara di Notepad.

Bentuk token kira-kira: `aBcD1234eFgH5678iJkL`

> ⚠️ **Token ini seperti kunci.** Siapa pun yang punya token ini bisa
> mengirim WhatsApp atas nama nomor sekolah. Jangan dibagikan, jangan
> difoto lalu dikirim ke grup, dan jangan ditulis di file yang
> di-upload ke GitHub.

---

## BAGIAN C — MEMASUKKAN KE PANDAWA

1. Buka halaman **admin PANDAWA**, login.
2. Masuk menu **Pengaturan**.
3. Cari kartu **Notifikasi WhatsApp** (kolom kanan).
4. Isi:

| Kolom | Diisi |
|---|---|
| **Token Fonnte** | tempel token dari B.3 |
| **Nomor WhatsApp 1** | nomor **penerima** notifikasi (mis. HP Bapak/Ibu) |
| **Nomor WhatsApp 2** | opsional, misalnya HP kepala sekolah |
| **Sakelar** | geser ke kanan sampai tertulis "WhatsApp AKTIF" |

5. Klik **Simpan**.
6. Klik **Kirim Uji Coba**.
7. Periksa WhatsApp nomor penerima — pesan uji coba harus masuk dalam
   beberapa detik.

> Nomor boleh ditulis `08123456789` atau `628123456789` — keduanya
> otomatis dirapikan sistem.

> **Bedakan dua nomor ini:** nomor di Fonnte (B.1) adalah **pengirim**,
> nomor di PANDAWA (C.4) adalah **penerima**. Boleh saja berbeda, dan
> memang sebaiknya berbeda.

---

## BAGIAN D — UJI COBA SUNGGUHAN

1. Buka halaman formulir pendaftaran.
2. Isi satu pendaftaran percobaan (boleh data asal-asalan).
3. Kirim.
4. Cek WhatsApp — harus masuk pesan seperti ini:

```
*PENDAFTAR BARU*
PKBM Cinta Damai Bengalon
------------------------------
Nama      : Budi Percobaan
Paket     : Paket C
L/P       : Laki-laki
No HP     : 08123456789
Waktu     : 25/09/2026 14:30
------------------------------
Buka dashboard untuk rincian lengkap.
```

5. Setelah berhasil, **hapus data percobaan** lewat admin:
   Data Pendaftar → Aksi → Hapus Peserta.

---

## KALAU BERMASALAH

| Pesan / Gejala | Penyebab & Solusi |
|---|---|
| **"Token Fonnte belum diisi"** | Kolom token kosong. Isi lalu Simpan dulu sebelum Uji Coba |
| **"Belum ada nomor WhatsApp yang valid"** | Nomor penerima kosong atau salah format. Pastikan hanya angka |
| **"device not found"** / **"invalid token"** | Token salah salin (kurang/lebih karakter). Salin ulang dari dashboard Fonnte |
| **"device disconnected"** | Nomor pengirim terputus. Buka Fonnte → Device → Connect → scan QR ulang |
| **"quota exceeded"** / kuota habis | Kuota bulanan habis. Tunggu bulan berikutnya atau upgrade paket |
| Uji coba sukses tapi **pesan tidak masuk** | Cek nomor penerima sudah benar; cek juga apakah nomor pengirim diblokir oleh penerima |
| Pesan masuk tapi **ada tulisan Fonnte** | Itu watermark paket gratis. Hilang bila upgrade ke paket berbayar |
| Notifikasi **tiba-tiba berhenti** | Paling sering karena nomor pengirim logout. Cek status device di Fonnte harus **Connected** |

---

## PERAWATAN RUTIN

- **Cek status device** di dashboard Fonnte sesekali, terutama menjelang
  masa pendaftaran dibuka. Pastikan tertulis **Connected**.
- **Jaga HP nomor pengirim** tetap menyala dan punya kuota internet.
- **Jangan logout** WhatsApp di HP tersebut, dan jangan hapus
  "Perangkat Tertaut" milik Fonnte.
- Kalau nomor pengirim diganti, **scan QR ulang** dan **ambil token
  baru**, lalu perbarui di Pengaturan PANDAWA.

---

## CATATAN TAMBAHAN

**Notifikasi WhatsApp ini bersifat pelengkap, bukan pengganti.**
Data pendaftar selalu tersimpan di Google Sheets apa pun yang terjadi —
kalau WhatsApp gagal terkirim (kuota habis, device terputus, Fonnte
sedang gangguan), **pendaftaran tetap berhasil** dan datanya tetap
masuk. Jadi tidak ada data yang hilang hanya karena notifikasi gagal.

**Kalau ingin lebih aman**, aktifkan juga **Notifikasi Email** yang ada
di kartu sebelahnya. Email memakai layanan Google yang jauh lebih
stabil dan tidak berisiko diblokir, jadi cocok sebagai cadangan.
