import { cn } from '@/lib/utils'

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  borderWidth?: number
  anchor?: number
  colorFrom?: string
  colorTo?: string
  delay?: number
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = '#FF4500',
  colorTo = 'transparent',
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          '--size': size,
          '--duration': duration,
          '--anchor': anchor,
          '--border-width': borderWidth,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--delay': `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]',
        '[background:linear-gradient(#18181b,#18181b)_padding-box,conic-gradient(from_calc(360deg*(var(--anchor)/100)),var(--color-from)_0%,var(--color-to)_var(--tw-gradient-stops))_border-box]',
        '[animation:border-beam_calc(var(--duration)*1s)_var(--delay)_infinite_linear]',
        className,
      )}
    />
  )
}
