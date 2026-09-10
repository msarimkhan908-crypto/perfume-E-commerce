import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { getErrorMessage } from '../../lib/api'

const emptyForm = {
  name: '',
  category_id: '',
  brand_id: '',
  price: '',
  sale_price: '',
  sku: '',
  size_ml: '',
  gender: 'unisex',
  stock: '',
  image_url: '',
  short_description: '',
  description: '',
  is_featured: false,
  is_active: true,
}

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    api.get('/admin/categories').then(({ data }) => setCategories(data.data))
    api.get('/admin/brands').then(({ data }) => setBrands(data.data))
  }, [])

  useEffect(() => {
    if (!isEdit) return
    api.get(`/admin/products/${id}`).then(({ data }) => {
      const p = data.data
      setForm({
        name: p.name,
        category_id: p.category?.id || '',
        brand_id: p.brand?.id || '',
        price: p.price,
        sale_price: p.sale_price ?? '',
        sku: p.sku,
        size_ml: p.size_ml ?? '',
        gender: p.gender,
        stock: p.stock,
        image_url: p.image_url ?? '',
        short_description: p.short_description ?? '',
        description: p.description ?? '',
        is_featured: p.is_featured,
        is_active: p.is_active ?? true,
      })
      setLoading(false)
    })
  }, [id, isEdit])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const payload = {
      ...form,
      category_id: form.category_id || null,
      brand_id: form.brand_id || null,
      sale_price: form.sale_price === '' ? null : form.sale_price,
      size_ml: form.size_ml === '' ? null : form.size_ml,
    }

    try {
      if (isEdit) {
        await api.put(`/admin/products/${id}`, payload)
      } else {
        await api.post('/admin/products', payload)
      }
      navigate('/admin/products')
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save the product. Please check the fields.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-muted">Loading&hellip;</p>

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-ink">{isEdit ? 'Edit Product' : 'New Product'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error && <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} required />
          <TextField label="SKU" name="sku" value={form.sku} onChange={handleChange} required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted">Category</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-muted">Brand</label>
            <select
              name="brand_id"
              value={form.brand_id}
              onChange={handleChange}
              className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
            >
              <option value="">None</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <TextField label="Price" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
          <TextField label="Sale Price" name="sale_price" type="number" step="0.01" value={form.sale_price} onChange={handleChange} />
          <TextField label="Size (ml)" name="size_ml" type="number" value={form.size_ml} onChange={handleChange} />
          <TextField label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
            >
              <option value="unisex">Unisex</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>
          <TextField label="Image URL" name="image_url" value={form.image_url} onChange={handleChange} />
        </div>

        <TextField label="Short Description" name="short_description" value={form.short_description} onChange={handleChange} />

        <div>
          <label className="text-xs uppercase tracking-wide text-muted">Description</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
            Active (visible in store)
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-gold-dark disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Save Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="rounded-full border border-line px-8 py-3 text-sm uppercase tracking-wide text-ink hover:border-ink"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function TextField({ label, name, value, onChange, type = 'text', step, required = false }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  )
}
