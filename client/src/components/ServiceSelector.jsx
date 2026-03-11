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

const inputBase = {
  padding: '4px 7px',
  borderRadius: 4,
  border: '1px solid var(--gray-300)',
  fontSize: 13,
  color: 'var(--gray-900)',
  background: 'white',
  outline: 'none',
  boxSizing: 'border-box',
}

const miniLabel = {
  display: 'block',
  fontSize: 10,
  fontWeight: 600,
  color: 'var(--gray-400)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 2,
}

export default function ServiceSelector({ selected, onToggle, overrides = {}, onUpdateOverride }) {
  return (
    <div className="card">
      <h2 className="section-title">Services ✏️ v2</h2>
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cat.services.map((svc) => {
                  const isOn = selected.includes(svc.id)
                  const ov = overrides[svc.id] || {}

                  // Rolloff catalog defaults
                  let rolloffDefaults = null
                  if (isRolloff) {
                    const swapPrice = svc.price.replace(/[^0-9.]/g, '')
                    const m = svc.priceNote.match(/\$(\d+)\/ton/)
                    rolloffDefaults = { swapPrice, perTonPrice: m ? m[1] : '' }
                  }

                  return (
                    <div
                      key={svc.id}
                      style={{
                        borderRadius: 6,
                        border: `1.5px solid ${isOn ? 'var(--orange)' : 'var(--gray-200)'}`,
                        background: isOn ? 'var(--orange-light)' : 'white',
                        padding: '10px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                    >
                      {/* Row 1: checkbox + name + prices */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Checkbox toggle */}
                        <div
                          onClick={() => onToggle(svc.id)}
                          style={{
                            flexShrink: 0,
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            border: isOn ? '2px solid var(--orange)' : '2px solid var(--gray-300)',
                            background: isOn ? 'var(--orange)' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
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

                        {/* Name input */}
                        <input
                          style={{ ...inputBase, flex: 1, fontWeight: 600 }}
                          value={ov.name ?? svc.name}
                          onChange={(e) => onUpdateOverride(svc.id, { name: e.target.value })}
                        />

                        {/* Price inputs */}
                        {isRolloff ? (
                          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            <div>
                              <div style={miniLabel}>Swap $</div>
                              <input
                                style={{ ...inputBase, width: 72, color: 'var(--orange)', fontWeight: 700 }}
                                value={ov.swapPrice ?? rolloffDefaults.swapPrice}
                                onChange={(e) => onUpdateOverride(svc.id, { swapPrice: e.target.value })}
                                placeholder="650"
                              />
                            </div>
                            <div>
                              <div style={miniLabel}>
                                {svc.id === 'rolloff_metal' ? 'Rebate $' : 'Per Ton $'}
                              </div>
                              <input
                                style={{ ...inputBase, width: 72, color: 'var(--orange)', fontWeight: 700 }}
                                value={ov.perTonPrice ?? rolloffDefaults.perTonPrice}
                                onChange={(e) => onUpdateOverride(svc.id, { perTonPrice: e.target.value })}
                                placeholder="105"
                              />
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            <div>
                              <div style={miniLabel}>Price</div>
                              <input
                                style={{ ...inputBase, width: 80, color: 'var(--orange)', fontWeight: 700 }}
                                value={ov.price ?? svc.price}
                                onChange={(e) => onUpdateOverride(svc.id, { price: e.target.value })}
                                placeholder="$90"
                              />
                            </div>
                            <div>
                              <div style={miniLabel}>Unit</div>
                              <input
                                style={{ ...inputBase, width: 120 }}
                                value={ov.priceNote ?? (svc.priceNote || '')}
                                onChange={(e) => onUpdateOverride(svc.id, { priceNote: e.target.value })}
                                placeholder="/ mash"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Row 2: description */}
                      <div style={{ paddingLeft: 28 }}>
                        <input
                          style={{ ...inputBase, width: '100%', color: 'var(--gray-500)', fontSize: 12 }}
                          value={ov.note ?? (svc.note || '')}
                          onChange={(e) => onUpdateOverride(svc.id, { note: e.target.value })}
                          placeholder="Description (optional)"
                        />
                      </div>
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
