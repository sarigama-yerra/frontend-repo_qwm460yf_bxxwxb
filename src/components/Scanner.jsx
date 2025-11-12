import { useState } from 'react'
import { QrScanner } from '@yudiel/react-qr-scanner'

function Scanner({ onResult }) {
  const [error, setError] = useState('')
  const [manual, setManual] = useState('')
  const [started, setStarted] = useState(false)
  const [facing, setFacing] = useState('environment') // or 'user'
  const [instanceKey, setInstanceKey] = useState(0)

  const startCamera = () => {
    setError('')
    setStarted(true)
    // re-mount to ensure fresh permission prompt on some browsers
    setInstanceKey((k) => k + 1)
  }

  const switchCamera = () => {
    setFacing((prev) => (prev === 'environment' ? 'user' : 'environment'))
    // Force remount so new constraints apply immediately
    setInstanceKey((k) => k + 1)
  }

  return (
    <div className="w-full">
      {!started ? (
        <div className="rounded-xl border border-gray-200 p-4 bg-white text-center">
          <p className="text-sm text-gray-600">Siapkan kamera untuk memindai QR pada meter.</p>
          <button
            type="button"
            onClick={startCamera}
            className="mt-3 w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold"
          >
            Mulai Kamera
          </button>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
          <QrScanner
            key={instanceKey}
            onDecode={(result) => {
              if (result) onResult(result)
            }}
            onError={(err) => {
              console.error(err)
              setError(
                'Kamera tidak dapat diakses atau tidak kompatibel. Periksa izin kamera, coba ganti kamera, atau gunakan input manual di bawah.'
              )
            }}
            constraints={{ facingMode: { ideal: facing } }}
            containerStyle={{ width: '100%', height: 'auto', background: '#000' }}
            videoStyle={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
          <div className="absolute inset-x-0 top-0 p-2 flex justify-between pointer-events-none">
            <div className="pointer-events-auto">
              <button
                type="button"
                onClick={switchCamera}
                className="m-1 px-3 py-1.5 text-xs bg-black/60 text-white rounded-md"
              >
                Ganti Kamera
              </button>
            </div>
          </div>
        </div>
      )}

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
