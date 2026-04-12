import React from 'react'
import { cn } from '@/lib/utils'

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = '#ffffff',
      shimmerSize = '0.05em',
      shimmerDuration = '3s',
      borderRadius = '4px',
      background = '#FF4500',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
          } as React.CSSProperties
        }
        className={cn(
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-7 py-3',
          'font-condensed text-[13px] font-bold tracking-[2px] uppercase text-white',
          '[background:var(--bg)] [border-radius:var(--radius)]',
          'before:absolute before:inset-0 before:overflow-hidden before:[border-radius:var(--radius)]',
          'before:[background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]',
          'before:opacity-0 before:transition-opacity before:duration-500',
          'hover:before:opacity-100',
          'after:absolute after:inset-[var(--cut)] after:[background:var(--bg)] after:[border-radius:var(--radius)]',
          '[box-shadow:0_0_28px_rgba(255,69,0,0.4)]',
          className,
        )}
        ref={ref}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    )
  },
)

ShimmerButton.displayName = 'ShimmerButton'
