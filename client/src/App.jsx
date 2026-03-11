import React, { useState } from 'react'
import CustomerInfo from './components/CustomerInfo.jsx'
import ServiceSelector, { CATALOG } from './components/ServiceSelector.jsx'
import CustomLineItems from './components/CustomLineItems.jsx'
import NotesTerms, { DEFAULT_NOTES } from './components/NotesTerms.jsx'
import QuotePreview from './components/QuotePreview.jsx'
import './App.css'

const SERVICE_MAP = {}
CATALOG.forEach((cat) => {
  cat.services.forEach((svc) => {
    SERVICE_MAP[svc.id] = { ...svc, category: cat.category }
  })
})

export default function App() {
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    companyName: '',
    address: '',
  })

  const [selectedServices, setSelectedServices] = useState([])

  const [customItems, setCustomItems] = useState([])

  const [notes, setNotes] = useState(DEFAULT_NOTES)

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  const handleToggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleAddCustomItem = () => {
    setCustomItems((prev) => [...prev, { name: '', note: '', price: '', priceNote: '' }])
  }

  const handleChangeCustomItem = (index, updated) => {
    setCustomItems((prev) => prev.map((item, i) => (i === index ? updated : item)))
  }

  const handleRemoveCustomItem = (index) => {
    setCustomItems((prev) => prev.filter((_, i) => i !== index))
  }

  const buildPayload = () => {
    const resolvedServices = selectedServices.map((id) => SERVICE_MAP[id]).filter(Boolean)
    const validCustomItems = customItems.filter((i) => i.name.trim())

    const sections = []

    // Group standard services by category
    const byCategory = {}
    resolvedServices.forEach((svc) => {
      if (!byCategory[svc.category]) byCategory[svc.category] = []
      byCategory[svc.category].push({
        name: svc.name,
        note: svc.note || '',
        price: svc.price,
        priceNote: svc.priceNote || '',
      })
    })

    Object.entries(byCategory).forEach(([category, items]) => {
      sections.push({ category, items })
    })

    if (validCustomItems.length > 0) {
      sections.push({
        category: 'Additional Services',
        items: validCustomItems.map((i) => ({
          name: i.name,
          note: i.note || '',
          price: i.price,
          priceNote: i.priceNote || '',
        })),
      })
    }

    return {
      customerInfo,
      sections,
      notes,
    }
  }

  const handleGenerate = async () => {
    setError(null)
    setIsGenerating(true)

    try {
      const payload = buildPayload()
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Server error: ${res.status}`)
      }

      const blob = await res.blob()
      const today = new Date()
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Mashed_Waste_Quote_${dateStr}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-logo-mark">MW</div>
            <div>
              <div className="header-title">Quote Generator</div>
              <div className="header-subtitle">Mashed Waste Company — Internal Tool</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="app-main">
        <div className="layout">
          {/* Left column — form */}
          <div className="form-column">
            <CustomerInfo data={customerInfo} onChange={setCustomerInfo} />
            <ServiceSelector selected={selectedServices} onToggle={handleToggleService} />
            <CustomLineItems
              items={customItems}
              onAdd={handleAddCustomItem}
              onChange={handleChangeCustomItem}
              onRemove={handleRemoveCustomItem}
            />
            <NotesTerms value={notes} onChange={setNotes} />

            {error && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1.5px solid #fca5a5',
                  borderRadius: 8,
                  padding: '12px 16px',
                  color: '#dc2626',
                  fontSize: 14,
                }}
              >
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          {/* Right column — preview */}
          <aside className="preview-column">
            <QuotePreview
              customerInfo={customerInfo}
              selectedServices={selectedServices}
              customItems={customItems}
              notes={notes}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </aside>
        </div>
      </main>
    </div>
  )
}
