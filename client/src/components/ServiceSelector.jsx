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

export default function ServiceSelector({ selected, onToggle }) {
  return (
    <div className="card">
      <h2 className="section-title">Services</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {CATALOG.map((cat) => (
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
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => onToggle(svc.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '12px 14px',
                      borderRadius: 6,
                      border: isOn
                        ? '1.5px solid var(--orange)'
                        : '1.5px solid var(--gray-200)',
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
                          <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--gray-900)' }}>
                          {svc.name}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--orange)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {svc.price}
                          <span style={{ fontWeight: 500, fontSize: 12, color: 'var(--gray-500)', marginLeft: 3 }}>
                            {svc.priceNote}
                          </span>
                        </span>
                      </div>
                      {svc.note && (
                        <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 3 }}>
                          {svc.note}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
