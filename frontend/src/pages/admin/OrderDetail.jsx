import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../lib/api'
import { formatDate, formatPrice, STATUS_STYLES } from '../../lib/format'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [updating, setUpdating] = useState(false)

  function load() {
    api.get(`/admin/orders/${id}`).then(({ data }) => setOrder(data.data))
  }

  useEffect(load, [id])

  async function handleStatusChange(status) {
    setUpdating(true)
    try {
      const { data } = await api.put(`/admin/orders/${id}/status`, { status })
      setOrder(data.data)
    } finally {
      setUpdating(false)
    }
  }

  if (!order) return <p className="text-muted">Loading&hellip;</p>

  return (
    <div className="max-w-3xl">
      <Link to="/admin/orders" className="text-sm text-gold-dark hover:underline">
        &larr; Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">{order.order_number}</h1>
          <p className="text-sm text-muted">Placed on {formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
            {order.status}
          </span>
          <select
            value={order.status}
            disabled={updating}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-sm border border-line bg-white p-5">
          <h2 className="font-display text-lg text-ink">Customer</h2>
          <p className="mt-2 text-sm text-ink/80">{order.customer?.name || order.customer_name}</p>
          <p className="text-sm text-ink/80">{order.customer?.email || order.customer_email}</p>
          <p className="text-sm text-ink/80">{order.customer_phone}</p>
        </div>
        <div className="rounded-sm border border-line bg-white p-5">
          <h2 className="font-display text-lg text-ink">Shipping Address</h2>
          <p className="mt-2 text-sm text-ink/80">
            {order.shipping_address}, {order.shipping_city}
            {order.shipping_state ? `, ${order.shipping_state}` : ''}
          </p>
          <p className="text-sm text-ink/80">
            {order.shipping_postal_code} {order.shipping_country}
          </p>
        </div>
      </div>

      {order.notes && (
        <div className="mt-6 rounded-sm border border-line bg-white p-5">
          <h2 className="font-display text-lg text-ink">Notes</h2>
          <p className="mt-2 text-sm text-ink/80">{order.notes}</p>
        </div>
      )}

      <div className="mt-6 rounded-sm border border-line bg-white p-5">
        <h2 className="font-display text-lg text-ink">Items</h2>
        <ul className="mt-4 divide-y divide-line">
          {order.items?.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3">
              <img src={item.product_image} alt={item.product_name} className="h-16 w-14 rounded-sm object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{item.product_name}</p>
                <p className="text-xs text-muted">
                  {formatPrice(item.unit_price)} &times; {item.quantity}
                </p>
              </div>
              <span className="text-sm font-semibold text-ink">{formatPrice(item.line_total)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-line pt-4 text-sm text-ink/80">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shipping_fee === 0 ? 'Free' : formatPrice(order.shipping_fee)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-ink">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
