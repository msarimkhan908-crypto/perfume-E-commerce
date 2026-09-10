import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setLoading(false)
      return
    }

    api
      .get('/me')
      .then(({ data }) => {
        setUser(data.data)
        localStorage.setItem('auth_user', JSON.stringify(data.data))
      })
      .catch(() => {
        setUser(null)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      })
      .finally(() => setLoading(false))
  }, [])

  function persistSession(userData, token) {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    setUser(userData)
  }

  async function login(email, password) {
    const { data } = await api.post('/login', { email, password })
    persistSession(data.user, data.token)
    return data.user
  }

  async function register(name, email, password, password_confirmation) {
    const { data } = await api.post('/register', { name, email, password, password_confirmation })
    persistSession(data.user, data.token)
    return data.user
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
