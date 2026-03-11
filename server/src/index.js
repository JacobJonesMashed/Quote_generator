const express = require('express')
const cors = require('cors')
const path = require('path')
const { generateQuotePdf } = require('./pdfGenerator')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// ── In-memory quote counter per day ──────────────────────────────────────────
const dailyCounters = {}

function getNextQuoteNumber() {
  const today = new Date()
  const pad = (n, len = 2) => String(n).padStart(len, '0')
  const dateKey =
    today.getFullYear().toString() +
    pad(today.getMonth() + 1) +
    pad(today.getDate())

  if (!dailyCounters[dateKey]) {
    dailyCounters[dateKey] = 0
  }
  dailyCounters[dateKey] += 1

  return `Q-${dateKey}-${pad(dailyCounters[dateKey], 3)}`
}

// ── API endpoint ──────────────────────────────────────────────────────────────
app.post('/api/generate-quote', async (req, res) => {
  try {
    const { customerInfo, sections, notes } = req.body

    if (!customerInfo || !customerInfo.customerName) {
      return res.status(400).json({ error: 'customerInfo.customerName is required' })
    }

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ error: 'sections array is required and must not be empty' })
    }

    const quoteNumber = getNextQuoteNumber()
    const today = new Date()
    const validUntil = new Date(today)
    validUntil.setDate(validUntil.getDate() + 30)

    const quoteData = {
      quoteNumber,
      dateIssued: today,
      validUntil,
      customerInfo,
      sections,
      notes: notes || '',
    }

    const pdfBuffer = await generateQuotePdf(quoteData)

    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Mashed_Waste_Quote_${dateStr}.pdf"`,
      'Content-Length': pdfBuffer.length,
    })
    res.end(pdfBuffer)
  } catch (err) {
    console.error('PDF generation error:', err)
    res.status(500).json({ error: 'Failed to generate PDF', detail: err.message })
  }
})

// ── Serve built client in production ─────────────────────────────────────────
const clientDist = path.join(__dirname, '../../client/dist')
app.use(express.static(clientDist))
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`\n  Mashed Waste Quote Server running at http://localhost:${PORT}\n`)
})
