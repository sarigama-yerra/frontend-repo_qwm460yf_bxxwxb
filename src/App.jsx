import React, { useEffect, useMemo, useState, lazy, Suspense } from 'react'
import { Camera, CheckCircle, RefreshCw, User, ClipboardList } from 'lucide-react'
import ErrorBoundary from './components/ErrorBoundary'

const Scanner = lazy(() => import('./components/Scanner'))

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [scanned, setScanned] = useState('')
  const [loading, setLoading] = useState(false)
  const [customer, setCustomer] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ current_reading: '', operator_name: '', notes: '' })
  const [submittedId, setSubmittedId] = useState('')

  useEffect(() => {
    if (!scanned) return
    const fetchCustomer = async () => {
      setLoading(true)
      setError('')
      setCustomer(null)
      setSubmittedId('')
      try {
        const res = await fetch(`${BACKEND}/api/customers/by-qr/${encodeURIComponent(scanned)}`)
        if (!res.ok) throw new Error('Gagal mengambil data pelanggan')
        const data = await res.json()
        if (!data) {
          setError('Pelanggan dengan QR tersebut tidak ditemukan')
        } else {
          setCustomer(data)
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [scanned])

  const onScanResult = (text) => {
    if (!text) return
    if (scanned) return
    setScanned(String(text))
  }

  const resetAll = () => {
    setScanned('')
    setCustomer(null)
    setError('')
    setForm({ current_reading: '', operator_name: '', notes: '' })
    setSubmittedId('')
  }

  const canSubmit = useMemo(() => {
    const val = parseFloat(form.current_reading)
    return customer && !loading && !isNaN(val) && val >= 0
  }, [customer, loading, form])

  const submitReading = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    setSubmittedId('')
    try {
      const payload = {
        customer_id: customer._id,
        current_reading: parseFloat(form.current_reading),
        operator_name: form.operator_name || undefined,
        notes: form.notes || undefined,
      }
      const res = await fetch(`${BACKEND}/api/readings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Gagal menyimpan pencatatan')
      }
      const data = await res.json()
      setSubmittedId(data.id)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="mx-auto max-w-md p-4 pb-24">
        <header className="pt-6 pb-4 flex items-center gap-3">
          <div className="p-2 bg-sky-100 rounded-lg text-sky-600"><Camera size={20} /></div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">PDAM Mobile - Scan QR</h1>
            <p className="text-xs text-gray-500">Input pemakaian air melalui QR meter</p>
          </div>
        </header>

        {!scanned && (
          <div className="mt-2 space-y-3">
            <ErrorBoundary>
              <Suspense fallback={<div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600">Memuat pemindai...</div>}>
                <Scanner onResult={onScanResult} />
              </Suspense>
            </ErrorBoundary>
            <div className="text-center">
              <button onClick={() => setScanned('') } className="hidden" aria-hidden="true">reset</button>
            </div>
          </div>
        )}

        {scanned && (
          <div className="mt-3">
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
              <div className="text-sm text-emerald-800 truncate"><span className="font-medium">QR:</span> {scanned}</div>
              <button onClick={resetAll} className="text-emerald-700 hover:text-emerald-900 text-sm flex items-center gap-1"><RefreshCw size={14}/> Scan ulang</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-4 animate-pulse bg-gray-100 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">Memuat data...</div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
        )}

        {customer && (
          <div className="mt-4 space-y-4">
            <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-sky-100 text-sky-600 rounded-lg"><User size={18} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">Data Pelanggan</p>
                  <p className="text-base font-semibold text-gray-800">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.address}</p>
                  <div className="mt-2 text-xs text-gray-500">No. Meter: <span className="font-medium text-gray-700">{customer.meter_number}</span></div>
                </div>
              </div>
            </div>

            <form onSubmit={submitReading} className="bg-white rounded-xl shadow border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><ClipboardList size={18} /></div>
                <p className="font-medium text-gray-800">Input Angka Meter</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Angka Meter Saat Ini</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    placeholder="contoh: 1234.56"
                    value={form.current_reading}
                    onChange={(e) => setForm({ ...form, current_reading: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nama Petugas (opsional)</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    placeholder="Isi nama petugas"
                    value={form.operator_name}
                    onChange={(e) => setForm({ ...form, operator_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Catatan (opsional)</label>
                  <textarea
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    placeholder="Kondisi meter, akses lokasi, dll"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full py-2.5 rounded-lg text-white font-semibold transition-colors ${canSubmit ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  {loading ? 'Menyimpan...' : 'Simpan Pencatatan'}
                </button>
                {submittedId && (
                  <div className="flex items-center gap-2 text-emerald-700 text-sm bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                    <CheckCircle size={16} /> Data berhasil disimpan
                  </div>
                )}
              </div>
            </form>

            <div className="text-center">
              <a href="/test" className="text-sm text-sky-600 hover:text-sky-700 underline">Cek koneksi backend</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
