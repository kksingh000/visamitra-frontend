import { useState } from 'react'
import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react'
import { checkVisa } from '../lib/api'

const COUNTRIES = [
  { code: 'US', label: '🇺🇸 United States' },
  { code: 'GB', label: '🇬🇧 United Kingdom' },
  { code: 'DE', label: '🇩🇪 Germany' },
  { code: 'CA', label: '🇨🇦 Canada' },
  { code: 'AE', label: '🇦🇪 UAE' },
  { code: 'SG', label: '🇸🇬 Singapore' },
  { code: 'AU', label: '🇦🇺 Australia' },
  { code: 'TH', label: '🇹🇭 Thailand' },
]

const PURPOSES = ['tourist', 'student', 'work', 'business']

export default function Checker() {
  const [form, setForm] = useState({ to_country: 'US', purpose: 'tourist', occupation: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [checked, setChecked] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    setChecked({})
    try {
      const data = await checkVisa({ from_country: 'IN', ...form })
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const mandatory = result?.documents?.filter(d => d.mandatory) || []
  const optional = result?.documents?.filter(d => !d.mandatory) || []
  const progress = mandatory.length
    ? Math.round((mandatory.filter((_, i) => checked[`m-${i}`]).length / mandatory.length) * 100)
    : 0

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-fraunces text-4xl font-bold text-white mb-2">Visa Checker</h1>
      <p className="text-gray-400 mb-8">Get your exact document checklist in seconds.</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Traveling to</label>
            <select
              value={form.to_country}
              onChange={e => setForm(f => ({ ...f, to_country: e.target.value }))}
              className="w-full bg-navy border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-gold focus:outline-none"
            >
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Purpose</label>
            <select
              value={form.purpose}
              onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
              className="w-full bg-navy border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-gold focus:outline-none capitalize"
            >
              {PURPOSES.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">
            Your occupation <span className="text-gray-600">(optional — for AI tips)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Software Engineer, Student, Doctor"
            value={form.occupation}
            onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))}
            className="w-full bg-navy border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-gold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-navy font-semibold py-3 rounded-full hover:bg-gold-light transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</> : 'Get My Checklist'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6">
          {/* Meta */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex flex-wrap gap-3 mb-3">
              <span className="text-xs bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full">{result.visa_type}</span>
              <span className="text-xs bg-white/5 text-gray-300 border border-white/10 px-3 py-1 rounded-full">⏱ {result.processing_days}</span>
              {result.fee_usd && (
                <span className="text-xs bg-white/5 text-gray-300 border border-white/10 px-3 py-1 rounded-full">💰 ${result.fee_usd}</span>
              )}
            </div>
            {/* Progress */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Mandatory docs checked</span>
                <span className="text-gold font-medium">{progress}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          {/* Mandatory */}
          <div>
            <h3 className="font-semibold text-white mb-3">Mandatory Documents</h3>
            <div className="space-y-2">
              {mandatory.map((doc, i) => (
                <div
                  key={i}
                  onClick={() => setChecked(c => ({ ...c, [`m-${i}`]: !c[`m-${i}`] }))}
                  className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:border-gold/30 transition-all duration-200 select-none"
                >
                  {checked[`m-${i}`]
                    ? <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    : <Circle className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />}
                  <div>
                    <p className={`text-sm font-medium ${checked[`m-${i}`] ? 'line-through text-gray-500' : 'text-white'}`}>{doc.name}</p>
                    {doc.notes && <p className="text-xs text-gray-500 mt-0.5">{doc.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional */}
          {optional.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-400 mb-3">Recommended (Optional)</h3>
              <div className="space-y-2">
                {optional.map((doc, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/3 border border-white/5 rounded-lg p-4">
                    <Circle className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">{doc.name}</p>
                      {doc.notes && <p className="text-xs text-gray-600 mt-0.5">{doc.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Tips */}
          {result.ai_tips?.length > 0 && (
            <div className="bg-gold/5 border border-gold/20 rounded-xl p-5">
              <h3 className="font-semibold text-gold mb-3">✨ AI Tips for You</h3>
              <ul className="space-y-2">
                {result.ai_tips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-gold mt-0.5">→</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
