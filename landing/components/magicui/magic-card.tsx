'use client'
import { useCallback, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = '#FF450026',
}: {
  children?: React.ReactNode
  className?: string
  gradientSize?: number
  gradientColor?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!cardRef.current) return
      const { left, top } = cardRef.current.getBoundingClientRect()
      const localX = e.clientX - left
      const localY = e.clientY - top
      cardRef.current.style.setProperty('--mouse-x', `${localX}px`)
      cardRef.current.style.setProperty('--mouse-y', `${localY}px`)
    },
    [],
  )

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    card.addEventListener('mousemove', handleMouseMove)
    return () => card.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <div
      ref={cardRef}
      style={{ '--gradient-size': `${gradientSize}px`, '--gradient-color': gradientColor } as React.CSSProperties}
      className={cn(
        'relative overflow-hidden rounded-xl',
        'before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit]',
        'before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
        'before:[background:radial-gradient(var(--gradient-size)_circle_at_var(--mouse-x)_var(--mouse-y),var(--gradient-color),transparent_100%)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
