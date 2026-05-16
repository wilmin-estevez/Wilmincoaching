'use client'

import { useEffect } from 'react'

export default function PrintTrigger() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex items-center justify-between mb-6 print:hidden">
      <button
        onClick={() => window.print()}
        className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors"
      >
        Descargar / Imprimir PDF
      </button>
      <button
        onClick={() => window.close()}
        className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cerrar
      </button>
    </div>
  )
}
