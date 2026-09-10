import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'

const GENDERS = [
  { value: '', label: 'All' },
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'unisex', label: 'Unisex' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState(null)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  const category = searchParams.get('category') || ''
  const brand = searchParams.get('brand') || ''
  const gender = searchParams.get('gender') || ''
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'newest'
  const page = Number(searchParams.get('page') || 1)

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data))
    api.get('/brands').then(({ data }) => setBrands(data.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    api
      .get('/products', { params: { category, brand, gender, search, sort, page, per_page: 12 } })
      .then(({ data }) => {
        setProducts(data.data)
        setMeta(data.meta)
      })
      .finally(() => setLoading(false))
  }, [category, brand, gender, search, sort, page])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  function goToPage(nextPage) {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(nextPage))
    setSearchParams(next)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl text-ink">Shop All Fragrances</h1>
        <p className="text-sm text-muted">{meta?.total ?? 0} fragrances found</p>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-6">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted" htmlFor="search">
              Search
            </label>
            <input
              id="search"
              type="text"
              defaultValue={search}
              onKeyDown={(e) => e.key === 'Enter' && updateParam('search', e.currentTarget.value)}
              onBlur={(e) => updateParam('search', e.currentTarget.value)}
              placeholder="Search fragrances&hellip;"
              className="mt-2 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wide text-muted">Category</h3>
            <div className="mt-2 flex flex-col gap-1.5">
              <button
                onClick={() => updateParam('category', '')}
                className={`text-left text-sm ${!category ? 'font-semibold text-gold-dark' : 'text-ink hover:text-gold-dark'}`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateParam('category', c.slug)}
                  className={`text-left text-sm ${category === c.slug ? 'font-semibold text-gold-dark' : 'text-ink hover:text-gold-dark'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wide text-muted">Brand</h3>
            <div className="mt-2 flex flex-col gap-1.5">
              <button
                onClick={() => updateParam('brand', '')}
                className={`text-left text-sm ${!brand ? 'font-semibold text-gold-dark' : 'text-ink hover:text-gold-dark'}`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => updateParam('brand', b.slug)}
                  className={`text-left text-sm ${brand === b.slug ? 'font-semibold text-gold-dark' : 'text-ink hover:text-gold-dark'}`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wide text-muted">Gender</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => updateParam('gender', g.value)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    gender === g.value ? 'border-gold bg-gold text-white' : 'border-line text-ink hover:border-gold'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex justify-end">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="rounded-sm border border-line bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {loading ? (
            <p className="text-muted">Loading fragrances&hellip;</p>
          ) : products.length === 0 ? (
            <p className="text-muted">No fragrances match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {meta && meta.last_page > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`h-8 w-8 rounded-full text-sm ${
                    p === meta.current_page ? 'bg-ink text-white' : 'text-ink hover:bg-paper-dim'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
