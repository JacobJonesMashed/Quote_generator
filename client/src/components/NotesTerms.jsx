import React from 'react'

// Always-on lines plus lines that only appear when specific line items are selected.
const ALWAYS_INTRO = [
  'All prices are quoted in USD.',
  'This quote is valid for 30 days from the date of issue.',
]

const ALWAYS_OUTRO = ['Please reach out with any questions or to customize your service plan.']

const COMPACTOR_TERM_LINE =
  'Compactor and Receiver Box monthly pricing is based on a 5-year (60-month) service term.'
const WEIGHT_OVERAGE_LINE = 'Weight overages are billed based on actual ticket weights.'
const REBATE_LINE =
  'Rebates on metal and cardboard loads are subject to current market rates and volume.'

// Default notes shown before any line item is selected.
export const DEFAULT_NOTES = [...ALWAYS_INTRO, ...ALWAYS_OUTRO].join('\n')

// Build the notes/terms text conditionally based on the selected line items.
export function buildNotes(selectedServices, serviceOverrides = {}, serviceMap = {}) {
  const selected = selectedServices.map((id) => serviceMap[id]).filter(Boolean)

  const hasCompactor = selected.some((s) => s.category === 'Compactors')
  const hasRolloff = selected.some((s) => s.category === 'Roll-Off Dumpsters')
  const hasCardboardSwap = selectedServices.includes('compactor_swap_cardboard')
  const hasRolloffCardboardOrMetal = selected.some((s) => {
    if (s.category !== 'Roll-Off Dumpsters') return false
    const wasteType = serviceOverrides[s.id]?.wasteType ?? 'C&D'
    return wasteType === 'Cardboard' || wasteType === 'Metal'
  })

  const lines = [...ALWAYS_INTRO]
  if (hasCompactor) lines.push(COMPACTOR_TERM_LINE)
  if (hasCompactor || hasRolloff) lines.push(WEIGHT_OVERAGE_LINE)
  if (hasCardboardSwap || hasRolloffCardboardOrMetal) lines.push(REBATE_LINE)
  lines.push(...ALWAYS_OUTRO)

  return lines.join('\n')
}

export default function NotesTerms({ value, onChange, defaultNotes = DEFAULT_NOTES }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 className="section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
          Notes & Terms
        </h2>
        <button className="btn-secondary" type="button" onClick={() => onChange(defaultNotes)}>
          Reset
        </button>
      </div>
      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 }}>
        Lines update automatically based on the line items you select. Reset restores the auto-generated text.
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={8} />
    </div>
  )
}
