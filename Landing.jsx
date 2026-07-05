import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, MessageSquare, LayoutDashboard, Shield } from 'lucide-react'

const CORRIDORS = [
  { from: '🇮🇳 India', to: '🇺🇸 USA', types: ['Tourist', 'Student', 'H-1B'] },
  { from: '🇮🇳 India', to: '🇬🇧 UK', types: ['Tourist'] },
  { from: '🇮🇳 India', to: '🇩🇪 Germany', types: ['Tourist (Schengen)'] },
  { from: '🇮🇳 India', to: '🇨🇦 Canada', types: ['Tourist'] },
  { from: '🇮🇳 India', to: '🇦🇪 UAE', types: ['Tourist'] },
  { from: '🇮🇳 India', to: '🇦🇺 Australia', types: ['Tourist'] },
]

const FEATURES = [
  {
    icon: CheckCircle,
    title: 'Exact Document Checklist',
    desc: 'No guesswork. Get the verified list for your specific visa type and situation.',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat Assistant',
    desc: 'Ask anything about visa requirements. Grounded answers, never hallucinated rules.',
  },
  {
    icon: LayoutDashboard,
    title: 'Application Tracker',
    desc: 'Track every visa application from document prep to approval.',
  },
  {
    icon: Shield,
    title: 'Verified Data Only',
    desc: 'AI can only suggest tips — it can never invent fees, dates, or government rules.',
  },
]

export default function Landing() {
  return (
    <main>
      {/* Hero */}
      <section className="min-h-[85vh] flex items-center justify-center px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.08)_0%,_transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block bg-gold/10 border border-gold/30 text-gold text-xs font-medium px-4 py-1.5 rounded-full mb-6 font-outfit">
            Free · No middleman · AI-powered
          </span>
          <h1 className="font-fraunces text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Know exactly what<br />
            <span className="text-gold">documents you need.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-outfit">
            Stop paying ₹50,000 to agents for information that should be free.
            VisaMitra gives you verified, AI-personalized visa checklists instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/check"
              className="bg-gold text-navy font-semibold px-8 py-4 rounded-full hover:bg-gold-light transition-all duration-200 flex items-center justify-center gap-2"
            >
              Check My Visa <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/chat"
              className="border border-white/20 text-white px-8 py-4 rounded-full hover:border-gold/50 hover:text-gold transition-all duration-200"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>

      {/* Corridors */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-fraunces text-3xl font-bold text-white mb-2 text-center">
            Supported Corridors
          </h2>
          <p className="text-gray-400 text-center mb-12">More being added every week.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CORRIDORS.map((c, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-gold/40 transition-all duration-300">
                <div className="text-white font-medium mb-2">{c.from} → {c.to}</div>
                <div className="flex flex-wrap gap-2">
                  {c.types.map(t => (
                    <span key={t} className="text-xs bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-fraunces text-3xl font-bold text-white mb-12 text-center">
            Everything you need, nothing you don't.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-gold/30 transition-all duration-300 flex gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-fraunces text-4xl font-bold text-white mb-4">
            Ready to apply with confidence?
          </h2>
          <p className="text-gray-400 mb-8">Get your personalized checklist in under 30 seconds.</p>
          <Link
            to="/check"
            className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-8 py-4 rounded-full hover:bg-gold-light transition-all duration-200"
          >
            Get My Checklist <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
