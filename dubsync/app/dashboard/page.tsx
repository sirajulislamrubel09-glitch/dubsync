'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p style={{color:'white',fontSize:'18px'}}>Loading... ⚡</p>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',padding:'24px',fontFamily:'system-ui'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'40px'}}>
        <h1 style={{fontSize:'28px',fontWeight:900,color:'white',margin:0,fontStyle:'italic'}}>
          Dub<span style={{color:'#8b5cf6'}}>Sync</span>
        </h1>
        <button onClick={handleLogout} style={{padding:'10px 20px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:'14px'}}>
          Logout
        </button>
      </div>

      <div style={{background:'rgba(139,92,246,0.05)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'24px',padding:'32px',marginBottom:'24px'}}>
        <h2 style={{color:'white',fontSize:'24px',fontWeight:800,margin:'0 0 8px 0'}}>Welcome back! 👋</h2>
        <p style={{color:'rgba(255,255,255,0.5)',margin:0}}>{user?.email}</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
        {[
          {label:'Plan',value:'Free 🆓',color:'#8b5cf6'},
          {label:'Dubs Today',value:'0 / 2',color:'#10b981'},
          {label:'Total Dubs',value:'0',color:'#f59e0b'},
          {label:'Challenges',value:'Coming Soon 🔥',color:'#ef4444'},
        ].map(stat => (
          <div key={stat.label} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'20px'}}>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',margin:'0 0 8px 0',textTransform:'uppercase',letterSpacing:'1px'}}>{stat.label}</p>
            <p style={{color:stat.color,fontSize:'20px',fontWeight:800,margin:0}}>{stat.value}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push('/create')}
        style={{width:'100%',padding:'20px',borderRadius:'16px',background:'linear-gradient(135deg,#8b5cf6,#a78bfa)',border:'none',color:'white',fontSize:'18px',fontWeight:800,cursor:'pointer',letterSpacing:'1px'}}>
        🎤 Create New Dub
      </button>
    </div>
  )
}
