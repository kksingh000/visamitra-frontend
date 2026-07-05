const BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('vm_token')
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Auth
export async function register(name, email, password) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Registration failed')
  return data
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Login failed')
  return data
}

// Visa
export async function checkVisa(payload) {
  const res = await fetch(`${BASE}/visa/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Not supported yet')
  return data
}

export async function getCorridors() {
  const res = await fetch(`${BASE}/visa/corridors`)
  return res.json()
}

// Tracker
export async function getTrackers() {
  const res = await fetch(`${BASE}/tracker/`, {
    headers: authHeaders(),
  })
  return res.json()
}

export async function createTracker(payload) {
  const res = await fetch(`${BASE}/tracker/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function updateTracker(id, payload) {
  const res = await fetch(`${BASE}/tracker/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function deleteTracker(id) {
  const res = await fetch(`${BASE}/tracker/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return res.json()
}

// Chat streaming
export function streamChat(message, corridor, history, onChunk, onDone) {
  fetch(`${BASE}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, corridor, history }),
  }).then(async (res) => {
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value)
      const lines = text.split('\n').filter(l => l.startsWith('data: '))
      for (const line of lines) {
        const data = line.replace('data: ', '')
        if (data === '[DONE]') { onDone(); return }
        try {
          const { content } = JSON.parse(data)
          onChunk(content)
        } catch {}
      }
    }
  })
}
