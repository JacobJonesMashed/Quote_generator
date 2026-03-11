const PDFDocument = require('pdfkit')
const path = require('path')
const fs = require('fs')

// ── Brand constants ───────────────────────────────────────────────────────────
const ORANGE = '#E8470A'
const GRAY_LABEL = '#888888'
const GRAY_DARK = '#374151'
const GRAY_ROW = '#F5F5F5'
const WHITE = '#FFFFFF'

const COMPANY = {
  name: 'Mashed Waste Company',
  sender: 'Jacob Jones',
  address: '1236 Cullman Shopping Center NW, Cullman, AL 35055',
  email: 'jacob@mashedco.com',
  phone: '615-972-8323',
}

const LOGO_PATH = path.join(__dirname, '../assets/logo.jpeg')

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Generates the quote PDF and resolves with a Buffer.
 */
function generateQuotePdf(quoteData) {
  return new Promise((resolve, reject) => {
    try {
      const { quoteNumber, dateIssued, validUntil, customerInfo, sections, notes } = quoteData

      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 48, bottom: 48, left: 48, right: 48 },
        info: {
          Title: `Mashed Waste Quote ${quoteNumber}`,
          Author: COMPANY.sender,
        },
      })

      const chunks = []
      doc.on('data', (c) => chunks.push(c))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      const pageW = doc.page.width
      const pageH = doc.page.height
      const marginL = 48
      const marginR = 48
      const contentW = pageW - marginL - marginR

      // ── HEADER ──────────────────────────────────────────────────────────────
      // Logo (top-left) — load only if file exists
      const logoExists = fs.existsSync(LOGO_PATH)
      const logoH = 56
      const logoW = 140

      if (logoExists) {
        doc.image(LOGO_PATH, marginL, 40, { height: logoH, fit: [logoW, logoH] })
      } else {
        // Fallback text logo
        doc
          .fontSize(22)
          .font('Helvetica-Bold')
          .fillColor(ORANGE)
          .text(COMPANY.name, marginL, 48, { width: logoW })
      }

      // "QUOTE" label — top-right
      const quoteHeaderRight = pageW - marginR
      doc
        .fontSize(42)
        .font('Helvetica-Bold')
        .fillColor(ORANGE)
        .text('QUOTE', 0, 36, { align: 'right', width: quoteHeaderRight })

      // Quote number below label
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor(GRAY_LABEL)
        .text(quoteNumber, 0, 86, { align: 'right', width: quoteHeaderRight })

      // ── HEADER INFO ROW ──────────────────────────────────────────────────────
      const headerRowY = 118
      const colW = contentW / 4
      const headerCols = [
        { label: 'FROM', value: `${COMPANY.sender}\n${COMPANY.name}` },
        { label: 'DATE ISSUED', value: formatDate(dateIssued) },
        { label: 'VALID UNTIL', value: formatDate(validUntil) },
        { label: 'QUOTE #', value: quoteNumber },
      ]

      // Orange rule line beneath header row labels
      const ruleY = headerRowY + 14
      doc
        .moveTo(marginL, ruleY)
        .lineTo(marginL + contentW, ruleY)
        .strokeColor(ORANGE)
        .lineWidth(1.5)
        .stroke()

      headerCols.forEach((col, i) => {
        const x = marginL + i * colW
        doc
          .fontSize(8)
          .font('Helvetica-Bold')
          .fillColor(ORANGE)
          .text(col.label, x, headerRowY, { width: colW - 4 })

        doc
          .fontSize(9.5)
          .font('Helvetica')
          .fillColor(GRAY_DARK)
          .text(col.value, x, ruleY + 5, { width: colW - 4, lineGap: 1 })
      })

      // ── BILL TO ──────────────────────────────────────────────────────────────
      let curY = headerRowY + 52

      // Add a little extra if FROM has 2 lines
      curY = Math.max(curY, doc.y + 4)

      drawSectionHeader(doc, 'BILL TO', marginL, curY, contentW)
      curY += 22

      const { customerName, companyName, address } = customerInfo
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor(GRAY_DARK)
        .text(customerName, marginL, curY)
      curY += 14

      if (companyName) {
        doc.fontSize(10).font('Helvetica').fillColor(GRAY_DARK).text(companyName, marginL, curY)
        curY += 13
      }
      if (address) {
        doc.fontSize(10).font('Helvetica').fillColor(GRAY_LABEL).text(address, marginL, curY)
        curY += 13
      }

      curY += 12

      // ── SERVICE SECTIONS ─────────────────────────────────────────────────────
      sections.forEach((section) => {
        drawSectionHeader(doc, section.category.toUpperCase(), marginL, curY, contentW)
        curY += 22

        section.items.forEach((item, rowIdx) => {
          const rowBg = rowIdx % 2 === 0 ? WHITE : GRAY_ROW
          const rowH = estimateRowHeight(doc, item, contentW)

          // Page break if needed (leave room for footer)
          if (curY + rowH > pageH - 80) {
            doc.addPage()
            curY = 48
          }

          // Row background
          doc.rect(marginL, curY, contentW, rowH).fill(rowBg)

          const priceColW = 130
          const nameColW = contentW - priceColW - 8

          // Service name (bold)
          doc
            .fontSize(10)
            .font('Helvetica-Bold')
            .fillColor(GRAY_DARK)
            .text(item.name, marginL + 8, curY + 8, { width: nameColW, lineGap: 0 })

          const nameBottom = doc.y

          // Note (gray subtext below name)
          if (item.note) {
            doc
              .fontSize(8.5)
              .font('Helvetica')
              .fillColor(GRAY_LABEL)
              .text(item.note, marginL + 8, nameBottom + 2, { width: nameColW, lineGap: 1 })
          }

          // Price (bold, right-aligned)
          doc
            .fontSize(11)
            .font('Helvetica-Bold')
            .fillColor(GRAY_DARK)
            .text(item.price, marginL + nameColW, curY + 7, {
              width: priceColW,
              align: 'right',
            })

          // Price note (colored: rebate → orange, else gray)
          if (item.priceNote) {
            const isRebate = /rebate/i.test(item.priceNote)
            doc
              .fontSize(8)
              .font('Helvetica')
              .fillColor(isRebate ? ORANGE : GRAY_LABEL)
              .text(item.priceNote, marginL + nameColW, curY + 21, {
                width: priceColW,
                align: 'right',
              })
          }

          curY += rowH
        })

        curY += 10 // gap between sections
      })

      // ── NOTES & TERMS ────────────────────────────────────────────────────────
      if (notes && notes.trim()) {
        // Page break if needed
        if (curY + 80 > pageH - 80) {
          doc.addPage()
          curY = 48
        }

        curY += 4
        drawSectionHeader(doc, 'NOTES & TERMS', marginL, curY, contentW)
        curY += 22

        const noteLines = notes.trim().split('\n').filter((l) => l.trim())
        noteLines.forEach((line) => {
          if (curY + 16 > pageH - 72) {
            doc.addPage()
            curY = 48
          }
          doc
            .fontSize(9)
            .font('Helvetica')
            .fillColor(GRAY_DARK)
            .text(line, marginL + 8, curY, { width: contentW - 16, lineGap: 1 })
          curY = doc.y + 3
        })
      }

      // ── FOOTER ───────────────────────────────────────────────────────────────
      drawFooter(doc, pageW, pageH, marginL)

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}

// ── Drawing helpers ───────────────────────────────────────────────────────────

function drawSectionHeader(doc, text, x, y, width) {
  doc.rect(x, y, width, 20).fill(ORANGE)
  doc
    .fontSize(9)
    .font('Helvetica-Bold')
    .fillColor(WHITE)
    .text(text, x + 8, y + 6, { width: width - 16, lineGap: 0 })
}

function drawFooter(doc, pageW, pageH, marginL) {
  const footerY = pageH - 38
  const footerText = `${COMPANY.name}  •  ${COMPANY.address}  •  ${COMPANY.email}  •  ${COMPANY.phone}`

  doc
    .moveTo(marginL, footerY - 6)
    .lineTo(pageW - marginL, footerY - 6)
    .strokeColor(GRAY_ROW)
    .lineWidth(1)
    .stroke()

  doc
    .fontSize(8)
    .font('Helvetica')
    .fillColor(GRAY_LABEL)
    .text(footerText, 0, footerY, { align: 'center', width: pageW })
}

/**
 * Estimates the height of a service row so we can draw the background rect
 * before drawing text. Adds padding so the row never feels cramped.
 */
function estimateRowHeight(doc, item, contentW) {
  const priceColW = 130
  const nameColW = contentW - priceColW - 8

  // Rough estimate: bold name (10pt) + optional note (8.5pt)
  const nameLines = Math.ceil((item.name.length * 5.5) / nameColW) || 1
  const noteLines = item.note
    ? Math.ceil((item.note.length * 4.5) / nameColW) || 1
    : 0

  const nameHeight = nameLines * 13
  const noteHeight = noteLines * 11
  const baseHeight = nameHeight + noteHeight + 20 // 10px top + 10px bottom padding

  return Math.max(baseHeight, 34) // minimum row height
}

module.exports = { generateQuotePdf }
