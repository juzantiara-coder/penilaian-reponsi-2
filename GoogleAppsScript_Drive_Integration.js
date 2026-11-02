/**
 * ====================================================================
 * GOOGLE APPS SCRIPT: WEB UJIAN ONLINE LENGKAP & INTEGRASI GOOGLE DRIVE
 * ====================================================================
 * 
 * AGAR LINK INI BISA DIBUKA OLEH SIAPA SAJA SEBAGAI WEB UJIAN INTERAKTIF:
 * -------------------------------------------------------------------
 * 1. Di editor Google Apps Script ini, lihat bilah kiri di bawah tulisan "File":
 * 2. Klik tombol tanda tambah [+] di samping "File" -> Pilih "HTML".
 * 3. Beri nama file baru tersebut: "index" (tanpa tanda kutip).
 * 4. Buka file "index_standalone.html" yang ada di folder ujian laptop Anda,
 *    salin seluruh isinya, lalu tempel (paste) ke dalam file "index.html" di Apps Script.
 * 5. Klik Simpan (ikon disket).
 * 6. Di pojok kanan atas, klik "Terapkan" (Deploy) -> "Kelola penerapan" (Manage deployments)
 *    -> Klik ikon Pensil (Edit) -> Versi: "Versi Baru" (New version) -> Klik "Terapkan".
 * 7. Selesai! Sekarang link https://script.google.com/.../exec Anda akan
 *    MENAMPILKAN WEB UJIAN LENGKAP SIAP PAKAI KEPADA SIAPA SAJA YANG MEMBUKANYA!
 * ====================================================================
 */

function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. PING TEST KONEKSI
    if (e && e.parameter && (e.parameter.action === "ping" || e.parameter.action === "test")) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: "success",
          message: "Koneksi Google Apps Script & Spreadsheet aktif dan siap digunakan!",
          timestamp: new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. SIMPAN DATA VIA GET (Fallback)
    if (e && e.parameter && (e.parameter.action === "save" || (e.parameter.action !== "page" && e.parameter.action !== "get" && e.parameter.nama))) {
      var saveResult = appendStudentRecord(ss, e.parameter);
      return ContentService
        .createTextOutput(JSON.stringify(saveResult))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. AMBIL DATA UNTUK DASHBOARD CO.ASS
    if (e && e.parameter && e.parameter.action === "get") {
      var sheet = getOrCreateRekapSheet(ss);
      var data = sheet.getDataRange().getValues();
      var results = [];

      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (row[2] || row[3]) {
          results.push({
            no: row[0] || i,
            waktu: String(row[1] || ""),
            nim: String(row[2] || "").replace(/^'/, ""),
            nama: String(row[3] || ""),
            minat: String(row[4] || "-"),
            skor: Number(row[5] !== undefined && row[5] !== "" ? row[5] : 0),
            benar: Number(row[6] || 0),
            salah: Number(row[7] || 0),
            kosong: Number(row[8] || 0),
            status: String(row[9] || (Number(row[5] || 0) >= 70 ? "LULUS" : "REMEDIAL")),
            ringkasanJawaban: String(row[10] || "")
          });
        }
      }

      return ContentService
        .createTextOutput(JSON.stringify(results))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 4. JIKA DIBUKA DI BROWSER OLEH MAHASISWA/SIAPA SAJA:
    // TAMPILKAN LANGSUNG HALAMAN WEB UJIAN INTERAKTIF!
    try {
      return HtmlService.createHtmlOutputFromFile("index")
        .setTitle("INSTIPER Yogyakarta - Praktikum Teknologi dan Mekanisasi")
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag("viewport", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
    } catch (htmlErr) {
      // Jika file index.html belum dibuat di editor Apps Script, berikan petunjuk jelas
      return HtmlService.createHtmlOutput(
        "<div style='font-family:sans-serif;padding:30px;max-width:600px;margin:auto;line-height:1.6;color:#1e293b;background:#f8fafc;border-radius:16px;border:1px solid #e2e8f0;margin-top:40px;'>" +
        "<h2 style='color:#1d7350;margin-top:0;'>🏛️ Ujian Online INSTIPER</h2>" +
        "<p>Backend Google Spreadsheet berhasil terhubung! ✅</p>" +
        "<p>Agar link ini langsung memunculkan tampilan halaman ujian lengkap kepada mahasiswa:</p>" +
        "<ol style='padding-left:20px;'>" +
        "<li>Buka editor Apps Script Anda.</li>" +
        "<li>Di bilah kiri samping tulisan <b>File</b>, klik tanda tambah <b>[+]</b> &rarr; pilih <b>HTML</b>.</li>" +
        "<li>Beri nama: <b>index</b></li>" +
        "<li>Salin seluruh isi file <b>index_standalone.html</b> di folder ujian laptop Anda, lalu tempelkan ke file index.html tersebut.</li>" +
        "<li>Klik Simpan & Kelola Penerapan &rarr; Edit &rarr; Versi Baru &rarr; Terapkan.</li>" +
        "</ol>" +
        "<p>Setelah itu, siapa pun yang mengklik link ini akan langsung melihat tampilan ujian interaktif!</p>" +
        "</div>"
      ).setTitle("INSTIPER Yogyakarta").addMetaTag("viewport", "width=device-width, initial-scale=1.0");
    }

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = {};

    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var result = appendStudentRecord(ss, data);

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ====================================================================
// FUNGSI PENYIMPANAN DATA KE 2 SHEET: "Rekap Nilai" & "Detail Jawaban"
// ====================================================================

function appendStudentRecord(ss, data) {
  var rekapSheet = getOrCreateRekapSheet(ss);
  var detailSheet = getOrCreateDetailSheet(ss);

  var noUrut = Math.max(1, rekapSheet.getLastRow());
  var waktu = data.waktu || new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  var nim = "'" + String(data.nim || "-").trim();
  var nama = String(data.nama || "-").trim();
  var minat = String(data.minat || "-").trim();
  var skor = Number(data.skor !== undefined ? data.skor : 0);
  var benar = Number(data.benar || 0);
  var salah = Number(data.salah || 0);
  var kosong = Number(data.kosong || 0);
  var status = data.status || (skor >= 70 ? "LULUS" : "REMEDIAL");
  var ringkasanJawaban = String(data.ringkasanJawaban || "-");

  // 1. Sheet "Rekap Nilai"
  rekapSheet.appendRow([
    noUrut,
    waktu,
    nim,
    nama,
    minat,
    skor,
    benar,
    salah,
    kosong,
    status,
    ringkasanJawaban
  ]);

  var lastRowRekap = rekapSheet.getLastRow();
  var scoreCell = rekapSheet.getRange(lastRowRekap, 6);
  var statusCell = rekapSheet.getRange(lastRowRekap, 10);
  scoreCell.setFontWeight("bold").setHorizontalAlignment("center");

  if (status === "LULUS") {
    statusCell.setBackground("#d1fae5").setFontColor("#065f46").setFontWeight("bold").setHorizontalAlignment("center");
  } else {
    statusCell.setBackground("#fee2e2").setFontColor("#991b1b").setFontWeight("bold").setHorizontalAlignment("center");
  }

  // 2. Sheet "Detail Jawaban"
  var detailList = [];
  if (Array.isArray(data.detailJawaban)) {
    detailList = data.detailJawaban;
  } else if (typeof data.detailJawaban === "string" && data.detailJawaban.trim().length > 0) {
    try {
      detailList = JSON.parse(data.detailJawaban);
    } catch (e) {
      detailList = data.detailJawaban.split(",").map(function(s) { return s.trim(); });
    }
  }

  var detailRow = [noUrut, waktu, nim, nama, skor, status];
  for (var q = 0; q < 30; q++) {
    detailRow.push(detailList[q] !== undefined ? String(detailList[q]) : "-");
  }
  detailSheet.appendRow(detailRow);

  return {
    status: "success",
    message: "Hasil jawaban " + nama + " berhasil disimpan ke Google Drive!",
    row: lastRowRekap
  };
}

function getOrCreateRekapSheet(ss) {
  var sheet = ss.getSheetByName("Rekap Nilai");
  if (!sheet) {
    sheet = ss.insertSheet("Rekap Nilai", 0);
  }

  if (sheet.getLastRow() === 0) {
    var headers = [
      "No",
      "Waktu Ujian",
      "NIM",
      "Nama Praktikan",
      "Minat / Bidang",
      "Nilai Akhir (0-100)",
      "Jumlah Benar",
      "Jumlah Salah",
      "Timeout / Kosong",
      "Status Kelulusan",
      "Ringkasan Jawaban"
    ];
    sheet.appendRow(headers);

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1d7350");
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);

    sheet.setColumnWidth(1, 50);
    sheet.setColumnWidth(2, 170);
    sheet.setColumnWidth(3, 140);
    sheet.setColumnWidth(4, 220);
    sheet.setColumnWidth(5, 170);
    sheet.setColumnWidth(6, 130);
    sheet.setColumnWidth(7, 100);
    sheet.setColumnWidth(8, 100);
    sheet.setColumnWidth(9, 120);
    sheet.setColumnWidth(10, 140);
    sheet.setColumnWidth(11, 280);
  }

  return sheet;
}

function getOrCreateDetailSheet(ss) {
  var sheet = ss.getSheetByName("Detail Jawaban");
  if (!sheet) {
    sheet = ss.insertSheet("Detail Jawaban", 1);
  }

  if (sheet.getLastRow() === 0) {
    var headers = ["No", "Waktu Ujian", "NIM", "Nama Praktikan", "Nilai Akhir", "Status"];
    for (var i = 1; i <= 30; i++) {
      headers.push("Soal " + i);
    }
    sheet.appendRow(headers);

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#165a3e");
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);

    sheet.setColumnWidth(1, 50);
    sheet.setColumnWidth(2, 170);
    sheet.setColumnWidth(3, 140);
    sheet.setColumnWidth(4, 220);
    sheet.setColumnWidth(5, 100);
    sheet.setColumnWidth(6, 110);
    for (var col = 7; col <= headers.length; col++) {
      sheet.setColumnWidth(col, 160);
    }
  }

  return sheet;
}
