import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/products', { params: { featured: 1, per_page: 8 } }),
      api.get('/categories'),
    ])
      .then(([productsRes, categoriesRes]) => {
        setFeatured(productsRes.data.data)
        setCategories(categoriesRes.data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-light">Fine Perfumery</p>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
              Wear a Scent
              <br />
              Worth Remembering
            </h1>
            <p className="mt-6 max-w-md text-paper/70">
              Discover an exclusive collection of eau de parfum, eau de toilette, and rare oud &mdash;
              sourced from the world&rsquo;s most storied fragrance houses.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition hover:bg-gold-light"
            >
              Explore the Collection
            </Link>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <img
              src="https://placehold.co/700x700/15120f/d9b96a?text=Essence"
              alt="Featured perfume"
              className="h-full w-full rounded-full object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl text-ink">Shop by Category</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/shop?category=${c.slug}`}
                className="group flex flex-col items-center gap-3 rounded-sm border border-line bg-white/50 p-6 text-center transition hover:border-gold"
              >
                <span className="font-display text-lg text-ink group-hover:text-gold-dark">{c.name}</span>
                <span className="text-xs text-muted">{c.products_count} items</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">Featured Fragrances</h2>
          <Link to="/shop" className="text-sm uppercase tracking-wide text-gold-dark hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <p className="mt-8 text-muted">Loading fragrances&hellip;</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
