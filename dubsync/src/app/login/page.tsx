'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Check your email to confirm! 📧')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white mb-2">
            Dub<span className="text-pink-500">Sync</span>
          </h1>
          <p className="text-gray-400 text-lg">AI Lip Sync Battle 🎤</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
          <h2 className="text-white text-2xl font-bold mb-6">
            {isSignUp ? 'Create account 🚀' : 'Welcome back 👋'}
          </h2>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 text-white placeholder-gray-500 rounded-2xl px-4 py-4 outline-none border border-zinc-700 focus:border-pink-500 transition-all"
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 text-white placeholder-gray-500 rounded-2xl px-4 py-4 outline-none border border-zinc-700 focus:border-pink-500 transition-all"
            />

            {message && (
              <p className="text-pink-400 text-sm text-center">{message}</p>
            )}

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl transition-all text-lg disabled:opacity-50"
            >
              {loading ? '...' : isSignUp ? 'Sign Up 🎉' : 'Login 🔥'}
            </button>
          </div>

          <p className="text-gray-500 text-center mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-pink-500 font-bold ml-2"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}