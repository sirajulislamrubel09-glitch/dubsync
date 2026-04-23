'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [msgType, setMsgType] = useState('error')
  const router = useRouter()
  const supabase = createClient()

  const showMsg = (text: string, type: string) => {
    setMessage(text)
    setMsgType(type)
    setTimeout(() => setMessage(''), 6000)
  }

  const handleSubmit = async () => {
    if (!email || !password) return showMsg('Fill all fields! 👆', 'error')
    setLoading(true)

    if (tab === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (error) showMsg(error.message, 'error')
      else showMsg('Check your email to confirm! 📧', 'success')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) showMsg(error.message, 'error')
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  const s: any = {
    page: { minHeight:'100vh', background:'#0a0a0f', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', fontFamily:'system-ui' },
    card: { width:'100%', maxWidth:'420px' },
    logo: { textAlign:'center', marginBottom:'32px' },
    h1: { fontSize:'42px', fontWeight:900, color:'white', margin:0, fontStyle:'italic' },
    accent: { color:'#8b5cf6' },
    sub: { color:'rgba(255,255,255,0.5)', marginTop:'8px' },
    box: { background:'rgba(139,92,246,0.05)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:'32px', padding:'40px' },
    tabs: { display:'flex', gap:'12px', marginBottom:'28px' },
    input: { width:'100%', padding:'14px 16px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:'14px', outline:'none', boxSizing:'border-box' as any },
    label: { display:'block', color:'rgba(255,255,255,0.7)', fontSize:'13px', fontWeight:700, marginBottom:'8px' },
    field: { marginBottom:'16px' },
    btn: { width:'100%', padding:'16px', borderRadius:'12px', background:'linear-gradient(135deg,#8b5cf6,#a78bfa)', border:'none', color:'white', fontSize:'15px', fontWeight:800, cursor:'pointer', textTransform:'uppercase' as any, letterSpacing:'1px', marginTop:'8px' },
  }

  const tabStyle = (t: string) => ({
    flex:1, padding:'12px', borderRadius:'12px', border:'2px solid',
    borderColor: tab===t ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
    background: tab===t ? '#8b5cf6' : 'transparent',
    color: tab===t ? 'white' : 'rgba(255,255,255,0.5)',
    fontWeight:700, cursor:'pointer', fontSize:'14px'
  })

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <h1 style={s.h1}>Dub<span style={s.accent}>Sync</span></h1>
          <p style={s.sub}>AI Lip Sync Battle 🎤</p>
        </div>
        <div style={s.box}>
          <div style={s.tabs}>
            <button onClick={() => setTab('login')} style={tabStyle('login')}>Login</button>
            <button onClick={() => setTab('signup')} style={tabStyle('signup')}>Sign Up</button>
          </div>

          {message && (
            <div style={{ padding:'12px', borderRadius:'12px', marginBottom:'20px', background: msgType==='success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border:`1px solid ${msgType==='success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msgType==='success' ? '#10b981' : '#ef4444', fontSize:'14px' }}>
              {message}
            </div>
          )}

          {tab === 'signup' && (
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={s.input} />
            </div>
          )}

          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={s.input} />
          </div>

          <div style={{marginBottom:'24px'}}>
            <label style={s.label}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={s.input} />
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{...s.btn, opacity: loading ? 0.7 : 1}}>
            {loading ? '...' : tab === 'login' ? '🔥 Login' : '🚀 Create Account'}
          </button>

          <p style={{textAlign:'center', color:'rgba(255,255,255,0.4)', fontSize:'13px', marginTop:'20px'}}>
            {tab === 'login' ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setTab(tab === 'login' ? 'signup' : 'login')} style={{color:'#8b5cf6', fontWeight:700, cursor:'pointer'}}>
              {tab === 'login' ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
