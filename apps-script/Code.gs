// ============================================================
// Wedding Invitation — Google Apps Script Backend
// ------------------------------------------------------------
// Desplegar como: Web app
//   • Ejecutar como: Yo (tu cuenta de Google)
//   • Quién tiene acceso: Cualquier usuario
// ============================================================

const SPREADSHEET_ID = '1TzyKqI75na_Wij20V2YgDED6YTfr983VvylvkmrWjnI';

// Índices de columnas (0-based): A=0, B=1, C=2, D=3, E=4, F=5
const COL = {
  NAME:        0,
  ATTENDANCE:  1,
  STARTER:     2,
  MAIN_COURSE: 3,
  PHONE:       4,
  COMMENTS:    5,
};

function doGet(e) {
  const action = e.parameter.action;
  let result;

  if (action === 'get') {
    result = handleGet(e.parameter.name);
  } else if (action === 'save') {
    result = handleSave(
      e.parameter.name,
      e.parameter.attendance,
      e.parameter.starter,
      e.parameter.mainCourse
    );
  } else {
    result = { error: 'Unknown action' };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleGet(name) {
  if (!name) return { error: 'No name provided' };

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  const data  = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (normalize(row[COL.NAME]) === normalize(name)) {
      return {
        name:       row[COL.NAME].toString(),
        attendance: row[COL.ATTENDANCE].toString(),
        starter:    row[COL.STARTER].toString(),
        mainCourse: row[COL.MAIN_COURSE].toString(),
        phone:      row[COL.PHONE].toString(),
        comments:   row[COL.COMMENTS].toString(),
      };
    }
  }

  return { error: 'Guest not found' };
}

function handleSave(name, attendance, starter, mainCourse) {
  if (!name || !attendance) return { success: false, error: 'Missing data' };

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  const data  = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (normalize(row[COL.NAME]) === normalize(name)) {

      // Bloquear si ya confirmó previamente
      if (row[COL.ATTENDANCE].toString() !== '') {
        return { success: false, error: 'Already confirmed' };
      }

      const rowNum = i + 1; // getRange usa índice 1-based
      sheet.getRange(rowNum, COL.ATTENDANCE  + 1).setValue(attendance);
      sheet.getRange(rowNum, COL.STARTER     + 1).setValue(starter     || '');
      sheet.getRange(rowNum, COL.MAIN_COURSE + 1).setValue(mainCourse  || '');
      SpreadsheetApp.flush();

      return { success: true };
    }
  }

  return { success: false, error: 'Guest not found' };
}

// Normaliza texto para comparación: minúsculas y sin espacios al inicio/fin
function normalize(str) {
  return str.toString().trim().toLowerCase();
}
