function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    const id = "KOM" + new Date().getTime(); // ID unik berdasarkan timestamp

    sheet.appendRow([
      data.nama || "Anonim",
      data.email || "-",
      data.pesan || "(Pesan kosong)",
      new Date(),
      id,
    ]);

    return ContentService.createTextOutput("Sukses").setMimeType(
      ContentService.MimeType.TEXT
    );
  } catch (error) {
    return ContentService.createTextOutput(
      "Gagal: " + error.message
    ).setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const json = data
    .slice(1)
    .filter((row) => {
      const tanggal = new Date(row[3]);
      return tanggal >= sevenDaysAgo;
    })
    .map((row) => ({
      nama: row[0],
      email: row[1],
      pesan: row[2],
      waktu: row[3],
      id: row[4],
    }));

  return ContentService.createTextOutput(JSON.stringify(json)).setMimeType(
    ContentService.MimeType.JSON
  );
}
