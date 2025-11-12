import { useState } from 'react'
import { QrScanner } from '@yudiel/react-qr-scanner'

function Scanner({ onResult }) {
  const [error, setError] = useState('')
  const [manual, setManual] = useState('')

  return (
    <div className="w-full">
      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <QrScanner
          onDecode={(result) => {
            if (result) onResult(result)
          }}
          onError={(err) => {
            console.error(err)
            setError(
              'Kamera tidak dapat diakses. Periksa izin kamera atau coba gunakan input manual di bawah.'
            )
          }}
          constraints={{ facingMode: 'environment' }}
          containerStyle={{ width: '100%', height: 'auto' }}
          videoStyle={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Arahkan kamera ke QR kode meter pelanggan
      </p>

      {error && (
        <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="mt-3">
        <label className="block text-sm text-gray-600 mb-1">
          Input manual nilai QR (opsional)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Tempel / ketik nilai QR di sini"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
          />
          <button
            type="button"
            onClick={() => manual && onResult(manual)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold disabled:bg-gray-300"
            disabled={!manual}
          >
            Cari
          </button>
        </div>
      </div>
    </div>
  )
}

export default Scanner
