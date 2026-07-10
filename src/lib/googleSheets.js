// ─────────────────────────────────────────────────────────────
// Google Sheets Integration
// All form submissions are sent here via Apps Script Web App
//
// SETUP INSTRUCTIONS:
// 1. Go to https://sheets.google.com → create a new sheet
//    Name it: "Royal Graphix Submissions"
//
// 2. In the sheet, go to Extensions → Apps Script
//    Paste the script from /scripts/google-apps-script.js
//    Click Deploy → New Deployment → Web App
//    Set "Execute as: Me" and "Who has access: Anyone"
//    Copy the Web App URL
//
// 3. Add to your .env file:
//    VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_ID/exec
//
// 4. TEST IT: paste the URL directly into your browser.
//    You should see: {"status":"Royal Graphix Sheets API is live"}
//
// ── IMPORTANT TECHNICAL NOTE ──────────────────────────────────
// Google Apps Script Web Apps respond to requests with an HTTP
// redirect (302) to script.googleusercontent.com before running
// your code. Browsers do NOT reliably forward a POST body through
// that redirect with normal CORS fetch — the request can silently
// turn into a GET with no body, which makes Apps Script run doGet()
// instead of doPost(), and doGet() returns a "success-looking"
// health-check response even though NOTHING was written to the
// sheet. This is why submissions could appear to work but never
// show up as new rows.
//
// THE FIX: we send the request in 'no-cors' mode as the PRIMARY
// method. This is the officially documented way Apps Script Web
// Apps expect to be called from a browser — it reliably preserves
// the POST body through the redirect, so doPost() actually runs.
// The trade-off is we cannot read the response (opaque response),
// so we cannot 100% confirm success from JS alone. To verify
// delivery, check the "Errors" tab that auto-appears in your sheet
// if anything goes wrong server-side.
// ─────────────────────────────────────────────────────────────

const SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL

/**
 * Submit any form data to Google Sheets
 * @param {string} sheet - Sheet tab name e.g. "Contacts"
 * @param {object} data  - Form fields as key/value pairs
 * @returns {{ success: boolean, error: string|null }}
 */
export async function submitToGoogleSheets(sheet, data) {
  if (!SHEETS_URL) {
    console.warn('[Sheets] VITE_GOOGLE_SHEETS_URL not set in .env — skipping Google Sheets submission')
    return { success: false, error: 'Google Sheets not configured' }
  }

  const payload = {
    sheet,
    timestamp: new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }),
    ...data,
  }

  // ── Primary method: no-cors POST ───────────────────────────────────────
  // This reliably preserves the POST body through Apps Script's redirect.
  // We use a FormData/text body (not JSON content-type) to avoid a CORS
  // preflight request, which Apps Script Web Apps do not handle.
  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
    console.log('[Sheets] Submission sent (no-cors — response not readable, this is expected and normal)')
    return { success: true, error: null, unverified: true }
  } catch (err) {
    console.error('[Sheets] no-cors submission failed:', err.message)
  }

  // ── Fallback: readable fetch (only works if Apps Script CORS allows it,
  // rare, but worth trying if no-cors somehow threw a network error) ─────
  try {
    const response = await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
    if (response.ok) {
      const result = await response.json().catch(() => null)
      if (result?.status === 'success') {
        console.log('[Sheets] Confirmed success via readable fetch')
        return { success: true, error: null }
      }
      console.warn('[Sheets] Readable fetch returned unexpected response:', result)
      return { success: false, error: result?.message || 'Unexpected response from Apps Script' }
    }
    return { success: false, error: `HTTP ${response.status}` }
  } catch (fallbackErr) {
    console.error('[Sheets] Both submission attempts failed:', fallbackErr.message)
    return { success: false, error: fallbackErr.message }
  }
}
