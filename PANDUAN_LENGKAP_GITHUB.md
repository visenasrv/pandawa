# PANDUAN DEPLOY PANDAWA KE GITHUB
### Langkah demi langkah — lengkap dengan menu yang harus diklik

Panduan ini untuk Bapak/Ibu yang **sudah punya akun GitHub, sudah
install Git, dan sudah pernah deploy aplikasi lain**. Aplikasi lama
TIDAK akan terganggu karena kita membuat repository baru yang terpisah.

**Perkiraan waktu: 15–20 menit.**

---

# PERSIAPAN (lakukan dulu sebelum ke GitHub)

## P.1 — Siapkan backend Apps Script

1. Buka spreadsheet PANDAWA Anda.
2. Menu atas: **Extensions** (Ekstensi) → **Apps Script**.
3. Di panel kiri, klik file **Kode.gs**.
4. Klik di dalam area kode, tekan **Ctrl + A** lalu **Delete**
   sampai benar-benar kosong.
5. Tempel seluruh isi `Kode.gs` yang baru dari saya.
6. Klik ikon **disket** (Simpan).

## P.2 — Deploy backend

1. Tombol biru **Deploy** di kanan atas → **Manage deployments**.
2. Klik ikon **pensil** (Edit) di kanan atas kotak deployment.
3. Atur:
   - **Version**: pilih **New version**
   - **Execute as**: **Me**
   - **Who has access**: **Anyone** ← WAJIB
4. Klik **Deploy**.
5. **SALIN URL yang berakhiran `/exec`.** Simpan dulu di Notepad.

## P.3 — Uji backend

Tempel URL tadi di browser, tambahkan `?action=ping` di belakangnya:

```
https://script.google.com/macros/s/AKfy...../exec?action=ping
```

✅ Muncul `{"ok":true,"pesan":"PANDAWA API aktif."}` → lanjut
❌ Muncul halaman login Google → ulangi P.2, pastikan "Anyone"

## P.4 — Siapkan folder frontend

1. Ekstrak `pandawa-web.zip`.
2. **Letakkan di folder yang TERPISAH dari aplikasi lama Anda.**
   Contoh: `C:\Users\NAMA_ANDA\Documents\pandawa-web`
3. Buka folder `js`, klik kanan `api.js` → **Open with** → Notepad.
4. Cari baris:
   ```javascript
   URL: "TEMPEL_URL_WEB_APP_ANDA_DI_SINI",
   ```
5. Ganti tulisan besar itu dengan URL `/exec` dari P.2:
   ```javascript
   URL: "https://script.google.com/macros/s/AKfy...../exec",
   ```
   Tanda kutip dan koma **jangan dihapus**.
6. **Ctrl + S** untuk simpan, lalu tutup Notepad.

> Tanpa langkah P.4 ini aplikasi akan terbuka tapi tidak bisa
> menyimpan data apa pun.

---

# BAGIAN A — MEMBUAT REPOSITORY DI GITHUB

## A.1 — Masuk ke GitHub

1. Buka browser, ketik: **github.com**
2. Klik **Sign in** di kanan atas.
3. Masukkan username/email dan password Anda.

## A.2 — Membuat repository baru

**Cara tercepat:** langsung buka alamat ini di browser:

```
github.com/new
```

**Atau lewat menu:**
1. Setelah login, lihat **pojok kanan atas**.
2. Klik tanda **+** (plus) di sebelah foto profil Anda.
3. Muncul menu turun — klik **New repository**.

## A.3 — Mengisi form repository

Akan muncul halaman "Create a new repository". Isi seperti ini:

| Kolom | Diisi apa |
|---|---|
| **Owner** | biarkan (nama akun Anda) |
| **Repository name** | ketik: `pandawa` |
| **Description** | boleh dikosongkan |
| **Public / Private** | pilih **Public** |
| **Add a README file** | ❌ **JANGAN dicentang** |
| **Add .gitignore** | biarkan "None" |
| **Choose a license** | biarkan "None" |

> ⚠️ Kalau nama `pandawa` ditolak dengan tulisan merah "name already
> exists", berarti sudah dipakai repo lain. Ganti jadi `pandawa-pkbm`
> atau nama lain, dan **ingat nama itu** karena dipakai di Bagian B.

> ⚠️ Kalau "Add a README file" tercentang, nanti akan muncul error
> saat push. Pastikan kotaknya kosong.

Klik tombol hijau **Create repository** di paling bawah.

## A.4 — Halaman yang muncul setelahnya

Akan muncul halaman berisi perintah-perintah git. **Jangan ditutup
dulu** — di situ ada alamat repository Anda, bentuknya:

```
https://github.com/NAMA_AKUN/pandawa.git
```

Catat atau biarkan tab-nya terbuka.

---

# BAGIAN B — MENGIRIM FILE LEWAT TERMINAL

> Kita pakai terminal, **bukan** tombol "uploading an existing file" di
> halaman GitHub. Upload lewat web membuat folder `css/` dan `js/`
> hilang, dan situs akan tampil polos tanpa warna.

## B.1 — Buka Command Prompt

Tekan tombol **Windows**, ketik `cmd`, tekan **Enter**.

## B.2 — Masuk ke folder proyek

Ketik (sesuaikan jalurnya dengan lokasi folder Anda):

```
cd "C:\Users\NAMA_ANDA\Documents\pandawa-web"
```

**Cara mudah mendapatkan jalurnya:** buka folder `pandawa-web` di File
Explorer, klik kolom alamat di atas, salin tulisannya, lalu tempel
setelah `cd ` di Command Prompt.

## B.3 — VERIFIKASI ISI FOLDER (langkah paling penting)

Ketik:

```
dir
```

Yang **harus** muncul:

```
index.html
admin.html
README.md
PANDUAN_DEPLOY.md
css          <DIR>
js           <DIR>
```

❌ **Kalau yang muncul justru satu folder bernama `pandawa-web`**,
berarti Anda masih di luar. Ketik dulu:

```
cd pandawa-web
```

lalu `dir` lagi sampai `index.html` terlihat.

> Ini gerbang paling penting di seluruh panduan. Kalau salah folder,
> semua perintah git di bawah akan **berhasil tanpa satu pun pesan
> error**, tapi situsnya nanti 404 dan Bapak/Ibu tidak akan tahu
> penyebabnya.

## B.4 — Jalankan perintah git

Ketik satu per satu, tekan Enter setiap selesai satu baris:

**1)** Memulai repository lokal:
```
git init
```

**2)** Menandai semua file untuk dikirim:
```
git add .
```

**3)** Menyimpan sebagai satu paket perubahan:
```
git commit -m "PANDAWA versi pertama"
```

**4)** Menamai cabang utama:
```
git branch -M main
```

**5)** Menghubungkan ke repository GitHub — **ganti NAMA_AKUN dengan
nama akun Anda**, dan `pandawa` dengan nama repo dari A.3:
```
git remote add origin https://github.com/NAMA_AKUN/pandawa.git
```

**6)** Mengirim:
```
git push -u origin main
```

## B.5 — Saat diminta login

Akan muncul jendela atau pertanyaan di terminal:

- **Username**: nama akun GitHub Anda
- **Password**: **tempel TOKEN** Anda (yang dipakai waktu deploy
  aplikasi sebelumnya), **bukan password akun GitHub**

> Saat menempel token di terminal, **kursor tidak bergerak dan tidak
> muncul bintang apa pun** — itu normal, bukan berarti gagal. Langsung
> tekan Enter.

> Kalau muncul jendela "Sign in to GitHub" dari browser, pilih
> **Sign in with your browser** dan ikuti saja.

## B.6 — Tanda berhasil

Di akhir akan muncul tulisan semacam:

```
Enumerating objects: 11, done.
...
branch 'main' set up to track 'origin/main'.
```

Muat ulang halaman repository di GitHub — semua file sudah terlihat
di sana.

---

# BAGIAN C — MENGAKTIFKAN GITHUB PAGES

## C.1 — Masuk ke Settings

1. Buka halaman repository: `github.com/NAMA_AKUN/pandawa`
2. Lihat **baris menu di bawah nama repository**:
   `Code · Issues · Pull requests · Actions · Projects · Wiki ·
   Security · Insights · Settings`
3. Klik **Settings** (paling kanan, ada ikon gerigi).

> Kalau "Settings" tidak terlihat, layar mungkin terlalu sempit —
> klik tanda **···** di ujung kanan baris menu.

## C.2 — Masuk ke menu Pages

1. Setelah di Settings, lihat **menu panjang di sebelah kiri**.
2. Gulir ke bawah sampai bagian **"Code and automation"**.
3. Klik **Pages**.

## C.3 — Mengatur sumber

Di bagian **"Build and deployment"**:

| Kolom | Pilih |
|---|---|
| **Source** | **Deploy from a branch** |
| **Branch** | **main** |
| folder di sebelahnya | **/ (root)** |

Klik **Save**.

## C.4 — Tunggu & ambil alamat

1. Tunggu **1–3 menit**.
2. Muat ulang halaman Pages tersebut (tekan F5).
3. Di bagian atas akan muncul kotak hijau:
   > **Your site is live at** `https://NAMA_AKUN.github.io/pandawa/`

Itulah alamat aplikasi Bapak/Ibu.

---

# BAGIAN D — LANGKAH TERAKHIR

## D.1 — Dua alamat yang perlu diingat

| Halaman | Alamat | Untuk siapa |
|---|---|---|
| **Formulir** | `https://NAMA_AKUN.github.io/pandawa/` | dibagikan ke calon pendaftar |
| **Admin** | `https://NAMA_AKUN.github.io/pandawa/admin.html` | **jangan disebar** |

## D.2 — Masuk admin & ganti password

1. Buka alamat admin di atas.
2. Login dengan: username `admin`, password `123456`
3. Masuk **Pengaturan** → kartu **Akun Admin** → ganti username dan
   password dengan milik sendiri → **Simpan Akun**.

> Karena repository ini publik, siapa pun bisa melihat alamat API di
> dalam kode. Username & password TIDAK ada di dalam kode (tersimpan di
> spreadsheet), tapi tetap **jangan biarkan password bawaan**.

## D.3 — Lengkapi alamat frontend di Apps Script

Agar tombol pada email notifikasi mengarah ke alamat yang benar:

1. Kembali ke Apps Script, buka `Kode.gs`.
2. Cari di bagian atas:
   ```javascript
   const URL_FRONTEND = "";
   ```
3. Isi dengan alamat dari C.4:
   ```javascript
   const URL_FRONTEND = "https://NAMA_AKUN.github.io/pandawa/";
   ```
4. Simpan → **Deploy** → **Manage deployments** → pensil →
   **New version** → **Deploy**.

## D.4 — (Opsional) Notifikasi WhatsApp

Kalau ingin mendapat pesan WhatsApp setiap ada pendaftar baru:

1. Daftar di **fonnte.com**, buat **Device**, lalu **hubungkan nomor
   WhatsApp** dengan memindai QR (seperti WhatsApp Web).
2. Salin **Token** perangkat tersebut.
3. Di admin PANDAWA: **Pengaturan** → kartu **Notifikasi WhatsApp**
   → tempel token, isi 1–2 nomor tujuan, nyalakan sakelar → **Simpan**.
4. Klik **Kirim Uji Coba** untuk memastikan pesannya sampai.

> Nomor boleh ditulis `08123456789` maupun `628123456789` — keduanya
> otomatis dirapikan sistem.

> Fonnte adalah layanan pihak ketiga berbayar (ada paket gratis
> terbatas). Nomor WhatsApp yang dihubungkan harus tetap aktif dan
> tersambung di dashboard Fonnte, kalau tidak pesan tidak akan terkirim.

## D.5 — Periksa semuanya berjalan

- [ ] Buka alamat formulir — tampilan berwarna, tidak polos
- [ ] Status pendaftaran termuat (formulir muncul / pesan ditutup)
- [ ] Coba kirim satu pendaftaran percobaan
- [ ] Buka admin — data percobaan tadi muncul di Data Pendaftar
- [ ] Cek Pengaturan — nama sekolah, logo, dan rombel masih utuh
- [ ] Hapus data percobaan lewat Aksi → Hapus Peserta

---

# CARA UPDATE DI KEMUDIAN HARI

## Kalau yang berubah file frontend (html/css/js)

```
cd "C:\Users\NAMA_ANDA\Documents\pandawa-web"
git add .
git commit -m "perbarui tampilan"
git push
```

Perubahan tampil di situs dalam 1–2 menit. Kalau belum berubah, tekan
**Ctrl + F5** di browser untuk memuat ulang tanpa cache.

## Kalau yang berubah Kode.gs

Tidak lewat git. Perbarui langsung di Apps Script, lalu
**Deploy → Manage deployments → pensil → New version → Deploy.**

---

# KALAU BERMASALAH

| Gejala | Penyebab & Solusi |
|---|---|
| Situs **404 Not Found** | `index.html` tidak di root. Buka repo di GitHub — kalau yang terlihat folder `pandawa-web/`, berarti `git init` dijalankan satu tingkat terlalu tinggi. Lihat "Perbaikan Struktur" di bawah |
| Tampilan **polos tanpa warna** | Folder `css/` dan `js/` tidak ikut terkirim. Cek di GitHub apakah kedua folder itu ada |
| **"Alamat API belum diatur"** | `js/api.js` belum diisi (langkah P.4) |
| **"Balasan server bukan JSON"** | Deployment belum "Anyone" (langkah P.2) |
| **"Failed to fetch"** | URL di `api.js` salah, atau tidak sengaja memakai `/dev` |
| **`remote origin already exists`** | Folder ini sudah pernah di-git init. Ketik: `git remote set-url origin https://github.com/NAMA_AKUN/pandawa.git` |
| **`Authentication failed`** | Memakai password akun, bukan token. Buat token baru di github.com/settings/tokens (centang **repo**) |
| **`Updates were rejected`** | Repo dibuat dengan README tercentang. Ketik: `git pull origin main --allow-unrelated-histories` lalu `git push` |

## Perbaikan Struktur (kalau 404 karena salah folder)

```
cd "C:\Users\NAMA_ANDA\Documents\pandawa-web"
dir
```
Pastikan `index.html` terlihat, lalu:
```
git init
git add .
git commit -m "perbaiki struktur"
git branch -M main
git remote add origin https://github.com/NAMA_AKUN/pandawa.git
git push -u origin main --force
```

> `--force` menimpa isi repository dengan versi di komputer Anda. Aman
> di sini karena isi lama memang struktur yang salah — tapi jangan
> dipakai sembarangan di repository lain.

---

# CATATAN: APLIKASI LAMA ANDA AMAN

Aplikasi yang sudah Bapak/Ibu deploy sebelumnya **tidak terpengaruh
sama sekali**, karena:

- Repository-nya berbeda → situs GitHub Pages-nya juga berbeda
- `git init` dijalankan di folder yang berbeda
- `git remote add origin` menunjuk alamat repository yang berbeda

Keduanya berjalan sendiri-sendiri di bawah akun yang sama. Aturan
`git config --global` (nama & email) memang dipakai bersama, dan itu
memang tidak masalah.
