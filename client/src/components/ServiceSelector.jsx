import React from 'react'

const WASTE_TYPES = ['C&D', 'MSW', 'Cardboard', 'Metal']

export const CATALOG = [
  {
    category: 'Mobile Dumpster Compaction',
    services: [
      {
        id: 'mobile_compaction',
        name: 'Mobile Dumpster Compaction',
        note: '',
        price: '$100',
        priceNote: '/ mash',
      },
    ],
  },
  {
    category: 'Roll-Off Dumpsters',
    services: [
      { id: 'rolloff_40', name: '40-Yard Roll-Off Dumpster', note: '', price: '$650', priceNote: '/ swap' },
      { id: 'rolloff_30', name: '30-Yard Roll-Off Dumpster', note: '', price: '$595', priceNote: '/ swap' },
      { id: 'rolloff_20', name: '20-Yard Roll-Off Dumpster', note: '', price: '$485', priceNote: '/ swap' },
    ],
  },
  {
    category: 'Compactors',
    services: [
      {
        id: 'compactor_2yd',
        name: '2-Yard Compactor Rental',
        note: 'Includes delivery, installation, and all maintenance & service costs for general wear and tear. Monthly rate based on a 5-year (60-month) service term.',
        price: '$485 / mo',
        priceNote: '60-mo term',
      },
      {
        id: 'compactor_3yd',
        name: '3-Yard Compactor Rental',
        note: 'Includes delivery, installation, and all maintenance & service costs for general wear and tear. Monthly rate based on a 5-year (60-month) service term.',
        price: '$595 / mo',
        priceNote: '60-mo term',
      },
      {
        id: 'receiver_box',
        name: 'Receiver Box Rental',
        note: 'Monthly rate based on a 5-year (60-month) service term.',
        price: '$270 / mo',
        priceNote: '60-mo term',
      },
      {
        id: 'compactor_swap_general',
        name: 'Compactor Swap — General Waste',
        note: 'Per-swap charge plus weight fees.',
        price: '$300 / swap',
        priceNote: '+$105/ton',
      },
      {
        id: 'compactor_swap_cardboard',
        name: 'Compactor Swap — Cardboard',
        note: 'No weight fees. Rebate may be available depending on volume.',
        price: '$300 / swap',
        priceNote: 'Rebate possible',
      },
    ],
  },
]

const cardStyle = (on) => ({
  border: `1px solid ${on ? 'var(--orange)' : 'var(--gray-200)'}`,
  borderRadius: 8,
  padding: 12,
  background: on ? 'var(--orange-light)' : 'white',
})

export default function ServiceSelector({ selected, onToggle, overrides, onUpdateOverride }) {
  return (
    <div className="card">
      <h2 className="section-title">Service Catalog</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {CATALOG.map((category) => (
          <div key={category.category}>
            <div className="subheading">{category.category}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {category.services.map((service) => {
                const on = selected.includes(service.id)
                const ov = overrides[service.id] || {}
                const isRollOff = category.category === 'Roll-Off Dumpsters'

                return (
                  <div key={service.id} style={cardStyle(on)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'start' }}>
                      <label style={{ display: 'flex', gap: 8, cursor: 'pointer', margin: 0, flex: 1 }}>
                        <input type="checkbox" checked={on} onChange={() => onToggle(service.id)} />
                        <span style={{ fontWeight: 700 }}>{service.name}</span>
                      </label>
                      <input
                        type="text"
                        style={{ width: 120, fontWeight: 700, color: 'var(--orange)' }}
                        value={ov.price ?? service.price}
                        onChange={(e) => onUpdateOverride(service.id, { price: e.target.value })}
                      />
                    </div>

                    {isRollOff && (
                      <div className="form-row cols-3" style={{ marginTop: 10, marginBottom: 8 }}>
                        <div>
                          <label>Waste Type</label>
                          <select
                            value={ov.wasteType ?? 'C&D'}
                            onChange={(e) => onUpdateOverride(service.id, { wasteType: e.target.value })}
                          >
                            {WASTE_TYPES.map((w) => (
                              <option key={w} value={w}>{w}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label>Pricing Mode</label>
                          <select
                            value={ov.pricingMode ?? 'flat'}
                            onChange={(e) =>
                              onUpdateOverride(service.id, {
                                pricingMode: e.target.value,
                                note:
                                  e.target.value === 'flat'
                                    ? '4 tons included'
                                    : 'Haul charge + tonnage fees apply.',
                              })
                            }
                          >
                            <option value="flat">Flat Rate</option>
                            <option value="haul">Haul + tonnage</option>
                          </select>
                        </div>
                        <div>
                          <label>Price Note</label>
                          <input
                            type="text"
                            value={ov.priceNote ?? service.priceNote}
                            onChange={(e) => onUpdateOverride(service.id, { priceNote: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: isRollOff ? 0 : 8 }}>
                      <label>Service Note</label>
                      <input
                        type="text"
                        value={ov.note ?? service.note}
                        onChange={(e) => onUpdateOverride(service.id, { note: e.target.value })}
                        placeholder="Optional note"
                      />
                    </div>

                    {!isRollOff && (
                      <div style={{ marginTop: 8 }}>
                        <label>Price Note</label>
                        <input
                          type="text"
                          value={ov.priceNote ?? service.priceNote}
                          onChange={(e) => onUpdateOverride(service.id, { priceNote: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
