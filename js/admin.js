/* ============================================================
   STATE APLIKASI (cache frontend)
   Semua filter/pencarian/render dikerjakan dari sini — tanpa
   memanggil server, sehingga interaksi terasa instan (0ms).
   ============================================================ */
const App = {
  username: "",
  password: "",
  pendaftar: [],
  rombel: [],
  settings: { nama_sekolah:"", jenis_satuan:"", tahun_ajaran:"", logo_url:"" },
  notif: { aktif:false, email_1:"", email_2:"" },
  wa: { aktif:false, token:"", nomor_1:"", nomor_2:"" },
  tahunTerpilih: new Set(),
  halaman: "dashboard",
  paketRombel: null,
  rombelTerpilih: null,
  detailRow: null,
  registerRow: null
};

const LS = {
  tema: "ppdb_tema",
  halaman: "ppdb_halaman",
  tahun: "ppdb_tahun_filter",
  paketRombel: "ppdb_paket_rombel",
  rombelTerpilih: "ppdb_rombel_terpilih"
};
const SS_AKUN = "pandawa_akun";

const KELAS_JENJANG = {
  "Paket A": ["Kelas 4","Kelas 5","Kelas 6"],
  "Paket B": ["Kelas 7","Kelas 8","Kelas 9"],
  "Paket C": ["Kelas 10","Kelas 11","Kelas 12"]
};

const JUDUL_HALAMAN = {
  dashboard:  ["Dashboard", "Ringkasan data pendaftaran"],
  pendaftar:  ["Data Pendaftar", "Peserta yang belum masuk rombel"],
  rombel:     ["Rombel", "Peserta dikelompokkan per rombel"],
  lulus:      ["Peserta Lulus", "Dikelompokkan per tahun kelulusan"],
  pengaturan: ["Pengaturan", "Konfigurasi sekolah & sistem"]
};

/* ============================================================
   UTILITAS
   ============================================================ */
const $  = (id) => document.getElementById(id);
const el = (sel, root) => (root || document).querySelector(sel);
const els = (sel, root) => Array.from((root || document).querySelectorAll(sel));

function esc(str){
  const d = document.createElement("div");
  d.textContent = (str === undefined || str === null || str === "") ? "-" : String(str);
  return d.innerHTML;
}
function icon(id, size){
  return '<svg width="'+(size||16)+'" height="'+(size||16)+'"><use href="#'+id+'"/></svg>';
}
function pad2(n){ return String(n).padStart(2,"0"); }

/** Notifikasi instan (tanpa menunggu server) */
function toast(pesan, tipe){
  const jenis = tipe || "info";
  const ikon = jenis === "ok" ? "i-check" : (jenis === "err" ? "i-alert" : "i-info");
  const t = document.createElement("div");
  t.className = "toast " + jenis;
  t.innerHTML = icon(ikon, 18) + "<span>" + esc(pesan) + "</span>";
  $("toastWrap").appendChild(t);
  setTimeout(() => {
    t.classList.add("out");
    setTimeout(() => t.remove(), 220);
  }, 2800);
}

/** Indikator sinkronisasi latar belakang */
let syncCount = 0;
function syncMulai(){ syncCount++; $("syncDot").classList.add("show"); }
function syncSelesai(){
  syncCount = Math.max(0, syncCount - 1);
  if(syncCount === 0) $("syncDot").classList.remove("show");
}

function pesan(idEl, teks, tipe){
  const m = $(idEl);
  m.textContent = teks;
  m.className = "msg show " + (tipe || "info");
}
function pesanReset(idEl){ $(idEl).className = "msg"; }

/** Debounce — mengurangi render berlebihan saat mengetik */
function debounce(fn, delay){
  let timer;
  return function(){
    const args = arguments, ctx = this;
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(ctx, args), delay || 250);
  };
}

/* ============================================================
   TEMA (localStorage)
   ============================================================ */
function terapkanTema(tema){
  document.documentElement.setAttribute("data-theme", tema);
  el("#themeIcon use").setAttribute("href", tema === "dark" ? "#i-sun" : "#i-moon");
  localStorage.setItem(LS.tema, tema);
}
(function initTema(){
  const tersimpan = localStorage.getItem(LS.tema);
  const sukaGelap = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  terapkanTema(tersimpan || (sukaGelap ? "dark" : "light"));
})();

/* ============================================================
   LOGIN
   ============================================================ */
function tampilkanIdentitas(){
  const s = App.settings;
  const nama = s.nama_sekolah || "";
  $("loginSchool").textContent = nama;
  $("brandTitle").textContent = nama || "PANDAWA";
  $("brandSub").textContent = s.tahun_ajaran ? "T.A. " + s.tahun_ajaran : "Data Warga Belajar";
  document.title = nama ? ("PANDAWA — " + nama) : "PANDAWA — Pendaftaran dan Data Warga Belajar";


  if(s.logo_url){
    $("loginLogo").src = s.logo_url;
    $("loginLogo").style.display = "block";
    $("loginBadge").style.display = "none";
    $("brandMark").innerHTML = '<img src="'+esc(s.logo_url)+'" alt="Logo">';
  }
}

/** Ambil identitas sekolah untuk layar login (tanpa password) */
API.kirim({ action: "settings" })
  .then(res => {
    if(res && res.ok){
      App.settings = res.settings;
      tampilkanIdentitas();
    }
  })
  .catch(() => {});

function login(username, password){
  const btn = $("loginBtn");
  btn.disabled = true;
  btn.textContent = "Memeriksa…";
  pesanReset("loginMsg");

  API.kirim({ action: "login", username: username, password: password })
    .then(res => {
      btn.disabled = false;
      btn.textContent = "Masuk";
      if(!res || !res.ok){
        pesan("loginMsg", (res && res.message) || "Username atau password salah.", "err");
        return;
      }
      App.username = username;
      App.password = password;
      sessionStorage.setItem(SS_AKUN, JSON.stringify({ u: username, p: password }));
      simpanDataAwal(res);
      bukaAplikasi();
    })
    .catch(err => {
      btn.disabled = false;
      btn.textContent = "Masuk";
      pesan("loginMsg", "Gagal terhubung: " + err.message, "err");
    });
}

/** Simpan hasil batch getInitialData ke state frontend */
function simpanDataAwal(res){
  App.settings  = res.settings || App.settings;
  App.notif     = res.notif || App.notif;
  App.wa        = res.wa || App.wa;
  App.pendaftar = res.pendaftar || [];
  App.rombel    = res.rombel || [];

  // Filter tahun: pulihkan dari localStorage, tambahkan tahun baru otomatis
  const semua = daftarTahun();
  let tersimpan = [];
  try{ tersimpan = JSON.parse(localStorage.getItem(LS.tahun) || "[]"); } catch(e){}
  App.tahunTerpilih = new Set(semua.filter(t => tersimpan.length === 0 || tersimpan.indexOf(t) > -1));
  semua.forEach(t => { if(tersimpan.indexOf(t) === -1 && tersimpan.length > 0) App.tahunTerpilih.add(t); });
  if(App.tahunTerpilih.size === 0) App.tahunTerpilih = new Set(semua);
}

function bukaAplikasi(){
  $("loginWrap").style.display = "none";
  $("app").classList.add("show");
  App.paketRombel = localStorage.getItem(LS.paketRombel) || null;
  App.rombelTerpilih = localStorage.getItem(LS.rombelTerpilih) || null;
  tampilkanIdentitas();
  isiFormPengaturan();
  renderSemua();

  const terakhir = localStorage.getItem(LS.halaman);
  pindahHalaman(terakhir && JUDUL_HALAMAN[terakhir] ? terakhir : "dashboard");
}

$("loginBtn").addEventListener("click", () => {
  const u = $("usernameInput").value.trim();
  const p = $("passwordInput").value;
  if(!u){ pesan("loginMsg", "Username wajib diisi.", "err"); return; }
  if(!p){ pesan("loginMsg", "Password wajib diisi.", "err"); return; }
  login(u, p);
});
["usernameInput","passwordInput"].forEach(id => {
  $(id).addEventListener("keydown", (e) => { if(e.key === "Enter") $("loginBtn").click(); });
});

/* Tombol mata: tampilkan / sembunyikan password */
els(".eye-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const inp = $(btn.dataset.target);
    const sembunyi = inp.type === "password";
    inp.type = sembunyi ? "text" : "password";
    el(".ic-show", btn).style.display = sembunyi ? "none" : "";
    el(".ic-hide", btn).style.display = sembunyi ? "" : "none";
    btn.setAttribute("aria-label", sembunyi ? "Sembunyikan password" : "Tampilkan password");
    inp.focus();
  });
});

/** Auto-login bila sesi masih aktif */
(function autoLogin(){
  try{
    const akun = JSON.parse(sessionStorage.getItem(SS_AKUN) || "null");
    if(akun && akun.u && akun.p) login(akun.u, akun.p);
  } catch(e){}
})();

/**
 * KELUAR — tanpa location.reload().
 * Aplikasi GAS berjalan di dalam iframe (userCodeAppPanel); memuat ulang
 * halaman justru membuka alamat internal itu dan menghasilkan layar putih.
 * Jadi sesi dibersihkan langsung di browser, lalu layar login ditampilkan lagi.
 */
function keluar(){
  // 1. Hapus sesi & data sensitif dari memori
  sessionStorage.removeItem(SS_AKUN);
  App.username = "";
  App.password = "";
  App.pendaftar = [];
  App.rombel = [];
  App.notif = { aktif:false, email_1:"", email_2:"" };
  App.wa = { aktif:false, token:"", nomor_1:"", nomor_2:"" };
  App.detailRow = null;
  App.registerRow = null;

  // 2. Tutup semua yang sedang terbuka
  tutupMenuAksi();
  els(".modal-overlay.show").forEach(m => tutupModal(m));
  tutupSidebar();

  // 3. Kosongkan isian login & pesan
  $("passwordInput").value = "";
  $("passwordInput").type = "password";
  els(".eye-btn").forEach(b => {
    el(".ic-show", b).style.display = "";
    el(".ic-hide", b).style.display = "none";
  });
  pesanReset("loginMsg");

  // 4. Kembali ke layar login
  $("app").classList.remove("show");
  $("loginWrap").style.display = "flex";
  window.scrollTo(0, 0);
  setTimeout(() => $("usernameInput").focus(), 50);

  toast("Anda telah keluar.", "info");
}

$("logoutBtn").addEventListener("click", keluar);

/* ============================================================
   NAVIGASI SPA — 0ms, tanpa panggilan server
   ============================================================ */
function pindahHalaman(nama){
  App.halaman = nama;
  localStorage.setItem(LS.halaman, nama);

  els(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page === nama));
  els(".page").forEach(p => p.classList.toggle("active", p.id === "page-" + nama));

  const judul = JUDUL_HALAMAN[nama] || ["", ""];
  $("pageTitle").textContent = judul[0];
  $("pageSub").textContent = judul[1];

  tutupSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

els(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => pindahHalaman(btn.dataset.page));
});

function bukaSidebar(){ $("sidebar").classList.add("open"); $("backdrop").classList.add("show"); }
function tutupSidebar(){ $("sidebar").classList.remove("open"); $("backdrop").classList.remove("show"); }
$("menuBtn").addEventListener("click", bukaSidebar);
$("backdrop").addEventListener("click", tutupSidebar);

$("themeBtn").addEventListener("click", () => {
  const sekarang = document.documentElement.getAttribute("data-theme");
  terapkanTema(sekarang === "dark" ? "light" : "dark");
});

/* Sub-tab pengaturan */
els(".subtab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    els(".subtab-btn").forEach(b => b.classList.remove("active"));
    els(".subpage").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    $("sub-" + btn.dataset.sub).classList.add("active");
  });
});

/* ============================================================
   FILTER TAHUN
   ============================================================ */
function ambilTahun(str){
  if(!str) return null;
  const m = String(str).match(/(\d{4})/);
  return m ? m[1] : null;
}
function daftarTahun(){
  const set = new Set();
  App.pendaftar.forEach(d => { const t = ambilTahun(d["Waktu Kirim"]); if(t) set.add(t); });
  return Array.from(set).sort((a,b) => b - a);
}
function dataTerfilter(){
  if(App.tahunTerpilih.size === 0) return [];
  return App.pendaftar.filter(d => App.tahunTerpilih.has(ambilTahun(d["Waktu Kirim"])));
}
function labelFilter(){
  const tahun = daftarTahun();
  if(tahun.length === 0) return "Tahun: —";
  if(App.tahunTerpilih.size === tahun.length) return "Tahun: Semua";
  if(App.tahunTerpilih.size === 0) return "Tahun: (kosong)";
  return "Tahun: " + Array.from(App.tahunTerpilih).sort().join(", ");
}

function renderFilterTahun(){
  const tahun = daftarTahun();
  const semuaTercentang = tahun.length > 0 && tahun.every(t => App.tahunTerpilih.has(t));
  const html =
    '<div class="filter-wrap">' +
      '<button type="button" class="filter-btn">' + esc(labelFilter()) + icon("i-chev",15) + '</button>' +
      '<div class="filter-panel">' +
        '<label class="check-row"><input type="checkbox" class="cb-all" ' + (semuaTercentang?"checked":"") + '><span>Semua Tahun</span></label>' +
        '<hr>' +
        (tahun.map(t =>
          '<label class="check-row"><input type="checkbox" class="cb-year" value="'+t+'" ' +
          (App.tahunTerpilih.has(t)?"checked":"") + '><span>'+t+'</span></label>'
        ).join("") || '<div class="check-row">Belum ada data</div>') +
      '</div>' +
    '</div>';

  ["filterDashboardWrap","filterPendaftarWrap"].forEach(idWadah => {
    const wadah = $(idWadah);
    if(!wadah) return;
    wadah.innerHTML = html;

    const tombol = el(".filter-btn", wadah);
    const panel  = el(".filter-panel", wadah);

    tombol.addEventListener("click", (e) => {
      e.stopPropagation();
      const terbuka = panel.classList.contains("show");
      els(".filter-panel.show").forEach(p => p.classList.remove("show"));
      if(!terbuka) panel.classList.add("show");
    });

    el(".cb-all", wadah).addEventListener("change", (e) => {
      App.tahunTerpilih = e.target.checked ? new Set(tahun) : new Set();
      simpanFilterTahun();
    });
    els(".cb-year", wadah).forEach(cb => {
      cb.addEventListener("change", () => {
        if(cb.checked) App.tahunTerpilih.add(cb.value); else App.tahunTerpilih.delete(cb.value);
        simpanFilterTahun();
      });
    });
  });
}

function simpanFilterTahun(){
  localStorage.setItem(LS.tahun, JSON.stringify(Array.from(App.tahunTerpilih)));
  renderSemua(); // instan, tanpa server
}

document.addEventListener("click", (e) => {
  els(".filter-panel.show").forEach(p => p.classList.remove("show"));
  if(!e.target.closest || !e.target.closest("#aksiMenu")) tutupMenuAksi();
});

/* ============================================================
   RENDER — dipanggil setiap state berubah
   ============================================================ */
function renderSemua(){
  renderFilterTahun();
  renderDashboard();
  renderPendaftar();
  renderRombel();
  renderLulus();
  renderDaftarRombel();
  isiPilihanRombel();
  $("badgePendaftar").textContent = dataTerfilter().filter(belumRombel).filter(d => !sudahLulus(d)).length;
}

function belumRombel(d){ return !(d["Rombel"] && String(d["Rombel"]).trim() !== ""); }
function sudahLulus(d){ return !!(d["Tanggal Lulus"] && String(d["Tanggal Lulus"]).trim() !== ""); }
function adaKendala(d){ return !!(d["Kendala"] && String(d["Kendala"]).trim() !== ""); }

/* ---------- DASHBOARD ---------- */
function hitungUmur(tgl){
  if(!tgl) return null;
  const s = String(tgl).trim();
  let d;
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if(m) d = new Date(+m[3], +m[2]-1, +m[1]);
  else d = new Date(s);
  if(isNaN(d.getTime())) return null;
  const kini = new Date();
  let umur = kini.getFullYear() - d.getFullYear();
  const bln = kini.getMonth() - d.getMonth();
  if(bln < 0 || (bln === 0 && kini.getDate() < d.getDate())) umur--;
  return umur;
}

function renderDashboard(){
  const data = dataTerfilter();
  const total = data.length;
  const lk = data.filter(d => d["Jenis Kelamin"] === "Laki-laki").length;
  const pr = data.filter(d => d["Jenis Kelamin"] === "Perempuan").length;
  const nisn = data.filter(d => String(d["NISN"]||"").trim() !== "").length;

  const kartu = [
    ["Total Pendaftar", total, "violet", "i-users"],
    ["Laki-laki", lk, "blue", "i-users"],
    ["Perempuan", pr, "pink", "i-users"],
    ["Memiliki NISN", nisn, "teal", "i-file"]
  ];
  $("statsGrid").innerHTML = kartu.map(k =>
    '<div class="stat">' +
      '<div class="stat-top">' +
        '<div class="stat-icon '+k[2]+'">'+icon(k[3],21)+'</div>' +
        '<div class="stat-label">'+k[0]+'</div>' +
      '</div>' +
      '<div class="stat-value">'+k[1]+'</div>' +
    '</div>'
  ).join("");

  function hitungPer(field){
    const map = {};
    data.forEach(d => { const k = d[field] || "(kosong)"; map[k] = (map[k]||0)+1; });
    return Object.entries(map).sort((a,b) => b[1]-a[1]);
  }
  function hitungUmurSemua(){
    const map = {};
    data.forEach(d => {
      const u = hitungUmur(d["Tanggal Lahir"]);
      const k = (u === null) ? "(tidak diketahui)" : u + " tahun";
      map[k] = (map[k]||0)+1;
    });
    return Object.entries(map).sort((a,b) => {
      const x = parseInt(a[0]), y = parseInt(b[0]);
      if(isNaN(x) && isNaN(y)) return 0;
      if(isNaN(x)) return 1;
      if(isNaN(y)) return -1;
      return x - y;
    });
  }

  function kartuRincian(judul, entri){
    const maks = entri.reduce((m,e) => Math.max(m, e[1]), 0) || 1;
    const baris = entri.map(([k,v]) =>
      '<div style="padding:9px 0;border-bottom:1px dashed var(--border);">' +
        '<div style="display:flex;justify-content:space-between;gap:12px;font-size:13px;">' +
          '<span>'+esc(k)+'</span><span class="count">'+v+'</span>' +
        '</div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:'+Math.round(v/maks*100)+'%"></div></div>' +
      '</div>'
    ).join("");
    return '<div class="card"><div class="card-head"><span class="card-title">'+judul+'</span></div>' +
           '<div class="card-pad" style="padding-top:var(--sp-2);">' +
           (baris || '<div class="empty-state" style="padding:var(--sp-6);">Belum ada data</div>') +
           '</div></div>';
  }

  $("breakdownGrid").innerHTML =
    kartuRincian("Jenis Pendaftaran", hitungPer("Pendaftaran")) +
    kartuRincian("Umur Peserta", hitungUmurSemua()) +
    kartuRincian("Berkebutuhan Khusus", hitungPer("Berkebutuhan Khusus"));
}

/* ---------- TABEL PESERTA (dipakai ulang) ---------- */
function barisPesertaHTML(rows, opsi){
  const o = opsi || {};
  const tampilHapus = o.hapus !== false;
  const tampilWaktu = o.waktu !== false;
  const tampilLulus = o.lulus !== false;

  return rows.map(d => {
    const i = App.pendaftar.indexOf(d);
    const kendala = adaKendala(d);
    return '<tr class="'+(kendala?"row-kendala":"")+'"'+(kendala?' title="Kendala: '+esc(d["Kendala"])+'"':"")+'>' +
      (tampilWaktu ? '<td>'+esc(d["Waktu Kirim"])+'</td>' : "") +
      '<td class="cell-name">'+esc(d["Nama Lengkap"])+'</td>' +
      '<td><span class="badge '+(d["Jenis Kelamin"]==="Perempuan"?"badge-pink":"badge-blue")+'">'+
        esc(d["Jenis Kelamin"]==="Perempuan"?"P":"L")+'</span></td>' +
      '<td><span class="badge badge-violet">'+esc(d["Pendaftaran"])+'</span></td>' +
      '<td>'+esc(d["NISN"])+'</td>' +
      '<td>'+esc(d["No HP"])+'</td>' +
      '<td>' +
        '<div class="action-cell">' +
          '<button class="btn btn-ghost btn-sm act-detail" data-i="'+i+'">Detail</button>' +
          '<button class="btn btn-ghost btn-sm act-menu" data-i="'+i+'" aria-haspopup="true" aria-expanded="false" ' +
            'data-hapus="'+(tampilHapus?"1":"0")+'" data-lulus="'+(tampilLulus?"1":"0")+'">' +
            'Aksi '+icon("i-chev",13)+'</button>' +
        '</div>' +
      '</td>' +
    '</tr>';
  }).join("");
}

/* ---------- Menu Aksi melayang (portal) ---------- */
let aksiPemicu = null;

function tutupMenuAksi(){
  $("aksiMenu").classList.remove("show");
  if(aksiPemicu){ aksiPemicu.setAttribute("aria-expanded","false"); aksiPemicu = null; }
}

function bukaMenuAksi(tombol, opsi){
  const o = opsi || {};
  const row = App.pendaftar[+tombol.dataset.i];
  if(!row) return;

  const menu = $("aksiMenu");
  const adaHapus = tombol.dataset.hapus === "1";
  const adaLulus = tombol.dataset.lulus === "1";

  menu.innerHTML =
    '<div class="aksi-menu-head">' +
      '<div class="nm">'+esc(row["Nama Lengkap"])+'</div>' +
      '<div class="sub">'+esc(row["Pendaftaran"] || "-")+
        (row["Rombel"] ? ' &middot; '+esc(row["Rombel"]) : "")+'</div>' +
    '</div>' +
    '<button class="aksi-item" data-act="register"><span class="ic">'+icon("i-tag")+'</span> Register</button>' +
    '<button class="aksi-item" data-act="pdf"><span class="ic">'+icon("i-file")+'</span> Download Formulir</button>' +
    (adaHapus
      ? '<div class="aksi-sep"></div>' +
        '<button class="aksi-item danger" data-act="hapus"><span class="ic">'+icon("i-trash")+'</span> Hapus Peserta</button>'
      : "");

  // Tampilkan dulu agar ukurannya terukur, lalu posisikan
  menu.classList.add("show");
  const r = tombol.getBoundingClientRect();
  const lebar = menu.offsetWidth, tinggi = menu.offsetHeight;
  const jarak = 6;

  let kiri = r.right - lebar;                       // rata kanan tombol
  kiri = Math.max(10, Math.min(kiri, window.innerWidth - lebar - 10));

  let atas = r.bottom + jarak;
  if(atas + tinggi > window.innerHeight - 10){      // tidak muat di bawah -> buka ke atas
    atas = Math.max(10, r.top - tinggi - jarak);
  }
  menu.style.left = kiri + "px";
  menu.style.top = atas + "px";

  tombol.setAttribute("aria-expanded","true");
  aksiPemicu = tombol;

  els(".aksi-item", menu).forEach(item => {
    item.addEventListener("click", () => {
      const aksi = item.dataset.act;
      tutupMenuAksi();
      if(aksi === "register") bukaRegister(row, { lulusSaja: !!o.lulusSaja, adaLulus: adaLulus });
      else if(aksi === "pdf") unduhPDFPeserta(row);
      else if(aksi === "hapus") hapusPeserta(row);
    });
  });
}

// Tutup menu saat halaman digulir / ukuran layar berubah
window.addEventListener("scroll", tutupMenuAksi, true);
window.addEventListener("resize", tutupMenuAksi);

function pasangEventBaris(tbody, opsi){
  const o = opsi || {};
  els(".act-detail", tbody).forEach(b =>
    b.addEventListener("click", () => bukaDetail(App.pendaftar[+b.dataset.i])));

  els(".act-menu", tbody).forEach(b => {
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      const sedangTerbuka = (aksiPemicu === b);
      tutupMenuAksi();
      els(".filter-panel.show").forEach(p => p.classList.remove("show"));
      if(!sedangTerbuka) bukaMenuAksi(b, o);
    });
  });
}

function cocokPencarian(d, q){
  if(!q) return true;
  const f = q.toLowerCase();
  return String(d["Nama Lengkap"]||"").toLowerCase().includes(f) ||
         String(d["NIK"]||"").toLowerCase().includes(f) ||
         String(d["NISN"]||"").toLowerCase().includes(f);
}

function kosongHTML(teks){
  return '<div class="empty-state">'+icon("i-inbox",44)+'<div>'+esc(teks)+'</div></div>';
}

/* ---------- HALAMAN: DATA PENDAFTAR ---------- */
function renderPendaftar(){
  const q = $("searchPendaftar").value;
  const rows = dataTerfilter().filter(d => belumRombel(d) && !sudahLulus(d) && cocokPencarian(d, q));

  const tabel = $("tablePendaftar");
  const kosong = $("emptyPendaftar");

  if(rows.length === 0){
    tabel.style.display = "none";
    kosong.innerHTML = kosongHTML(q ? "Tidak ada peserta yang cocok dengan pencarian."
                                    : "Belum ada data pendaftar.");
    return;
  }
  tabel.style.display = "table";
  kosong.innerHTML = "";
  $("bodyPendaftar").innerHTML = barisPesertaHTML(rows, { lulus:false });
  pasangEventBaris($("bodyPendaftar"));
}
$("searchPendaftar").addEventListener("input", debounce(renderPendaftar, 220));

/* ---------- HALAMAN: ROMBEL ---------- */
function slug(str){ return String(str).replace(/[^a-zA-Z0-9]+/g, "_"); }

function urutkanRombel(daftar){
  const urutan = ["Paket A","Paket B","Paket C"];
  const grup = { "Paket A":[], "Paket B":[], "Paket C":[], "Lainnya":[] };
  daftar.forEach(nama => {
    const m = String(nama).match(/^Paket\s+([ABC])\s+kls\s+(\d+)/i);
    if(m) grup["Paket " + m[1].toUpperCase()].push({ nama, kelas:+m[2] });
    else grup["Lainnya"].push({ nama, kelas:null });
  });
  urutan.forEach(p => grup[p].sort((a,b) => a.kelas - b.kelas));
  grup["Lainnya"].sort((a,b) => String(a.nama).localeCompare(String(b.nama)));
  return urutan.concat(["Lainnya"]).reduce((acc,p) => acc.concat(grup[p].map(x => x.nama)), []);
}

/** Menentukan Paket dari nama rombel, mis. "Paket C kls 12" -> "Paket C" */
function paketDariRombel(nama){
  const m = String(nama).match(/^Paket\s+([ABC])\b/i);
  return m ? ("Paket " + m[1].toUpperCase()) : "Lainnya";
}

function renderRombel(){
  const q = $("searchRombel").value.trim();
  const data = dataTerfilter().filter(d => !sudahLulus(d) && cocokPencarian(d, q));
  const namaRombel = urutkanRombel(App.rombel.map(r => r.nama));
  const wadah = $("rombelContent");

  const asing = data.filter(d => {
    const r = d["Rombel"];
    return r && String(r).trim() !== "" && namaRombel.indexOf(r) === -1;
  });

  if(namaRombel.length === 0 && asing.length === 0){
    wadah.innerHTML = kosongHTML("Belum ada rombel. Tambahkan di Pengaturan \u203a Rombel.");
    return;
  }

  // Saat mencari: lewati semua tingkat, langsung tampilkan hasil dari seluruh rombel
  if(q){
    tampilkanPesertaRombel(wadah, null, data, namaRombel, asing, q);
    return;
  }

  // Tingkat 1: pilih Paket
  if(!App.paketRombel){
    tampilkanDaftarPaket(wadah, data, namaRombel, asing);
    return;
  }

  // Tingkat 2: pilih Rombel di dalam Paket
  if(!App.rombelTerpilih){
    tampilkanDaftarRombelPaket(wadah, App.paketRombel, data, namaRombel, asing);
    return;
  }

  // Tingkat 3: daftar peserta pada rombel terpilih
  tampilkanPesertaRombel(wadah, App.rombelTerpilih, data, namaRombel, asing, "");
}

/** Breadcrumb navigasi Rombel: Semua Paket › Paket X › Nama Rombel */
function breadcrumbRombel(paket, namaRombel){
  const panah = '<span class="crumb-sep"><svg width="13" height="13" style="transform:rotate(-90deg);"><use href="#i-chev"/></svg></span>';
  let html = '<div class="breadcrumb">' +
    '<button class="crumb" id="crumbSemua">' +
      '<svg width="14" height="14"><use href="#i-layers"/></svg> Semua Paket' +
    '</button>';

  if(paket){
    html += panah;
    html += namaRombel
      ? '<button class="crumb" id="crumbPaket">'+esc(paket)+'</button>'
      : '<span class="crumb-now">'+esc(paket)+'</span>';
  }
  if(namaRombel){
    html += panah + '<span class="crumb-now">'+esc(namaRombel)+'</span>';
  }
  return html + '</div>';
}

function pasangBreadcrumb(){
  const semua = $("crumbSemua");
  if(semua) semua.addEventListener("click", () => {
    App.paketRombel = null;
    App.rombelTerpilih = null;
    localStorage.removeItem(LS.paketRombel);
    localStorage.removeItem(LS.rombelTerpilih);
    renderRombel();
    window.scrollTo({ top:0, behavior:"smooth" });
  });

  const paket = $("crumbPaket");
  if(paket) paket.addEventListener("click", () => {
    App.rombelTerpilih = null;
    localStorage.removeItem(LS.rombelTerpilih);
    renderRombel();
    window.scrollTo({ top:0, behavior:"smooth" });
  });
}

/** TINGKAT 1 — kartu Paket A / B / C (+ Lainnya bila ada) */
function tampilkanDaftarPaket(wadah, data, namaRombel, asing){
  const daftar = [];
  ["Paket A","Paket B","Paket C"].forEach(p => {
    const isi = namaRombel.filter(n => paketDariRombel(n) === p);
    if(isi.length) daftar.push({ paket:p, rombel:isi });
  });
  const lain = namaRombel.filter(n => paketDariRombel(n) === "Lainnya");
  if(lain.length || asing.length) daftar.push({ paket:"Lainnya", rombel:lain });

  const warna = { "Paket A":"violet", "Paket B":"blue", "Paket C":"teal", "Lainnya":"pink" };

  wadah.innerHTML =
    '<div class="stats-grid" style="margin-bottom:0;">' +
    daftar.map(item => {
      let jumlah = data.filter(d => String(d["Rombel"]||"").trim() !== "" &&
                                    paketDariRombel(d["Rombel"]) === item.paket).length;
      if(item.paket === "Lainnya") jumlah += asing.length;
      return '<button class="stat paket-card" data-paket="'+esc(item.paket)+'" ' +
               'style="text-align:left;border:1px solid var(--border);cursor:pointer;width:100%;font-family:inherit;">' +
        '<div class="stat-top">' +
          '<div class="stat-icon '+warna[item.paket]+'">'+icon("i-layers",21)+'</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div class="stat-label">'+esc(item.paket)+'</div>' +
            '<div class="hint" style="margin-top:2px;">'+item.rombel.length+' rombel</div>' +
          '</div>' +
          '<svg width="18" height="18" style="color:var(--text-subtle);transform:rotate(-90deg);"><use href="#i-chev"/></svg>' +
        '</div>' +
        '<div class="stat-value">'+jumlah+' <span style="font-size:13px;font-weight:600;color:var(--text-muted);">peserta</span></div>' +
      '</button>';
    }).join("") +
    '</div>';

  els(".paket-card", wadah).forEach(b => {
    b.addEventListener("click", () => {
      App.paketRombel = b.dataset.paket;
      App.rombelTerpilih = null;
      localStorage.setItem(LS.paketRombel, App.paketRombel);
      localStorage.removeItem(LS.rombelTerpilih);
      renderRombel();
      window.scrollTo({ top:0, behavior:"smooth" });
    });
  });
}

/** TINGKAT 2 — kartu tingkatan rombel di dalam satu Paket */
function tampilkanDaftarRombelPaket(wadah, paket, data, namaRombel, asing){
  const daftar = namaRombel.filter(n => paketDariRombel(n) === paket);
  const asingDipakai = (paket === "Lainnya") ? asing : [];

  let html = breadcrumbRombel(paket, null);

  if(daftar.length === 0 && asingDipakai.length === 0){
    wadah.innerHTML = html + kosongHTML("Belum ada rombel pada paket ini.");
    pasangBreadcrumb();
    return;
  }

  html += '<div class="stats-grid" style="margin-bottom:0;">' +
    daftar.map(nama => {
      const info = App.rombel.find(r => r.nama === nama) || {};
      const jumlah = data.filter(d => d["Rombel"] === nama).length;
      return '<button class="stat paket-card" data-rombel="'+esc(nama)+'" ' +
               'style="text-align:left;border:1px solid var(--border);cursor:pointer;width:100%;font-family:inherit;">' +
        '<div class="stat-top">' +
          '<div class="stat-icon violet">'+icon("i-users",21)+'</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div class="stat-label">'+esc(nama)+'</div>' +
            '<div class="hint" style="margin-top:2px;">'+(info.wali_guru ? "Wali: "+esc(info.wali_guru) : "Wali belum diisi")+'</div>' +
          '</div>' +
          '<svg width="18" height="18" style="color:var(--text-subtle);transform:rotate(-90deg);"><use href="#i-chev"/></svg>' +
        '</div>' +
        '<div class="stat-value">'+jumlah+' <span style="font-size:13px;font-weight:600;color:var(--text-muted);">peserta</span></div>' +
      '</button>';
    }).join("") +
    (asingDipakai.length
      ? '<button class="stat paket-card" data-rombel="__asing__" ' +
          'style="text-align:left;border:1px solid var(--border);cursor:pointer;width:100%;font-family:inherit;">' +
        '<div class="stat-top">' +
          '<div class="stat-icon pink">'+icon("i-alert",21)+'</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div class="stat-label">Rombel Tidak Dikenal</div>' +
            '<div class="hint" style="margin-top:2px;">Nama rombel di luar daftar</div>' +
          '</div>' +
          '<svg width="18" height="18" style="color:var(--text-subtle);transform:rotate(-90deg);"><use href="#i-chev"/></svg>' +
        '</div>' +
        '<div class="stat-value">'+asingDipakai.length+' <span style="font-size:13px;font-weight:600;color:var(--text-muted);">peserta</span></div>' +
      '</button>'
      : "") +
    '</div>';

  wadah.innerHTML = html;
  pasangBreadcrumb();

  els(".paket-card", wadah).forEach(b => {
    b.addEventListener("click", () => {
      App.rombelTerpilih = b.dataset.rombel;
      localStorage.setItem(LS.rombelTerpilih, App.rombelTerpilih);
      renderRombel();
      window.scrollTo({ top:0, behavior:"smooth" });
    });
  });
}

/** TINGKAT 3 — daftar peserta pada satu rombel (atau hasil pencarian) */
function tampilkanPesertaRombel(wadah, namaRombelAktif, data, namaRombel, asing, q){
  function grupHTML(nama, rows, waliGuru){
    return '<div class="group">' +
      '<div class="group-head">' +
        '<span class="group-title">'+esc(nama)+'</span>' +
        '<span class="badge badge-violet">'+rows.length+' peserta</span>' +
        (waliGuru ? '<span class="group-wali">Wali: '+esc(waliGuru)+'</span>' : "") +
        (rows.length ? '<button class="btn btn-ghost btn-sm push rombel-xlsx" data-nama="'+esc(nama)+'">' +
          icon("i-download",14)+' Excel</button>' : "") +
      '</div>' +
      (rows.length
        ? '<div class="table-wrap"><table><thead><tr>' +
            '<th>Nama Lengkap</th><th>L/P</th><th>Paket</th><th>NISN</th><th>No HP</th><th></th>' +
          '</tr></thead><tbody id="rb_'+slug(nama)+'"></tbody></table></div>'
        : '<div class="card"><div class="empty-state" style="padding:var(--sp-6);">Belum ada peserta di rombel ini.</div></div>') +
    '</div>';
  }

  let html = "";
  const daftarTampil = [];

  if(q){
    // Mode pencarian: tampilkan semua rombel yang ada hasilnya
    namaRombel.forEach(nama => {
      const rows = data.filter(d => d["Rombel"] === nama);
      if(rows.length === 0) return;
      const info = App.rombel.find(r => r.nama === nama);
      html += grupHTML(nama, rows, info && info.wali_guru);
      daftarTampil.push({ nama, rows });
    });
    if(asing.length){
      html += grupHTML("Rombel Tidak Dikenal", asing, "");
      daftarTampil.push({ nama:"Rombel Tidak Dikenal", rows:asing });
    }
    wadah.innerHTML = html || kosongHTML("Tidak ada peserta yang cocok dengan pencarian.");
  } else {
    // Mode telusur: satu rombel saja
    const asingMode = (namaRombelAktif === "__asing__");
    const nama = asingMode ? "Rombel Tidak Dikenal" : namaRombelAktif;
    const rows = asingMode ? asing : data.filter(d => d["Rombel"] === nama);
    const info = App.rombel.find(r => r.nama === nama);

    html = breadcrumbRombel(App.paketRombel, nama) +
           grupHTML(nama, rows, info && info.wali_guru);

    wadah.innerHTML = html;
    daftarTampil.push({ nama, rows });
    pasangBreadcrumb();
  }

  daftarTampil.forEach(item => {
    const tb = $("rb_" + slug(item.nama));
    if(tb && item.rows.length){
      tb.innerHTML = barisPesertaHTML(item.rows, { hapus:false, waktu:false });
      pasangEventBaris(tb);
    }
  });

  els(".rombel-xlsx", wadah).forEach(b => {
    b.addEventListener("click", () => {
      const nama = b.dataset.nama;
      const rows = (nama === "Rombel Tidak Dikenal")
        ? asing : data.filter(d => d["Rombel"] === nama);
      unduhExcel(rows, "Data_" + slug(nama), nama);
    });
  });
}
$("searchRombel").addEventListener("input", debounce(renderRombel, 220));

/* ---------- HALAMAN: PESERTA LULUS ---------- */
function renderLulus(){
  const q = $("searchLulus").value;
  const data = dataTerfilter().filter(d => sudahLulus(d) && cocokPencarian(d, q));
  const wadah = $("lulusContent");

  if(data.length === 0){
    wadah.innerHTML = kosongHTML(q ? "Tidak ada peserta yang cocok dengan pencarian."
      : "Belum ada peserta yang ditandai lulus.");
    return;
  }

  const perTahun = {};
  data.forEach(d => {
    const t = ambilTahun(d["Tanggal Lulus"]) || "Tidak Diketahui";
    (perTahun[t] = perTahun[t] || []).push(d);
  });
  const tahunUrut = Object.keys(perTahun).sort((a,b) => b.localeCompare(a));

  wadah.innerHTML = tahunUrut.map(t =>
    '<div class="group">' +
      '<div class="group-head">' +
        '<span class="group-title">Lulus '+esc(t)+'</span>' +
        '<span class="badge badge-green">'+perTahun[t].length+' peserta</span>' +
        '<button class="btn btn-ghost btn-sm push lulus-xlsx" data-tahun="'+esc(t)+'">'+icon("i-download",14)+' Excel</button>' +
      '</div>' +
      '<div class="table-wrap"><table><thead><tr>' +
        '<th>Tanggal Lulus</th><th>Nama Lengkap</th><th>L/P</th><th>Paket</th><th>Rombel Terakhir</th><th></th>' +
      '</tr></thead><tbody id="ll_'+slug(t)+'"></tbody></table></div>' +
    '</div>'
  ).join("");

  tahunUrut.forEach(t => {
    const tb = $("ll_" + slug(t));
    if(!tb) return;
    tb.innerHTML = perTahun[t].map(d => {
      const i = App.pendaftar.indexOf(d);
      return '<tr>' +
        '<td>'+esc(d["Tanggal Lulus"])+'</td>' +
        '<td class="cell-name">'+esc(d["Nama Lengkap"])+'</td>' +
        '<td><span class="badge '+(d["Jenis Kelamin"]==="Perempuan"?"badge-pink":"badge-blue")+'">'+
          esc(d["Jenis Kelamin"]==="Perempuan"?"P":"L")+'</span></td>' +
        '<td><span class="badge badge-violet">'+esc(d["Pendaftaran"])+'</span></td>' +
        '<td>'+esc(d["Rombel"])+'</td>' +
        '<td><div class="action-cell">' +
          '<button class="btn btn-ghost btn-sm act-detail" data-i="'+i+'">Detail</button>' +
          '<button class="btn btn-ghost btn-sm act-menu" data-i="'+i+'" aria-haspopup="true" aria-expanded="false" ' +
            'data-hapus="0" data-lulus="1">Aksi '+icon("i-chev",13)+'</button>' +
        '</div></td>' +
      '</tr>';
    }).join("");
    pasangEventBaris(tb, { lulusSaja:true });
  });

  els(".lulus-xlsx", wadah).forEach(b => {
    b.addEventListener("click", () => {
      const t = b.dataset.tahun;
      unduhExcel(perTahun[t], "Peserta_Lulus_" + slug(t), "Lulus " + t);
    });
  });
}
$("searchLulus").addEventListener("input", debounce(renderLulus, 220));

/* ============================================================
   MODAL DETAIL
   ============================================================ */
const F_DAPODIK = ["Provinsi Sekolah Asal","Kabupaten/Kota Sekolah Asal","Kecamatan Sekolah Asal","Nama Sekolah Asal","Lulus Tahun"];
const F_NON_DAPODIK = ["Nama Lengkap","Jenis Kelamin","NIK","Tempat Lahir","Tanggal Lahir","Nama Ibu",
  "Agama & Kepercayaan","Alamat Jalan","Desa/Kelurahan","Provinsi","Kabupaten/Kota","Kecamatan"];

/* Urutan & pengelompokan detail — mengikuti susunan Formulir Pendaftaran (PDF) */
const URUTAN_DETAIL = [
  { bagian:"Pendaftaran", fields:["Waktu Kirim","Pendaftaran","Apakah Pernah Putus Sekolah"] },
  { sub:"Alamat Sekolah Asal", fields:["Provinsi Sekolah Asal","Kabupaten/Kota Sekolah Asal","Kecamatan Sekolah Asal","Nama Sekolah Asal","Lulus Tahun"] },
  { bagian:"Data Pribadi", fields:["Nama Lengkap","Jenis Kelamin","NISN","NIK","No KK","Tempat Lahir","Tanggal Lahir","No Registrasi Akta Lahir","Berkebutuhan Khusus","Agama & Kepercayaan","Alamat Jalan","Provinsi","Kabupaten/Kota","Kecamatan","RT","RW","Nama Dusun","Desa/Kelurahan","Kode Pos","Tempat Tinggal","Moda Transportasi","Anak Ke-"] },
  { bagian:"Data Ayah Kandung", fields:["Status Ayah","Nama Ayah","NIK Ayah","Tahun Lahir Ayah","Pendidikan Ayah","Pekerjaan Ayah","Berkebutuhan Khusus Ayah","Penghasilan Ayah"] },
  { bagian:"Data Ibu Kandung", fields:["Status Ibu","Nama Ibu","NIK Ibu","Tahun Lahir Ibu","Pendidikan Ibu","Pekerjaan Ibu","Berkebutuhan Khusus Ibu","Penghasilan Ibu"] },
  { bagian:"Data Wali", fields:["Mempunyai Wali","Nama Wali","NIK Wali","Tahun Lahir Wali","Pendidikan Wali","Pekerjaan Wali","Penghasilan Wali"] },
  { bagian:"Kontak", fields:["No Telepon Rumah","No HP","Email"] },
  { bagian:"Data Periodik", fields:["Tinggi Badan (CM)","Berat Badan (Kg)","Lingkar Kepala","Jarak Rumah ke Sekolah","Sebutkan (KM)","Waktu Tempuh ke Sekolah","Jumlah Saudara Kandung"] },
  { bagian:"Berkas", fields:["Berkas KK","Berkas Ijazah"] },
  { bagian:"Status Akademik", fields:["Rombel","Kendala","Tanggal Lulus"] }
];

function barisDetailHTML(row, k){
  const v = row[k];
  const berkas = (k === "Berkas KK" || k === "Berkas Ijazah") && v && String(v).startsWith("http");
  const nilai = berkas
    ? '<button class="btn btn-ghost btn-sm lihat-berkas" data-url="'+esc(v)+'" data-judul="'+esc(k)+'">' +
        icon("i-eye",14)+' Lihat Berkas</button>'
    : esc(v);
  return '<div class="detail-row"><span class="k">'+esc(k)+'</span><span class="v">'+nilai+'</span></div>';
}

/** Ubah tautan Google Drive menjadi tautan pratinjau yang bisa disematkan */
function urlPratinjau(url){
  const m = String(url).match(/\/d\/([A-Za-z0-9_-]+)/) || String(url).match(/[?&]id=([A-Za-z0-9_-]+)/);
  return m ? ("https://drive.google.com/file/d/" + m[1] + "/preview") : url;
}

function bukaPratinjauBerkas(url, judul){
  $("berkasJudul").textContent = judul || "Pratinjau Berkas";
  $("berkasBukaTab").href = url;
  $("berkasBody").innerHTML =
    '<div class="berkas-memuat"><div class="spinner"></div><div>Memuat berkas…</div></div>';
  $("berkasModal").classList.add("show");

  // Sematkan setelah modal tampil agar animasi tetap mulus
  setTimeout(() => {
    $("berkasBody").innerHTML =
      '<iframe src="'+esc(urlPratinjau(url))+'" allow="autoplay" title="Pratinjau berkas"></iframe>';
  }, 120);
}

/** Tutup pratinjau -> kosongkan iframe agar berhenti memuat */
function tutupPratinjauBerkas(){
  $("berkasModal").classList.remove("show");
  $("berkasBody").innerHTML = "";
}

function isiDetail(row, tampilan){
  const body = $("detailBody");

  // Tab Dapodik / Non Dapodik: daftar datar tanpa judul bagian
  if(tampilan === "dapodik" || tampilan === "non_dapodik"){
    const keys = (tampilan === "dapodik") ? F_DAPODIK : F_NON_DAPODIK;
    body.innerHTML = keys.map(k => barisDetailHTML(row, k)).join("");
    pasangTombolBerkas(body);
    return;
  }

  // Tab Semua: ikuti urutan & pengelompokan Formulir Pendaftaran
  const sudahTampil = new Set();
  let html = "";

  URUTAN_DETAIL.forEach(grup => {
    const isi = grup.fields
      .filter(k => Object.prototype.hasOwnProperty.call(row, k))
      .map(k => { sudahTampil.add(k); return barisDetailHTML(row, k); })
      .join("");
    if(!isi) return;
    html += grup.bagian
      ? '<div class="detail-section">'+esc(grup.bagian)+'</div>'
      : '<div class="detail-subsection">'+esc(grup.sub)+'</div>';
    html += isi;
  });

  // Kolom lain yang belum masuk daftar di atas (mis. kolom baru) tetap ditampilkan
  const sisa = Object.keys(row).filter(k => !k.startsWith("_") && !sudahTampil.has(k));
  if(sisa.length){
    html += '<div class="detail-section">Data Lainnya</div>';
    html += sisa.map(k => barisDetailHTML(row, k)).join("");
  }

  body.innerHTML = html;
  pasangTombolBerkas(body);
}

function pasangTombolBerkas(wadah){
  els(".lihat-berkas", wadah).forEach(b => {
    b.addEventListener("click", () => bukaPratinjauBerkas(b.dataset.url, b.dataset.judul));
  });
}

function bukaDetail(row){
  App.detailRow = row;
  $("detailNama").textContent = row["Nama Lengkap"] || "Detail Pendaftar";
  els(".modal-tab").forEach(t => t.classList.toggle("active", t.dataset.view === "semua"));
  isiDetail(row, "semua");
  $("detailModal").classList.add("show");
}

els(".modal-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    els(".modal-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    if(App.detailRow) isiDetail(App.detailRow, tab.dataset.view);
  });
});

function tutupModal(idAtauEl){
  const m = (typeof idAtauEl === "string") ? $(idAtauEl) : idAtauEl;
  if(!m) return;
  m.classList.remove("show");
  if(m.id === "berkasModal") $("berkasBody").innerHTML = ""; // hentikan pemuatan iframe
}

els("[data-close]").forEach(b =>
  b.addEventListener("click", () => tutupModal(b.dataset.close)));
els(".modal-overlay").forEach(ov =>
  ov.addEventListener("click", (e) => { if(e.target === ov) tutupModal(ov); }));
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape") els(".modal-overlay.show").forEach(m => tutupModal(m));
});

/* ============================================================
   MODAL REGISTER — Optimistic UI
   ============================================================ */
function isiPilihanRombel(){
  const sel = $("selectRombel");
  if(!sel) return;
  const row = App.registerRow;
  const sekarang = row ? (row["Rombel"] || "") : "";
  const paket = row ? (row["Pendaftaran"] || "") : "";

  let daftar = App.rombel;
  if(paket){
    const cocok = App.rombel.filter(r => String(r.nama).toLowerCase().startsWith(paket.toLowerCase()));
    if(cocok.length) daftar = cocok;
  }
  sel.innerHTML = '<option value="">— Pilih Rombel —</option>' +
    daftar.map(r => '<option value="'+esc(r.nama)+'" '+(r.nama===sekarang?"selected":"")+'>'+esc(r.nama)+'</option>').join("");
}

function bukaRegister(row, opsi){
  const o = opsi || {};
  App.registerRow = row;
  $("registerNama").textContent = row["Nama Lengkap"] || "";
  pesanReset("msgRegister");

  const diRombel = !belumRombel(row);
  const lulus = sudahLulus(row);
  const kendala = adaKendala(row);

  $("choiceRombel").textContent = diRombel ? "Pindah/Naik Rombel" : "Masukan Rombel";
  $("choiceKendala").textContent = diRombel ? "Keluarkan dari Rombel" : "Kendala";
  $("choiceLulus").textContent = lulus ? "Batalkan Kelulusan" : "Lulus";

  // Di halaman Peserta Lulus: hanya opsi Batalkan Kelulusan
  if(o.lulusSaja){
    $("choiceRow").style.display = "none";
    isiSectionLulus();
    pilihTab("lulus");
  } else {
    $("choiceRow").style.display = "flex";
    $("choiceLulus").style.display = o.adaLulus ? "" : "none";
    isiPilihanRombel();
    isiSectionKendala();
    isiSectionLulus();

    // Rombel dikunci bila masih ada kendala
    $("choiceRombel").disabled = kendala;
    $("selectRombel").disabled = kendala;
    $("saveRombelBtn").disabled = kendala;
    $("warnKendala").className = kendala ? "msg err show" : "msg";

    pilihTab(kendala ? "kendala" : "rombel");
  }

  $("registerModal").classList.add("show");
}

function pilihTab(mana){
  const peta = { rombel:["choiceRombel","sectionRombel"], kendala:["choiceKendala","sectionKendala"], lulus:["choiceLulus","sectionLulus"] };
  Object.keys(peta).forEach(k => {
    $(peta[k][0]).classList.toggle("active", k === mana);
    $(peta[k][1]).style.display = (k === mana) ? "block" : "none";
  });
  pesanReset("msgRegister");
}
$("choiceRombel").addEventListener("click", () => { if(!$("choiceRombel").disabled) pilihTab("rombel"); });
$("choiceKendala").addEventListener("click", () => pilihTab("kendala"));
$("choiceLulus").addEventListener("click", () => pilihTab("lulus"));

function isiSectionKendala(){
  const row = App.registerRow;
  const diRombel = !belumRombel(row);
  const punyaKendala = adaKendala(row);

  if(diRombel){
    $("sectionKendala").innerHTML =
      '<p style="font-size:14px;font-weight:600;margin:0 0 var(--sp-5);text-align:center;">Keluarkan peserta didik ini dari rombel?</p>' +
      '<div style="display:flex;gap:10px;">' +
        '<button class="btn btn-ghost" style="flex:1;" id="btnTidakKeluar">Tidak</button>' +
        '<button class="btn btn-danger" style="flex:1;" id="btnYaKeluar">Ya, Keluarkan</button>' +
      '</div>';
    $("btnTidakKeluar").addEventListener("click", () => pilihTab("rombel"));
    $("btnYaKeluar").addEventListener("click", () =>
      simpanField("Rombel", "", "Peserta dikeluarkan dari rombel.", true));
  } else {
    $("sectionKendala").innerHTML =
      '<div class="field"><label for="inputKendala">Kendala</label>' +
      '<textarea id="inputKendala" placeholder="Tulis kendala peserta ini…"></textarea></div>' +
      '<div style="display:flex;gap:10px;">' +
        '<button class="btn btn-primary" style="flex:1;" id="btnSimpanKendala">Simpan Kendala</button>' +
        (punyaKendala ? '<button class="btn btn-ghost" style="flex:1;color:var(--red-500);border-color:var(--red-500);" id="btnHapusKendala">Hapus Kendala</button>' : "") +
      '</div>';
    $("inputKendala").value = row["Kendala"] || "";
    $("btnSimpanKendala").addEventListener("click", () =>
      simpanField("Kendala", $("inputKendala").value.trim(), "Kendala berhasil disimpan.", true));
    if(punyaKendala){
      $("btnHapusKendala").addEventListener("click", () =>
        simpanField("Kendala", "", "Kendala berhasil dihapus.", true));
    }
  }
}

function isiSectionLulus(){
  const row = App.registerRow;
  if(sudahLulus(row)){
    $("sectionLulus").innerHTML =
      '<p class="hint" style="margin:0 0 var(--sp-2);">Tanggal lulus tercatat: <strong style="color:var(--text);">'+esc(row["Tanggal Lulus"])+'</strong></p>' +
      '<p style="font-size:14px;font-weight:600;margin:var(--sp-4) 0 var(--sp-5);text-align:center;">Batalkan status lulus peserta didik ini?</p>' +
      '<div style="display:flex;gap:10px;">' +
        '<button class="btn btn-ghost" style="flex:1;" id="btnTidakBatal">Tidak</button>' +
        '<button class="btn btn-danger" style="flex:1;" id="btnYaBatal">Ya, Batalkan</button>' +
      '</div>';
    $("btnTidakBatal").addEventListener("click", () => $("registerModal").classList.remove("show"));
    $("btnYaBatal").addEventListener("click", () =>
      simpanField("Tanggal Lulus", "", "Status lulus dibatalkan.", true));
  } else {
    $("sectionLulus").innerHTML =
      '<div class="field"><label for="inputTglLulus">Tanggal Lulus</label>' +
      '<input type="date" id="inputTglLulus"></div>' +
      '<button class="btn btn-primary btn-block" id="btnSimpanLulus">Simpan Kelulusan</button>';
    $("btnSimpanLulus").addEventListener("click", () => {
      const v = $("inputTglLulus").value;
      if(!v){ pesan("msgRegister", "Tanggal lulus wajib diisi.", "err"); return; }
      const [y,m,d] = v.split("-");
      simpanField("Tanggal Lulus", d+"/"+m+"/"+y, "Peserta ditandai lulus.", true);
    });
  }
}

$("saveRombelBtn").addEventListener("click", () =>
  simpanField("Rombel", $("selectRombel").value, "Rombel berhasil disimpan.", true));

/**
 * OPTIMISTIC UI:
 * 1) Ubah state lokal + render ulang -> UI berubah instan (0ms)
 * 2) Kirim ke server di latar belakang
 * 3) Bila gagal -> kembalikan nilai lama (rollback) + beri tahu
 */
function simpanField(field, nilai, pesanSukses, tutupModal){
  const row = App.registerRow;
  if(!row || !row._row){
    pesan("msgRegister", "Data peserta tidak valid. Muat ulang data lalu coba lagi.", "err");
    return;
  }

  const nilaiLama = row[field];
  row[field] = nilai;          // 1. state lokal
  renderSemua();               //    UI instan
  toast(pesanSukses, "ok");
  if(tutupModal) $("registerModal").classList.remove("show");

  syncMulai();                 // 2. sinkronisasi latar belakang
  API.kirim({
      action: "update_field",
      username: App.username,
      password: App.password,
      row: row._row,
      field: field,
      value: nilai
    })
    .then(res => {
      syncSelesai();
      if(!res || !res.ok){
        row[field] = nilaiLama; // 3. rollback
        renderSemua();
        toast((res && res.message) || "Gagal menyimpan ke server.", "err");
      }
    })
    .catch(err => {
      syncSelesai();
      row[field] = nilaiLama;   // 3. rollback
      renderSemua();
      toast("Gagal tersimpan: " + err.message, "err");
    });
}

/* ============================================================
   HAPUS PESERTA
   ============================================================ */
function hapusPeserta(row){
  const nama = row["Nama Lengkap"] || "peserta ini";
  if(!confirm('Yakin ingin menghapus data pendaftar "'+nama+'"?\n\nData akan dihapus PERMANEN dari spreadsheet dan tidak bisa dikembalikan.')) return;
  if(!row._row){ toast("Nomor baris tidak ditemukan. Muat ulang data.", "err"); return; }

  syncMulai();
  API.kirim({
      action: "hapus_peserta",
      username: App.username,
      password: App.password,
      row: row._row
    })
    .then(res => {
      syncSelesai();
      if(res && res.ok){
        toast("Data peserta dihapus.", "ok");
        muatUlang(true); // nomor baris peserta lain ikut bergeser -> ambil ulang
      } else {
        toast((res && res.message) || "Gagal menghapus data.", "err");
      }
    })
    .catch(err => { syncSelesai(); toast("Gagal menghapus: " + err.message, "err"); });
}

/* ============================================================
   MUAT ULANG DATA
   ============================================================ */
function muatUlang(diam){
  if(!diam) toast("Memuat ulang data…", "info");
  syncMulai();
  API.kirim({ action: "muat_ulang", username: App.username, password: App.password })
    .then(res => {
      syncSelesai();
      if(res && res.ok){
        App.pendaftar = res.pendaftar || [];
        App.rombel = res.rombel || [];
        daftarTahun().forEach(t => App.tahunTerpilih.add(t)); // tahun baru ikut tercentang
        renderSemua();
        if(!diam) toast("Data terbaru dimuat.", "ok");
      } else {
        toast((res && res.message) || "Gagal memuat ulang.", "err");
      }
    })
    .catch(err => { syncSelesai(); toast("Gagal memuat ulang: " + err.message, "err"); });
}
$("refreshBtn").addEventListener("click", () => muatUlang(false));

/* ============================================================
   PENGATURAN
   ============================================================ */
/** Tautan khusus halaman pendaftaran */
function tautanPendaftaran(){
  // Formulir berada di index.html pada situs yang sama dengan halaman admin ini
  return location.origin + location.pathname.replace(/admin\.html$/, "") ;
}

function tampilkanTautanPendaftaran(){
  const link = tautanPendaftaran();
  if($("linkPendaftaran")) $("linkPendaftaran").value = link || "(belum tersedia)";
  if($("bukaFormulirBtn")) $("bukaFormulirBtn").href = link || "#";
}

function isiFormPengaturan(){
  const s = App.settings;
  $("inputNamaSekolah").value = s.nama_sekolah || "";
  $("inputJenisSatuan").value = s.jenis_satuan || "PKBM";
  $("inputTahunAjaran").value = s.tahun_ajaran || "";
  $("inputUserBaru").value = App.username || "";
  $("switchPendaftaran").checked = (s.pendaftaran_dibuka !== false);
  $("inputPesanTutup").value = s.pesan_tutup || "";
  perbaruiLabelStatus();
  tampilkanTautanPendaftaran();
  isiFormNotif();
  isiFormWa();
  $("userName").textContent = App.username || "Administrator";
  tampilkanLogo(s.logo_url || "");
}

function tampilkanLogo(url){
  $("logoPreview").innerHTML = url
    ? '<img src="'+esc(url)+'" alt="Logo Sekolah">'
    : '<span>Belum ada logo</span>';
}

function perbaruiLabelStatus(){
  const dibuka = $("switchPendaftaran").checked;
  const label = $("statusLabel");
  label.textContent = dibuka ? "Pendaftaran DIBUKA" : "Pendaftaran DITUTUP";
  label.className = "status-label " + (dibuka ? "buka" : "tutup");
  $("statusKet").textContent = dibuka
    ? "Calon peserta didik dapat mengisi formulir."
    : "Tombol Daftar di beranda dinonaktifkan.";
}
$("switchPendaftaran").addEventListener("change", perbaruiLabelStatus);

$("saveStatusBtn").addEventListener("click", () => {
  const dibuka = $("switchPendaftaran").checked;
  const pesanTutup = $("inputPesanTutup").value.trim();
  const btn = $("saveStatusBtn");
  btn.disabled = true; btn.textContent = "Menyimpan…";

  API.kirim({
      action: "set_status",
      username: App.username,
      password: App.password,
      dibuka: dibuka,
      pesan_tutup: pesanTutup
    })
    .then(res => {
      btn.disabled = false; btn.textContent = "Simpan Status";
      if(res && res.ok){
        App.settings.pendaftaran_dibuka = dibuka;
        App.settings.pesan_tutup = pesanTutup;
        pesan("msgStatus", dibuka ? "Pendaftaran dibuka." : "Pendaftaran ditutup.", "ok");
        toast(dibuka ? "Pendaftaran dibuka." : "Pendaftaran ditutup.", "ok");
      } else {
        pesan("msgStatus", (res && res.message) || "Gagal menyimpan status.", "err");
      }
    })
    .catch(err => {
      btn.disabled = false; btn.textContent = "Simpan Status";
      pesan("msgStatus", "Gagal: " + err.message, "err");
    });
});

/* ---------- Notifikasi WhatsApp (Fonnte) ---------- */
function isiFormWa(){
  $("switchWa").checked = !!App.wa.aktif;
  $("inputWaToken").value = App.wa.token || "";
  $("inputWaNomor1").value = App.wa.nomor_1 || "";
  $("inputWaNomor2").value = App.wa.nomor_2 || "";
  perbaruiLabelWa();
}

function perbaruiLabelWa(){
  const aktif = $("switchWa").checked;
  const label = $("waLabel");
  label.textContent = aktif ? "WhatsApp AKTIF" : "WhatsApp NONAKTIF";
  label.className = "status-label " + (aktif ? "buka" : "tutup");
  $("waKet").textContent = aktif
    ? "Pesan dikirim otomatis setiap ada pendaftar baru."
    : "Tidak ada pesan WhatsApp yang dikirim.";
}
$("switchWa").addEventListener("change", perbaruiLabelWa);

/** Nomor dianggap valid bila 10-15 digit setelah dirapikan ke awalan 62 */
function nomorValid(n){
  let d = String(n).replace(/[^0-9]/g, "");
  if(!d) return false;
  if(d.indexOf("0") === 0) d = "62" + d.substring(1);
  else if(d.indexOf("62") !== 0) d = "62" + d;
  return d.length >= 10 && d.length <= 15;
}

$("saveWaBtn").addEventListener("click", () => {
  const aktif = $("switchWa").checked;
  const token = $("inputWaToken").value.trim();
  const n1 = $("inputWaNomor1").value.trim();
  const n2 = $("inputWaNomor2").value.trim();

  if(n1 && !nomorValid(n1)){ pesan("msgWa", "Nomor WhatsApp 1 tidak valid.", "err"); return; }
  if(n2 && !nomorValid(n2)){ pesan("msgWa", "Nomor WhatsApp 2 tidak valid.", "err"); return; }
  if(aktif && !token){ pesan("msgWa", "Token Fonnte wajib diisi untuk mengaktifkan.", "err"); return; }
  if(aktif && !n1 && !n2){ pesan("msgWa", "Isi minimal satu nomor WhatsApp.", "err"); return; }

  const btn = $("saveWaBtn");
  btn.disabled = true; btn.textContent = "Menyimpan…";

  API.kirim({
      action: "simpan_wa",
      username: App.username,
      password: App.password,
      aktif: aktif,
      token: token,
      nomor_1: n1,
      nomor_2: n2
    })
    .then(res => {
      btn.disabled = false; btn.textContent = "Simpan";
      if(res && res.ok){
        App.wa = res.wa || { aktif, token, nomor_1:n1, nomor_2:n2 };
        pesan("msgWa", aktif ? "Notifikasi WhatsApp diaktifkan." : "Pengaturan WhatsApp disimpan.", "ok");
        toast("Notifikasi WhatsApp disimpan.", "ok");
      } else {
        pesan("msgWa", (res && res.message) || "Gagal menyimpan.", "err");
      }
    })
    .catch(err => {
      btn.disabled = false; btn.textContent = "Simpan";
      pesan("msgWa", "Gagal: " + err.message, "err");
    });
});

$("testWaBtn").addEventListener("click", () => {
  const btn = $("testWaBtn");
  btn.disabled = true; btn.textContent = "Mengirim…";
  pesanReset("msgWa");

  API.kirim({ action: "wa_uji", username: App.username, password: App.password })
    .then(res => {
      btn.disabled = false; btn.textContent = "Kirim Uji Coba";
      if(res && res.ok){
        pesan("msgWa", "Pesan uji coba terkirim ke: " + res.nomor.join(", ") +
          ". Periksa WhatsApp nomor tersebut.", "ok");
        toast("WhatsApp uji coba terkirim.", "ok");
      } else {
        pesan("msgWa", (res && res.message) || "Gagal mengirim pesan uji coba.", "err");
      }
    })
    .catch(err => {
      btn.disabled = false; btn.textContent = "Kirim Uji Coba";
      pesan("msgWa", "Gagal: " + err.message, "err");
    });
});

/* ---------- Notifikasi Email ---------- */
function isiFormNotif(){
  $("switchNotif").checked = !!App.notif.aktif;
  $("inputEmail1").value = App.notif.email_1 || "";
  $("inputEmail2").value = App.notif.email_2 || "";
  perbaruiLabelNotif();
}

function perbaruiLabelNotif(){
  const aktif = $("switchNotif").checked;
  const label = $("notifLabel");
  label.textContent = aktif ? "Notifikasi AKTIF" : "Notifikasi NONAKTIF";
  label.className = "status-label " + (aktif ? "buka" : "tutup");
  $("notifKet").textContent = aktif
    ? "Email dikirim otomatis setiap ada pendaftar baru."
    : "Tidak ada email yang dikirim.";
}
$("switchNotif").addEventListener("change", perbaruiLabelNotif);

function emailValid(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

$("saveNotifBtn").addEventListener("click", () => {
  const aktif = $("switchNotif").checked;
  const e1 = $("inputEmail1").value.trim();
  const e2 = $("inputEmail2").value.trim();

  if(e1 && !emailValid(e1)){ pesan("msgNotif", "Format Email Penerima 1 tidak valid.", "err"); return; }
  if(e2 && !emailValid(e2)){ pesan("msgNotif", "Format Email Penerima 2 tidak valid.", "err"); return; }
  if(aktif && !e1 && !e2){ pesan("msgNotif", "Isi minimal satu email untuk mengaktifkan notifikasi.", "err"); return; }

  const btn = $("saveNotifBtn");
  btn.disabled = true; btn.textContent = "Menyimpan…";

  API.kirim({
      action: "simpan_notif",
      username: App.username,
      password: App.password,
      aktif: aktif,
      email_1: e1,
      email_2: e2
    })
    .then(res => {
      btn.disabled = false; btn.textContent = "Simpan";
      if(res && res.ok){
        App.notif = res.notif || { aktif, email_1:e1, email_2:e2 };
        pesan("msgNotif", aktif ? "Notifikasi email diaktifkan." : "Pengaturan notifikasi disimpan.", "ok");
        toast("Notifikasi email disimpan.", "ok");
      } else {
        pesan("msgNotif", (res && res.message) || "Gagal menyimpan.", "err");
      }
    })
    .catch(err => {
      btn.disabled = false; btn.textContent = "Simpan";
      pesan("msgNotif", "Gagal: " + err.message, "err");
    });
});

$("testEmailBtn").addEventListener("click", () => {
  const btn = $("testEmailBtn");
  btn.disabled = true; btn.textContent = "Mengirim…";
  pesanReset("msgNotif");

  API.kirim({ action: "email_uji", username: App.username, password: App.password })
    .then(res => {
      btn.disabled = false; btn.textContent = "Kirim Uji Coba";
      if(res && res.ok){
        pesan("msgNotif", "Email uji coba terkirim ke: " + res.penerima.join(", ") +
          ". Periksa kotak masuk (atau folder Spam).", "ok");
        toast("Email uji coba terkirim.", "ok");
      } else {
        pesan("msgNotif", (res && res.message) || "Gagal mengirim email uji coba.", "err");
      }
    })
    .catch(err => {
      btn.disabled = false; btn.textContent = "Kirim Uji Coba";
      pesan("msgNotif", "Gagal: " + err.message, "err");
    });
});

$("saveSettingsBtn").addEventListener("click", () => {
  const nama = $("inputNamaSekolah").value.trim();
  const jenis = $("inputJenisSatuan").value;
  const tahun = $("inputTahunAjaran").value.trim();
  if(!nama || !tahun){ pesan("msgPengaturan", "Nama Satuan Pendidikan dan Tahun Ajaran wajib diisi.", "err"); return; }

  const btn = $("saveSettingsBtn");
  btn.disabled = true; btn.textContent = "Menyimpan…";

  API.kirim({
      action: "simpan_pengaturan",
      username: App.username,
      password: App.password,
      nama_sekolah: nama,
      jenis_satuan: jenis,
      tahun_ajaran: tahun
    })
    .then(res => {
      btn.disabled = false; btn.textContent = "Simpan Pengaturan";
      if(res && res.ok){
        App.settings.nama_sekolah = nama;
        App.settings.jenis_satuan = jenis;
        App.settings.tahun_ajaran = tahun;
        tampilkanIdentitas();
        tampilkanTautanPendaftaran();
        pesan("msgPengaturan", "Pengaturan berhasil disimpan.", "ok");
        toast("Pengaturan tersimpan.", "ok");
      } else {
        pesan("msgPengaturan", (res && res.message) || "Gagal menyimpan.", "err");
      }
    })
    .catch(err => {
      btn.disabled = false; btn.textContent = "Simpan Pengaturan";
      pesan("msgPengaturan", "Gagal menyimpan: " + err.message, "err");
    });
});

$("changePassBtn").addEventListener("click", () => {
  const userBaru = $("inputUserBaru").value.trim();
  const baru = $("inputPassBaru").value;
  const konfirmasi = $("inputPassKonfirmasi").value;

  if(userBaru.length < 3){ pesan("msgPassword", "Username minimal 3 karakter.", "err"); return; }
  if(/\s/.test(userBaru)){ pesan("msgPassword", "Username tidak boleh mengandung spasi.", "err"); return; }
  if(baru && baru.length < 4){ pesan("msgPassword", "Password baru minimal 4 karakter.", "err"); return; }
  if(baru !== konfirmasi){ pesan("msgPassword", "Konfirmasi password tidak sama.", "err"); return; }

  const btn = $("changePassBtn");
  btn.disabled = true; btn.textContent = "Menyimpan…";

  API.kirim({
      action: "ganti_akun",
      username: App.username,
      password: App.password,
      username_baru: userBaru,
      password_baru: baru
    })
    .then(res => {
      btn.disabled = false; btn.textContent = "Simpan Akun";
      if(res && res.ok){
        App.username = userBaru;
        if(baru) App.password = baru;
        sessionStorage.setItem(SS_AKUN, JSON.stringify({ u: App.username, p: App.password }));
        $("inputPassBaru").value = ""; $("inputPassKonfirmasi").value = "";
        $("userName").textContent = App.username;
        pesan("msgPassword", baru ? "Username & password berhasil diperbarui."
                                  : "Username berhasil diperbarui.", "ok");
        toast("Akun admin diperbarui.", "ok");
      } else {
        pesan("msgPassword", (res && res.message) || "Gagal menyimpan akun.", "err");
      }
    })
    .catch(err => {
      btn.disabled = false; btn.textContent = "Simpan Akun";
      pesan("msgPassword", "Gagal: " + err.message, "err");
    });
});

/* Tampilkan nama file logo yang dipilih pada tombol */
$("logoFile").addEventListener("change", () => {
  const f = $("logoFile").files[0];
  $("logoFileName").textContent = f ? f.name : "Pilih Gambar";
});

$("uploadLogoBtn").addEventListener("click", () => {
  const file = $("logoFile").files[0];
  if(!file){ pesan("msgLogo", "Pilih file gambar terlebih dahulu.", "err"); return; }
  if(file.size > 250 * 1024){
    pesan("msgLogo", "Ukuran logo maksimal 250 KB. File ini " + Math.round(file.size/1024) + " KB.", "err");
    return;
  }

  const btn = $("uploadLogoBtn");
  btn.disabled = true; btn.textContent = "Mengunggah…";

  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result.split(",")[1];
    API.kirim({
        action: "upload_logo",
        username: App.username,
        password: App.password,
        image_base64: base64,
        mime_type: file.type || "image/png"
      })
      .then(res => {
        btn.disabled = false; btn.textContent = "Upload Logo";
        if(res && res.ok){
          App.settings.logo_url = res.url;
          tampilkanLogo(res.url);
          tampilkanIdentitas();
          $("logoFile").value = "";
          $("logoFileName").textContent = "Pilih Gambar";
          pesan("msgLogo", "Logo berhasil diunggah.", "ok");
          toast("Logo diperbarui.", "ok");
        } else {
          pesan("msgLogo", (res && res.message) || "Gagal mengunggah logo.", "err");
        }
      })
      .catch(err => {
        btn.disabled = false; btn.textContent = "Upload Logo";
        pesan("msgLogo", "Gagal mengunggah: " + err.message, "err");
      });
  };
  reader.onerror = () => {
    btn.disabled = false; btn.textContent = "Upload Logo";
    pesan("msgLogo", "Gagal membaca file.", "err");
  };
  reader.readAsDataURL(file);
});

$("shareBtn").addEventListener("click", async () => {
  const link = tautanPendaftaran();
  if(!link){ pesan("msgShare", "Tautan belum tersedia. Pastikan aplikasi sudah di-deploy.", "err"); return; }
  try{
    await navigator.clipboard.writeText(link);
    pesan("msgShare", "Tautan disalin: " + link, "ok");
    toast("Tautan formulir disalin.", "ok");
  } catch(e){
    pesan("msgShare", "Salin manual: " + link, "info");
  }
});

/* ============================================================
   INPUT ROMBEL
   ============================================================ */
function perbaruiPilihanKelas(){
  const jenjang = $("inputJenjang").value;
  const sel = $("inputKelas");
  if(jenjang && KELAS_JENJANG[jenjang]){
    sel.innerHTML = '<option value="">— Pilih Kelas —</option>' +
      KELAS_JENJANG[jenjang].map(k => '<option value="'+k+'">'+k+'</option>').join("");
    sel.disabled = false;
  } else {
    sel.innerHTML = '<option value="">— Pilih Jenjang dahulu —</option>';
    sel.disabled = true;
  }
  perbaruiNamaRombel();
}
function perbaruiNamaRombel(){
  const j = $("inputJenjang").value, k = $("inputKelas").value;
  $("inputNamaRombel").value = (j && k) ? (j + " kls " + k.replace("Kelas ", "")) : "";
}
$("inputJenjang").addEventListener("change", perbaruiPilihanKelas);
$("inputKelas").addEventListener("change", perbaruiNamaRombel);

$("addRombelBtn").addEventListener("click", () => {
  const j = $("inputJenjang").value, k = $("inputKelas").value;
  if(!j || !k){ pesan("msgRombel", "Jenjang dan Kelas wajib dipilih.", "err"); return; }
  const nama = $("inputNamaRombel").value;
  const wali = $("inputWaliGuru").value.trim();

  if(App.rombel.some(r => r.nama === nama)){
    pesan("msgRombel", 'Rombel "'+nama+'" sudah ada.', "err");
    return;
  }

  const btn = $("addRombelBtn");
  btn.disabled = true; btn.textContent = "Menyimpan…";

  API.kirim({
      action: "tambah_rombel",
      username: App.username,
      password: App.password,
      nama: nama,
      wali_guru: wali
    })
    .then(res => {
      btn.disabled = false; btn.textContent = "Tambah Rombel";
      if(res && res.ok){
        App.rombel = res.rombel || App.rombel;
        $("inputJenjang").value = ""; $("inputWaliGuru").value = "";
        perbaruiPilihanKelas();
        renderSemua();
        pesan("msgRombel", "Rombel berhasil ditambahkan.", "ok");
        toast("Rombel ditambahkan.", "ok");
      } else {
        pesan("msgRombel", (res && res.message) || "Gagal menambahkan rombel.", "err");
      }
    })
    .catch(err => {
      btn.disabled = false; btn.textContent = "Tambah Rombel";
      pesan("msgRombel", "Gagal: " + err.message, "err");
    });
});

function renderDaftarRombel(){
  const wadah = $("rombelList");
  if(!wadah) return;
  if(App.rombel.length === 0){
    wadah.innerHTML = '<div class="hint" style="padding:var(--sp-3) 0;">Belum ada rombel yang ditambahkan.</div>';
    return;
  }
  const urut = urutkanRombel(App.rombel.map(r => r.nama));
  wadah.innerHTML = urut.map(nama => {
    const r = App.rombel.find(x => x.nama === nama);
    const jumlah = App.pendaftar.filter(d => d["Rombel"] === nama).length;
    return '<div class="list-item">' +
      '<div style="min-width:0;">' +
        '<div class="nama">'+esc(nama)+'</div>' +
        '<div class="sub">'+(r.wali_guru ? "Wali: "+esc(r.wali_guru)+" · " : "")+jumlah+' peserta</div>' +
      '</div>' +
      '<button class="btn btn-ghost btn-sm rombel-del" data-row="'+r._row+'" data-nama="'+esc(nama)+'" ' +
        'style="color:var(--red-500);border-color:var(--red-500);">Hapus</button>' +
    '</div>';
  }).join("");

  els(".rombel-del", wadah).forEach(b => {
    b.addEventListener("click", () => hapusRombel(+b.dataset.row, b.dataset.nama));
  });
}

function hapusRombel(rowNum, nama){
  const jumlah = App.pendaftar.filter(d => d["Rombel"] === nama).length;
  if(jumlah > 0){
    pesan("msgRombel", 'Rombel "'+nama+'" masih memiliki '+jumlah+
      ' peserta. Keluarkan semua peserta dari rombel ini terlebih dahulu.', "err");
    toast("Rombel masih berisi peserta.", "err");
    return;
  }
  if(!confirm('Yakin ingin menghapus rombel "'+nama+'"?')) return;

  syncMulai();
  API.kirim({
      action: "hapus_rombel",
      username: App.username,
      password: App.password,
      row: rowNum,
      nama: nama
    })
    .then(res => {
      syncSelesai();
      if(res && res.ok){
        App.rombel = res.rombel || [];
        renderSemua();
        toast("Rombel dihapus.", "ok");
      } else {
        toast((res && res.message) || "Gagal menghapus rombel.", "err");
      }
    })
    .catch(err => { syncSelesai(); toast("Gagal: " + err.message, "err"); });
}

/* ============================================================
   EXPORT EXCEL
   ============================================================ */
function unduhExcel(rows, namaFile, namaSheet){
  if(!rows || rows.length === 0){ toast("Tidak ada data untuk diekspor.", "err"); return; }
  const bersih = rows.map(r => {
    const o = {};
    Object.keys(r).filter(k => !k.startsWith("_")).forEach(k => o[k] = r[k]);
    return o;
  });
  const ws = XLSX.utils.json_to_sheet(bersih);
  const headers = Object.keys(bersih[0]);
  ws["!cols"] = headers.map(h => {
    let maks = h.length;
    bersih.forEach(r => {
      const v = (r[h] === undefined || r[h] === null) ? "" : String(r[h]);
      if(v.length > maks) maks = v.length;
    });
    return { wch: Math.min(maks + 2, 40) };
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, String(namaSheet || "Data").slice(0, 31));
  XLSX.writeFile(wb, namaFile + "_" + new Date().toISOString().slice(0,10) + ".xlsx");
  toast("File Excel diunduh.", "ok");
}

$("exportPendaftarBtn").addEventListener("click", () => {
  const q = $("searchPendaftar").value;
  const rows = dataTerfilter().filter(d => belumRombel(d) && !sudahLulus(d) && cocokPencarian(d, q));
  unduhExcel(rows, "Data_Pendaftaran", "Pendaftaran");
});

/* ============================================================
   PDF FORMULIR PER PESERTA
   ============================================================ */
const PETA_BAGIAN = [
  { bagian:"Pendaftaran", fields:["Pendaftaran","Apakah Pernah Putus Sekolah"] },
  { sub:"Alamat Sekolah Asal", fields:["Provinsi Sekolah Asal","Kabupaten/Kota Sekolah Asal","Kecamatan Sekolah Asal","Nama Sekolah Asal","Lulus Tahun"] },
  { bagian:"Data Pribadi", fields:["Nama Lengkap","Jenis Kelamin","NISN","NIK","No KK","Tempat Lahir","Tanggal Lahir","No Registrasi Akta Lahir","Berkebutuhan Khusus","Agama & Kepercayaan","Alamat Jalan","Provinsi","Kabupaten/Kota","Kecamatan","RT","RW","Nama Dusun","Desa/Kelurahan","Kode Pos","Tempat Tinggal","Moda Transportasi","Anak Ke-"] },
  { bagian:"Data Ayah Kandung", fields:["Status Ayah","Nama Ayah","NIK Ayah","Tahun Lahir Ayah","Pendidikan Ayah","Pekerjaan Ayah","Berkebutuhan Khusus Ayah","Penghasilan Ayah"] },
  { bagian:"Data Ibu Kandung", fields:["Status Ibu","Nama Ibu","NIK Ibu","Tahun Lahir Ibu","Pendidikan Ibu","Pekerjaan Ibu","Berkebutuhan Khusus Ibu","Penghasilan Ibu"] },
  { bagian:"Data Wali", fields:["Mempunyai Wali","Nama Wali","NIK Wali","Tahun Lahir Wali","Pendidikan Wali","Pekerjaan Wali","Penghasilan Wali"] },
  { bagian:"Kontak", fields:["No Telepon Rumah","No HP","Email"] },
  { bagian:"Data Periodik", fields:["Tinggi Badan (CM)","Berat Badan (Kg)","Lingkar Kepala","Jarak Rumah ke Sekolah","Sebutkan (KM)","Waktu Tempuh ke Sekolah","Jumlah Saudara Kandung"] },
  { bagian:"Status Akademik", fields:["Rombel","Kendala","Tanggal Lulus"] }
];
const FIELD_WALI = ["Nama Wali","NIK Wali","Tahun Lahir Wali","Pendidikan Wali","Pekerjaan Wali","Penghasilan Wali"];

function susunEntri(row){
  const entri = [];
  const punyaWali = row["Mempunyai Wali"] === "Iya";
  const jauh = row["Jarak Rumah ke Sekolah"] === "Lebih dari 1 KM";
  const sekolahDisembunyikan = (row["Pendaftaran"] === "Paket A" && row["Apakah Pernah Putus Sekolah"] !== "Iya");

  PETA_BAGIAN.forEach(grup => {
    if(grup.sub === "Alamat Sekolah Asal" && sekolahDisembunyikan) return;
    if(grup.bagian) entri.push({ tipe:"bagian", teks:grup.bagian });
    if(grup.sub) entri.push({ tipe:"sub", teks:grup.sub });
    grup.fields.forEach(label => {
      if(FIELD_WALI.indexOf(label) > -1 && !punyaWali) return;
      if(label === "Sebutkan (KM)" && !jauh) return;
      const v = row[label];
      entri.push({ tipe:"field", label, value:(v === undefined || v === null || v === "") ? "-" : String(v) });
    });
  });
  return entri;
}

function parseWaktuKirim(str){
  if(!str) return null;
  const m = String(str).match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4}).*?(\d{1,2})\D+(\d{1,2})/);
  if(!m) return null;
  return new Date(+m[3], +m[2]-1, +m[1], +m[4], +m[5]);
}

function buatNoReg(tgl, paket){
  if(!tgl) return "";
  const kode = paket === "Paket B" ? "B" : (paket === "Paket C" ? "C" : "A");
  return pad2(tgl.getDate())+"_"+pad2(tgl.getMonth()+1)+"_"+String(tgl.getFullYear()).slice(-2)+
         "-"+pad2(tgl.getHours())+"_"+pad2(tgl.getMinutes())+"_P."+kode;
}

function unduhPDFPeserta(row){
  const entri = susunEntri(row);
  const noReg = buatNoReg(parseWaktuKirim(row["Waktu Kirim"]), row["Pendaftaran"]);
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:"mm", format:"a4" });

  const margin = 15, lebar = doc.internal.pageSize.getWidth(), tinggi = doc.internal.pageSize.getHeight();
  const lebarPakai = lebar - margin*2, kolomLabel = 60;
  const xTitik = margin + kolomLabel, xNilai = xTitik + 4;
  const lebarNilai = lebarPakai - kolomLabel - 4, tinggiBaris = 4.3;
  let y = margin;

  function ruang(h){ if(y + h > tinggi - margin){ doc.addPage(); y = margin; } }

  if(noReg){
    doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(105,65,224);
    doc.text("No Reg. ("+noReg+")", lebar - margin, margin, { align:"right" });
    doc.setTextColor(20,20,20);
  }

  doc.setFont("helvetica","bold"); doc.setFontSize(13);
  doc.text("FORMULIR PENDAFTARAN", lebar/2, y+3, { align:"center" });
  y += 8.5;
  doc.text(String(App.settings.nama_sekolah || "").toUpperCase(), lebar/2, y, { align:"center" });
  y += 6;
  doc.setFont("helvetica","normal"); doc.setFontSize(10);
  doc.text("Tahun Ajaran " + (App.settings.tahun_ajaran || ""), lebar/2, y, { align:"center" });
  y += 4;
  doc.setDrawColor(105,65,224); doc.setLineWidth(0.5);
  doc.line(margin, y, lebar - margin, y);
  y += 6;

  entri.forEach(e => {
    if(e.tipe === "bagian"){
      ruang(9); y += 1.5;
      doc.setFillColor(105,65,224); doc.setTextColor(255,255,255);
      doc.setFont("helvetica","bold"); doc.setFontSize(10.5);
      doc.rect(margin, y-4, lebarPakai, 6, "F");
      doc.text(e.teks.toUpperCase(), margin+2, y);
      doc.setTextColor(20,20,20); y += 5.5;
      return;
    }
    if(e.tipe === "sub"){
      ruang(7); y += 1;
      doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(105,65,224);
      doc.text(e.teks, margin, y);
      doc.setTextColor(20,20,20); y += 4.8;
      return;
    }
    doc.setFontSize(9.5); doc.setFont("helvetica","normal");
    const barisNilai = doc.splitTextToSize(e.value || "-", lebarNilai);
    doc.setFont("helvetica","bold");
    const barisLabel = doc.splitTextToSize(e.label, kolomLabel - 2);
    const jml = Math.max(barisLabel.length, barisNilai.length);
    ruang(jml * tinggiBaris + 0.5);
    doc.text(barisLabel, margin, y);
    doc.setFont("helvetica","normal");
    doc.text(":", xTitik, y);
    doc.text(barisNilai, xNilai, y);
    y += jml * tinggiBaris;
  });

  const namaFile = String(row["Nama Lengkap"] || "Pendaftaran")
    .replace(/[^a-zA-Z0-9]+/g,"_").replace(/^_+|_+$/g,"");
  doc.save("Formulir_Pendaftaran_" + namaFile + ".pdf");
  toast("PDF formulir diunduh.", "ok");
}
