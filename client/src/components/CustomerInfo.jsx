import React from 'react'

export default function CustomerInfo({ data, onChange }) {
  const handleChange = (field) => (e) => {
    onChange({ ...data, [field]: e.target.value })
  }

  return (
    <div className="card">
      <h2 className="section-title">Customer Information</h2>
      <div className="form-row cols-2">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="customerName">Customer Name *</label>
          <input
            id="customerName"
            type="text"
            placeholder="John Smith"
            value={data.customerName}
            onChange={handleChange('customerName')}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="companyName">Company Name</label>
          <input
            id="companyName"
            type="text"
            placeholder="Acme Corp"
            value={data.companyName}
            onChange={handleChange('companyName')}
          />
        </div>
      </div>
      <div className="form-group" style={{ marginTop: 16, marginBottom: 0 }}>
        <label htmlFor="address">Service Address <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
        <input
          id="address"
          type="text"
          placeholder="123 Main St, City, ST 00000"
          value={data.address}
          onChange={handleChange('address')}
        />
      </div>
    </div>
  )
}
