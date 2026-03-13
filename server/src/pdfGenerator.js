const PDFDocument = require('pdfkit')
const path = require('path')
const fs = require('fs')

const ORANGE = '#E8470A'
const GRAY = '#888888'
const DARK = '#222222'
const LIGHT_ROW = '#F5F5F5'

const COMPANY = {
  name: 'Mashed Waste Company',
  address: '1236 Cullman Shopping Center NW, Cullman, AL 35055',
  email: 'jacob@mashedco.com',
  phone: '615-972-8323',
}

const LOGO_PATH = path.join(__dirname, '../assets/logo.jpeg')

const fmtDate = (date) =>
  date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

function generateQuotePdf({ quoteNumber, dateIssued, validUntil, customerInfo, sections, notes }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'LETTER', margin: 54 })
    const parts = []
    doc.on('data', (chunk) => parts.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(parts)))
    doc.on('error', reject)

    const width = doc.page.width - 108
    const left = 54
    const right = left + width

    if (fs.existsSync(LOGO_PATH)) {
      doc.image(LOGO_PATH, left, 52, { fit: [270, 90] })
    }

    doc.fillColor(ORANGE).font('Helvetica-Bold').fontSize(58).text('QUOTE', 0, 56, { align: 'right' })
    doc.fillColor(GRAY).fontSize(18).text(`#${quoteNumber}`, 0, 122, { align: 'right' })

    const dividerY = 174
    doc.moveTo(left, dividerY).lineTo(right, dividerY).lineWidth(2).strokeColor(ORANGE).stroke()

    const cols = [left, left + width * 0.40, left + width * 0.60, left + width * 0.80]
    const rowTop = dividerY + 18

    drawLabel(doc, 'FROM', cols[0], rowTop)
    drawLabel(doc, 'DATE ISSUED', cols[1], rowTop)
    drawLabel(doc, 'VALID UNTIL', cols[2], rowTop)
    drawLabel(doc, 'QUOTE #', cols[3], rowTop)

    const rep = customerInfo.rep || { name: 'Jacob Jones', email: COMPANY.email, phone: COMPANY.phone }

    doc.font('Helvetica-Bold').fontSize(12).fillColor(DARK).text(rep.name, cols[0], rowTop + 24)
    doc.font('Helvetica').text(COMPANY.name, cols[0], rowTop + 42)
    doc.text(COMPANY.address, cols[0], rowTop + 60, { width: width * 0.38 })
    doc.text(rep.email, cols[0], rowTop + 92)
    doc.text(rep.phone, cols[0], rowTop + 110)

    doc.font('Helvetica').fillColor(DARK).fontSize(14).text(fmtDate(dateIssued), cols[1], rowTop + 24)
    doc.text(fmtDate(validUntil), cols[2], rowTop + 24)
    doc.text(quoteNumber, cols[3], rowTop + 24)

    let y = rowTop + 160

    for (const section of sections) {
      y = ensurePage(doc, y, 90)
      drawSectionHeader(doc, section.category.toUpperCase(), left, y, width)
      y += 35

      doc.fontSize(12).font('Helvetica-Bold').fillColor(DARK)
      doc.text('SERVICE', left + 12, y)
      doc.text('PRICING', right - 110, y, { width: 90, align: 'right' })
      y += 26
      doc.moveTo(left, y).lineTo(right, y).strokeColor('#DDDDDD').lineWidth(1).stroke()
      y += 8

      section.items.forEach((item, index) => {
        const baseHeight = item.note ? 56 : 42
        y = ensurePage(doc, y, baseHeight + 12)
        if (index % 2 === 1) {
          doc.rect(left, y - 4, width, baseHeight).fill(LIGHT_ROW)
        }

        doc.fillColor(DARK).font('Helvetica-Bold').fontSize(16).text(item.name, left + 12, y + 6, { width: width - 180 })
        doc.text(item.price, right - 140, y + 6, { width: 128, align: 'right' })

        if (item.note) {
          doc.font('Helvetica').fontSize(11).fillColor(GRAY).text(item.note, left + 12, y + 28, { width: width - 180 })
        }

        if (item.priceNote) {
          const priceNoteColor = /rebate/i.test(item.priceNote) ? ORANGE : GRAY
          doc.font('Helvetica').fontSize(11).fillColor(priceNoteColor).text(item.priceNote, right - 140, y + 30, { width: 128, align: 'right' })
        }

        y += baseHeight
      })

      y += 12
    }

    y = ensurePage(doc, y, 130)
    drawSectionHeader(doc, 'NOTES & TERMS', left, y, width)
    y += 36

    notes
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        y = ensurePage(doc, y, 18)
        doc.fillColor(DARK).font('Helvetica').fontSize(11).text('•', left + 6, y)
        doc.text(line, left + 24, y, { width: width - 24 })
        y += 24
      })

    const footer = `${COMPANY.name} • ${COMPANY.address} • ${COMPANY.email} • ${COMPANY.phone}`
    const footerY = doc.page.height - 42
    doc.moveTo(left, footerY - 10).lineTo(right, footerY - 10).strokeColor('#D9D9D9').stroke()
    doc.font('Helvetica').fontSize(10).fillColor(GRAY).text(footer, left, footerY, { width, align: 'center' })

    doc.end()
  })
}

function drawLabel(doc, label, x, y) {
  doc.font('Helvetica-Bold').fontSize(13).fillColor(ORANGE).text(label, x, y)
}

function drawSectionHeader(doc, label, x, y, width) {
  doc.rect(x, y, width, 28).fill(ORANGE)
  doc.font('Helvetica-Bold').fontSize(12).fillColor('white').text(label, x + 12, y + 8)
}

function ensurePage(doc, y, requiredHeight) {
  if (y + requiredHeight > doc.page.height - 70) {
    doc.addPage()
    return 54
  }
  return y
}

module.exports = { generateQuotePdf }
