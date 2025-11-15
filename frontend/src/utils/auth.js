// Auth utility functions

export function getToken() {
  return localStorage.getItem('novablog_token')
}

export function getUser() {
  const userStr = localStorage.getItem('novablog_user')
  try {
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

export function setAuth(token, user) {
  localStorage.setItem('novablog_token', token)
  localStorage.setItem('novablog_user', JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem('novablog_token')
  localStorage.removeItem('novablog_user')
}

export function isAuthenticated() {
  return !!getToken()
}
