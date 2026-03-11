# Mashed Waste Company — Quote Generator

Internal web app for building and downloading customer quotes as PDFs.

## Project Structure

```
Quote_generator/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── CustomerInfo.jsx
│   │       ├── ServiceSelector.jsx
│   │       ├── CustomLineItems.jsx
│   │       ├── NotesTerms.jsx
│   │       └── QuotePreview.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/          # Node.js + Express backend
│   ├── src/
│   │   ├── index.js          # Express server + API route
│   │   └── pdfGenerator.js   # PDFKit layout & rendering
│   ├── assets/
│   │   └── logo.jpeg         # ← place your logo here (see below)
│   └── package.json
├── package.json     # Root workspace + concurrently dev script
└── README.md
```

---

## Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **npm 9+** (comes with Node 18)

---

## Setup

### 1. Install dependencies

From the repo root:

```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

Or using the shorthand script:

```bash
npm run install:all
```

### 2. Add the logo

Copy your company logo to:

```
server/assets/logo.jpeg
```

- Format: JPEG (or rename the constant in `server/src/pdfGenerator.js` to match your filename)
- Recommended size: at least 280×112 px (2:1 ratio), will be scaled to 140×56 on the PDF
- If no logo file is found, the PDF will fall back to a text logo automatically — so the app works without it too

---

## Running Locally

Start both frontend and backend with a single command from the repo root:

```bash
npm run dev
```

This runs:
- **Frontend** (Vite dev server) → [http://localhost:5173](http://localhost:5173)
- **Backend** (Express + nodemon) → [http://localhost:3001](http://localhost:3001)

The Vite dev server proxies all `/api/*` requests to the Express backend, so no CORS issues.

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Production Build

```bash
npm run build        # builds client → client/dist/
npm run start        # starts Express server, serves built client
```

Then open [http://localhost:3001](http://localhost:3001).

---

## Using the Tool

1. **Customer Info** — Fill in customer name (required), company name, and address (optional)
2. **Services** — Click any service card to toggle it on/off. Selected items show in the preview panel
3. **Custom Line Items** — Click "Add Custom Line Item" to add a service not in the standard catalog
4. **Notes & Terms** — Pre-filled with standard terms. Edit as needed, or click "Reset to Default"
5. **Quote Preview** — Live summary on the right shows selected services and a "Download PDF Quote" button
6. **Download** — Click the button to generate and immediately download the PDF

---

## API Reference

### `POST /api/generate-quote`

**Request body (JSON):**

```json
{
  "customerInfo": {
    "customerName": "John Smith",
    "companyName": "Acme Corp",
    "address": "123 Main St, City, AL 12345"
  },
  "sections": [
    {
      "category": "Mobile Dumpster Compaction",
      "items": [
        {
          "name": "Mobile Dumpster Compaction",
          "note": "",
          "price": "$90",
          "priceNote": "/ mash"
        }
      ]
    }
  ],
  "notes": "1. All prices are quoted in USD.\n..."
}
```

**Response:** PDF binary (`application/pdf`) with filename `Mashed_Waste_Quote_YYYYMMDD.pdf`

**Quote numbers** are auto-generated as `Q-YYYYMMDD-NNN` (sequential per day, resets on server restart).

---

## PDF Design

- Page size: US Letter (8.5 × 11 in)
- Brand orange: `#E8470A`
- Logo top-left, "QUOTE" label top-right in orange
- Header info row: FROM | DATE ISSUED | VALID UNTIL | QUOTE #
- Section headers: solid orange bar with white text
- Alternating row backgrounds: white / `#F5F5F5`
- Price notes containing "rebate" render in orange; others in gray
- Footer: centered — company name • address • email • phone
