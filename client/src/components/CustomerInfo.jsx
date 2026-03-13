import React, { useState } from 'react'

export default function CustomerInfo({ data, onChange, reps, onAddRep }) {
  const [draftRep, setDraftRep] = useState({ name: '', email: '', phone: '' })

  const updateField = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  const selectedRep = reps.find((rep) => rep.id === data.repId)

  const handleAddRep = () => {
    if (!draftRep.name.trim() || !draftRep.email.trim() || !draftRep.phone.trim()) return
    onAddRep(draftRep)
    setDraftRep({ name: '', email: '', phone: '' })
  }

  return (
    <div className="card">
      <h2 className="section-title">Customer & Rep Information</h2>

      <div className="form-row cols-2">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="customerName">Customer Name *</label>
          <input
            id="customerName"
            type="text"
            value={data.customerName}
            onChange={(e) => updateField('customerName', e.target.value)}
            placeholder="Customer contact"
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="companyName">Company Name</label>
          <input
            id="companyName"
            type="text"
            value={data.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            placeholder="Customer company"
          />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: 16 }}>
        <label htmlFor="address">Address (optional)</label>
        <input
          id="address"
          type="text"
          value={data.address}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder="123 Main St, City, ST ZIP"
        />
      </div>

      <div className="form-row cols-2" style={{ marginBottom: 8 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="repSelect">Sales Rep</label>
          <select
            id="repSelect"
            value={data.repId}
            onChange={(e) => updateField('repId', e.target.value)}
          >
            {reps.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {rep.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Selected Rep Details</label>
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 8 }}>
            <div>{selectedRep?.email}</div>
            <div>{selectedRep?.phone}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, borderTop: '1px solid var(--gray-200)', paddingTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--gray-500)', textTransform: 'uppercase' }}>
          Admin: Add Rep
        </div>
        <div className="form-row cols-3" style={{ marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Rep name"
            value={draftRep.name}
            onChange={(e) => setDraftRep((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            type="email"
            placeholder="Rep email"
            value={draftRep.email}
            onChange={(e) => setDraftRep((prev) => ({ ...prev, email: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Rep phone"
            value={draftRep.phone}
            onChange={(e) => setDraftRep((prev) => ({ ...prev, phone: e.target.value }))}
          />
        </div>
        <button type="button" className="btn-secondary" onClick={handleAddRep}>
          Add Rep
        </button>
      </div>
    </div>
  )
}
