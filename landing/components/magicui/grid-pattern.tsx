import { cn } from '@/lib/utils'

interface GridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  squares?: Array<[x: number, y: number]>
  className?: string
  [key: string]: unknown
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  squares,
  className,
  ...props
}: GridPatternProps) {
  const id = 'grid-pattern'
  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full',
        className,
      )}
      {...props}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  )
}
