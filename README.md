# Mashed Waste Company Internal Quoting Tool

Full-stack monorepo app for creating quotes and downloading a PDF that follows the Mashed Waste quote design.

## Stack

- `client/`: React + Vite
- `server/`: Node.js + Express + PDFKit
- npm workspaces at root

## Project Structure

```txt
/client   React UI for quote builder
/server   API + PDF generation
```

## Setup

1. Install dependencies from repo root:

```bash
npm install
npm install --workspace=client
npm install --workspace=server
```

2. Add company logo file:

```txt
server/assets/logo.jpeg
```

The PDF generator loads this image at the top-left of the quote.

## Run locally

```bash
npm run dev
```

- Client: `http://localhost:5199`
- Server API: `http://localhost:3001`

## Build / production run

```bash
npm run build
npm run start
```

## API

### `POST /api/generate-quote`

Request body:

```json
{
  "customerInfo": {
    "customerName": "Jane Doe",
    "companyName": "Acme",
    "address": "123 Main St",
    "repId": "rep-jacob-jones",
    "rep": {
      "name": "Jacob Jones",
      "email": "jacob@mashedco.com",
      "phone": "615-972-8323"
    }
  },
  "sections": [
    {
      "category": "Roll-Off Dumpsters",
      "items": [
        {
          "name": "40-Yard Roll-Off Dumpster - C&D",
          "note": "4 tons included",
          "price": "$650",
          "priceNote": "/ swap"
        }
      ]
    }
  ],
  "notes": "All prices are quoted in USD.\nThis quote is valid for 30 days from the date of issue."
}
```

Response:
- Binary PDF file download
- Filename: `Mashed_Waste_Quote_YYYYMMDD.pdf`

## Included functionality

- Customer info capture
- Rep selector with default Jacob Jones rep and admin add-rep controls
- Service catalog with toggles, editable pricing/notes, roll-off waste type selector, and flat-rate vs haul+tonnage toggle
- Custom line items
- Editable notes/terms defaults
- Quote preview panel
- PDF rendering on backend with:
  - `#E8470A` primary orange
  - logo top-left
  - QUOTE heading top-right
  - quote metadata row
  - section headers + alternating service row backgrounds
  - orange rebate price-note highlight
  - centered footer line
