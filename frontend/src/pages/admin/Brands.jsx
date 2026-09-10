import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../../lib/api'

export default function Brands() {
  const [brands, setBrands] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  function load() {
    api.get('/admin/brands').then(({ data }) => setBrands(data.data))
  }

  useEffect(load, [])

  function startEdit(brand) {
    setEditingId(brand.id)
    setName(brand.name)
    setDescription(brand.description || '')
  }

  function resetForm() {
    setEditingId(null)
    setName('')
    setDescription('')
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await api.put(`/admin/brands/${editingId}`, { name, description })
      } else {
        await api.post('/admin/brands', { name, description })
      }
      resetForm()
      load()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save brand.'))
    }
  }

  async function handleDelete(brand) {
    if (!confirm(`Delete "${brand.name}"?`)) return
    await api.delete(`/admin/brands/${brand.id}`)
    load()
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-ink">Brands</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 rounded-sm border border-line bg-white p-5 sm:flex-row sm:items-end">
        {error && <p className="w-full rounded-sm bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
        <div className="flex-1">
          <label className="text-xs uppercase tracking-wide text-muted">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-2 w-full rounded-sm border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs uppercase tracking-wide text-muted">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full rounded-sm border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-gold-dark">
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-full border border-line px-5 py-2.5 text-sm uppercase tracking-wide text-ink">
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="mt-6 divide-y divide-line rounded-sm border border-line bg-white">
        {brands.map((b) => (
          <li key={b.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-ink">{b.name}</p>
              <p className="text-xs text-muted">{b.products_count} products</p>
            </div>
            <div className="flex gap-4 text-sm">
              <button onClick={() => startEdit(b)} className="text-gold-dark hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(b)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </li>
        ))}
        {brands.length === 0 && <li className="px-4 py-6 text-center text-muted">No brands yet.</li>}
      </ul>
    </div>
  )
}
