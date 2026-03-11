import React from 'react'

export const DEFAULT_NOTES = `1. All prices are quoted in USD.
2. This quote is valid for 30 days from the date of issue.
3. Compactor and Receiver Box monthly pricing is based on a 5-year (60-month) service term.
4. Weight overages are billed based on actual ticket weights.
5. Rebates on metal and cardboard loads are subject to current market rates and volume.
6. Please reach out with any questions or to customize your service plan.`

export default function NotesTerms({ value, onChange }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
          Notes & Terms
        </h2>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onChange(DEFAULT_NOTES)}
          style={{ fontSize: 12, padding: '5px 10px' }}
        >
          Reset to Default
        </button>
      </div>
      <textarea
        rows={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontSize: 13, lineHeight: 1.7 }}
      />
    </div>
  )
}
