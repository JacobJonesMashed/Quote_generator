import React from 'react'

export default function QuotePreview({
  customerInfo,
  sections,
  notes,
  onGenerate,
  isGenerating,
  error,
}) {
  const hasCustomer = Boolean(customerInfo.customerName.trim())
  const count = sections.reduce((acc, section) => acc + section.items.length, 0)
  const canGenerate = hasCustomer && count > 0

  return (
    <div className="card" style={{ position: 'sticky', top: 80 }}>
      <h2 className="section-title">Quote Preview</h2>
      <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 12 }}>
        <div><strong>Customer:</strong> {customerInfo.customerName || '—'}</div>
        <div><strong>Company:</strong> {customerInfo.companyName || '—'}</div>
      </div>

      <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 10, marginBottom: 12 }}>
        {sections.map((section) => (
          <div key={section.category} style={{ marginBottom: 10 }}>
            <div className="subheading" style={{ marginBottom: 6 }}>{section.category}</div>
            {section.items.map((item, idx) => (
              <div key={`${section.category}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>{item.name}</span>
                <strong>{item.price}</strong>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 12 }}>
        Notes lines: {notes.split('\n').filter((line) => line.trim()).length}
      </div>

      {error && <div style={{ color: '#b91c1c', marginBottom: 8, fontSize: 12 }}>{error}</div>}

      <button className="btn-primary" disabled={!canGenerate || isGenerating} onClick={onGenerate} style={{ width: '100%' }}>
        {isGenerating ? 'Generating PDF...' : 'Generate Quote PDF'}
      </button>
    </div>
  )
}
