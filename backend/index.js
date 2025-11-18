require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('./models/User')
const Blog = require('./models/Blog')
const Comment = require('./models/Comment')
const authMiddleware = require('./middleware/auth')

// Create Express app (only once)
const app = express()

// Enable CORS for your deployed frontend.
// Read allowed frontend origin from env so deployments can configure it.
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://novablog-1.onrender.com'
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}))

console.log('Allowing CORS requests from:', FRONTEND_URL)

// Parse JSON request bodies
app.use(express.json())

// Environment variables
const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI
const JWT_SECRET = process.env.JWT_SECRET || 'change-me'

// MongoDB connection
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment variables')
  process.exit(1)
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1) })

// ------------------- Routes ------------------- //

// Signup
app.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body || {}

    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' })
    if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const user = new User({ email, password: hashed, name })
    await user.save()

    return res.status(201).json({ message: 'User created' })
  } catch (err) {
    console.error('Signup error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Signin
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })

    const payload = { id: user._id, email: user.email }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })

    return res.json({ token, user: { id: user._id, email: user.email, name: user.name } })
  } catch (err) {
    console.error('Signin error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Logout (stateless JWT)
app.post('/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully' })
})

// Create blog (authenticated)
app.post('/create-blog', authMiddleware, async (req, res) => {
  try {
    const { title, thumbnailUrl, tags, description } = req.body || {}
    if (!title || !description) return res.status(400).json({ error: 'Title and description are required' })

    const blog = new Blog({
      title,
      thumbnailUrl: thumbnailUrl || '',
      tags: Array.isArray(tags) ? tags : [],
      description,
      userId: req.user.id
    })
    await blog.save()

    return res.status(201).json({ message: 'Blog created', blog })
  } catch (err) {
    console.error('Create blog error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Get my blogs (authenticated)
app.get('/my-blogs', authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')

    return res.json({ blogs })
  } catch (err) {
    console.error('Get my blogs error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Get all blogs (public)
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
    return res.json({ blogs })
  } catch (err) {
    console.error('Get blogs error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Get single blog by ID
app.get('/blog/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('userId', 'name email')
    if (!blog) return res.status(404).json({ error: 'Blog not found' })
    return res.json({ blog })
  } catch (err) {
    console.error('Get blog error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Track blog view (increment views count)
app.post('/blog/:id/view', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
    if (!blog) return res.status(404).json({ error: 'Blog not found' })
    return res.json({ views: blog.views })
  } catch (err) {
    console.error('View tracking error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Update blog (authenticated)
app.put('/update-blog/:id', authMiddleware, async (req, res) => {
  try {
    const { title, thumbnailUrl, tags, description } = req.body || {}
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ error: 'Blog not found' })
    if (blog.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized to update this blog' })

    if (title !== undefined) blog.title = title
    if (thumbnailUrl !== undefined) blog.thumbnailUrl = thumbnailUrl
    if (tags !== undefined) blog.tags = Array.isArray(tags) ? tags : []
    if (description !== undefined) blog.description = description
    blog.updatedAt = Date.now()

    await blog.save()
    return res.json({ message: 'Blog updated', blog })
  } catch (err) {
    console.error('Update blog error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Delete blog (authenticated)
app.delete('/delete-blog/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ error: 'Blog not found' })
    if (blog.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized to delete this blog' })

    await Blog.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Blog deleted' })
  } catch (err) {
    console.error('Delete blog error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Comments
app.post('/comment/:blogId', authMiddleware, async (req, res) => {
  try {
    const { commentText } = req.body || {}
    const { blogId } = req.params
    if (!commentText || !commentText.trim()) return res.status(400).json({ error: 'Comment text is required' })

    const blog = await Blog.findById(blogId)
    if (!blog) return res.status(404).json({ error: 'Blog not found' })

    const user = await User.findById(req.user.id)
    const comment = new Comment({
      blogId,
      userId: req.user.id,
      username: user.name || user.email,
      commentText: commentText.trim()
    })
    await comment.save()

    blog.commentsCount = (blog.commentsCount || 0) + 1
    await blog.save()

    return res.status(201).json({ message: 'Comment added', comment })
  } catch (err) {
    console.error('Post comment error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

app.get('/comments/:blogId', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
    return res.json({ comments })
  } catch (err) {
    console.error('Get comments error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Like/Unlike
app.post('/like/:blogId', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId)
    if (!blog) return res.status(404).json({ error: 'Blog not found' })

    const userId = req.user.id
    const hasLiked = blog.likes.includes(userId)

    if (hasLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId)
      blog.likesCount = blog.likes.length
    } else {
      blog.likes.push(userId)
      blog.likesCount = blog.likes.length
    }

    await blog.save()
    return res.json({ message: hasLiked ? 'Blog unliked' : 'Blog liked', liked: !hasLiked, likesCount: blog.likesCount })
  } catch (err) {
    console.error('Like blog error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Health check
app.get('/', (req, res) => res.json({ status: 'ok' }))

// Start server
app.listen(PORT, () => {
  console.log(`Auth server listening on port ${PORT}`)
})
