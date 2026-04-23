'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreateDub() {
  const [step, setStep] = useState(1)
  const [videoBase64, setVideoBase64] = useState('')
  const [audioBase64, setAudioBase64] = useState('')
  const [audioName, setAudioName] = useState('')
  const [videoPreview, setVideoPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleVideo = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('Video must be under 10MB!')
      return
    }
    setError('')
    setProgress('Reading video...')
    const b64 = await toBase64(file)
    setVideoBase64(b64)
    setVideoPreview(URL.createObjectURL(file))
    setProgress('')
    setStep(2)
  }

  const handleAudio = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Audio must be under 5MB!')
      return
    }
    setError('')
    setProgress('Reading audio...')
    const b64 = await toBase64(file)
    setAudioBase64(b64)
    setAudioName(file.name)
    setProgress('')
    setStep(3)
  }

  const pollResult = async (id: string) => {
    setProgress('AI is processing... 🤖')
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 5000))
      const res = await fetch(`/api/check-dub?id=${id}`)
      const data = await res.json()
      setProgress(`Processing... ${data.status} (${(i + 1) * 5}s elapsed)`)
      if (data.status === 'succeeded') {
        setResult(data.output)
        setLoading(false)
        setProgress('')
        return
      }
      if (data.status === 'failed') {
        setError('AI failed! Try shorter video under 10 seconds.')
        setLoading(false)
        setProgress('')
        return
      }
    }
    setError('Timeout! Try a shorter video.')
    setLoading(false)
    setProgress('')
  }

  const handleCreate = async () => {
    if (!videoBase64 || !audioBase64) return
    setLoading(true)
    setError('')
    setResult('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      setProgress('Sending to AI... 📤')

      const res = await fetch('/api/create-dub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video: videoBase64,
          audio: audioBase64,
          userId: user.id
        })
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      await pollResult(data.predictionId)

    } catch (err: any) {
      setError(err.message || 'Something went wrong!')
      setLoading(false)
    }
  }

  const stepStyle = (n: number) => ({
    flex: 1, padding: '10px', borderRadius: '10px',
    textAlign: 'center' as any,
    background: step >= n ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
    color: step >= n ? 'white' : 'rgba(255,255,255,0.3)',
    fontSize: '13px', fontWeight: 700
  })

  const s: any = {
    page: { minHeight: '100vh', background: '#0a0a0f', padding: '24px', fontFamily: 'system-ui' },
    logo: { fontSize: '24px', fontWeight: 900, color: 'white', fontStyle: 'italic' },
    accent: { color: '#8b5cf6' },
    back: { padding: '10px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '14px' },
    box: { background: 'rgba(139,92,246,0.05)', border: '2px dashed rgba(139,92,246,0.3)', borderRadius: '24px', padding: '40px', textAlign: 'center' as any, marginBottom: '20px' },
    uploadBtn: { padding: '14px 28px', borderRadius: '12px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#a78bfa', fontSize: '15px', fontWeight: 700, cursor: 'pointer' },
    createBtn: { width: '100%', padding: '18px', borderRadius: '16px', background: 'linear-gradient(135deg,#8b5cf6,#a78bfa)', border: 'none', color: 'white', fontSize: '16px', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' as any, letterSpacing: '1px' },
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <span style={s.logo}>Dub<span style={s.accent}>Sync</span></span>
        <button onClick={() => router.push('/dashboard')} style={s.back}>← Back</button>
      </div>

      <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 900, marginBottom: '8px' }}>Create Your Dub 🎤</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>Upload face video + audio = AI lip sync magic!</p>

      {/* Steps */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        <div style={stepStyle(1)}>1. Video</div>
        <div style={stepStyle(2)}>2. Audio</div>
        <div style={stepStyle(3)}>3. Create</div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', marginBottom: '20px', fontSize: '14px' }}>
          ❌ {error}
        </div>
      )}

      {/* Progress */}
      {progress && (
        <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
          {progress}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div style={s.box}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎥</div>
          <h3 style={{ color: 'white', marginBottom: '8px' }}>Upload Face Video</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '24px' }}>
            MP4 • Max 10MB • Keep under 10 seconds!
          </p>
          <label style={s.uploadBtn}>
            Choose Video
            <input type="file" accept="video/*" onChange={handleVideo} style={{ display: 'none' }} />
          </label>
        </div>
      )}

      {/* Video Preview */}
      {step >= 2 && videoPreview && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '8px', fontWeight: 700 }}>✅ Video ready!</p>
          <video src={videoPreview} controls style={{ width: '100%', borderRadius: '16px', maxHeight: '200px' }} />
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div style={s.box}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎵</div>
          <h3 style={{ color: 'white', marginBottom: '8px' }}>Upload Audio</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '24px' }}>
            MP3 or WAV • Max 5MB
          </p>
          <label style={s.uploadBtn}>
            Choose Audio
            <input type="file" accept="audio/*" onChange={handleAudio} style={{ display: 'none' }} />
          </label>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '16px', fontWeight: 700 }}>
            ✅ Audio: {audioName}
          </p>

          {result && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#10b981', fontWeight: 700, marginBottom: '8px' }}>🎉 Your Dub is Ready!</p>
              <video src={result} controls style={{ width: '100%', borderRadius: '16px' }} />
              <a href={result} download style={{ display: 'block', textAlign: 'center', marginTop: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
                ⬇️ Download Dub
              </a>
            </div>
          )}

          {!result && (
            <button onClick={handleCreate} disabled={loading} style={{ ...s.createBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? '🔄 Processing...' : '✨ Create Dub Now!'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
