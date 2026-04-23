'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [msgType, setMsgType] = useState<'error' | 'success'>('error')

  const showMsg = (text: string, type: 'error' | 'success') => {
    setMessage(text)
    setMsgType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  const handleSubmit = async () => {
    if (!email || !password) return showMsg('Fill all fields!', 'error')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    showMsg(tab === 'login' ? 'Login coming soon! 🔥' : 'Signup coming soon! 🚀', 'success')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: 'white', margin: 0, fontStyle: 'italic' }}>
            Dub<span style={{ color: '#8b5cf6' }}>Sync</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
            {tab === 'login' ? 'Welcome back! 👋' : 'Create your account 🚀'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '32px', padding: '40px' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
            {(['login', 'signup'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid', borderColor: tab === t ? '#8b5cf6' : 'rgba(255,255,255,0.1)', background: tab === t ? '#8b5cf6' : 'transparent', color: tab === t ? 'white' : 'rgba(255,255,255,0.5)', fontWeight: 700, cursor: 'pointer', fontSize: '14px', textTransform: 'capitalize' }}>
                {t === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Alert */}
          {message && (
            <div style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', background: msgType === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msgType === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msgType === 'success' ? '#10b981' : '#ef4444', fontSize: '14px' }}>
              {message}
            </div>
          )}

          {/* Name field (signup only) */}
          {tab === 'signup' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Full Name</label>
              <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Email</label>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Button */}
          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', border: 'none', color: 'white', fontSize: '15px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {loading ? '...' : tab === 'login' ? '🔥 Login' : '🚀 Create Account'}
          </button>

        </div>
      </div>
    </div>
  )
}
