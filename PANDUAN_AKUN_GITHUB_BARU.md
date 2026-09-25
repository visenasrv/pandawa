# PANDUAN PINDAH KE AKUN GITHUB BARU
### Untuk PANDAWA — sekaligus menjaga SIKAP-BK tetap aman

Perkiraan waktu: **20–25 menit.**

---

## RINGKASAN: APA YANG BERUBAH, APA YANG TIDAK

| | Berubah? |
|---|---|
| Akun GitHub `Sikap-BK` | ❌ tidak tersentuh |
| Repository SIKAP-BK | ❌ tidak tersentuh |
| Situs SIKAP-BK yang sudah jalan | ❌ tetap online seperti biasa |
| Folder proyek SIKAP-BK di laptop | ❌ tidak diubah |
| Folder `pandawa-frontend` | ✅ diarahkan ke akun baru |
| Login GitHub tersimpan di Windows | ✅ diganti (ini satu-satunya yang dipakai bersama) |

**Satu-satunya hal yang perlu diwaspadai** adalah login tersimpan di
Windows. Karena itu Bagian 0 di bawah ini **wajib dikerjakan lebih
dulu** dan jangan dilewati.

---

# BAGIAN 0 — AMANKAN SIKAP-BK DULU (WAJIB)

## 0.1 Pastikan token SIKAP-BK masih Anda miliki

Nanti login GitHub yang tersimpan di Windows akan dihapus. Kalau token
SIKAP-BK hilang, Bapak/Ibu **tidak bisa push update ke SIKAP-BK lagi**
sampai membuat token baru.

Cek dulu: apakah token lama masih tersimpan (di Notepad, catatan HP,
atau password manager)?

**Kalau MASIH ADA** → simpan baik-baik, lanjut ke 0.2.

**Kalau SUDAH HILANG** → buat token baru sekarang, sebelum melanjutkan:

1. Login ke GitHub sebagai **Sikap-BK**
2. Buka **https://github.com/settings/tokens**
3. **Generate new token (classic)**
4. Note: `sikap-bk`, Expiration: **No expiration**
5. Centang **repo** (kotak paling atas)
6. **Generate token**
7. **SALIN dan simpan** — hanya ditampilkan sekali

## 0.2 Catat alamat repository SIKAP-BK

Buka repo SIKAP-BK di GitHub, salin alamatnya, simpan bersama token:

```
https://github.com/Sikap-BK/NAMA_REPO.git
```

## 0.3 Simpan catatan ini

Buat satu file Notepad, isi begini, lalu simpan di tempat aman:

```
=== SIKAP-BK ===
Username : Sikap-BK
Token    : ghp_xxxxxxxxxxxxxxxx
Repo     : https://github.com/Sikap-BK/NAMA_REPO.git
Folder   : D:\Projek\...\folder-sikap-bk
```

> ⚠️ Jangan simpan file ini di dalam folder proyek mana pun — nanti
> ikut terkirim ke GitHub dan tokennya terbaca publik.

## 0.4 Pastikan tidak ada pekerjaan SIKAP-BK yang belum di-push

Buka Command Prompt, masuk ke folder SIKAP-BK, lalu:

```
cd "D:\Projek\...\folder-sikap-bk"
git status
```

- Muncul **"nothing to commit, working tree clean"** → aman, lanjut
- Muncul daftar file berwarna merah/hijau → ada perubahan belum
  terkirim. Push dulu sekarang selagi login lama masih tersimpan:
  ```
  git add .
  git commit -m "simpan perubahan terakhir"
  git push
  ```

✅ Setelah Bagian 0 selesai, SIKAP-BK aman. Lanjut.

---

# BAGIAN 1 — BUAT AKUN GITHUB BARU

## 1.1 Keluar dari akun lama

1. Buka **github.com**
2. Klik foto profil di kanan atas → **Sign out**

## 1.2 Daftar akun baru

1. Buka **https://github.com/signup**
2. Masukkan **email lain** (yang belum pernah dipakai di GitHub)
3. Buat password
4. **Pilih username dengan hati-hati** — username ini akan menjadi
   bagian dari alamat situs dan tidak enak kalau sering diganti.

### Pilihan nama & hasil alamatnya

| Username | Nama repository | Alamat situs |
|---|---|---|
| `pandawa-app` | `pandawa` | `pandawa-app.github.io/pandawa/` |
| `pandawa-app` | **`pandawa-app.github.io`** | **`pandawa-app.github.io`** ← paling bersih |
| `pkbm-digital` | `pandawa` | `pkbm-digital.github.io/pandawa/` |

> **Trik alamat terpendek:** kalau nama repository dibuat **persis sama
> dengan username ditambah `.github.io`**, nama repo hilang dari
> alamat. Contoh: username `pandawa-app` + repo `pandawa-app.github.io`
> → alamatnya cukup `https://pandawa-app.github.io`
>
> Kelemahannya: satu akun hanya bisa punya **satu** situs model ini.
> Kalau nanti mau menaruh aplikasi lain di akun yang sama, aplikasi
> berikutnya tetap memakai format panjang.

5. Selesaikan verifikasi email.

---

# BAGIAN 2 — BUAT REPOSITORY & TOKEN BARU

## 2.1 Buat repository

1. Dalam keadaan login sebagai **akun baru**, buka
   **https://github.com/new**
2. Isi:
   - **Repository name**: sesuai pilihan di tabel 1.2
   - Pilih **Public**
   - **JANGAN** centang "Add a README file"
3. Klik **Create repository**

## 2.2 Buat token untuk akun baru

Akun baru punya token sendiri — token SIKAP-BK **tidak berlaku** di sini.

1. Buka **https://github.com/settings/tokens**
   (pastikan masih login sebagai akun baru)
2. **Generate new token (classic)**
3. Note: `pandawa`, Expiration: **No expiration**
4. Centang **repo**
5. **Generate token** → **SALIN dan simpan**

## 2.3 Tambahkan ke catatan

Tambahkan di file catatan tadi:

```
=== PANDAWA ===
Username : AKUN_BARU
Token    : ghp_yyyyyyyyyyyyyyyy
Repo     : https://github.com/AKUN_BARU/NAMA_REPO.git
Folder   : D:\Projek\APLIKASI\PANDAWA\pandawa-frontend
```

---

# BAGIAN 3 — HAPUS LOGIN LAMA DI WINDOWS

Inilah langkah yang membuat Git berhenti memakai akun `Sikap-BK`.

1. Tekan tombol **Windows**, ketik **Credential Manager**
   (atau "Pengelola Kredensial"), tekan Enter.
2. Klik tab **Windows Credentials** (Kredensial Windows).
3. Gulir ke bagian **Generic Credentials**.
4. Cari entri bernama **`git:https://github.com`**
5. Klik entri itu → klik **Remove** (Hapus) → **Yes**.

> Kalau ada beberapa entri `github`, hapus semuanya yang berawalan
> `git:https://github.com`.

> Ini **tidak menghapus akun** maupun repository — hanya menghapus
> "ingatan login" di laptop. Nanti tinggal login lagi saat diminta.

---

# BAGIAN 4 — ARAHKAN PANDAWA KE AKUN BARU

## 4.1 Masuk ke folder PANDAWA

```
cd "D:\Projek\APLIKASI\PANDAWA\pandawa-frontend"
```

## 4.2 Pastikan folder benar

```
dir
```
Harus terlihat `index.html`, `admin.html`, `css`, `js`.

> ❌ Kalau yang terlihat folder SIKAP-BK, **JANGAN lanjut** — Anda
> salah folder. Perintah berikutnya akan mengubah tujuan repo yang
> salah.

## 4.3 Cek tujuan saat ini

```
git remote -v
```
Akan muncul alamat lama (`Sikap-BK/pandawa.git`). Ini yang akan diganti.

## 4.4 Ganti tujuan ke repo baru

```
git remote set-url origin https://github.com/AKUN_BARU/NAMA_REPO.git
```

Ganti `AKUN_BARU` dan `NAMA_REPO` sesuai Bagian 2.

## 4.5 Pastikan sudah berubah

```
git remote -v
```
Sekarang harus menampilkan alamat **akun baru**. Kalau masih yang lama,
ulangi 4.4.

## 4.6 Kirim

```
git push -u origin main
```

Saat diminta login:
- **Username**: username **akun baru**
- **Password**: **token baru** dari langkah 2.2

> Kursor tidak bergerak saat menempel token — itu normal, tekan Enter.

---

# BAGIAN 5 — AKTIFKAN GITHUB PAGES

1. Buka repository baru di GitHub → **Settings**
2. Menu kiri → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** · Folder: **/ (root)** → **Save**
5. Tunggu 1–3 menit, muat ulang → muncul alamat situsnya

Atau langsung:
```
https://github.com/AKUN_BARU/NAMA_REPO/settings/pages
```

---

# BAGIAN 6 — PERIKSA SIKAP-BK MASIH AMAN

Ini langkah penutup yang penting — memastikan tidak ada yang rusak.

## 6.1 Cek situsnya masih online

Buka alamat situs SIKAP-BK di browser. Harus tetap tampil normal.

## 6.2 Cek repository-nya utuh

Login GitHub sebagai `Sikap-BK` (di browser boleh pakai jendela
Incognito supaya tidak bentrok dengan akun baru), lihat repo-nya —
semua file harus masih ada.

## 6.3 Uji push ke SIKAP-BK masih bisa

```
cd "D:\Projek\...\folder-sikap-bk"
git remote -v
```
Harus masih menunjuk `Sikap-BK/...` — **bukan** akun baru.

Lalu coba:
```
git pull
```
Saat diminta login, masukkan username `Sikap-BK` dan **token SIKAP-BK**
dari Bagian 0.

Kalau berhasil, berarti akses ke SIKAP-BK masih normal sepenuhnya.

## 6.4 Kalau ke depannya bingung

Setiap kali Git meminta login, perhatikan **sedang berada di folder
mana**:

| Folder | Username | Token |
|---|---|---|
| `pandawa-frontend` | akun baru | token PANDAWA |
| folder SIKAP-BK | `Sikap-BK` | token SIKAP-BK |

Windows akan menyimpan yang terakhir dipakai, jadi kadang perlu
menghapus credential lagi saat berpindah proyek. Itu normal dan tidak
merusak apa pun.

---

# BAGIAN 7 — LANGKAH TERAKHIR

1. Buka situs PANDAWA yang baru, pastikan formulir tampil normal.
2. Buka `admin.html`, login, cek data masih utuh.
3. Di Apps Script, perbarui konstanta:
   ```javascript
   const URL_FRONTEND = "https://ALAMAT_BARU_ANDA/";
   ```
   lalu **Deploy → Manage deployments → pensil → New version → Deploy**
4. Bagikan alamat formulir yang baru; hentikan pemakaian alamat lama.
5. Repo lama `Sikap-BK/pandawa` boleh dihapus (Settings → paling bawah
   → **Delete this repository**) atau dibiarkan saja — tidak
   mengganggu.

---

# KALAU BERMASALAH

| Gejala | Solusi |
|---|---|
| **"Permission to ... denied"** saat push | Masih memakai login lama. Ulangi Bagian 3, lalu push lagi |
| Git tidak meminta login sama sekali | Credential lama belum terhapus. Ulangi Bagian 3 |
| **"remote origin already exists"** | Pakai `set-url`, bukan `add`: `git remote set-url origin ALAMAT_BARU` |
| **"Authentication failed"** | Memasukkan password akun, bukan token. Pakai token dari 2.2 |
| Tidak bisa push ke SIKAP-BK lagi | Token SIKAP-BK belum dimasukkan, atau sudah hilang. Buat baru sesuai Bagian 0.1 |
| Situs baru 404 | `index.html` tidak di root, atau Pages belum diaktifkan (Bagian 5) |
| Situs SIKAP-BK ikut hilang | **Tidak mungkin terjadi** dari langkah-langkah di atas. Cek apakah alamatnya salah ketik |

---

## CATATAN PENUTUP

Yang membuat kedua aplikasi tetap terpisah adalah tiga hal ini:

1. **Folder berbeda** — setiap folder punya pengaturan git sendiri
2. **`git remote` berbeda** — masing-masing menunjuk repo-nya sendiri
3. **Akun & token berbeda** — tidak saling bergantung

Selama perintah `git remote set-url` **hanya dijalankan di folder
`pandawa-frontend`**, SIKAP-BK tidak akan pernah terpengaruh.
