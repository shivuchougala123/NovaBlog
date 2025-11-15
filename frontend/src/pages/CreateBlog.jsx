import { useState, useEffect } from 'react'
import Editor from '../components/Editor'
import { createBlog as createBlogAPI, updateBlog, getBlogById } from '../utils/api'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function CreateBlog(){
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [thumb, setThumb] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [blogId, setBlogId] = useState(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setIsEdit(true)
      setBlogId(id)
      loadBlog(id)
    }
  }, [searchParams])

  async function loadBlog(id) {
    try {
      setLoading(true)
      const { blog } = await getBlogById(id)
      setTitle(blog.title)
      setThumb(blog.thumbnailUrl || '')
      setTags(Array.isArray(blog.tags) ? blog.tags.join(', ') : '')
      setContent(blog.description)
    } catch (err) {
      setError(err.message || 'Failed to load blog')
    } finally {
      setLoading(false)
    }
  }

  async function submit(e){
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Clean the HTML content by removing data-* attributes
      const cleanContent = content.replace(/\sdata-[a-z-]+="[^"]*"/gi, '')
      
      const blogData = {
        title,
        thumbnailUrl: thumb,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        description: cleanContent
      }

      if (isEdit && blogId) {
        await updateBlog(blogId, blogData)
        setSuccess('Blog updated successfully! 🎉')
        setTimeout(() => navigate('/dashboard'), 1500)
      } else {
        const { blog } = await createBlogAPI(blogData)
        setSuccess('Blog created successfully! 🎉')
        setTimeout(() => navigate('/dashboard'), 1500)
      }
    } catch (err) {
      setError(err.message || 'Failed to save blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8 float">
        <h1 className="text-4xl font-bold gradient-text mb-3">
          {isEdit ? '✏️ Update Your Blog' : '✍️ Create Amazing Content'}
        </h1>
        <p className="text-gray-600 text-lg">
          {isEdit ? 'Make your content even better' : 'Share your thoughts with the world'}
        </p>
      </div>

      {error && (
        <div className="card p-4 bg-red-50 border-2 border-red-300 mb-6 float">
          <p className="text-red-700 font-semibold">❌ {error}</p>
        </div>
      )}

      {success && (
        <div className="card p-4 bg-green-50 border-2 border-green-300 mb-6 float">
          <p className="text-green-700 font-semibold">✅ {success}</p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <div className="card p-6 shadow-colorful">
          <div className="space-y-2 mb-4">
            <label className="text-sm text-gray-700 font-semibold flex items-center gap-2">
              📝 Blog Title
            </label>
            <input 
              required 
              placeholder="Enter an eye-catching title..." 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              className="w-full p-4 rounded-xl glass text-gray-800 text-xl placeholder:text-gray-400 border border-accent-light/30 focus:border-accent-main transition-all duration-300 font-semibold"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                🖼️ Thumbnail URL
              </label>
              <input 
                placeholder="https://your-image-url.com/image.jpg" 
                value={thumb} 
                onChange={e=>setThumb(e.target.value)} 
                className="w-full p-4 rounded-xl glass text-gray-800 placeholder:text-gray-400 border border-accent-light/30 focus:border-accent-main transition-all duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                🏷️ Tags
              </label>
              <input 
                placeholder="tech, design, AI" 
                value={tags} 
                onChange={e=>setTags(e.target.value)} 
                className="w-full p-4 rounded-xl glass text-gray-800 placeholder:text-gray-400 border border-accent-light/30 focus:border-accent-main transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div className="card p-6 shadow-glow">
          <label className="text-sm text-gray-700 font-semibold flex items-center gap-2 mb-3">
            ✨ Content
          </label>
          <Editor value={content} onChange={setContent} />
        </div>

        <div className="flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl btn-ghost text-lg font-semibold ripple"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-8 py-3 rounded-xl btn-glow text-lg font-bold ripple shadow-blue-soft hover:shadow-blue-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? '⏳ Saving...' : isEdit ? '� Update Blog' : '�🚀 Publish Blog'}
          </button>
        </div>
      </form>
    </div>
  )
}

