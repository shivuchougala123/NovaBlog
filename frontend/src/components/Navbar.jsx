import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { isAuthenticated, getUser, clearAuth } from '../utils/auth'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAuth()
    // Listen for storage changes to update navbar when user logs in/out
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  // Re-check auth on route change
  useEffect(() => {
    checkAuth()
  }, [location])

  function checkAuth() {
    setIsLoggedIn(isAuthenticated())
    setUser(getUser())
  }

  function handleLogout() {
    clearAuth()
    setIsLoggedIn(false)
    setUser(null)
    // Trigger storage event for other tabs/components
    window.dispatchEvent(new Event('storage'))
    navigate('/')
  }
  return (
    <header className="w-full py-4 px-6 glass backdrop-blur-lg border-b border-accent-main/20 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            className="rounded-2xl p-3 bg-gradient-blue shadow-blue-soft cursor-pointer float hover:scale-110 transition-all duration-300" 
            onClick={() => navigate('/')}
          >
            <span className="font-bold tracking-tight text-lg text-gray-800 gradient-text">✨ NovaBlog</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-accent-main transition-all duration-300 hover:scale-110 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-blue group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/explore" 
              className="text-gray-700 hover:text-accent-main transition-all duration-300 hover:scale-110 relative group"
            >
              Explore
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
            {isLoggedIn && (
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-accent-main transition-all duration-300 hover:scale-110 relative group"
              >
                My Blogs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-blue group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link 
                to="/signin" 
                className="text-sm px-4 py-2 rounded-xl btn-ghost font-semibold ripple"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="text-sm px-5 py-2.5 rounded-xl btn-glow font-semibold ripple"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass">
                {/* <div className="w-8 h-8 rounded-full bg-gradient-blue flex items-center justify-center text-sm font-bold text-gray-800">
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '👤'}
                </div> */}
                <span className="text-sm font-semibold text-gray-800">{`@${user?.name}` || '👤'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:scale-105 transition-all duration-300 ripple shadow-sm"
              >
                Logout
              </button>
            </>
          )}
          {isLoggedIn && (
            <Link 
              to="/create" 
              className="text-sm px-4 py-2.5 rounded-xl bg-gradient-accent text-gray-800 font-semibold shadow-blue-soft hover:shadow-blue-glow transition-all duration-300 hover:scale-105 ripple"
            >
              ✍️ Create
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

