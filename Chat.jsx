import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Compass } from 'lucide-react'
import { streamChat } from '../lib/api'

const SUGGESTIONS = [
  'What documents do I need for a US tourist visa?',
  'How long does a UK visa take to process?',
  'Can I apply for a Schengen visa from India?',
  'What is the SEVIS fee for an F-1 visa?',
]

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage(text) {
    if (!text.trim() || streaming) return
    const userMsg = { role: 'user', content: text }
    const history = messages.slice(-10)
    setMessages(m => [...m, userMsg, { role: 'assistant', content: '' }])
    setInput('')
    setStreaming(true)

    streamChat(
      text,
      null,
      history,
      (chunk) => {
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = { ...copy[copy.length - 1], content: copy[copy.length - 1].content + chunk }
          return copy
        })
      },
      () => setStreaming(false)
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="font-fraunces text-3xl font-bold text-white">Ask VisaMitra</h1>
        <p className="text-gray-400 text-sm mt-1">Grounded answers. No hallucinated rules.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-6">
            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center">
              <Compass className="w-8 h-8 text-gold" />
            </div>
            <div>
              <p className="text-white font-medium mb-1">Your visa guide is ready</p>
              <p className="text-gray-500 text-sm">Ask anything about visa requirements, documents, or processes.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-left text-xs text-gray-400 bg-white/5 border border-white/10 rounded-lg p-3 hover:border-gold/30 hover:text-white transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 bg-gold/10 rounded-full flex items-center justify-center mr-2 shrink-0 mt-1">
                <Compass className="w-3.5 h-3.5 text-gold" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gold text-navy font-medium rounded-br-sm'
                : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm'
            }`}>
              {msg.content || (streaming && i === messages.length - 1 ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              ) : '')}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask about visa requirements..."
          disabled={streaming}
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder-gray-600 focus:border-gold focus:outline-none disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={streaming || !input.trim()}
          className="bg-gold text-navy w-11 h-11 rounded-full flex items-center justify-center hover:bg-gold-light transition-all duration-200 disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </main>
  )
}
