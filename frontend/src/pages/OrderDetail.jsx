import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../lib/api'
import { formatDate, formatPrice, STATUS_STYLES } from '../lib/format'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.data))
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl">Order not found</h1>
        <Link to="/orders" className="mt-4 inline-block text-gold-dark hover:underline">
          Back to my orders
        </Link>
      </div>
    )
  }

  if (!order) return <div className="mx-auto max-w-3xl px-4 py-20 text-muted">Loading&hellip;</div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/orders" className="text-sm text-gold-dark hover:underline">
        &larr; Back to my orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ink">{order.order_number}</h1>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
          {order.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">Placed on {formatDate(order.created_at)}</p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div className="rounded-sm border border-line bg-white/60 p-5">
          <h2 className="font-display text-lg text-ink">Shipping To</h2>
          <p className="mt-2 text-sm text-ink/80">{order.customer_name}</p>
          <p className="text-sm text-ink/80">{order.customer_phone}</p>
          <p className="text-sm text-ink/80">
            {order.shipping_address}, {order.shipping_city}
            {order.shipping_state ? `, ${order.shipping_state}` : ''}
          </p>
          <p className="text-sm text-ink/80">
            {order.shipping_postal_code} {order.shipping_country}
          </p>
        </div>
        <div className="rounded-sm border border-line bg-white/60 p-5">
          <h2 className="font-display text-lg text-ink">Payment</h2>
          <p className="mt-2 text-sm capitalize text-ink/80">
            {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
          </p>
          {order.notes && (
            <>
              <h3 className="mt-4 text-xs uppercase tracking-wide text-muted">Notes</h3>
              <p className="text-sm text-ink/80">{order.notes}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-sm border border-line bg-white/60 p-5">
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
