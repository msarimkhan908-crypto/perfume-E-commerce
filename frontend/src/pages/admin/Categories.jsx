import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../../lib/api'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  function load() {
    api.get('/admin/categories').then(({ data }) => setCategories(data.data))
  }

  useEffect(load, [])

  function startEdit(category) {
    setEditingId(category.id)
    setName(category.name)
    setDescription(category.description || '')
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
        await api.put(`/admin/categories/${editingId}`, { name, description })
      } else {
        await api.post('/admin/categories', { name, description })
      }
      resetForm()
      load()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save category.'))
    }
  }

  async function handleDelete(category) {
    if (!confirm(`Delete "${category.name}"?`)) return
    await api.delete(`/admin/categories/${category.id}`)
    load()
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-ink">Categories</h1>

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
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-ink">{c.name}</p>
              <p className="text-xs text-muted">{c.products_count} products</p>
            </div>
            <div className="flex gap-4 text-sm">
              <button onClick={() => startEdit(c)} className="text-gold-dark hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(c)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </li>
        ))}
        {categories.length === 0 && <li className="px-4 py-6 text-center text-muted">No categories yet.</li>}
      </ul>
    </div>
  )
}
