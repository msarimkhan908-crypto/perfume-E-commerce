import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../lib/format'
import api, { getErrorMessage } from '../lib/api'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    customer_name: user?.name || '',
    customer_phone: '',
    customer_email: user?.email || '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: 'Pakistan',
    notes: '',
  })

  if (items.length === 0) return <Navigate to="/cart" replace />
  if (!user) return <Navigate to="/login" state={{ from: { pathname: '/checkout' } }} replace />

  const shippingFee = subtotal >= 100 ? 0 : 5
  const total = subtotal + shippingFee

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const { data } = await api.post('/orders', {
        ...form,
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      })
      clearCart()
      navigate(`/order-confirmation/${data.data.id}`)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not place your order. Please check your details and try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl text-ink">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <h2 className="font-display text-lg text-ink">Shipping Details</h2>

          {error && <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="customer_name" value={form.customer_name} onChange={handleChange} required />
            <Field label="Phone Number" name="customer_phone" value={form.customer_phone} onChange={handleChange} required />
          </div>
          <Field label="Email" name="customer_email" type="email" value={form.customer_email} onChange={handleChange} />
          <Field label="Street Address" name="shipping_address" value={form.shipping_address} onChange={handleChange} required />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City" name="shipping_city" value={form.shipping_city} onChange={handleChange} required />
            <Field label="State / Province" name="shipping_state" value={form.shipping_state} onChange={handleChange} />
            <Field label="Postal Code" name="shipping_postal_code" value={form.shipping_postal_code} onChange={handleChange} />
          </div>
          <Field label="Country" name="shipping_country" value={form.shipping_country} onChange={handleChange} />
          <div>
            <label className="text-xs uppercase tracking-wide text-muted">Order Notes (optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <div className="rounded-sm border border-gold/40 bg-gold-light/10 px-4 py-3 text-sm text-ink">
            Payment method: <strong>Cash on Delivery</strong> &mdash; pay when your order arrives.
          </div>
        </div>

        <div className="h-fit rounded-sm border border-line bg-white/60 p-6">
          <h2 className="font-display text-lg text-ink">Order Summary</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink/80">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span>
                  {i.name} &times; {i.quantity}
                </span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm text-ink/80">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-ink/80">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-semibold text-ink">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-gold-dark disabled:opacity-50"
          >
            {submitting ? 'Placing order…' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  )
}
