import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { formatDate, formatPrice, STATUS_STYLES } from '../lib/format'

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/orders')
      .then(({ data }) => setOrders(data.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl text-ink">My Orders</h1>

      {loading ? (
        <p className="mt-8 text-muted">Loading&hellip;</p>
      ) : orders.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-muted">You haven&rsquo;t placed any orders yet.</p>
          <Link to="/shop" className="mt-4 inline-block text-gold-dark hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-line">
          {orders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
              <div>
                <Link to={`/orders/${order.id}`} className="font-display text-lg text-ink hover:text-gold-dark">
                  {order.order_number}
                </Link>
                <p className="text-xs text-muted">{formatDate(order.created_at)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
                {order.status}
              </span>
              <span className="font-semibold text-ink">{formatPrice(order.total)}</span>
              <Link to={`/orders/${order.id}`} className="text-sm text-gold-dark hover:underline">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
