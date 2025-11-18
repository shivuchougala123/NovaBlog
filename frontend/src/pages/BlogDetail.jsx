import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBlogById, postComment, getComments, toggleLike, trackBlogView } from '../utils/api'
import { isAuthenticated } from '../utils/auth'

export default function BlogDetail(){
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [postingComment, setPostingComment] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [likingInProgress, setLikingInProgress] = useState(false)
  const isLoggedIn = isAuthenticated()
  
  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true)
        const { blog } = await getBlogById(id)
        setBlog(blog)
        setLikesCount(blog.likesCount || 0)
        
        // Track view
        await trackBlogView(id)
        
        // Check if current user has liked (if logged in)
        if (isLoggedIn && blog.likes) {
          const userId = JSON.parse(localStorage.getItem('novablog_user'))?.id
          setIsLiked(blog.likes.includes(userId))
        }
      } catch (err) {
        setError(err.message || 'Failed to load blog')
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id, isLoggedIn])

  useEffect(() => {
    async function fetchComments() {
      try {
        const { comments: fetchedComments } = await getComments(id)
        setComments(fetchedComments)
      } catch (err) {
        console.error('Failed to fetch comments:', err)
      }
    }
    fetchComments()
  }, [id])

  async function handlePostComment(e) { 
    e.preventDefault()
    if (!commentText.trim() || !isLoggedIn) return
    
    try {
      setPostingComment(true)
      const { comment } = await postComment(id, commentText)
      setComments(prev => [comment, ...prev])
      setCommentText('')
    } catch (err) {
      alert(err.message || 'Failed to post comment')
    } finally {
      setPostingComment(false)
    }
  }

  async function handleToggleLike() {
    if (!isLoggedIn || likingInProgress) return
    
    try {
      setLikingInProgress(true)
      const { liked, likesCount: newCount } = await toggleLike(id)
      setIsLiked(liked)
      setLikesCount(newCount)
    } catch (err) {
      alert(err.message || 'Failed to toggle like')
    } finally {
      setLikingInProgress(false)
    }
  }

  function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
    const years = Math.floor(months / 12)
    return `${years} year${years > 1 ? 's' : ''} ago`
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 animate-bounce">⏳</div>
        <h2 className="text-3xl font-bold gradient-text">Loading blog...</h2>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-3xl font-bold gradient-text mb-4">
          {error || 'Blog Not Found'}
        </h2>
        <Link to="/" className="px-6 py-3 rounded-xl btn-glow inline-block">
          Go Home
        </Link>
      </div>
    )
  }

  const author = blog.userId?.name || 'Anonymous'
  const thumbnail = blog.thumbnailUrl || blog.thumbnail

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="card p-8 shadow-colorful float">
        <div className="flex items-center gap-2 mb-4">
          {blog.tags?.map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6 leading-tight">
          {blog.title}
        </h1>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-main to-accent-light flex items-center justify-center text-xl font-bold text-gray-800 shadow-blue-soft">
              {author?.[0]?.toUpperCase() ?? '👤'}
            </div>
            <div>
              <div className="font-bold text-lg text-gray-800">{author}</div>
              <div className="text-sm text-gray-600">
                {getTimeAgo(blog.createdAt)}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleToggleLike}
              disabled={!isLoggedIn || likingInProgress}
              className={`px-4 py-2 rounded-xl glass border transition-all duration-300 ripple ${
                isLiked 
                  ? 'border-red-400 text-red-500 bg-red-50' 
                  : 'border-accent-main text-accent-main hover:bg-accent-main/10'
              } ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLiked ? '❤️' : '🤍'} {likesCount}
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      {thumbnail && (
        <div className="rounded-2xl overflow-hidden shadow-glow">
          <img src={thumbnail} alt={blog.title} className="w-full h-96 object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="card p-8 shadow-colorful">
        <div 
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />
      </div>

      {/* Comments Section */}
      <section className="card p-8 shadow-blue-glow">
        <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-2">
          💬 Comments ({comments.length})
        </h3>
        
        {isLoggedIn ? (
          <form onSubmit={handlePostComment} className="mb-8">
            <div className="flex gap-3">
              <input 
                value={commentText} 
                onChange={e => setCommentText(e.target.value)} 
                disabled={postingComment}
                className="flex-1 p-4 rounded-xl glass text-gray-800 placeholder:text-gray-400 border border-accent-main/30 focus:border-accent-main transition-all duration-300" 
                placeholder="Share your thoughts..." 
              />
              <button 
                type="submit"
                disabled={postingComment || !commentText.trim()}
                className="px-6 py-4 rounded-xl btn-glow font-semibold ripple disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {postingComment ? 'Posting...' : 'Post 💬'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 rounded-xl glass text-center text-gray-600">
            <Link to="/signin" className="text-accent-main hover:underline font-semibold">
              Sign in
            </Link>
            {' '}to post a comment
          </div>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment! 🎉
            </div>
          ) : (
            comments.map(cm => (
              <div key={cm._id} className="p-5 rounded-xl glass border border-accent-main/20 hover:border-accent-main/40 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-main to-accent-light flex items-center justify-center text-gray-800 font-bold shrink-0">
                    {cm.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-800">{cm.username || 'Anonymous'}</span>
                      <span className="text-xs text-gray-500">• {getTimeAgo(cm.createdAt)}</span>
                    </div>
                    <p className="text-gray-700">{cm.commentText}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Back Button */}
      <div className="text-center">
        <Link 
          to="/" 
          className="inline-block px-6 py-3 rounded-xl btn-ghost font-semibold ripple"
        >
          ← Back to Home
        </Link>
      </div>
    </article>
  )
}

