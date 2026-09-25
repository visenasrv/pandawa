# PANDAWA

**Pendaftaran dan Data Warga Belajar** — sistem pendaftaran peserta
didik untuk satuan pendidikan nonformal (PKBM, SKB, LKP).

## Halaman

| Berkas | Fungsi |
|---|---|
| `index.html` | Formulir pendaftaran — dibagikan ke calon peserta didik |
| `admin.html` | Dashboard admin — pengelolaan data |

## Arsitektur

Frontend statis (halaman ini) berkomunikasi dengan Google Apps Script
sebagai REST API. Seluruh data tersimpan di Google Sheets dan berkas
unggahan di Google Drive milik sekolah.

```
GitHub Pages  ──fetch JSON──►  Apps Script  ──►  Sheets & Drive
```

## Pengaturan

Alamat backend diatur di `js/api.js`:

```javascript
URL: "https://script.google.com/macros/s/..../exec",
```

## Fitur

- Formulir pendaftaran lengkap dengan validasi bertingkat
- Unggah berkas (KK & Ijazah) langsung ke Google Drive
- Unduh bukti pendaftaran dalam bentuk PDF
- Dashboard: statistik, data pendaftar, rombel bertingkat, peserta lulus
- Pengelompokan rombel per Paket → tingkatan → peserta
- Ekspor Excel per rombel maupun keseluruhan
- Buka/tutup pendaftaran dari admin
- Notifikasi email saat ada pendaftar baru
- Mode terang & gelap

## Pemasangan

Lihat `PANDUAN_LENGKAP_GITHUB.md`.
