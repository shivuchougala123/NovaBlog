import { getMyBlogs, deleteBlog as deleteBlogAPI } from '../utils/api'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  useEffect(() => {
    fetchBlogs()
  }, [])

  async function fetchBlogs() {
    try {
      setLoading(true)
      setError('')
      const { blogs } = await getMyBlogs()
      setBlogs(blogs)
      console.log(blogs);
      
    } catch (err) {
      setError(err.message || 'Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  async function remove(id) { 
    if(confirm('Delete this blog?')) {
      try {
        await deleteBlogAPI(id)
        setSuccess('Blog deleted successfully! 🗑️')
        setTimeout(() => setSuccess(''), 3000)
        await fetchBlogs()
      } catch (err) {
        setError(err.message || 'Failed to delete blog')
        setTimeout(() => setError(''), 3000)
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="card p-6 shadow-colorful">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2">📚 My Blogs</h2>
            <p className="text-gray-600">Manage your published content</p>
          </div>
          <Link to="/create" className="px-6 py-3 rounded-xl btn-glow font-semibold ripple">
            ✍️ Create New
          </Link>
        </div>
      </div>

      {error && (
        <div className="card p-4 shadow-colorful border-l-4 border-red-300 bg-red-50">
          <p className="text-red-700 font-semibold">❌ {error}</p>
        </div>
      )}

      {success && (
        <div className="card p-4 shadow-colorful border-l-4 border-green-300 bg-green-50">
          <p className="text-green-700 font-semibold">✅ {success}</p>
        </div>
      )}

      {loading ? (
        <div className="card p-12 text-center shadow-glow">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <h3 className="text-2xl font-bold gradient-text">Loading your blogs...</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.length === 0 ? (
            <div className="card p-12 text-center shadow-glow">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold gradient-text mb-2">No blogs yet</h3>
              <p className="text-gray-600 mb-6">Start creating amazing content today!</p>
              <Link to="/create" className="inline-block px-6 py-3 rounded-xl btn-glow font-semibold ripple">
                Create Your First Blog 🚀
              </Link>
            </div>
          ) : (
            blogs.map(b => (
              <div key={b._id} className="card p-6 shadow-colorful hover:shadow-glow transition-all duration-300 group">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-800 group-hover:bg-gradient-to-r group-hover:from-accent-main group-hover:to-accent-light group-hover:bg-clip-text transition-all duration-300 mb-2">
                      {b.title}
                    </h3>
                    <div className="mb-3 flex flex-row column-gap-10 gap-2.5">
                      {b.thumbnailUrl && (
                        <img 
                          src={b.thumbnailUrl} alt={`Thumbnail for ${b.title}`} className="mb-3 rounded-md max-h-40 object-cover"
                        />
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {b.description?.replace(/<[^>]+>/g, '').substring(0, 600)}...
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span>📅 {new Date(b.createdAt).toLocaleDateString()}</span>
                      {b.updatedAt && b.updatedAt !== b.createdAt && (
                        <>
                          <span>•</span>
                          <span>✏️ Updated {new Date(b.updatedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    {b.tags && b.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {b.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-gradient-to-r from-accent-main/20 to-accent-light/20 text-gray-700 rounded-full text-xs font-semibold">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                    <Link
                      to={`/blog/${b._id}`}
                      className="px-4 py-2 rounded-lg text-accent-main font-semibold hover:underline transition-all duration-200"
                    >
                      view
                    </Link>

                    <Link
                      to={`/create?id=${b._id}`}
                      className="px-4 py-2 rounded-lg btn-glow font-semibold ripple"
                    >
                      ✏️ Edit
                    </Link>

                    <button
                      onClick={() => remove(b._id)}
                      aria-label={`Delete blog ${b.title}`}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:scale-105 transition-all duration-300 ripple"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

