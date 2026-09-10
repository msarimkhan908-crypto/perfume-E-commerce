import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../lib/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(email, password)
      const from = location.state?.from?.pathname
      if (user.role === 'admin') navigate('/admin')
      else navigate(from || '/')
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-ink">Welcome Back</h1>
      <p className="mt-2 text-sm text-muted">Sign in to track orders and check out faster.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div>
          <label className="text-xs uppercase tracking-wide text-muted" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-gold-dark disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&rsquo;t have an account?{' '}
        <Link to="/register" className="text-gold-dark hover:underline">
          Create one
        </Link>
      </p>

      <div className="mt-8 rounded-sm border border-line bg-paper-dim/60 p-4 text-xs text-muted">
        <p className="font-semibold text-ink">Demo accounts</p>
        <p className="mt-1">Admin: admin@perfumestore.test / password</p>
        <p>Customer: customer@perfumestore.test / password</p>
      </div>
    </div>
  )
}
