import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../lib/api'
import { formatPrice } from '../lib/format'

export default function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.data))
  }, [id])

  if (!order) return <div className="mx-auto max-w-3xl px-4 py-20 text-muted">Loading&hellip;</div>

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        &#10003;
      </div>
      <h1 className="mt-6 font-display text-3xl text-ink">Order Placed!</h1>
      <p className="mt-2 text-muted">
        Thank you, {order.customer_name}. Your order <strong>{order.order_number}</strong> has been received and
        will be paid via cash on delivery.
      </p>

      <div className="mt-8 rounded-sm border border-line bg-white/60 p-6 text-left">
        <h2 className="font-display text-lg text-ink">Order Summary</h2>
        <ul className="mt-4 space-y-2 text-sm text-ink/80">
          {order.items?.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.product_name} &times; {item.quantity}
              </span>
              <span>{formatPrice(item.line_total)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4 font-semibold text-ink">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link to="/shop" className="rounded-full border border-ink px-6 py-2.5 text-sm uppercase tracking-wide text-ink hover:bg-ink hover:text-white">
          Continue Shopping
        </Link>
        <Link to="/orders" className="rounded-full bg-ink px-6 py-2.5 text-sm uppercase tracking-wide text-white hover:bg-gold-dark">
          View My Orders
        </Link>
      </div>
    </div>
  )
}
