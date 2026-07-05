export function saveAuth(token, user) {
  localStorage.setItem('vm_token', token)
  localStorage.setItem('vm_user', JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem('vm_token')
  localStorage.removeItem('vm_user')
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('vm_user'))
  } catch {
    return null
  }
}

export function isLoggedIn() {
  return !!localStorage.getItem('vm_token')
}
