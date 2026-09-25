/* ============================================================
   PANDAWA — Modul API
   Penghubung tunggal antara frontend (GitHub Pages) dan
   backend Google Apps Script.
   ============================================================ */

const API = {

  /**
   * Alamat Web App Google Apps Script.
   * WAJIB diisi — salin dari Apps Script:
   * Deploy > Manage deployments > salin URL yang berakhiran /exec
   */
  URL: "https://script.google.com/macros/s/AKfycbwAJnGeyFDuRCsUUqXZaogjwIk7XRtjzMaOwApxlwgbxe-sTFrZk7XnPeM4F0WEqh6Ehg/exec",

  /**
   * Mengirim permintaan ke backend.
   *
   * Catatan penting soal Content-Type:
   * sengaja memakai "text/plain" (bukan "application/json") agar browser
   * TIDAK melakukan preflight OPTIONS. Apps Script tidak bisa menjawab
   * permintaan OPTIONS, sehingga application/json akan selalu gagal CORS.
   * Isinya tetap JSON dan dibaca dengan JSON.parse() di sisi server.
   *
   * @param {Object} data  - { action: "...", ...data lain }
   * @returns {Promise<Object>} balasan server: { ok: true/false, ... }
   */
  async kirim(data){
    if(!API.URL || API.URL.indexOf("TEMPEL_URL") === 0){
      throw new Error("Alamat API belum diatur. Buka js/api.js lalu isi API.URL.");
    }

    const res = await fetch(API.URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
      redirect: "follow"
    });

    if(!res.ok) throw new Error("Server membalas dengan kode " + res.status);

    const teks = await res.text();
    try{
      return JSON.parse(teks);
    } catch(err){
      // Biasanya terjadi bila Web App belum di-deploy sebagai "Anyone"
      // sehingga yang terkirim halaman login Google, bukan JSON.
      throw new Error(
        "Balasan server bukan JSON. Pastikan deployment Apps Script " +
        "diatur 'Who has access: Anyone'."
      );
    }
  }
};
