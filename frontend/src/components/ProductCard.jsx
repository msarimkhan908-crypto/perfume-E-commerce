import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-sm border border-line bg-white/60 transition hover:shadow-lg">
      <Link to={`/products/${product.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-paper-dim">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.on_sale && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-white">
            Sale
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.brand?.name && (
          <span className="text-xs uppercase tracking-wide text-muted">{product.brand.name}</span>
        )}
        <Link to={`/products/${product.slug}`} className="font-display text-lg leading-snug text-ink hover:text-gold-dark">
          {product.name}
        </Link>
        {product.size_ml && <span className="text-xs text-muted">{product.size_ml} ml</span>}
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-ink">{formatPrice(product.current_price)}</span>
            {product.on_sale && (
              <span className="text-sm text-muted line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          <button
            type="button"
            disabled={!product.in_stock}
            onClick={() => addItem(product, 1)}
            className="rounded-full border border-ink px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink transition hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
