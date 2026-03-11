import React from 'react'

function CustomLineItem({ item, index, onChange, onRemove }) {
  const handleField = (field) => (e) => {
    onChange(index, { ...item, [field]: e.target.value })
  }

  return (
    <div
      style={{
        border: '1.5px solid var(--gray-200)',
        borderRadius: 8,
        padding: 16,
        background: 'var(--gray-50)',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Custom Item {index + 1}
        </span>
        <button
          type="button"
          className="btn-danger"
          onClick={() => onRemove(index)}
        >
          Remove
        </button>
      </div>

      <div className="form-row cols-2" style={{ marginBottom: 12 }}>
        <div>
          <label>Service Name *</label>
          <input
            type="text"
            placeholder="e.g. Specialty Haul"
            value={item.name}
            onChange={handleField('name')}
          />
        </div>
        <div>
          <label>Price *</label>
          <input
            type="text"
            placeholder="e.g. $250"
            value={item.price}
            onChange={handleField('price')}
          />
        </div>
      </div>

      <div className="form-row cols-2" style={{ marginBottom: 0 }}>
        <div>
          <label>Note <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
          <input
            type="text"
            placeholder="Additional details…"
            value={item.note}
            onChange={handleField('note')}
          />
        </div>
        <div>
          <label>Price Note <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
          <input
            type="text"
            placeholder="e.g. / load  or  rebate possible"
            value={item.priceNote}
            onChange={handleField('priceNote')}
          />
        </div>
      </div>
    </div>
  )
}

export default function CustomLineItems({ items, onAdd, onChange, onRemove }) {
  return (
    <div className="card">
      <h2 className="section-title">Custom Line Items</h2>

      {items.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 16 }}>
          No custom items yet. Add a line item for any service not in the catalog above.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: items.length > 0 ? 16 : 0 }}>
        {items.map((item, i) => (
          <CustomLineItem
            key={i}
            item={item}
            index={i}
            onChange={onChange}
            onRemove={onRemove}
          />
        ))}
      </div>

      <button
        type="button"
        className="btn-secondary"
        onClick={onAdd}
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Add Custom Line Item
      </button>
    </div>
  )
}
