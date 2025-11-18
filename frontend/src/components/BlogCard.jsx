import { Link } from 'react-router-dom'

const tagColors = [
  'bg-gradient-blue',
  'bg-gradient-accent',
  'bg-gradient-soft',
]

export default function BlogCard({ blog }) {
  const blogId = blog._id || blog.id
  const thumbnail = blog.thumbnailUrl || blog.thumbnail
  const rawDescription = blog.description || blog.preview || ''
  const preview = rawDescription.replace(/<[^>]+>/g, '').substring(0, 160)
  const author = blog.userId?.name || blog.author || 'Anonymous'
  
  // Calculate time ago
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + ' year' + (Math.floor(interval) > 1 ? 's' : '') + ' ago'
    
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + ' month' + (Math.floor(interval) > 1 ? 's' : '') + ' ago'
    
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + ' day' + (Math.floor(interval) > 1 ? 's' : '') + ' ago'
    
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + ' hour' + (Math.floor(interval) > 1 ? 's' : '') + ' ago'
    
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + ' min' + (Math.floor(interval) > 1 ? 's' : '') + ' ago'
    
    return 'Just now'
  }
  
  const timeAgo = blog.createdAt ? getTimeAgo(blog.createdAt) : 'Recently'
  
  return (
    <article className="card tilt-card p-4 flex flex-col gap-3 shadow-colorful hover:shadow-glow transition-all duration-300 group">
      <Link to={`/blog/${blogId}`} className="block rounded-2xl overflow-hidden relative hover:opacity-95 transition-opacity">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={blog.title} 
            className="w-full h-60 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-40 bg-gray-100 rounded-2xl"></div>
        )}
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-gray-700 font-semibold">
          {timeAgo}
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-gray-700 font-semibold flex items-center gap-1">
            ❤️ {blog.likesCount || 0}
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-gray-700 font-semibold flex items-center gap-1">
            💬 {blog.commentsCount || 0}
          </div>
        </div>
      </Link>
      
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base md:text-lg font-bold leading-tight text-gray-800 hover:text-gray-800 hover:bg-gradient-blue hover:bg-clip-text transition-all duration-300">
          <Link to={`/blog/${blogId}`}>{blog.title}</Link>
        </h3>
      </div>
      
      <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">{preview}</p>
      
      <div className="flex items-center justify-between text-xs mt-auto pt-2 border-t border-accent-main/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-blue flex items-center justify-center text-xs font-bold text-gray-800 shadow-blue-soft">
            {author?.[0]?.toUpperCase() ?? '👤'}
          </div>
          <div>
            <div className="text-gray-800 font-semibold text-xs">{author}</div>
            <div className="text-gray-600 text-[10px]">Author</div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 flex-wrap justify-end">
          {blog.tags?.slice(0,2).map((t, idx) => (
            <span 
              key={t} 
              className={`text-[10px] px-2 py-0.5 rounded-full ${tagColors[idx % tagColors.length]} hover:scale-110 transition-transform duration-300`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

