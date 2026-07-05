import { useState, useEffect } from 'react'
import { Plus, Trash2, ChevronDown, Loader2 } from 'lucide-react'
import { getTrackers, createTracker, updateTracker, deleteTracker } from '../lib/api'
import { isLoggedIn } from '../lib/auth'
import { Link } from 'react-router-dom'

const STATUS_COLORS = {
  not_started: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  submitted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const STATUS_LABELS = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
}

const COUNTRIES = ['US', 'GB', 'DE', 'CA', 'AE', 'SG', 'AU', 'TH']
const PURPOSES = ['tourist', 'student', 'work', 'business']

export default function Tracker() {
  const [trackers, setTrackers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ to_country: 'US', purpose: 'tourist', notes: '' })

  const loggedIn = isLoggedIn()

  useEffect(() => {
    if (loggedIn) {
      getTrackers().then(setTrackers).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    const item = await createTracker({ from_country: 'IN', ...form })
    setTrackers(t => [item, ...t])
    setShowForm(false)
    setForm({ to_country: 'US', purpose: 'tourist', notes: '' })
  }

  async function handleStatus(id, status) {
    const updated = await updateTracker(id, { status })
    setTrackers(t => t.map(item => item.id === id ? updated : item))
  }

  async function handleDelete(id) {
    await deleteTracker(id)
    setTrackers(t => t.filter(item => item.id !== id))
  }

  if (!loggedIn) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-fraunces text-3xl font-bold text-white mb-4">My Applications</h1>
        <p className="text-gray-400 mb-8">Sign in to track your visa applications.</p>
        <Link to="/auth" className="bg-gold text-navy font-semibold px-8 py-3 rounded-full hover:bg-gold-light transition-all">
          Sign In
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-fraunces text-4xl font-bold text-white">My Applications</h1>
          <p className="text-gray-400 mt-1">Track every visa from prep to approval.</p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 bg-gold text-navy font-semibold px-5 py-2.5 rounded-full hover:bg-gold-light transition-all duration-200"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white/5 border border-gold/30 rounded-xl p-5 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Country</label>
              <select value={form.to_country} onChange={e => setForm(f => ({ ...f, to_country: e.target.value }))}
                className="w-full bg-navy border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-gold focus:outline-none">
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Purpose</label>
              <select value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                className="w-full bg-navy border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-gold focus:outline-none capitalize">
                {PURPOSES.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
              </select>
            </div>
          </div>
          <input type="text" placeholder="Notes (optional)" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full bg-navy border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:border-gold focus:outline-none" />
          <div className="flex gap-3">
            <button type="submit" className="bg-gold text-navy font-semibold px-5 py-2 rounded-full text-sm hover:bg-gold-light transition-all">
              Save
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 text-sm hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gold" /></div>
      ) : trackers.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No applications yet. Add one above.</div>
      ) : (
        <div className="space-y-3">
          {trackers.map(item => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-white">IN → {item.to_country}</span>
                  <span className="text-gray-500 text-sm ml-2 capitalize">· {item.purpose}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <button className={`text-xs border px-3 py-1 rounded-full flex items-center gap-1 transition-all ${STATUS_COLORS[item.status]}`}>
                      {STATUS_LABELS[item.status]} <ChevronDown className="w-3 h-3" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-[#0F1530] border border-white/10 rounded-lg overflow-hidden z-10 hidden group-hover:block min-w-[140px]">
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <button key={val} onClick={() => handleStatus(item.id, val)}
                          className="w-full text-left text-xs text-gray-300 hover:text-white hover:bg-white/5 px-4 py-2 transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {item.notes && <p className="text-sm text-gray-500 mt-2">{item.notes}</p>}
              <p className="text-xs text-gray-700 mt-2">{new Date(item.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
