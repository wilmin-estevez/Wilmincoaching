'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Credenciales incorrectas')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-we-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-we-orange rounded-[6px] flex items-center justify-center">
            <span className="font-display font-bold text-white text-sm">WE</span>
          </div>
          <div>
            <div className="font-display font-bold text-we-white text-sm tracking-widest uppercase">
              WILMIN <span className="text-we-orange">ESTÉVEZ</span>
            </div>
            <div className="text-we-gray-mid text-xs">Fitness Coach · RD</div>
          </div>
        </div>

        <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-6">
          <h1 className="font-display font-bold text-we-white text-xl uppercase tracking-wide mb-6">
            Acceso al sistema
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-we-gray-mid uppercase tracking-widest block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-we-carbon-1 border border-we-carbon-2 rounded-btn px-3 py-2.5 text-we-white text-sm focus:outline-none focus:border-we-orange transition-colors"
                placeholder="wilminestevez@gmail.com"
              />
            </div>

            <div>
              <label className="text-xs text-we-gray-mid uppercase tracking-widest block mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-we-carbon-1 border border-we-carbon-2 rounded-btn px-3 py-2.5 text-we-white text-sm focus:outline-none focus:border-we-orange transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-we-danger text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-we-orange hover:bg-we-orange-dark text-white font-bold text-sm py-2.5 rounded-btn transition-colors disabled:opacity-50 shadow-[0_2px_12px_rgba(255,69,0,0.20)] uppercase tracking-wide font-display"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
