import React from 'react'

const CATALOG = [
  {
    category: 'Mobile Dumpster Compaction',
    services: [
      {
        id: 'mobile_compaction',
        name: 'Mobile Dumpster Compaction',
        note: '',
        price: '$90',
        priceNote: '/ mash',
      },
    ],
  },
  {
    category: 'Roll-Off Dumpsters',
    services: [
      {
        id: 'rolloff_general',
        name: '40-Yard Roll-Off Dumpster — General Waste',
        note: '4 tons included per swap. $105/ton over included weight.',
        price: '$650',
        priceNote: '/ swap  +$105/ton over',
      },
      {
        id: 'rolloff_metal',
        name: '40-Yard Roll-Off Dumpster — Metal Only',
        note: '$100/ton rebate available on metal loads.',
        price: '$350',
        priceNote: '/ swap  $100/ton rebate',
      },
    ],
  },
  {
    category: 'Compactors',
    services: [
      {
        id: 'compactor_2yd',
        name: '2-Yard Compactor Rental',
        note: 'Includes delivery, installation, and all maintenance & service costs for general wear and tear. Monthly rate based on a 5-year (60-month) service term.',
        price: '$485',
        priceNote: '/ mo  60-mo term',
      },
      {
        id: 'compactor_3yd',
        name: '3-Yard Compactor Rental',
        note: 'Includes delivery, installation, and all maintenance & service costs for general wear and tear. Monthly rate based on a 5-year (60-month) service term.',
        price: '$595',
        priceNote: '/ mo  60-mo term',
      },
      {
        id: 'receiver_box',
        name: 'Receiver Box Rental',
        note: 'Monthly rate based on a 5-year (60-month) service term.',
        price: '$270',
        priceNote: '/ mo  60-mo term',
      },
      {
        id: 'compactor_swap_general',
        name: 'Compactor Swap — General Waste',
        note: 'Per-swap charge plus weight fees.',
        price: '$300',
        priceNote: '/ swap  +$105/ton',
      },
      {
        id: 'compactor_swap_cardboard',
        name: 'Compactor Swap — Cardboard',
        note: 'No weight fees. Rebate may be available depending on volume.',
        price: '$300',
        priceNote: '/ swap  Rebate possible',
      },
    ],
  },
]

export { CATALOG }

const inputStyle = {
  width: '100%',
  padding: '5px 8px',
  borderRadius: 4,
  border: '1px solid var(--gray-300)',
  fontSize: 13,
  color: 'var(--gray-900)',
  background: 'white',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--gray-500)',
  marginBottom: 3,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

export default function ServiceSelector({ selected, onToggle, overrides = {}, onUpdateOverride }) {
  return (
    <div className="card">
      <h2 className="section-title">Services</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {CATALOG.map((cat) => {
          const isRolloff = cat.category === 'Roll-Off Dumpsters'
          return (
            <div key={cat.category}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--gray-500)',
                  marginBottom: 8,
                }}
              >
                {cat.category}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cat.services.map((svc) => {
                  const isOn = selected.includes(svc.id)
                  const override = overrides[svc.id] || {}

                  // Precompute rolloff catalog defaults
                  let rolloffDefaults = null
                  if (isRolloff) {
                    const swapPrice = svc.price.replace(/[^0-9.]/g, '')
                    const perTonMatch = svc.priceNote.match(/\$(\d+)\/ton/)
                    rolloffDefaults = {
                      swapPrice,
                      perTonPrice: perTonMatch ? perTonMatch[1] : '',
                    }
                  }

                  // Effective display values for the button header
                  let displayPrice, displayPriceNote
                  if (isRolloff && rolloffDefaults) {
                    const swapPrice = override.swapPrice ?? rolloffDefaults.swapPrice
                    const perTonPrice = override.perTonPrice ?? rolloffDefaults.perTonPrice
                    displayPrice = `$${swapPrice}`
                    displayPriceNote =
                      svc.id === 'rolloff_metal'
                        ? perTonPrice
                          ? `/ swap  $${perTonPrice}/ton rebate`
                          : '/ swap'
                        : perTonPrice
                        ? `/ swap  +$${perTonPrice}/ton over`
                        : '/ swap'
                  } else {
                    displayPrice = override.price ?? svc.price
                    displayPriceNote = override.priceNote ?? svc.priceNote
                  }
                  const displayName = override.name ?? svc.name
                  const displayNote = override.note ?? svc.note

                  return (
                    <div key={svc.id}>
                      {/* Toggle button */}
                      <button
                        type="button"
                        onClick={() => onToggle(svc.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          padding: '12px 14px',
                          borderRadius: isOn ? '6px 6px 0 0' : 6,
                          borderTop: `1.5px solid ${isOn ? 'var(--orange)' : 'var(--gray-200)'}`,
                          borderLeft: `1.5px solid ${isOn ? 'var(--orange)' : 'var(--gray-200)'}`,
                          borderRight: `1.5px solid ${isOn ? 'var(--orange)' : 'var(--gray-200)'}`,
                          borderBottom: isOn ? 'none' : `1.5px solid var(--gray-200)`,
                          background: isOn ? 'var(--orange-light)' : 'white',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          width: '100%',
                        }}
                      >
                        {/* Toggle indicator */}
                        <div
                          style={{
                            flexShrink: 0,
                            marginTop: 2,
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            border: isOn ? '2px solid var(--orange)' : '2px solid var(--gray-300)',
                            background: isOn ? 'var(--orange)' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isOn && (
                            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                              <path
                                d="M1 4L4 7L10 1"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'baseline',
                              gap: 8,
                            }}
                          >
                            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--gray-900)' }}>
                              {displayName}
                            </span>
                            <span
                              style={{
                                fontWeight: 700,
                                fontSize: 14,
                                color: 'var(--orange)',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                              }}
                            >
                              {displayPrice}
                              <span
                                style={{ fontWeight: 500, fontSize: 12, color: 'var(--gray-500)', marginLeft: 3 }}
                              >
                                {displayPriceNote}
                              </span>
                            </span>
                          </div>
                          {displayNote && (
                            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 3 }}>
                              {displayNote}
                            </div>
                          )}
                        </div>
                      </button>

                      {/* Inline edit panel — shown when service is selected */}
                      {isOn && (
                        <div
                          style={{
                            padding: '12px 14px',
                            borderRadius: '0 0 6px 6px',
                            borderLeft: '1.5px solid var(--orange)',
                            borderRight: '1.5px solid var(--orange)',
                            borderBottom: '1.5px solid var(--orange)',
                            background: 'white',
                          }}
                        >
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {/* Name */}
                            <div style={{ gridColumn: '1 / -1' }}>
                              <label style={labelStyle}>Name</label>
                              <input
                                style={inputStyle}
                                value={override.name ?? svc.name}
                                onChange={(e) => onUpdateOverride(svc.id, { name: e.target.value })}
                              />
                            </div>

                            {/* Description / Note */}
                            <div style={{ gridColumn: '1 / -1' }}>
                              <label style={labelStyle}>Description</label>
                              <input
                                style={inputStyle}
                                value={override.note ?? (svc.note || '')}
                                onChange={(e) => onUpdateOverride(svc.id, { note: e.target.value })}
                                placeholder="Optional detail line"
                              />
                            </div>

                            {/* Price fields — roll-off gets swap + per ton, others get free-form price */}
                            {isRolloff ? (
                              <>
                                <div>
                                  <label style={labelStyle}>Swap Price ($)</label>
                                  <input
                                    style={inputStyle}
                                    value={override.swapPrice ?? rolloffDefaults.swapPrice}
                                    onChange={(e) =>
                                      onUpdateOverride(svc.id, { swapPrice: e.target.value })
                                    }
                                    placeholder="e.g. 650"
                                  />
                                </div>
                                <div>
                                  <label style={labelStyle}>
                                    {svc.id === 'rolloff_metal' ? 'Per Ton Rebate ($)' : 'Per Ton ($)'}
                                  </label>
                                  <input
                                    style={inputStyle}
                                    value={override.perTonPrice ?? rolloffDefaults.perTonPrice}
                                    onChange={(e) =>
                                      onUpdateOverride(svc.id, { perTonPrice: e.target.value })
                                    }
                                    placeholder="e.g. 105"
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <label style={labelStyle}>Price</label>
                                  <input
                                    style={inputStyle}
                                    value={override.price ?? svc.price}
                                    onChange={(e) => onUpdateOverride(svc.id, { price: e.target.value })}
                                    placeholder="e.g. $90"
                                  />
                                </div>
                                <div>
                                  <label style={labelStyle}>Price Note</label>
                                  <input
                                    style={inputStyle}
                                    value={override.priceNote ?? (svc.priceNote || '')}
                                    onChange={(e) =>
                                      onUpdateOverride(svc.id, { priceNote: e.target.value })
                                    }
                                    placeholder="e.g. / mash"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
