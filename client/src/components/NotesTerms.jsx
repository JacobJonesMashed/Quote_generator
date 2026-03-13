import React from 'react'

export const DEFAULT_NOTES = `All prices are quoted in USD.
This quote is valid for 30 days from the date of issue.
Compactor and Receiver Box monthly pricing is based on a 5-year (60-month) service term.
Weight overages are billed based on actual ticket weights.
Rebates on metal and cardboard loads are subject to current market rates and volume.
Please reach out with any questions or to customize your service plan.`

export default function NotesTerms({ value, onChange }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 className="section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
          Notes & Terms
        </h2>
        <button className="btn-secondary" type="button" onClick={() => onChange(DEFAULT_NOTES)}>
          Reset
        </button>
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={8} />
    </div>
  )
}
