'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setMessage('Coming soon! 🔥')
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',fontFamily:'system-ui'}}>
      <div style={{width:'100%',maxWidth:'420px'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <h1 style={{fontSize:'42px',fontWeight:900,color:'white',margin:0,fontStyle:'italic'}}>
            Dub<span style={{color:'#8b5cf6'}}>Sync</span>
          </h1>
          <p style={{color:'rgba(255,255,255,0.5)',marginTop:'8px'}}>AI Lip Sync Battle 🎤</p>
        </div>
        <div style={{background:'rgba(139,92,246,0.05)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'32px',padding:'40px'}}>
          <div style={{display:'flex',gap:'12px',marginBottom:'28px'}}>
            {['login','signup'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{flex:1,padding:'12px',borderRadius:'12px',border:'2px solid',borderColor:tab===t?'#8b5cf6':'rgba(255,255,255,0.1)',background:tab===t?'#8b5cf6':'transparent',color:tab===t?'white':'rgba(255,255,255,0.5)',fontWeight:700,cursor:'pointer',fontSize:'14px'}}>
                {t === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>
          {message && <div style={{padding:'12px',borderRadius:'12px',marginBottom:'20px',background:'rgba(139,92,246,0.1)',border:'1px solid rgba(139,92,246,0.3)',color:'#a78bfa',fontSize:'14px'}}>{message}</div>}
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',color:'rgba(255,255,255,0.7)',fontSize:'13px',fontWeight:700,marginBottom:'8px'}}>Email</label>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
              style={{width:'100%',padding:'14px 16px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.05)',color:'white',fontSize:'14px',outline:'none',boxSizing:'border-box'}} />
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block',color:'rgba(255,255,255,0.7)',fontSize:'13px',fontWeight:700,marginBottom:'8px'}}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'14px 16px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.05)',color:'white',fontSize:'14px',outline:'none',boxSizing:'border-box'}} />
          </div>
          <button onClick={handleSubmit} disabled={loading}
            style={{width:'100%',padding:'16px',borderRadius:'12px',background:'linear-gradient(135deg,#8b5cf6,#a78bfa)',border:'none',color:'white',fontSize:'15px',fontWeight:800,cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,textTransform:'uppercase',letterSpacing:'1px'}}>
            {loading ? '...' : tab === 'login' ? '🔥 Login' : '🚀 Sign Up'}
          </button>
        </div>
      </div>
    </div>
  )
}
