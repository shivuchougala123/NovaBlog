// Read the API base from the build-time env var or fall back to localhost for dev
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function getAuthHeader() {
  const token = localStorage.getItem('novablog_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function createBlog(data) {
  const response = await fetch(`${API_BASE}/create-blog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create blog')
  }
  
  return response.json()
}

export async function getMyBlogs() {
  const response = await fetch(`${API_BASE}/my-blogs`, {
    headers: getAuthHeader()
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch blogs')
  }
  
  return response.json()
}

export async function getAllBlogs() {
  const response = await fetch(`${API_BASE}/blogs`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch blogs')
  }
  
  return response.json()
}

export async function getBlogById(id) {
  const response = await fetch(`${API_BASE}/blog/${id}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch blog')
  }
  
  return response.json()
}

export async function updateBlog(id, data) {
  const response = await fetch(`${API_BASE}/update-blog/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update blog')
  }
  
  return response.json()
}

export async function deleteBlog(id) {
  const response = await fetch(`${API_BASE}/delete-blog/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete blog')
  }
  
  return response.json()
}

export async function postComment(blogId, commentText) {
  const response = await fetch(`${API_BASE}/comment/${blogId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ commentText })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to post comment')
  }
  
  return response.json()
}

export async function getComments(blogId) {
  const response = await fetch(`${API_BASE}/comments/${blogId}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch comments')
  }
  
  return response.json()
}

export async function toggleLike(blogId) {
  const response = await fetch(`${API_BASE}/like/${blogId}`, {
    method: 'POST',
    headers: getAuthHeader()
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to toggle like')
  }
  
  return response.json()
}


