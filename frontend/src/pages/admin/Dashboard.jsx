import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import { formatDate, formatPrice, STATUS_STYLES } from '../../lib/format'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => {
      setStats(data.stats)
      setRecentOrders(data.recent_orders)
    })
  }, [])

  const cards = stats
    ? [
        { label: 'Total Products', value: stats.total_products },
        { label: 'Total Orders', value: stats.total_orders },
        { label: 'Pending Orders', value: stats.pending_orders },
        { label: 'Customers', value: stats.total_customers },
        { label: 'Total Revenue', value: formatPrice(stats.total_revenue) },
        { label: 'Low Stock Items', value: stats.low_stock_products },
      ]
    : []

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-sm border border-line bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-muted">{c.label}</p>
            <p className="mt-2 font-display text-2xl text-ink">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-gold-dark hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-sm border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper-dim/40 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${order.id}`} className="text-gold-dark hover:underline">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{order.customer_name}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(order.created_at)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
