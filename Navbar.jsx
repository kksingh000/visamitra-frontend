import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Compass } from 'lucide-react'
import { isLoggedIn, getUser, clearAuth } from '../lib/auth'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const loggedIn = isLoggedIn()
  const user = getUser()

  const links = [
    { to: '/check', label: 'Visa Checker' },
    { to: '/chat', label: 'Ask VisaMitra' },
    { to: '/tracker', label: 'My Applications' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-navy/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-gold font-fraunces text-xl font-bold">
          <Compass className="w-5 h-5" />
          VisaMitra
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === l.to ? 'text-gold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <>
              <span className="text-sm text-gray-400">{user?.name}</span>
              <button
                onClick={() => { clearAuth(); window.location.href = '/' }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-gold text-navy text-sm font-semibold px-5 py-2 rounded-full hover:bg-gold-light transition-all duration-200"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="text-gray-300 hover:text-gold transition-colors">{l.label}</Link>
          ))}
          {!loggedIn && (
            <Link to="/auth" onClick={() => setOpen(false)}
              className="bg-gold text-navy text-sm font-semibold px-5 py-2 rounded-full text-center">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
