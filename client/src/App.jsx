import React, { useEffect, useMemo, useState } from 'react'
import CustomerInfo from './components/CustomerInfo.jsx'
import ServiceSelector, { CATALOG } from './components/ServiceSelector.jsx'
import CustomLineItems from './components/CustomLineItems.jsx'
import NotesTerms, { buildNotes } from './components/NotesTerms.jsx'
import QuotePreview from './components/QuotePreview.jsx'
import './App.css'

const DEFAULT_REP = {
  id: 'rep-jacob-jones',
  name: 'Jacob Jones',
  email: 'jacob@mashedco.com',
  phone: '615-972-8323',
}

const DEFAULT_REPS = [
  DEFAULT_REP,
  { id: 'rep-cody-jones', name: 'Cody Jones', email: 'cody@mashedco.com', phone: '' },
  { id: 'rep-courtnee-bader', name: 'Courtnee Bader', email: 'cbader@mashedco.com', phone: '' },
  { id: 'rep-hunter-mckelvy', name: 'Hunter McKelvy', email: 'hmckelvy@mashedco.com', phone: '' },
  { id: 'rep-sam-cargo', name: 'Sam Cargo', email: 'scargo@mashedco.com', phone: '' },
  { id: 'rep-danny-baumann', name: 'Danny Baumann', email: 'danny@mashedco.com', phone: '' },
  { id: 'rep-kimberly-woznac', name: 'Kimberly Woznac', email: 'kwoznac@mashedco.com', phone: '' },
]

const SERVICE_MAP = Object.fromEntries(
  CATALOG.flatMap((category) =>
    category.services.map((service) => [service.id, { ...service, category: category.category }])
  )
)

export default function App() {
  const [reps, setReps] = useState(DEFAULT_REPS)
  const [customerInfo, setCustomerInfo] = useState({ customerName: '', companyName: '', address: '', repId: DEFAULT_REP.id })
  const [selectedServices, setSelectedServices] = useState([])
  const [serviceOverrides, setServiceOverrides] = useState({})
  const [customItems, setCustomItems] = useState([])
  const autoNotes = useMemo(
    () => buildNotes(selectedServices, serviceOverrides, SERVICE_MAP),
    [selectedServices, serviceOverrides]
  )
  const [notes, setNotes] = useState(autoNotes)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  // Keep notes/terms in sync with which line items are selected.
  useEffect(() => {
    setNotes(autoNotes)
  }, [autoNotes])

  const sections = useMemo(() => {
    const grouped = {}
    for (const id of selectedServices) {
      const service = SERVICE_MAP[id]
      if (!service) continue
      const override = serviceOverrides[id] || {}
      if (!grouped[service.category]) grouped[service.category] = []
      const isRolloff = service.category === 'Roll-Off Dumpsters'
      const wasteType = override.wasteType ?? 'C&D'
      grouped[service.category].push({
        name: isRolloff ? `${override.name ?? service.name} - ${wasteType}` : override.name ?? service.name,
        note: override.note ?? service.note,
        price: override.price ?? service.price,
        priceNote: override.priceNote ?? service.priceNote,
      })
    }

    const result = Object.entries(grouped).map(([category, items]) => ({ category, items }))
    const validCustom = customItems.filter((item) => item.name.trim() && item.price.trim())
    if (validCustom.length) {
      result.push({ category: 'Additional Services', items: validCustom })
    }
    return result
  }, [selectedServices, serviceOverrides, customItems])

  const selectedRep = reps.find((rep) => rep.id === customerInfo.repId) ?? DEFAULT_REP

  const addRep = (rep) => {
    const id = `rep-${Date.now()}`
    setReps((prev) => [...prev, { ...rep, id }])
    setCustomerInfo((prev) => ({ ...prev, repId: id }))
  }

  const toggleService = (id) => {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]))
  }

  const updateService = (id, updates) => {
    setServiceOverrides((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), ...updates } }))
  }

  const generateQuote = async () => {
    setError('')
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerInfo: { ...customerInfo, rep: selectedRep }, sections, notes }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const blob = await response.blob()
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Mashed_Waste_Quote_${dateStr}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-title">Mashed Waste Internal Quoting Tool</div>
        </div>
      </header>

      <main className="app-main">
        <div className="layout">
          <div className="form-column">
            <CustomerInfo data={customerInfo} onChange={setCustomerInfo} reps={reps} onAddRep={addRep} />
            <ServiceSelector selected={selectedServices} onToggle={toggleService} overrides={serviceOverrides} onUpdateOverride={updateService} />
            <CustomLineItems
              items={customItems}
              onAdd={() => setCustomItems((prev) => [...prev, { name: '', note: '', price: '', priceNote: '' }])}
              onChange={(index, item) => setCustomItems((prev) => prev.map((row, rowIndex) => (rowIndex === index ? item : row)))}
              onRemove={(index) => setCustomItems((prev) => prev.filter((_, rowIndex) => rowIndex !== index))}
            />
            <NotesTerms value={notes} onChange={setNotes} defaultNotes={autoNotes} />
          </div>

          <div className="preview-column">
            <QuotePreview
              customerInfo={customerInfo}
              sections={sections}
              notes={notes}
              onGenerate={generateQuote}
              isGenerating={isGenerating}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
