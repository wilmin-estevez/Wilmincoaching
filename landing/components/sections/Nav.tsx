'use client'
import Link from 'next/link'
import { ShimmerButton } from '@/components/magicui/shimmer-button'

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(255,69,0,0.1)] bg-[rgba(24,24,27,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="#" className="flex items-center gap-3 no-underline">
          <div className="h-8 w-[3px] rounded-sm bg-gradient-to-b from-[#FF4500] to-[rgba(255,69,0,0.15)]" />
          <div>
            <div className="font-condensed text-lg font-black tracking-widest text-brand-text uppercase">
              WILMIN <span className="text-orange">ESTÉVEZ</span>
            </div>
            <div className="text-[8px] tracking-[3px] text-brand-subtle uppercase">
              Fitness Coach
            </div>
          </div>
        </Link>

        {/* CTA */}
        <ShimmerButton
          onClick={() => document.getElementById('aplicar')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-[11px] px-5 py-2"
        >
          Aplicar ahora
        </ShimmerButton>
      </div>
    </nav>
  )
}
