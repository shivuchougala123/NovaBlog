import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuth } from '../utils/auth'
import { signIn } from '../utils/api'

export default function SignIn(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await signIn(email, password)

      if (!data.token) {
        setError(data.error || 'Sign in failed')
        setLoading(false)
        return
      }

      // Store token and user data using auth utility
      setAuth(data.token, data.user)
      
      // Trigger storage event for navbar update
      window.dispatchEvent(new Event('storage'))
      
      navigate('/')
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card p-8 space-y-6 shadow-colorful float">
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-2">Welcome Back! ✨</h2>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>
        
        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm text-gray-700 font-semibold">Email</label>
            <input 
              required 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="your@email.com" 
              type="email"
              className="w-full p-4 rounded-xl glass text-gray-800 placeholder:text-gray-400 border border-accent-main/20 focus:border-accent-main transition-all duration-300"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-700 font-semibold">Password</label>
            <input 
              required 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              placeholder="Enter your password" 
              type="password" 
              className="w-full p-4 rounded-xl glass text-gray-800 placeholder:text-gray-400 border border-accent-main/20 focus:border-accent-main transition-all duration-300"
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full py-4 rounded-xl btn-glow text-lg font-bold ripple mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In 🚀'}
          </button>
          
          <div className="text-center pt-4">
            <a href="/signup" className="text-sm text-accent-main hover:text-accent-dark transition-colors duration-300">
              Don't have an account? <span className="font-bold">Sign Up</span> ✨
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

