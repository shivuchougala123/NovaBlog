import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUp } from '../utils/api'

export default function SignUp(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await signUp(email, password, name)

      if (!data.message) {
        setError(data.error || 'Sign up failed')
        setLoading(false)
        return
      }

      // After successful signup, redirect to signin
      navigate('/signin')
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card p-8 space-y-6 shadow-glow">
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-2">Join NovaBlog! 🎨</h2>
          <p className="text-gray-600">Start your creative journey today</p>
        </div>
        
        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm text-gray-700 font-semibold">Name</label>
            <input 
              value={name} 
              onChange={e=>setName(e.target.value)} 
              placeholder="Your name (optional)" 
              type="text"
              className="w-full p-4 rounded-xl glass text-gray-800 placeholder:text-gray-400 border border-accent-main/20 focus:border-accent-main transition-all duration-300"
            />
          </div>
          
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
              placeholder="Create a strong password" 
              type="password" 
              className="w-full p-4 rounded-xl glass text-gray-800 placeholder:text-gray-400 border border-accent-main/20 focus:border-accent-main transition-all duration-300"
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full py-4 rounded-xl btn-glow text-lg font-bold ripple mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account 🎉'}
          </button>
          
          <div className="text-center pt-4">
            <a href="/signin" className="text-sm text-accent-main hover:text-accent-dark transition-colors duration-300">
              Already have an account? <span className="font-bold">Sign In</span> 🔑
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

