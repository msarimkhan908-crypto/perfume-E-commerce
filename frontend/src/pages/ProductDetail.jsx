import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../lib/api'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [notFound, setNotFound] = useState(false)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    setProduct(null)
    setNotFound(false)
    setAdded(false)
    api
      .get(`/products/${slug}`)
      .then(({ data }) => setProduct(data.data))
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl">Fragrance not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-gold-dark hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  if (!product) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-muted">Loading&hellip;</div>
  }

  function handleAddToCart() {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="text-xs text-muted">
        <Link to="/shop" className="hover:text-gold-dark">
          Shop
        </Link>{' '}
        / {product.category?.name && <span>{product.category.name} / </span>}
        <span className="text-ink">{product.name}</span>
      </div>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="aspect-[3/4] overflow-hidden rounded-sm bg-paper-dim">
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div>
          {product.brand?.name && (
            <span className="text-xs uppercase tracking-wide text-muted">{product.brand.name}</span>
          )}
          <h1 className="mt-1 font-display text-3xl text-ink">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-muted">
            <span>&#9733; {product.rating}</span>
            {product.size_ml && <span>&middot; {product.size_ml} ml</span>}
            <span className="capitalize">&middot; {product.gender}</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-2xl text-ink">{formatPrice(product.current_price)}</span>
            {product.on_sale && (
              <span className="text-muted line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-ink/80">{product.description}</p>

          <div className="mt-6">
            {product.in_stock ? (
              <span className="text-sm text-emerald-700">In stock &middot; {product.stock} available</span>
            ) : (
              <span className="text-sm text-red-600">Out of stock</span>
            )}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-line">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-ink"
              >
                &minus;
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2 text-ink"
              >
                +
              </button>
            </div>

            <button
              type="button"
              disabled={!product.in_stock}
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? 'Added to Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
