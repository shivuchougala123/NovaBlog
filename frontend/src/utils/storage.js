import { v4 as uuidv4 } from 'uuid'

const KEY = 'novablog_blogs'

export function loadBlogs() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) { return [] }
}

export function saveBlogs(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function createBlog(data) {
  const blogs = loadBlogs()
  const blog = { id: uuidv4(), createdAt: Date.now(), ...data }
  blogs.unshift(blog)
  saveBlogs(blogs)
  return blog
}

export function updateBlog(id, patch) {
  const blogs = loadBlogs()
  const idx = blogs.findIndex(b => b.id === id)
  if (idx === -1) return null
  blogs[idx] = { ...blogs[idx], ...patch }
  saveBlogs(blogs)
  return blogs[idx]
}

export function deleteBlog(id) {
  const blogs = loadBlogs().filter(b => b.id !== id)
  saveBlogs(blogs)
}
