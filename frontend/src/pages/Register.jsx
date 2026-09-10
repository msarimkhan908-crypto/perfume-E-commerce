import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../lib/api'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form.name, form.email, form.password, form.password_confirmation)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create your account.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-ink">Create an Account</h1>
      <p className="mt-2 text-sm text-muted">Join us for a personalized fragrance experience.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div>
          <label className="text-xs uppercase tracking-wide text-muted" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted" htmlFor="password_confirmation">
            Confirm Password
          </label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            required
            minLength={8}
            value={form.password_confirmation}
            onChange={handleChange}
            className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-gold-dark disabled:opacity-50"
        >
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-gold-dark hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
