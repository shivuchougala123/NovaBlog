import BlogCard from '../components/BlogCard'
import { getAllBlogs } from '../utils/api'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const { blogs } = await getAllBlogs()
        setBlogs(blogs)
      } catch (err) {
        console.error('Failed to load blogs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  console.log(blogs[0]?.tags[0]);
  const tags = blogs?.map(b => b.tags[0])
  console.log(tags);
  const uniqueTags = [...new Set(tags)];
  const tag_3 = [uniqueTags[0],uniqueTags[1],uniqueTags[2]];
  

  return (
    <div className="space-y-4 pb-8">
      {/* Hero Section */}
      <div className="card p-6 md:p-8 text-center shadow-glow float">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">
          Welcome to NovaBlog ✨
        </h1>
        <p className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto">
          Discover amazing stories, share your thoughts, and connect with creators from around the world 🌍
        </p>
        <Link 
          to="/create" 
          className="inline-block px-6 py-3 rounded-xl btn-glow text-base font-bold ripple"
        >
          🚀 Start Writing
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold gradient-text">✨ Latest Articles</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm rounded-lg glass border border-accent-main text-accent-main hover:bg-accent-main/10 transition-all duration-300">
                New
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg glass border border-accent-light text-accent-main hover:bg-accent-light/10 transition-all duration-300">
                Trending
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="col-span-2 p-8 glass card text-center shadow-colorful">
              <div className="text-5xl mb-3 animate-bounce">⏳</div>
              <h3 className="text-xl font-bold gradient-text">Loading amazing blogs...</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {blogs.length ? blogs.map(b => <BlogCard key={b._id} blog={b} />) : (
                <div className="col-span-2 p-8 glass card text-center shadow-colorful">
                  <div className="text-5xl mb-3">📝</div>
                  <h3 className="text-xl font-bold gradient-text mb-2">No blogs yet!</h3>
                  <p className="text-gray-600 mb-4">Be the first to share your amazing story</p>
                  <Link 
                    to="/create" 
                    className="inline-block px-5 py-2.5 rounded-xl btn-glow font-semibold ripple"
                  >
                    Create First Blog 🎉
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        
        <aside className="space-y-4">
          <div className="card p-4 shadow-blue-glow">
            <h3 className="text-lg font-bold gradient-text mb-3">🔥 Trending Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tag_3.map(tag => (
                <span key={tag} className="tag cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="card p-4 shadow-blue-soft">
            <h3 className="text-lg font-bold gradient-text mb-3">💡 About NovaBlog</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              A vibrant platform for creators to share ideas, stories, and inspiration. Join our colorful community today! 🎨
            </p>
          </div>

          <div className="card p-4 shadow-colorful float">
            <h3 className="text-lg font-bold gradient-text mb-3">📊 Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total Blogs</span>
                <span className="text-xl font-bold text-accent-main">{blogs.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Active Writers</span>
                <span className="text-xl font-bold text-accent-light">..</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total Views</span>
                <span className="text-xl font-bold text-accent-dark">..</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

