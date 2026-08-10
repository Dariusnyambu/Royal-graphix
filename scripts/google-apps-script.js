/**
 * ═══════════════════════════════════════════════════════════
 *  ROYAL GRAPHIX — Google Apps Script
 *  Receives POST requests from the website and appends rows
 *  to the correct sheet tab.
 *
 *  HOW TO DEPLOY (IMPORTANT — re-deploy after ANY edit to this file):
 *  1. Open your Google Sheet
 *  2. Extensions → Apps Script → paste this entire file (replace old code)
 *  3. Save (Ctrl+S)
 *  4. Click "Deploy" → "Manage Deployments" → pencil icon → "New Version"
 *     (If you create a brand NEW deployment instead, you must update
 *      VITE_GOOGLE_SHEETS_URL in .env with the new URL!)
 *  5. Execute as: Me
 *  6. Who has access: Anyone
 *  7. Click Deploy → Authorize → Copy the Web App URL
 *  8. Add to .env:  VITE_GOOGLE_SHEETS_URL=<paste URL here>
 *
 *  TEST IT: Paste the deployed URL into a browser address bar.
 *  You should see: {"status":"Royal Graphix Sheets API is live"}
 *  If you see a Google login/permission page instead, redeploy with
 *  "Who has access: Anyone" — this is the #1 cause of silent failures.
 * ═══════════════════════════════════════════════════════════
 */

// Master header list per sheet tab — kept in sync with the website forms.
const SHEET_HEADERS = {
  'Contacts':      ['timestamp', 'name', 'email', 'phone', 'project_type', 'budget', 'message', 'supabase_status'],
  'Chat Leads':    ['timestamp', 'name', 'company', 'phone', 'email', 'service', 'desc', 'service_interest', 'source'],
  'Newsletter':    ['timestamp', 'email'],
  'Quote Requests':['timestamp', 'name', 'email', 'service', 'budget', 'timeline', 'message'],
}

function doPost(e) {
  try {
    if (!e || !e.postData) {
      return jsonOut({ status: 'error', message: 'No POST data received' })
    }

    const data = JSON.parse(e.postData.contents)
    const sheetName = data.sheet || 'Contacts'
    const ss = SpreadsheetApp.getActiveSpreadsheet()

    let sheet = ss.getSheetByName(sheetName)
    if (!sheet) {
      sheet = ss.insertSheet(sheetName)
    }

    const masterHeaders = SHEET_HEADERS[sheetName] || Object.keys(data).filter(k => k !== 'sheet')

    // ── Sync header row: create OR repair if columns are missing ──────────
    let currentHeaders = sheet.getLastRow() > 0
      ? sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0]
      : []

    // Add any missing headers (handles old sheets created before phone/etc existed)
    const missing = masterHeaders.filter(h => currentHeaders.indexOf(h) === -1)
    if (missing.length > 0 || currentHeaders.length === 0) {
      const fullHeaders = currentHeaders.length === 0
        ? masterHeaders
        : currentHeaders.concat(missing)

      sheet.getRange(1, 1, 1, fullHeaders.length).setValues([fullHeaders])
      sheet.getRange(1, 1, 1, fullHeaders.length)
        .setBackground('#C8102E')
        .setFontColor('#FFFFFF')
        .setFontWeight('bold')
      sheet.setFrozenRows(1)
      currentHeaders = fullHeaders
    }

    // ── Build row in the EXACT header order found on the sheet ────────────
    const row = currentHeaders.map(h => {
      if (h === 'timestamp') return data.timestamp || new Date().toLocaleString()
      return (data[h] !== undefined && data[h] !== null) ? data[h] : ''
    })

    sheet.appendRow(row)
    sheet.autoResizeColumns(1, currentHeaders.length)

    return jsonOut({ status: 'success', sheet: sheetName, row: row })

  } catch (err) {
    // Log the error INTO the sheet itself so failures are never invisible
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet()
      let errSheet = ss.getSheetByName('Errors') || ss.insertSheet('Errors')
      errSheet.appendRow([new Date().toLocaleString(), err.message, e && e.postData ? e.postData.contents : 'no postData'])
    } catch (_) {}

    return jsonOut({ status: 'error', message: err.message })
  }
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}

// Health check + lets you verify the deployment is live and public
function doGet(e) {
  return jsonOut({ status: 'Royal Graphix Sheets API is live', time: new Date().toString() })
}
