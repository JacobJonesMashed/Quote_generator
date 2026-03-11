import React from 'react'
import { CATALOG } from './ServiceSelector.jsx'

const SERVICE_MAP = {}
CATALOG.forEach((cat) => {
  cat.services.forEach((svc) => {
    SERVICE_MAP[svc.id] = { ...svc, category: cat.category }
  })
})

export default function QuotePreview({ customerInfo, selectedServices, customItems, notes, onGenerate, isGenerating }) {
  const hasCustomer = customerInfo.customerName.trim()
  const hasServices = selectedServices.length > 0 || customItems.some((i) => i.name.trim())
  const canGenerate = hasCustomer && hasServices

  const resolvedServices = selectedServices.map((id) => SERVICE_MAP[id]).filter(Boolean)
  const validCustomItems = customItems.filter((i) => i.name.trim())

  const allItems = [...resolvedServices, ...validCustomItems]

  return (
    <div
      className="card"
      style={{
        border: '2px solid var(--orange)',
        position: 'sticky',
        top: 24,
      }}
    >
      <h2 className="section-title">Quote Preview</h2>

      {/* Customer */}
      <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--gray-200)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-400)', marginBottom: 4 }}>
          Bill To
        </div>
        {hasCustomer ? (
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{customerInfo.customerName}</div>
            {customerInfo.companyName && (
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{customerInfo.companyName}</div>
            )}
            {customerInfo.address && (
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{customerInfo.address}</div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: 'var(--gray-400)', fontStyle: 'italic' }}>Enter customer name to begin</div>
        )}
      </div>

      {/* Items */}
      <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--gray-200)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-400)', marginBottom: 8 }}>
          Services ({allItems.length})
        </div>
        {allItems.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--gray-400)', fontStyle: 'italic' }}>No services selected</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {allItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: 8,
                  padding: '6px 10px',
                  background: i % 2 === 0 ? 'white' : 'var(--gray-50)',
                  borderRadius: 4,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--orange)', whiteSpace: 'nowrap' }}>
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes snippet */}
      {notes.trim() && (
        <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--gray-200)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-400)', marginBottom: 4 }}>
            Notes & Terms
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.6 }}>
            {notes.trim().split('\n').slice(0, 3).join('\n')}
            {notes.trim().split('\n').length > 3 && (
              <span style={{ color: 'var(--gray-400)' }}> …and {notes.trim().split('\n').length - 3} more</span>
            )}
          </div>
        </div>
      )}

      {/* Validation warnings */}
      {!hasCustomer && (
        <div style={{ fontSize: 12, color: '#b45309', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 6, padding: '8px 12px', marginBottom: 12 }}>
          Customer name is required to generate a quote.
        </div>
      )}
      {hasCustomer && !hasServices && (
        <div style={{ fontSize: 12, color: '#b45309', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 6, padding: '8px 12px', marginBottom: 12 }}>
          Select at least one service.
        </div>
      )}

      {/* Generate button */}
      <button
        type="button"
        className="btn-primary"
        onClick={onGenerate}
        disabled={!canGenerate || isGenerating}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        {isGenerating ? (
          <>
            <Spinner />
            Generating PDF…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 10V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V10M8 2V11M8 11L5 8M8 11L11 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download PDF Quote
          </>
        )}
      </button>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="8" cy="8" r="6" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
      <path d="M14 8A6 6 0 018 2" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
