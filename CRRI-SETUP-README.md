# CRRI — Setup Guide

## What you're deploying

| File | Purpose |
|------|---------|
| `crri-google-sheets-form.html` | Standalone form athletes fill in. Submits data to your Google Sheet. |
| `crri-climbing-recovery.jsx` | Full React app with History tab and score graph (for Vercel/Netlify). |

---

## Part 1 — Google Sheets setup (15 minutes)

### Step 1: Create the Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new sheet
2. Name it **CRRI Athlete Data**
3. In Row 1, add these headers exactly (one per column, A through AQ):

```
Timestamp | Athlete Name | Session Type | Duration | Intensity | Limit Attempts | Finger Type | Age | Sleep Before Midnight | Water (L) | Post Meal | Protein | Nap | Walk | Cold Shower | Stretch | Recovery Credits | Training Load | Recovery Balance | Finger Stiff | Finger Fist | Finger Crimp | Finger Hang | Finger Worst | Forearm Sore | Forearm Tight | Forearm Pump | Skin | Motivation | Explosive | Energy | Focus | Sleep Quality | Stress | Finger Readiness % | Forearm Readiness % | Skin Readiness % | CNS Readiness % | General Readiness % | Composite Score | Injury Risk | Recommendation
```

### Step 2: Create the Apps Script

1. In your Sheet, click **Extensions → Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp,
    data.athleteName,
    data.sessionType,
    data.duration,
    data.intensity,
    data.limitAttempts,
    data.fingerType,
    data.age,
    data.sleepBefore,
    data.water,
    data.postMeal ? "Yes" : "No",
    data.protein ? "Yes" : "No",
    data.nap ? "Yes" : "No",
    data.walk ? "Yes" : "No",
    data.coldShower ? "Yes" : "No",
    data.stretch ? "Yes" : "No",
    data.recoveryCredits,
    data.trainingLoad,
    data.recoveryBalance,
    data.fingerStiff,
    data.fingerFist,
    data.fingerCrimp,
    data.fingerHang,
    data.fingerWorst,
    data.forearmSore,
    data.forearmTight,
    data.forearmPump,
    data.skin,
    data.motivation,
    data.explosive,
    data.energy,
    data.focus,
    data.sleepQuality,
    data.stress,
    data.fingerReadiness,
    data.forearmReadiness,
    data.skinReadiness,
    data.cnsReadiness,
    data.generalReadiness,
    data.compositeScore,
    data.injuryRisk,
    data.recommendation,
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (give the project any name, e.g. "CRRI")

### Step 3: Deploy as a Web App

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Type" and select **Web app**
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. Click **Authorize access** and follow the prompts (you'll need to click "Advanced → Go to [project name]" the first time)
6. Copy the **Web app URL** — it looks like:
   `https://script.google.com/macros/s/ABC123.../exec`

### Step 4: Paste the URL into the HTML

Open `crri-google-sheets-form.html` in any text editor and find this line near the top:

```javascript
const SHEETS_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
```

Replace the placeholder with your URL:

```javascript
const SHEETS_URL = "https://script.google.com/macros/s/ABC123.../exec";
```

Save the file.

---

## Part 2 — GitHub Pages (5 minutes)

This makes the form available at a free public URL like `https://youracademy.github.io/crri/`

1. Go to [github.com](https://github.com) and create a free account if you don't have one
2. Click **New repository**
   - Name it `crri` (or anything you like)
   - Set it to **Public**
   - Tick **Add a README file**
   - Click **Create repository**
3. Click **Add file → Upload files**
4. Drag `crri-google-sheets-form.html` into the upload area
5. **Rename the file to `index.html`** before uploading (this makes it the default page)
6. Click **Commit changes**
7. Go to **Settings → Pages**
8. Under **Source**, select **Deploy from a branch → main → / (root)**
9. Click **Save**

After about 60 seconds, your form is live at:
`https://[your-github-username].github.io/crri/`

Send that link to your athletes.

---

## Part 3 — Viewing athlete data as a coach

Every time an athlete submits the form, a new row appears in your Google Sheet in real time.

**Recommended setup:**
- Freeze Row 1 (headers) so they stay visible when scrolling
- Use **View → Freeze → 1 row**
- You can filter by athlete name, sort by composite score, or use conditional formatting to colour the score column green/yellow/orange/red

**To get a morning dashboard view:**
- In a new tab in the same sheet, use `=QUERY()` formulas to pull today's submissions
- Or simply sort by the Timestamp column descending

---

## Optional: Add to phone home screen

Athletes can bookmark the GitHub Pages URL and add it to their home screen:

**iPhone:** Safari → Share → Add to Home Screen
**Android:** Chrome → three dots → Add to Home Screen

It will open full-screen like a native app.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Form says "Could not save" | Check your Apps Script URL is correct and the deployment is set to "Anyone" |
| No data appearing in Sheet | Re-deploy the Apps Script (Deploy → Manage deployments → Edit → Save new version) |
| GitHub Pages not loading | Wait 2–3 minutes after first deploy; check Settings → Pages for the URL |
| Athletes can't access the form | Make sure the GitHub repo is set to Public |

---

## Questions?

The Google Sheets integration uses `no-cors` mode which means the form can't confirm receipt — it fires and forgets. The "✓ Saved" confirmation assumes success. If data isn't appearing, the Apps Script deployment permissions are almost always the cause.
