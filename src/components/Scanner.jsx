import { QrScanner } from '@yudiel/react-qr-scanner'

function Scanner({ onResult }) {
  return (
    <div className="w-full">
      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <QrScanner
          onDecode={(result) => {
            if (result) onResult(result)
          }}
          onError={(error) => {
            console.error(error)
          }}
          constraints={{ facingMode: 'environment' }}
          containerStyle={{ width: '100%', height: 'auto' }}
          videoStyle={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">Arahkan kamera ke QR kode meter pelanggan</p>
    </div>
  )
}

export default Scanner
