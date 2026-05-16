export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        body { background: white !important; color: #1a1a1a !important; }
        @media print {
          @page { margin: 1.5cm; size: A4; }
          body { font-size: 11px; background: white !important; color: #1a1a1a !important; }
          h1, h2, h3 { break-after: avoid; }
          .day-block { break-inside: avoid; }
        }
      `}</style>
      {children}
    </>
  )
}
