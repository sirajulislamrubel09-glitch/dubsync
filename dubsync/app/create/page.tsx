'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreateDub() {
  const [step, setStep] = useState(1)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleVideo = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('Video must be under 10MB!')
      return
    }
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
    setStep(2)
    setError('')
  }

  const handleAudio = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Audio must be under 5MB!')
      return
    }
    setAudioFile(file)
    setStep(3)
    setError('')
  }

  const handleCreate = async () => {
    if (!videoFile || !audioFile) return
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const formData = new FormData()
      formData.append('video', videoFile)
      formData.append('audio', audioFile)
      formData.append('userId', user.id)

      const res = await fetch('/api/create-dub', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (data.error) setError(data.error)
      else setResult(data.output)

    } catch (err) {
      setError('Something went wrong! Try again.')
    }
    setLoading(false)
  }

  const s: any = {
    page: { minHeight:'100vh', background:'#0a0a0f', padding:'24px', fontFamily:'system-ui' },
    header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px' },
    logo: { fontSize:'24px', fontWeight:900, color:'white', fontStyle:'italic' },
    accent: { color:'#8b5cf6' },
    back: { padding:'10px 16px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:'14px' },
    title: { color:'white', fontSize:'28px', fontWeight:900, marginBottom:'8px' },
    sub: { color:'rgba(255,255,255,0.5)', marginBottom:'32px', fontSize:'15px' },
    stepRow: { display:'flex', gap:'8px', marginBottom:'32px' },
    box: { background:'rgba(139,92,246,0.05)', border:'2px dashed rgba(139,92,246,0.3)', borderRadius:'24px', padding:'40px', textAlign:'center', marginBottom:'20px' },
    uploadBtn: { padding:'14px 28px', borderRadius:'12px', background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.4)', color:'#a78bfa', fontSize:'15px', fontWeight:700, cursor:'pointer' },
    createBtn: { width:'100%', padding:'18px', borderRadius:'16px', background:'linear-gradient(135deg,#8b5cf6,#a78bfa)', border:'none', color:'white', fontSize:'16px', fontWeight:800, cursor:'pointer', textTransform:'uppercase' as any, letterSpacing:'1px' },
  }

  const stepStyle = (n: number) => ({
    flex:1, padding:'10px', borderRadius:'10px', textAlign:'center' as any,
    background: step >= n ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
    color: step >= n ? 'white' : 'rgba(255,255,255,0.3)',
    fontSize:'13px', fontWeight:700
  })

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.logo}>Dub<span style={s.accent}>Sync</span></span>
        <button onClick={() => router.push('/dashboard')} style={s.back}>← Back</button>
      </div>

      <h1 style={s.title}>Create Your Dub 🎤</h1>
      <p style={s.sub}>Upload your face video + any audio = AI lip sync magic!</p>

      {/* Steps */}
      <div style={s.stepRow}>
        <div style={stepStyle(1)}>1. Video</div>
        <div style={stepStyle(2)}>2. Audio</div>
        <div style={stepStyle(3)}>3. Create</div>
      </div>

      {/* Error */}
      {error && (
        <div style={{padding:'12px 16px', borderRadius:'12px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444', marginBottom:'20px', fontSize:'14px'}}>
          {error}
        </div>
      )}

      {/* Step 1 - Video Upload */}
      {step === 1 && (
        <div style={s.box}>
          <div style={{fontSize:'48px', marginBottom:'16px'}}>🎥</div>
          <h3 style={{color:'white', marginBottom:'8px'}}>Upload Your Face Video</h3>
          <p style={{color:'rgba(255,255,255,0.4)', fontSize:'14px', marginBottom:'24px'}}>
            MP4 format • Max 10MB • Clear face required
          </p>
          <label style={s.uploadBtn}>
            Choose Video
            <input type="file" accept="video/*" onChange={handleVideo} style={{display:'none'}} />
          </label>
        </div>
      )}

      {/* Step 2 - Video Preview + Audio */}
      {step >= 2 && videoPreview && (
        <div style={{marginBottom:'20px'}}>
          <p style={{color:'rgba(255,255,255,0.6)', fontSize:'13px', marginBottom:'8px', fontWeight:700}}>
            ✅ Video uploaded!
          </p>
          <video src={videoPreview} controls style={{width:'100%', borderRadius:'16px', maxHeight:'200px'}} />
        </div>
      )}

      {step === 2 && (
        <div style={s.box}>
          <div style={{fontSize:'48px', marginBottom:'16px'}}>🎵</div>
          <h3 style={{color:'white', marginBottom:'8px'}}>Upload Audio</h3>
          <p style={{color:'rgba(255,255,255,0.4)', fontSize:'14px', marginBottom:'24px'}}>
            MP3 or WAV • Max 5MB • Any voice or music
          </p>
          <label style={s.uploadBtn}>
            Choose Audio
            <input type="file" accept="audio/*" onChange={handleAudio} style={{display:'none'}} />
          </label>
        </div>
      )}

      {/* Step 3 - Create */}
      {step === 3 && (
        <div style={{marginBottom:'20px'}}>
          <p style={{color:'rgba(255,255,255,0.6)', fontSize:'13px', marginBottom:'16px', fontWeight:700}}>
            ✅ Audio uploaded: {audioFile?.name}
          </p>

          {/* Result */}
          {result && (
            <div style={{marginBottom:'20px'}}>
              <p style={{color:'#10b981', fontWeight:700, marginBottom:'8px'}}>
                🎉 Your Dub is Ready!
              </p>
              <video src={result} controls style={{width:'100%', borderRadius:'16px'}} />
              <a href={result} download style={{display:'block', textAlign:'center', marginTop:'12px', padding:'12px', borderRadius:'12px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', color:'#10b981', fontSize:'14px', fontWeight:700, textDecoration:'none'}}>
                ⬇️ Download Dub
              </a>
            </div>
          )}

          {!result && (
            <button onClick={handleCreate} disabled={loading} style={{...s.createBtn, opacity: loading ? 0.7 : 1}}>
              {loading ? '🔄 Creating your dub... (~30 sec)' : '✨ Create Dub Now!'}
            </button>
          )}

          {loading && (
            <p style={{textAlign:'center', color:'rgba(255,255,255,0.4)', fontSize:'13px', marginTop:'12px'}}>
              AI is syncing your lips... please wait 🤖
            </p>
          )}
        </div>
      )}
    </div>
  )
}
