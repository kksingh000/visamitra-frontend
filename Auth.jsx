import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Compass } from 'lucide-react'
import { login, register } from '../lib/api'
import { saveAuth } from '../lib/auth'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = mode === 'login'
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password)
      saveAuth(data.access_token, data.user)
      navigate('/tracker')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Compass className="w-6 h-6 text-gold" />
          </div>
          <h1 className="font-fraunces text-3xl font-bold text-white">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {mode === 'login' ? 'Sign in to track your applications.' : 'Start tracking your visa applications.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Name</label>
              <input type="text" required placeholder="Your name" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-navy border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-gold focus:outline-none" />
            </div>
          )}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input type="email" required placeholder="you@example.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-navy border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input type="password" required placeholder="········" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full bg-navy border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-gold focus:outline-none" />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-gold text-navy font-semibold py-3 rounded-full hover:bg-gold-light transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Please wait...</> : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-gold hover:text-gold-light transition-colors">
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </main>
  )
}
