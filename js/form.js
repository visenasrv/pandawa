/* Pengaturan diambil dari server lewat API.kirim() — lihat js/api.js */
window.__pkbmSettings = { nama_pkbm:"", nama_sekolah:"", tahun_ajaran:"", logo_url:"", pendaftaran_dibuka:true };

API.kirim({ action: "settings" })
  .then(function(res){
    if(!res || !res.ok || !res.settings){
      tampilkanTutup("Gagal memuat status pendaftaran. Periksa koneksi internet Anda, lalu muat ulang halaman ini.");
      return;
    }
    terapkanPengaturan(res.settings);
  })
  .catch(function(){
    tampilkanTutup("Gagal terhubung ke server. Periksa koneksi internet Anda, lalu muat ulang halaman ini.");
  });

function terapkanPengaturan(d){
  window.__pkbmSettings = d;
  d.nama_pkbm = d.nama_sekolah || "";

  const namaEl = document.getElementById("namaPkbmText");
  const tahunEl = document.getElementById("tahunAjaranText");
  if(namaEl && d.nama_sekolah) namaEl.textContent = d.nama_sekolah;
  if(tahunEl && d.tahun_ajaran) tahunEl.textContent = d.tahun_ajaran;
  else if(tahunEl && tahunEl.parentElement) tahunEl.parentElement.style.display = "none";
  document.title = "Formulir Pendaftaran" + (d.nama_sekolah ? " " + d.nama_sekolah : "");

  if(d.logo_url){
    const logoEl = document.getElementById("pkbmLogo");
    if(logoEl){ logoEl.src = d.logo_url; logoEl.style.display = "block"; }
  }
  const lagi = document.getElementById("linkDaftarLagi");
  if(lagi) lagi.href = location.pathname;

  if(d.pendaftaran_dibuka === false) tampilkanTutup(d.pesan_tutup);
  else tampilkanFormulir();
}

/* Formulir disembunyikan sampai status pendaftaran dipastikan terbuka */
function sembunyikanSemuaLayar(){
  const form = document.getElementById("ppdbForm");
  const prog = document.querySelector(".progress-card");
  if(form) form.style.display = "none";
  if(prog) prog.style.display = "none";
  const memuat = document.getElementById("memuatScreen");
  if(memuat) memuat.style.display = "none";
}

function tampilkanFormulir(){
  sembunyikanSemuaLayar();
  const form = document.getElementById("ppdbForm");
  const prog = document.querySelector(".progress-card");
  if(form) form.style.display = "";
  if(prog) prog.style.display = "";
}

function tampilkanTutup(pesan){
  sembunyikanSemuaLayar();
  const tutup = document.getElementById("tutupScreen");
  if(tutup){
    document.getElementById("tutupPesan").textContent =
      pesan || "Mohon maaf, pendaftaran sedang ditutup.";
    tutup.style.display = "block";
  }
}

// ==============================================

// Data Provinsi & Kabupaten/Kota se-Indonesia (38 provinsi, 514 kabupaten/kota)
const WILAYAH_DATA = {"Aceh":["Kabupaten Aceh Barat","Kabupaten Aceh Barat Daya","Kabupaten Aceh Besar","Kabupaten Aceh Jaya","Kabupaten Aceh Selatan","Kabupaten Aceh Singkil","Kabupaten Aceh Tamiang","Kabupaten Aceh Tengah","Kabupaten Aceh Tenggara","Kabupaten Aceh Timur","Kabupaten Aceh Utara","Kabupaten Bener Meriah","Kabupaten Bireuen","Kabupaten Gayo Lues","Kabupaten Nagan Raya","Kabupaten Pidie","Kabupaten Pidie Jaya","Kabupaten Simeulue","Kota Banda Aceh","Kota Langsa","Kota Lhokseumawe","Kota Sabang","Kota Subulussalam"],"Bali":["Kabupaten Badung","Kabupaten Bangli","Kabupaten Buleleng","Kabupaten Gianyar","Kabupaten Jembrana","Kabupaten Karangasem","Kabupaten Klungkung","Kabupaten Tabanan","Kota Denpasar"],"Banten":["Kabupaten Lebak","Kabupaten Pandeglang","Kabupaten Serang","Kabupaten Tangerang","Kota Cilegon","Kota Serang","Kota Tangerang","Kota Tangerang Selatan"],"Bengkulu":["Kabupaten Bengkulu Selatan","Kabupaten Bengkulu Tengah","Kabupaten Bengkulu Utara","Kabupaten Kaur","Kabupaten Kepahiang","Kabupaten Lebong","Kabupaten Muko Muko","Kabupaten Rejang Lebong","Kabupaten Seluma","Kota Bengkulu"],"DI Yogyakarta":["Kabupaten Bantul","Kabupaten Gunungkidul","Kabupaten Kulon Progo","Kabupaten Sleman","Kota Yogyakarta"],"DKI Jakarta":["Kabupaten Kepulauan Seribu","Kota Jakarta Barat","Kota Jakarta Pusat","Kota Jakarta Selatan","Kota Jakarta Timur","Kota Jakarta Utara"],"Gorontalo":["Kabupaten Boalemo","Kabupaten Bone Bolango","Kabupaten Gorontalo","Kabupaten Gorontalo Utara","Kabupaten Pahuwato","Kota Gorontalo"],"Jambi":["Kabupaten Batanghari","Kabupaten Bungo","Kabupaten Kerinci","Kabupaten Merangin","Kabupaten Muaro Jambi","Kabupaten Sarolangun","Kabupaten Tanjung Jabung Barat","Kabupaten Tanjung Jabung Timur","Kabupaten Tebo","Kota Jambi","Kota Sungai Penuh"],"Jawa Barat":["Kabupaten Bandung","Kabupaten Bandung Barat","Kabupaten Bekasi","Kabupaten Bogor","Kabupaten Ciamis","Kabupaten Cianjur","Kabupaten Cirebon","Kabupaten Garut","Kabupaten Indramayu","Kabupaten Karawang","Kabupaten Kuningan","Kabupaten Majalengka","Kabupaten Pangandaran","Kabupaten Purwakarta","Kabupaten Subang","Kabupaten Sukabumi","Kabupaten Sumedang","Kabupaten Tasikmalaya","Kota Bandung","Kota Banjar","Kota Bekasi","Kota Bogor","Kota Cimahi","Kota Cirebon","Kota Depok","Kota Sukabumi","Kota Tasikmalaya"],"Jawa Tengah":["Kabupaten Banjarnegara","Kabupaten Banyumas","Kabupaten Batang","Kabupaten Blora","Kabupaten Boyolali","Kabupaten Brebes","Kabupaten Cilacap","Kabupaten Demak","Kabupaten Grobogan","Kabupaten Jepara","Kabupaten Karanganyar","Kabupaten Kebumen","Kabupaten Kendal","Kabupaten Klaten","Kabupaten Kudus","Kabupaten Magelang","Kabupaten Pati","Kabupaten Pekalongan","Kabupaten Pemalang","Kabupaten Purbalingga","Kabupaten Purworejo","Kabupaten Rembang","Kabupaten Semarang","Kabupaten Sragen","Kabupaten Sukoharjo","Kabupaten Tegal","Kabupaten Temanggung","Kabupaten Wonogiri","Kabupaten Wonosobo","Kota Magelang","Kota Pekalongan","Kota Salatiga","Kota Semarang","Kota Surakarta","Kota Tegal"],"Jawa Timur":["Kabupaten Bangkalan","Kabupaten Banyuwangi","Kabupaten Blitar","Kabupaten Bojonegoro","Kabupaten Bondowoso","Kabupaten Gresik","Kabupaten Jember","Kabupaten Jombang","Kabupaten Kediri","Kabupaten Lamongan","Kabupaten Lumajang","Kabupaten Madiun","Kabupaten Magetan","Kabupaten Malang","Kabupaten Mojokerto","Kabupaten Nganjuk","Kabupaten Ngawi","Kabupaten Pacitan","Kabupaten Pamekasan","Kabupaten Pasuruan","Kabupaten Ponorogo","Kabupaten Probolinggo","Kabupaten Sampang","Kabupaten Sidoarjo","Kabupaten Situbondo","Kabupaten Sumenep","Kabupaten Trenggalek","Kabupaten Tuban","Kabupaten Tulungagung","Kota Batu","Kota Blitar","Kota Kediri","Kota Madiun","Kota Malang","Kota Mojokerto","Kota Pasuruan","Kota Probolinggo","Kota Surabaya"],"Kalimantan Barat":["Kabupaten Bengkayang","Kabupaten Kapuas Hulu","Kabupaten Kayong Utara","Kabupaten Ketapang","Kabupaten Kubu Raya","Kabupaten Landak","Kabupaten Melawi","Kabupaten Mempawah","Kabupaten Sambas","Kabupaten Sanggau","Kabupaten Sekadau","Kabupaten Sintang","Kota Pontianak","Kota Singkawang"],"Kalimantan Selatan":["Kabupaten Balangan","Kabupaten Banjar","Kabupaten Barito Kuala","Kabupaten Hulu Sungai Selatan","Kabupaten Hulu Sungai Tengah","Kabupaten Hulu Sungai Utara","Kabupaten Kotabaru","Kabupaten Tabalong","Kabupaten Tanah Bumbu","Kabupaten Tanah Laut","Kabupaten Tapin","Kota Banjarbaru","Kota Banjarmasin"],"Kalimantan Tengah":["Kabupaten Barito Selatan","Kabupaten Barito Timur","Kabupaten Barito Utara","Kabupaten Gunung Mas","Kabupaten Kapuas","Kabupaten Katingan","Kabupaten Kotawaringin Barat","Kabupaten Kotawaringin Timur","Kabupaten Lamandau","Kabupaten Murung Raya","Kabupaten Pulang Pisau","Kabupaten Seruyan","Kabupaten Sukamara","Kota Palangkaraya"],"Kalimantan Timur":["Kabupaten Berau","Kabupaten Kutai Barat","Kabupaten Kutai Kartanegara","Kabupaten Kutai Timur","Kabupaten Mahakam Ulu","Kabupaten Paser","Kabupaten Penajam Paser Utara","Kota Balikpapan","Kota Bontang","Kota Samarinda"],"Kalimantan Utara":["Kabupaten Bulungan","Kabupaten Malinau","Kabupaten Nunukan","Kabupaten Tana Tidung","Kota Tarakan"],"Kepulauan Bangka Belitung":["Kabupaten Bangka","Kabupaten Bangka Barat","Kabupaten Bangka Selatan","Kabupaten Bangka Tengah","Kabupaten Belitung","Kabupaten Belitung Timur","Kota Pangkal Pinang"],"Kepulauan Riau":["Kabupaten Bintan","Kabupaten Karimun","Kabupaten Kepulauan Anambas","Kabupaten Lingga","Kabupaten Natuna","Kota Batam","Kota Tanjung Pinang"],"Lampung":["Kabupaten Lampung Barat","Kabupaten Lampung Selatan","Kabupaten Lampung Tengah","Kabupaten Lampung Timur","Kabupaten Lampung Utara","Kabupaten Mesuji","Kabupaten Pesawaran","Kabupaten Pesisir Barat","Kabupaten Pringsewu","Kabupaten Tanggamus","Kabupaten Tulang Bawang","Kabupaten Tulang Bawang Barat","Kabupaten Way Kanan","Kota Bandar Lampung","Kota Metro"],"Maluku":["Kabupaten Buru","Kabupaten Buru Selatan","Kabupaten Kepulauan Aru","Kabupaten Kepulauan Tanimbar (Maluku Tenggara Barat)","Kabupaten Maluku Barat Daya","Kabupaten Maluku Tengah","Kabupaten Maluku Tenggara","Kabupaten Seram Bagian Barat","Kabupaten Seram Bagian Timur","Kota Ambon","Kota Tual"],"Maluku Utara":["Kabupaten Halmahera Barat","Kabupaten Halmahera Selatan","Kabupaten Halmahera Tengah","Kabupaten Halmahera Timur","Kabupaten Halmahera Utara","Kabupaten Kepulauan Sula","Kabupaten Pulau Morotai","Kabupaten Pulau Taliabu","Kota Ternate","Kota Tidore Kepulauan"],"Nusa Tenggara Barat":["Kabupaten Bima","Kabupaten Dompu","Kabupaten Lombok Barat","Kabupaten Lombok Tengah","Kabupaten Lombok Timur","Kabupaten Lombok Utara","Kabupaten Sumbawa","Kabupaten Sumbawa Barat","Kota Bima","Kota Mataram"],"Nusa Tenggara Timur":["Kabupaten Alor","Kabupaten Belu","Kabupaten Ende","Kabupaten Flores Timur","Kabupaten Kupang","Kabupaten Lembata","Kabupaten Malaka","Kabupaten Manggarai","Kabupaten Manggarai Barat","Kabupaten Manggarai Timur","Kabupaten Nagekeo","Kabupaten Ngada","Kabupaten Rote Ndao","Kabupaten Sabu Raijua","Kabupaten Sikka","Kabupaten Sumba Barat","Kabupaten Sumba Barat Daya","Kabupaten Sumba Tengah","Kabupaten Sumba Timur","Kabupaten Timor Tengah Selatan","Kabupaten Timor Tengah Utara","Kota Kupang"],"Papua":["Kabupaten Biak Numfor","Kabupaten Jayapura","Kabupaten Keerom","Kabupaten Kepulauan Yapen","Kabupaten Mamberamo Raya","Kabupaten Sarmi","Kabupaten Supiori","Kabupaten Waropen","Kota Jayapura"],"Papua Barat":["Kabupaten Fak Fak","Kabupaten Kaimana","Kabupaten Manokwari","Kabupaten Manokwari Selatan","Kabupaten Pegunungan Arfak","Kabupaten Teluk Bintuni","Kabupaten Teluk Wondama"],"Papua Barat Daya":["Kabupaten Maybrat","Kabupaten Raja Ampat","Kabupaten Sorong","Kabupaten Sorong Selatan","Kabupaten Tambrauw","Kota Sorong"],"Papua Pegunungan":["Kabupaten Jayawijaya","Kabupaten Lanny Jaya","Kabupaten Mamberamo Tengah","Kabupaten Nduga","Kabupaten Pegunungan Bintang","Kabupaten Tolikara","Kabupaten Yahukimo","Kabupaten Yalimo"],"Papua Selatan":["Kabupaten Asmat","Kabupaten Boven Digoel","Kabupaten Mappi","Kabupaten Merauke"],"Papua Tengah":["Kabupaten Deiyai","Kabupaten Dogiyai","Kabupaten Intan Jaya","Kabupaten Mimika","Kabupaten Nabire","Kabupaten Paniai","Kabupaten Puncak","Kabupaten Puncak Jaya"],"Riau":["Kabupaten Bengkalis","Kabupaten Indragiri Hilir","Kabupaten Indragiri Hulu","Kabupaten Kampar","Kabupaten Kepulauan Meranti","Kabupaten Kuantan Singingi","Kabupaten Pelalawan","Kabupaten Rokan Hilir","Kabupaten Rokan Hulu","Kabupaten Siak","Kota Dumai","Kota Pekanbaru"],"Sulawesi Barat":["Kabupaten Majene","Kabupaten Mamasa","Kabupaten Mamuju","Kabupaten Mamuju Tengah","Kabupaten Pasangkayu (Mamuju Utara)","Kabupaten Polewali Mandar"],"Sulawesi Selatan":["Kabupaten Bantaeng","Kabupaten Barru","Kabupaten Bone","Kabupaten Bulukumba","Kabupaten Enrekang","Kabupaten Gowa","Kabupaten Jeneponto","Kabupaten Kepulauan Selayar","Kabupaten Luwu","Kabupaten Luwu Timur","Kabupaten Luwu Utara","Kabupaten Maros","Kabupaten Pangkajene Kepulauan","Kabupaten Pinrang","Kabupaten Sidenreng Rappang","Kabupaten Sinjai","Kabupaten Soppeng","Kabupaten Takalar","Kabupaten Tana Toraja","Kabupaten Toraja Utara","Kabupaten Wajo","Kota Makassar","Kota Palopo","Kota Pare Pare"],"Sulawesi Tengah":["Kabupaten Banggai","Kabupaten Banggai Kepulauan","Kabupaten Banggai Laut","Kabupaten Buol","Kabupaten Donggala","Kabupaten Morowali","Kabupaten Morowali Utara","Kabupaten Parigi Moutong","Kabupaten Poso","Kabupaten Sigi","Kabupaten Tojo Una Una","Kabupaten Toli Toli","Kota Palu"],"Sulawesi Tenggara":["Kabupaten Bombana","Kabupaten Buton","Kabupaten Buton Selatan","Kabupaten Buton Tengah","Kabupaten Buton Utara","Kabupaten Kolaka","Kabupaten Kolaka Timur","Kabupaten Kolaka Utara","Kabupaten Konawe","Kabupaten Konawe Kepulauan","Kabupaten Konawe Selatan","Kabupaten Konawe Utara","Kabupaten Muna","Kabupaten Muna Barat","Kabupaten Wakatobi","Kota Bau Bau","Kota Kendari"],"Sulawesi Utara":["Kabupaten Bolaang Mongondow","Kabupaten Bolaang Mongondow Selatan","Kabupaten Bolaang Mongondow Timur","Kabupaten Bolaang Mongondow Utara","Kabupaten Kepulauan Sangihe","Kabupaten Kepulauan Siau Tagulandang Biaro (Sitaro)","Kabupaten Kepulauan Talaud","Kabupaten Minahasa","Kabupaten Minahasa Selatan","Kabupaten Minahasa Tenggara","Kabupaten Minahasa Utara","Kota Bitung","Kota Kotamobagu","Kota Manado","Kota Tomohon"],"Sumatera Barat":["Kabupaten Agam","Kabupaten Dharmasraya","Kabupaten Kepulauan Mentawai","Kabupaten Lima Puluh Kota","Kabupaten Padang Pariaman","Kabupaten Pasaman","Kabupaten Pasaman Barat","Kabupaten Pesisir Selatan","Kabupaten Sijunjung","Kabupaten Solok","Kabupaten Solok Selatan","Kabupaten Tanah Datar","Kota Bukittinggi","Kota Padang","Kota Padang Panjang","Kota Pariaman","Kota Payakumbuh","Kota Sawahlunto","Kota Solok"],"Sumatera Selatan":["Kabupaten Banyuasin","Kabupaten Empat Lawang","Kabupaten Lahat","Kabupaten Muara Enim","Kabupaten Musi Banyuasin","Kabupaten Musi Rawas","Kabupaten Musi Rawas Utara","Kabupaten Ogan Ilir","Kabupaten Ogan Komering Ilir","Kabupaten Ogan Komering Ulu","Kabupaten Ogan Komering Ulu Selatan","Kabupaten Ogan Komering Ulu Timur","Kabupaten Penukal Abab Lematang Ilir","Kota Lubuk Linggau","Kota Pagar Alam","Kota Palembang","Kota Prabumulih"],"Sumatera Utara":["Kabupaten Asahan","Kabupaten Batu Bara","Kabupaten Dairi","Kabupaten Deli Serdang","Kabupaten Humbang Hasundutan","Kabupaten Karo","Kabupaten Labuhanbatu","Kabupaten Labuhanbatu Selatan","Kabupaten Labuhanbatu Utara","Kabupaten Langkat","Kabupaten Mandailing Natal","Kabupaten Nias","Kabupaten Nias Barat","Kabupaten Nias Selatan","Kabupaten Nias Utara","Kabupaten Padang Lawas","Kabupaten Padang Lawas Utara","Kabupaten Pakpak Bharat","Kabupaten Samosir","Kabupaten Serdang Bedagai","Kabupaten Simalungun","Kabupaten Tapanuli Selatan","Kabupaten Tapanuli Tengah","Kabupaten Tapanuli Utara","Kabupaten Toba","Kota Binjai","Kota Gunungsitoli","Kota Medan","Kota Padangsidimpuan","Kota Pematangsiantar","Kota Sibolga","Kota Tanjung Balai","Kota Tebing Tinggi"]};

const OPT = {
  pendaftaran: ["Paket A","Paket B","Paket C"],
  jenis_kelamin: ["Laki-laki","Perempuan"],
  kebutuhan_khusus: ["Tidak ada","Netra","Rungu","Grahita Ringan","Grahita Sedang","Daksa Ringan","Daksa Sedang","Laras","Wicara","Hyperaktif","Cerdas Istimewa","Bakat Istimewa","Kesulitan Belajar","Narkoba","Indigo","Down Syndrome","Autis"],
  agama: ["Islam","Kristen","Katholik","Hindu","Budha","Konghucu","Kepercayaan Kpd Tuhan YME","Lainnya"],
  tempat_tinggal: ["Bersama Orang Tua","Wali","Kost","Panti Asuhan","Pesantren","Lainnya"],
  moda_transportasi: ["Jalan Kaki","Angkutan umum/bus/pete-pete","Mobil/bus antar jemput","Kereta api","Ojek","Andong/bendi/sado/dokar/delman/becak","Perahu penyeberangan/rakit/getek","Kuda","Sepeda","Sepeda Motor","Mobil Pribadi","Lainnya"],
  pendidikan: ["Tidak Sekolah","Paket A","Paket B","Paket C","TK/sederajat","SD/sederajat","SMP/sederajat","SMA/sederajat","D1","D2","D3","D4","S1","S2","S2 Terapan","S3","S3 Terapan","Sp-1","Sp-2","Lainnya"],
  pekerjaan: ["Nelayan","Petani","Peternak","PNS/TNI/Polri","Karyawan Swasta","Pedagang Kecil","Pedagang Besar","Wiraswasta","Wirausaha","Buruh","Pensiunan","Tenaga Kerja Indonesia","Karyawan BUMN","Tidak dapat diterapkan","Sudah Meninggal","Lainnya"],
  pekerjaan_ortu: ["Tidak Bekerja","Nelayan","Petani","Peternak","PNS/TNI/Polri","Karyawan Swasta","Pedagang Kecil","Pedagang Besar","Wiraswasta","Wirausaha","Buruh","Pensiunan","Tenaga Kerja Indonesia","Karyawan BUMN","Tidak dapat diterapkan","Sudah Meninggal","Lainnya"],
  penghasilan: ["Tidak Berpenghasilan","Kurang dari Rp 500.000","Rp 500.000 – 999.999","Rp 1.000.000 – 1.999.999","Rp 2.000.000 – 4.999.999","Rp 5.000.000 – 20.000.000","Lebih dari Rp 20.000.000"]
};

function fillSelect(id, options, placeholder){
  const el = document.getElementById(id);
  el.innerHTML = "";
  const ph = document.createElement("option");
  ph.value = ""; ph.textContent = placeholder || "-- Pilih --"; ph.disabled = true; ph.selected = true;
  el.appendChild(ph);
  options.forEach(o=>{
    const op = document.createElement("option");
    op.value = o; op.textContent = o;
    el.appendChild(op);
  });
}

fillSelect("pendaftaran", OPT.pendaftaran);
fillSelect("jenis_kelamin", OPT.jenis_kelamin);

// Provinsi & Kabupaten/Kota bertingkat
const daftarProvinsi = Object.keys(WILAYAH_DATA).sort();
fillSelect("provinsi_sekolah_asal", daftarProvinsi, "-- Pilih Provinsi --");

function updateKabupatenOptions(){
  const provinsi = document.getElementById("provinsi_sekolah_asal").value;
  const kabSelect = document.getElementById("kabupaten_sekolah_asal");
  const kabHint = document.getElementById("kabupatenHint");
  if(provinsi && WILAYAH_DATA[provinsi]){
    fillSelect("kabupaten_sekolah_asal", WILAYAH_DATA[provinsi], "-- Pilih Kabupaten/Kota --");
    kabSelect.disabled = false;
    kabHint.style.display = "none";
  } else {
    kabSelect.innerHTML = '<option value="" selected disabled>-- Pilih Provinsi dahulu --</option>';
    kabSelect.disabled = true;
    kabHint.style.display = "block";
  }
  clearError(kabSelect);
}
document.getElementById("provinsi_sekolah_asal").addEventListener("change", updateKabupatenOptions);
updateKabupatenOptions();

// Provinsi & Kabupaten/Kota Domisili (Data Pribadi)
fillSelect("provinsi_domisili", daftarProvinsi, "-- Pilih Provinsi --");

function updateKabupatenDomisiliOptions(){
  const provinsi = document.getElementById("provinsi_domisili").value;
  const kabSelect = document.getElementById("kabupaten_domisili");
  const kabHint = document.getElementById("kabupatenDomisiliHint");
  if(provinsi && WILAYAH_DATA[provinsi]){
    fillSelect("kabupaten_domisili", WILAYAH_DATA[provinsi], "-- Pilih Kabupaten/Kota --");
    kabSelect.disabled = false;
    kabHint.style.display = "none";
  } else {
    kabSelect.innerHTML = '<option value="" selected disabled>-- Pilih Provinsi dahulu --</option>';
    kabSelect.disabled = true;
    kabHint.style.display = "block";
  }
  clearError(kabSelect);
}
document.getElementById("provinsi_domisili").addEventListener("change", updateKabupatenDomisiliOptions);
updateKabupatenDomisiliOptions();

fillSelect("kebutuhan_khusus", OPT.kebutuhan_khusus);
document.getElementById("kebutuhan_khusus").value = "Tidak ada";
fillSelect("agama", OPT.agama);
fillSelect("tempat_tinggal", OPT.tempat_tinggal);
fillSelect("moda_transportasi", OPT.moda_transportasi);

fillSelect("pendidikan_ayah", OPT.pendidikan);
fillSelect("pekerjaan_ayah", OPT.pekerjaan_ortu);
fillSelect("kebutuhan_khusus_ayah", OPT.kebutuhan_khusus);
document.getElementById("kebutuhan_khusus_ayah").value = "Tidak ada";
fillSelect("penghasilan_ayah", OPT.penghasilan);

fillSelect("pendidikan_ibu", OPT.pendidikan);
fillSelect("pekerjaan_ibu", OPT.pekerjaan_ortu);
fillSelect("kebutuhan_khusus_ibu", OPT.kebutuhan_khusus);
document.getElementById("kebutuhan_khusus_ibu").value = "Tidak ada";
fillSelect("penghasilan_ibu", OPT.penghasilan);

fillSelect("pendidikan_wali", OPT.pendidikan);
fillSelect("pekerjaan_wali", OPT.pekerjaan);
fillSelect("penghasilan_wali", OPT.penghasilan);

// ---------- Status toggle (Hidup/Wafat, Mempunyai Wali) ----------
document.querySelectorAll(".status-toggle").forEach(group=>{
  const targetId = group.dataset.target;
  const hidden = document.getElementById(targetId);
  group.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      group.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");
      hidden.value = btn.dataset.value;
      handleToggleChange(targetId, btn.dataset.value);
    });
  });
});

function handleToggleChange(targetId, value){
  if(targetId === "status_ayah"){
    const lockedNote = document.getElementById("ayahLockedNote");
    const pekerjaan = document.getElementById("pekerjaan_ayah");
    const penghasilan = document.getElementById("penghasilan_ayah");
    if(value === "Wafat"){
      pekerjaan.value = "Sudah Meninggal";
      penghasilan.value = "Tidak Berpenghasilan";
      pekerjaan.disabled = true;
      penghasilan.disabled = true;
      lockedNote.classList.add("show");
    } else {
      pekerjaan.disabled = false;
      penghasilan.disabled = false;
      pekerjaan.value = "";
      penghasilan.value = "";
      lockedNote.classList.remove("show");
    }
  }
  if(targetId === "status_ibu"){
    const lockedNote = document.getElementById("ibuLockedNote");
    const pekerjaan = document.getElementById("pekerjaan_ibu");
    const penghasilan = document.getElementById("penghasilan_ibu");
    if(value === "Wafat"){
      pekerjaan.value = "Sudah Meninggal";
      penghasilan.value = "Tidak Berpenghasilan";
      pekerjaan.disabled = true;
      penghasilan.disabled = true;
      lockedNote.classList.add("show");
    } else {
      pekerjaan.disabled = false;
      penghasilan.disabled = false;
      pekerjaan.value = "";
      penghasilan.value = "";
      lockedNote.classList.remove("show");
    }
  }
  if(targetId === "jarak_rumah"){
    const kmField = document.getElementById("jarakKmField");
    const kmInput = document.getElementById("jarak_km");
    if(value === "Lebih dari 1 KM"){
      kmField.style.display = "block";
      kmInput.disabled = false;
      kmInput.setAttribute("required","required");
    } else {
      kmField.style.display = "none";
      kmInput.disabled = true;
      kmInput.removeAttribute("required");
      kmInput.value = "";
      clearError(kmInput);
    }
  }
  if(targetId === "putus_sekolah"){
    updateAlamatSekolahVisibility();
  }
  if(targetId === "punya_wali"){
    const waliSection = document.getElementById("waliSection");
    const requiredWaliFields = ["nama_wali","nik_wali","tahun_lahir_wali","pendidikan_wali","pekerjaan_wali","penghasilan_wali"];
    if(value === "Iya"){
      waliSection.classList.add("show");
      requiredWaliFields.forEach(id=>document.getElementById(id).setAttribute("required","required"));
    } else {
      waliSection.classList.remove("show");
      requiredWaliFields.forEach(id=>{
        const el = document.getElementById(id);
        el.removeAttribute("required");
        clearError(el);
      });
    }
  }
  if(typeof updateSubmitButtonState === "function") updateSubmitButtonState();
}

// Pendaftaran + Apakah Pernah Putus Sekolah -> tampilkan/sembunyikan Alamat Sekolah Asal
function updateAlamatSekolahVisibility(){
  const pendaftaran = document.getElementById("pendaftaran").value;
  const putus = document.getElementById("putus_sekolah").value;
  const section = document.getElementById("alamatSekolahSection");
  const desc = document.getElementById("alamatSekolahDesc");
  const fieldIds = ["provinsi_sekolah_asal","kabupaten_sekolah_asal","kecamatan_sekolah_asal","nama_sekolah_asal","lulus_tahun"];

  desc.textContent = (putus === "Iya")
    ? "Masukan alamat sekolah sesuai sekolah terakhir yang pernah putus/keluar"
    : "Masukan alamat sekolah sesuai ijazah terakhir";

  const shouldHide = (pendaftaran === "Paket A" && putus === "Tidak");
  if(shouldHide){
    section.style.display = "none";
    fieldIds.forEach(id=>{
      const el = document.getElementById(id);
      el.removeAttribute("required");
      clearError(el);
    });
  } else {
    section.style.display = "block";
    fieldIds.forEach(id=>document.getElementById(id).setAttribute("required","required"));
  }
}
document.getElementById("pendaftaran").addEventListener("change", updateAlamatSekolahVisibility);
updateAlamatSekolahVisibility();
if(typeof updateSubmitButtonState === "function") updateSubmitButtonState();

// Ijazah Terakhir wajib untuk Paket B/C, opsional untuk Paket A
function updateIjazahRequirement(){
  const pendaftaran = document.getElementById("pendaftaran").value;
  const ijazahInput = document.getElementById("ijazah_file");
  const reqMark = document.getElementById("ijazahReqMark");
  const hint = document.getElementById("ijazahHint");
  const wajib = (pendaftaran === "Paket B" || pendaftaran === "Paket C");

  if(wajib){
    ijazahInput.setAttribute("required", "required");
    reqMark.style.display = "inline";
    hint.textContent = "Format PDF atau JPG, ukuran maksimal 2 MB. Wajib diunggah untuk " + pendaftaran + ".";
  } else {
    ijazahInput.removeAttribute("required");
    reqMark.style.display = "none";
    hint.textContent = "Format PDF atau JPG, ukuran maksimal 2 MB. Opsional untuk Paket A.";
  }
  clearError(ijazahInput);
  if(typeof updateSubmitButtonState === "function") updateSubmitButtonState();
}
document.getElementById("pendaftaran").addEventListener("change", updateIjazahRequirement);
updateIjazahRequirement();

// Validasi ukuran & tipe berkas upload (KK & Ijazah): maksimal 2 MB, hanya PDF/JPG
const BATAS_UKURAN_BERKAS = 2 * 1024 * 1024; // 2 MB
function validasiBerkasUpload(inputEl, errMsgId){
  const errEl = document.getElementById(errMsgId);
  const file = inputEl.files[0];
  if(!file){
    inputEl.classList.remove("invalid");
    if(errEl) errEl.classList.remove("show");
    return;
  }
  const tipeDiizinkan = ["application/pdf", "image/jpeg", "image/jpg"];
  const validTipe = tipeDiizinkan.includes(file.type) || /\.(pdf|jpe?g)$/i.test(file.name);
  const validUkuran = file.size <= BATAS_UKURAN_BERKAS;

  if(!validTipe || !validUkuran){
    inputEl.value = ""; // kosongkan agar tidak ikut terkirim
    inputEl.classList.add("invalid");
    if(errEl){
      errEl.textContent = !validTipe
        ? "Berkas harus berformat PDF atau JPG."
        : "Ukuran berkas maksimal 2 MB.";
      errEl.classList.add("show");
    }
  } else {
    inputEl.classList.remove("invalid");
    if(errEl) errEl.classList.remove("show");
  }
  if(typeof updateSubmitButtonState === "function") updateSubmitButtonState();
}
document.getElementById("kk_file").addEventListener("change", ()=>validasiBerkasUpload(document.getElementById("kk_file"), "kkFileErr"));
document.getElementById("ijazah_file").addEventListener("change", ()=>validasiBerkasUpload(document.getElementById("ijazah_file"), "ijazahFileErr"));

// Pekerjaan Ayah/Ibu "Tidak Bekerja" -> auto-isi Penghasilan "Tidak Berpenghasilan"
function handlePekerjaanChange(pekerjaanId, penghasilanId){
  const pekerjaan = document.getElementById(pekerjaanId);
  const penghasilan = document.getElementById(penghasilanId);
  if(pekerjaan.value === "Tidak Bekerja"){
    penghasilan.value = "Tidak Berpenghasilan";
    penghasilan.disabled = true;
  } else {
    // listener ini hanya aktif saat pekerjaan tidak terkunci (status bukan Wafat), jadi aman untuk membuka kunci
    penghasilan.disabled = false;
  }
  clearError(penghasilan);
}
document.getElementById("pekerjaan_ayah").addEventListener("change", ()=>handlePekerjaanChange("pekerjaan_ayah","penghasilan_ayah"));
document.getElementById("pekerjaan_ibu").addEventListener("change", ()=>handlePekerjaanChange("pekerjaan_ibu","penghasilan_ibu"));

// ---------- Numeric-only input enforcement ----------
function restrictNumeric(id, maxLen){
  const el = document.getElementById(id);
  el.addEventListener("input", ()=>{
    let v = el.value.replace(/\D/g,"");
    if(maxLen) v = v.slice(0, maxLen);
    el.value = v;
  });
}
["nik","no_kk","no_akta","nisn","rt","rw","kode_pos","anak_ke","tinggi_badan","berat_badan","jarak_km","waktu_tempuh_jam","waktu_tempuh_menit","jumlah_saudara","lulus_tahun","nik_ayah","tahun_lahir_ayah","nik_ibu","tahun_lahir_ibu","nik_wali","tahun_lahir_wali","telp_rumah","no_hp"].forEach(id=>{
  const maxLenMap = {nik:16, no_kk:16, no_akta:16, nisn:10, tinggi_badan:3, berat_badan:3, waktu_tempuh_jam:2, waktu_tempuh_menit:2, lulus_tahun:4, tahun_lahir_ayah:4, tahun_lahir_ibu:4, tahun_lahir_wali:4};
  restrictNumeric(id, maxLenMap[id]);
});

// ---------- Letters-only for Tempat Lahir ----------
document.getElementById("tempat_lahir").addEventListener("input", (e)=>{
  e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"");
});

// ---------- Validation ----------
function clearError(el){
  el.classList.remove("invalid");
  const field = el.closest(".field");
  const msg = field ? field.querySelector(".err-msg") : null;
  if(msg) msg.classList.remove("show");
}
function setError(el){
  el.classList.add("invalid");
  const field = el.closest(".field");
  const msg = field ? field.querySelector(".err-msg") : null;
  if(msg) msg.classList.add("show");
}

function isFieldValid(el){
  if(el.disabled) return true;
  const val = el.value.trim();
  const isRequired = el.hasAttribute("required");

  if(isRequired && val === "") return false;
  if(val === "" && !isRequired) return true;

  const id = el.id;
  if(id === "nisn" && val !== ""){
    if(!/^\d{10}$/.test(val)) return false;
  }
  if(["nik","nik_ayah","nik_ibu","nik_wali"].includes(id)){
    if(!/^\d{16}$/.test(val)) return false;
  }
  if(id === "no_akta" && val !== ""){
    if(!/^\d{16}$/.test(val)) return false;
  }
  if(["tahun_lahir_ayah","tahun_lahir_ibu","tahun_lahir_wali","lulus_tahun"].includes(id)){
    if(!/^\d{4}$/.test(val)) return false;
  }
  if(id === "tempat_lahir"){
    if(!/^[a-zA-Z\s]+$/.test(val)) return false;
  }
  if(id === "anak_ke"){
    if(!/^\d+$/.test(val)) return false;
  }
  if(id === "tinggi_badan"){
    if(!/^\d{3}$/.test(val)) return false;
  }
  if(id === "berat_badan"){
    if(!/^\d{1,3}$/.test(val)) return false;
  }
  if(id === "jarak_km"){
    if(!/^\d+$/.test(val)) return false;
  }
  if(id === "waktu_tempuh_jam"){
    if(!/^\d{1,2}$/.test(val) || Number(val) > 23) return false;
  }
  if(id === "waktu_tempuh_menit"){
    if(!/^\d{1,2}$/.test(val) || Number(val) > 59) return false;
  }
  if(id === "jumlah_saudara" && val !== ""){
    if(!/^\d+$/.test(val)) return false;
  }
  if(id === "email" && val !== ""){
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return false;
  }
  if(el.tagName === "SELECT" && isRequired){
    if(val === "") return false;
  }
  return true;
}

function validateField(el){
  const ok = isFieldValid(el);
  if(ok) clearError(el); else setError(el);
  return ok;
}

// Tombol Kirim Pendaftaran menyala hanya jika semua data wajib sudah terisi & valid
function updateSubmitButtonState(){
  const submitBtn = document.getElementById("submitBtn");
  if(submitBtn.textContent.indexOf("Mengirim") !== -1) return; // sedang proses kirim, jangan diubah
  const allFields = document.querySelectorAll("#ppdbForm input, #ppdbForm select");
  let allValid = true;
  allFields.forEach(el=>{
    if(el.type === "hidden") return;
    if(!isFieldValid(el)) allValid = false;
  });
  const confirmCheck = document.getElementById("confirmCheck");
  if(!confirmCheck.checked) allValid = false;
  submitBtn.disabled = !allValid;
}
document.getElementById("ppdbForm").addEventListener("input", updateSubmitButtonState);
document.getElementById("ppdbForm").addEventListener("change", updateSubmitButtonState);


// Live validation on blur
document.querySelectorAll("input, select").forEach(el=>{
  el.addEventListener("blur", ()=>validateField(el));
});

// ---------- Progress step highlight on scroll ----------
const cards = document.querySelectorAll("section.card");
const steps = document.querySelectorAll(".pstep");
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const idx = Array.from(cards).indexOf(entry.target);
      steps.forEach((s,i)=>{
        s.classList.toggle("active", i===idx);
        s.classList.toggle("done", i<idx);
      });
    }
  });
}, {threshold:0.4});
cards.forEach(c=>observer.observe(c));

// ---------- Submit ----------
document.getElementById("confirmCheck").addEventListener("change", (e)=>{
  if(e.target.checked) document.getElementById("confirmErr").classList.remove("show");
});
document.getElementById("ppdbForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const summaryErr = document.getElementById("summaryErr");
  const allFields = document.querySelectorAll("#ppdbForm input, #ppdbForm select");
  let firstInvalid = null;
  let allValid = true;

  allFields.forEach(el=>{
    if(el.type === "hidden") return;
    const ok = validateField(el);
    if(!ok){
      allValid = false;
      if(!firstInvalid) firstInvalid = el;
    }
  });

  if(!allValid){
    summaryErr.classList.add("show");
    firstInvalid.scrollIntoView({behavior:"smooth", block:"center"});
    return;
  }
  summaryErr.classList.remove("show");

  const confirmCheck = document.getElementById("confirmCheck");
  const confirmErr = document.getElementById("confirmErr");
  if(!confirmCheck.checked){
    confirmErr.classList.add("show");
    confirmCheck.scrollIntoView({behavior:"smooth", block:"center"});
    return;
  }
  confirmErr.classList.remove("show");

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Mengunggah berkas...";

  const waktuKirimDate = new Date();

  // Konversi file KK & Ijazah (jika ada) ke base64 sebelum dikirim
  function fileKeBase64(file){
    return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = ()=>resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const kkFileEl = document.getElementById("kk_file");
  const ijazahFileEl = document.getElementById("ijazah_file");
  const kkFile = kkFileEl.files[0];
  const ijazahFile = ijazahFileEl.files[0];

  let kkBase64 = "", ijazahBase64 = "";
  try{
    if(kkFile) kkBase64 = await fileKeBase64(kkFile);
    if(ijazahFile) ijazahBase64 = await fileKeBase64(ijazahFile);
  } catch(errBaca){
    alert("Gagal membaca berkas yang diunggah. Silakan coba pilih ulang berkasnya.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Kirim Pendaftaran";
    return;
  }

  const data = {
    pendaftaran: val("pendaftaran"), putus_sekolah: val("putus_sekolah"),
    provinsi_sekolah_asal: val("provinsi_sekolah_asal"), kabupaten_sekolah_asal: val("kabupaten_sekolah_asal"),
    kecamatan_sekolah_asal: val("kecamatan_sekolah_asal"), nama_sekolah_asal: val("nama_sekolah_asal"), lulus_tahun: val("lulus_tahun"),
    nama_lengkap: val("nama_lengkap"), jenis_kelamin: val("jenis_kelamin"), nisn: val("nisn"), nik: val("nik"), no_kk: val("no_kk"),
    tempat_lahir: val("tempat_lahir"), tanggal_lahir: val("tanggal_lahir"), no_akta: val("no_akta"),
    kebutuhan_khusus: val("kebutuhan_khusus"), agama: val("agama"), alamat_jalan: val("alamat_jalan"),
    provinsi_domisili: val("provinsi_domisili"), kabupaten_domisili: val("kabupaten_domisili"), kecamatan_domisili: val("kecamatan_domisili"),
    rt: val("rt"), rw: val("rw"), nama_dusun: val("nama_dusun"), desa_kelurahan: val("desa_kelurahan"),
    kode_pos: val("kode_pos"), tempat_tinggal: val("tempat_tinggal"), moda_transportasi: val("moda_transportasi"),
    anak_ke: val("anak_ke"),
    tinggi_badan: val("tinggi_badan"),
    status_ayah: val("status_ayah"), nama_ayah: val("nama_ayah"), nik_ayah: val("nik_ayah"),
    tahun_lahir_ayah: val("tahun_lahir_ayah"), pendidikan_ayah: val("pendidikan_ayah"),
    pekerjaan_ayah: val("pekerjaan_ayah"), kebutuhan_khusus_ayah: val("kebutuhan_khusus_ayah"),
    penghasilan_ayah: val("penghasilan_ayah"),
    status_ibu: val("status_ibu"), nama_ibu: val("nama_ibu"), nik_ibu: val("nik_ibu"),
    tahun_lahir_ibu: val("tahun_lahir_ibu"), pendidikan_ibu: val("pendidikan_ibu"),
    pekerjaan_ibu: val("pekerjaan_ibu"), kebutuhan_khusus_ibu: val("kebutuhan_khusus_ibu"),
    penghasilan_ibu: val("penghasilan_ibu"),
    punya_wali: val("punya_wali"), nama_wali: val("nama_wali"), nik_wali: val("nik_wali"),
    tahun_lahir_wali: val("tahun_lahir_wali"), pendidikan_wali: val("pendidikan_wali"),
    pekerjaan_wali: val("pekerjaan_wali"), penghasilan_wali: val("penghasilan_wali"),
    telp_rumah: val("telp_rumah"), no_hp: val("no_hp"), email: val("email"),
    berat_badan: val("berat_badan"), lingkar_kepala: val("lingkar_kepala"),
    jarak_rumah: val("jarak_rumah"), jarak_km: val("jarak_km"),
    waktu_tempuh: (val("waktu_tempuh_jam") || "0") + " : " + val("waktu_tempuh_menit"),
    jumlah_saudara: val("jumlah_saudara"),
    waktu_kirim: waktuKirimDate.toLocaleString("id-ID"),
    kk_file_base64: kkBase64, kk_file_name: kkFile ? kkFile.name : "", kk_file_mime: kkFile ? kkFile.type : "",
    ijazah_file_base64: ijazahBase64, ijazah_file_name: ijazahFile ? ijazahFile.name : "", ijazah_file_mime: ijazahFile ? ijazahFile.type : ""
  };

  submitBtn.textContent = "Mengirim...";

  // Ambil cuplikan data SEBELUM formulir disembunyikan (untuk PDF)
  const cuplikan = collectAllFieldEntries();
  const noRegBaru = buildNoReg(waktuKirimDate, val("pendaftaran"));

  data.action = "daftar";
  API.kirim(data)
    .then(function(json){
      if(!json || !json.ok){
        alert("Pendaftaran gagal dikirim.\n\n" + ((json && json.message) || "Silakan coba lagi."));
        submitBtn.disabled = false;
        submitBtn.textContent = "Kirim Pendaftaran";
        return;
      }
      window.__formSnapshot = cuplikan;
      window.__noReg = noRegBaru;
      document.getElementById("ppdbForm").style.display = "none";
      document.querySelector(".progress-card").style.display = "none";
      document.getElementById("successScreen").classList.add("show");
      window.scrollTo({top:0, behavior:"smooth"});
    })
    .catch(function(err){
      alert("Pendaftaran gagal dikirim.\n\n" + err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = "Kirim Pendaftaran";
    });
});

function val(id){
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

// ---------- Nomor Registrasi (dari waktu kirim + jenis paket) ----------
function pad2(n){ return String(n).padStart(2, "0"); }

function buildNoReg(date, pendaftaranValue){
  const dd = pad2(date.getDate());
  const mm = pad2(date.getMonth() + 1);
  const yy = String(date.getFullYear()).slice(-2);
  const jam = pad2(date.getHours());
  const menit = pad2(date.getMinutes());
  let kode = "A";
  if(pendaftaranValue === "Paket B") kode = "B";
  else if(pendaftaranValue === "Paket C") kode = "C";
  return dd + "_" + mm + "_" + yy + "-" + jam + "_" + menit + "_P." + kode;
}

// ---------- Kumpulkan seluruh data formulir (label & jawaban) untuk PDF ----------
function getFieldLabel(fieldEl){
  const label = fieldEl.querySelector("label");
  if(!label) return "";
  return label.textContent.replace("*","").trim();
}

function getFieldValue(fieldEl){
  const jam = fieldEl.querySelector("#waktu_tempuh_jam");
  const menit = fieldEl.querySelector("#waktu_tempuh_menit");
  if(jam && menit){
    const j = jam.value.trim() || "0";
    const m = menit.value.trim() || "-";
    return j + " : " + m;
  }
  const toggle = fieldEl.querySelector(".status-toggle");
  if(toggle){
    const hidden = fieldEl.querySelector('input[type="hidden"]');
    return hidden ? hidden.value : "-";
  }
  const select = fieldEl.querySelector("select");
  if(select){
    if(select.selectedIndex < 0 || select.value === "") return "-";
    const opt = select.options[select.selectedIndex];
    return opt ? opt.text : "-";
  }
  const input = fieldEl.querySelector('input:not([type="hidden"])');
  if(input){
    if(input.type === "date" && input.value){
      const [yyyy, mm, dd] = input.value.split("-");
      return dd + "/" + mm + "/" + yyyy;
    }
    if(input.type === "file"){
      return (input.files && input.files[0]) ? input.files[0].name : "-";
    }
    return input.value.trim() === "" ? "-" : input.value.trim();
  }
  return "-";
}

function collectAllFieldEntries(){
  const entries = [];
  const sections = document.querySelectorAll("#ppdbForm > section.card");
  sections.forEach(section=>{
    const titleEl = section.querySelector(":scope > .card-head .card-title");
    if(titleEl) entries.push({type:"section", text: titleEl.textContent.trim()});

    const items = section.querySelectorAll(".subsection-title, .field");
    items.forEach(el=>{
      if(el.classList.contains("subsection-title")){
        entries.push({type:"subsection", text: el.textContent.trim()});
        return;
      }
      if(el.offsetParent === null) return; // field tersembunyi, lewati
      const label = getFieldLabel(el);
      if(!label) return;
      const value = getFieldValue(el);
      entries.push({type:"field", label, value});
    });
  });
  return entries;
}

// ---------- Generate PDF Formulir ----------
function generatePDF(entries, noReg){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({unit:"mm", format:"a4"});
  const margin = 15; // 1,5 cm di semua sisi
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;
  const labelColWidth = 60;
  const colonX = margin + labelColWidth;
  const valueX = colonX + 4;
  const valueMaxWidth = usableWidth - labelColWidth - 4;
  const lineHeight = 4.3;
  let y = margin;

  function ensureSpace(h){
    if(y + h > pageHeight - margin){
      doc.addPage();
      y = margin;
    }
  }

  const pkbmSettings = window.__pkbmSettings || { nama_pkbm: "", tahun_ajaran: "" };

  if(noReg){
    doc.setFont("helvetica","bold");
    doc.setFontSize(9.5);
    doc.setTextColor(31,78,140);
    doc.text("No Reg. (" + noReg + ")", pageWidth - margin, margin, {align:"right"});
    doc.setTextColor(20,20,20);
  }

  doc.setFont("helvetica","bold");
  doc.setFontSize(13);
  doc.text("FORMULIR PENDAFTARAN", pageWidth/2, y + 3, {align:"center"});
  y += 8.5;
  doc.text((pkbmSettings.nama_pkbm || "").toUpperCase(), pageWidth/2, y, {align:"center"});
  y += 6;
  doc.setFont("helvetica","normal");
  doc.setFontSize(10);
  doc.text("Tahun Ajaran " + (pkbmSettings.tahun_ajaran || ""), pageWidth/2, y, {align:"center"});
  y += 4;
  doc.setDrawColor(31,78,140);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  entries.forEach(entry=>{
    if(entry.type === "section"){
      ensureSpace(9);
      y += 1.5;
      doc.setFillColor(31,78,140);
      doc.setTextColor(255,255,255);
      doc.setFont("helvetica","bold");
      doc.setFontSize(10.5);
      doc.rect(margin, y - 4, usableWidth, 6, "F");
      doc.text(entry.text.toUpperCase(), margin + 2, y);
      doc.setTextColor(20,20,20);
      y += 5.5;
      return;
    }
    if(entry.type === "subsection"){
      ensureSpace(7);
      y += 1;
      doc.setFont("helvetica","bold");
      doc.setFontSize(9.5);
      doc.setTextColor(31,78,140);
      doc.text(entry.text, margin, y);
      doc.setTextColor(20,20,20);
      y += 4.8;
      return;
    }
    // field: label di kiri, jawaban setelah tanda titik dua
    doc.setFontSize(9.5);
    doc.setFont("helvetica","normal");
    const valueLines = doc.splitTextToSize(entry.value || "-", valueMaxWidth);
    doc.setFont("helvetica","bold");
    const labelLines = doc.splitTextToSize(entry.label, labelColWidth - 2);
    const blockLines = Math.max(labelLines.length, valueLines.length);
    ensureSpace(blockLines * lineHeight + 0.5);
    doc.text(labelLines, margin, y);
    doc.setFont("helvetica","normal");
    doc.text(":", colonX, y);
    doc.text(valueLines, valueX, y);
    y += blockLines * lineHeight;
  });

  const namaEntry = entries.find(e=>e.type==="field" && e.label==="Nama Lengkap");
  let namaFile = (namaEntry && namaEntry.value !== "-") ? namaEntry.value : "Pendaftaran";
  namaFile = namaFile.replace(/[^a-zA-Z0-9]+/g,"_").replace(/^_+|_+$/g,"");
  doc.save("Formulir_Pendaftaran_" + namaFile + ".pdf");
}

document.getElementById("downloadFormBtn").addEventListener("click", ()=>{
  const entries = window.__formSnapshot;
  if(!entries || !entries.length){
    alert("Data formulir tidak ditemukan. Silakan kirim ulang formulir terlebih dahulu.");
    return;
  }
  generatePDF(entries, window.__noReg);
});
