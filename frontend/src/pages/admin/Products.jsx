import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import { formatPrice } from '../../lib/format'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)

  function load(p = page) {
    setLoading(true)
    api
      .get('/admin/products', { params: { page: p } })
      .then(({ data }) => {
        setProducts(data.data)
        setMeta(data.meta)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    await api.delete(`/admin/products/${product.id}`)
    load(page)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Products</h1>
        <Link
          to="/admin/products/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-gold-dark"
        >
          + New Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-paper-dim/40 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted">
                  Loading&hellip;
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img src={p.image_url} alt={p.name} className="h-10 w-9 rounded-sm object-cover" />
                    <span>{p.name}</span>
                  </td>
                  <td className="px-4 py-3">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3">{formatPrice(p.current_price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                      {p.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/products/${p.id}/edit`} className="text-gold-dark hover:underline">
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="ml-4 text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.last_page > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-full text-sm ${p === meta.current_page ? 'bg-ink text-white' : 'text-ink hover:bg-paper-dim'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
