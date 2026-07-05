import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Checker from './pages/Checker'
import Chat from './pages/Chat'
import Tracker from './pages/Tracker'
import Auth from './pages/Auth'

export default function App() {
  return (
    <div className="min-h-screen bg-navy font-outfit">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/check" element={<Checker />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  )
}
