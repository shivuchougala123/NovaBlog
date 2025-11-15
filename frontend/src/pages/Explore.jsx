import { useState, useEffect } from 'react'
import { getAllBlogs } from '../utils/api'
import BlogCard from '../components/BlogCard'

const categories = ['All', 'Technology', 'AI', 'Design', 'Web Dev', 'Lifestyle', 'Art', 'Science']
const sortOptions = ['Newest', 'Most Popular', 'Trending']

export default function Explore() {
  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSort, setSelectedSort] = useState('Newest')

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    filterAndSortBlogs()
  }, [blogs, searchQuery, selectedCategory, selectedSort])

  async function fetchBlogs() {
    try {
      setLoading(true)
      const { blogs } = await getAllBlogs()
      setBlogs(blogs)
    } catch (err) {
      console.error('Failed to load blogs:', err)
    } finally {
      setLoading(false)
    }
  }

  function filterAndSortBlogs() {
    let result = [...blogs]

    // Filter by search query
    if (searchQuery) {
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(blog => 
        blog.tags?.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase())
      )
    }

    // Sort blogs
    if (selectedSort === 'Newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (selectedSort === 'Most Popular') {
      // Mock popularity - in real app, use view count
      result.sort((a, b) => (b.views || 0) - (a.views || 0))
    } else if (selectedSort === 'Trending') {
      // Mock trending - in real app, use engagement metrics
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    }

    setFilteredBlogs(result)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="card p-6 shadow-glow float">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">
            🔍 Explore Blogs
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover amazing stories from creators around the world
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blogs by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-12 rounded-xl glass text-gray-800 placeholder:text-gray-400 border border-accent-main/30 focus:border-accent-main transition-all duration-300 text-base"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-main text-xl">
              🔍
            </div>
          </div>
        </div>

        {/* Category Filters
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            🏷️ Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ripple ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-accent-main to-accent-light text-gray-800 shadow-blue-soft'
                    : 'glass border border-accent-main/30 text-gray-700 hover:border-accent-main hover:bg-accent-main/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div> */}

        {/* Sort Options */}
        {/* <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Sort by:</span>
            <div className="flex gap-2">
              {sortOptions.map(option => (
                <button
                  key={option}
                  onClick={() => setSelectedSort(option)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    selectedSort === option
                      ? 'bg-gradient-accent text-gray-800 shadow-blue-soft'
                      : 'glass border border-accent-light/30 text-gray-700 hover:border-accent-light'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600 font-semibold">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'blog' : 'blogs'} found
          </div>
        </div> */}
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="card p-12 text-center shadow-colorful">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <h3 className="text-2xl font-bold gradient-text">Discovering amazing blogs...</h3>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="card p-12 text-center shadow-glow float">
          <div className="text-6xl mb-4">😢</div>
          <h3 className="text-2xl font-bold gradient-text mb-2">No blogs found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedCategory !== 'All' 
              ? 'Try adjusting your filters or search query'
              : 'Be the first to create a blog!'}
          </p>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
              }}
              className="px-6 py-3 rounded-xl btn-glow font-semibold ripple"
            >
              Clear Filters 🔄
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBlogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}
