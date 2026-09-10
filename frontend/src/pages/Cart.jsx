import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/format'

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Your cart is empty</h1>
        <p className="mt-2 text-muted">Discover a fragrance that tells your story.</p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-full bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-gold-dark"
        >
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl text-ink">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5">
              <img src={item.image_url} alt={item.name} className="h-24 w-20 rounded-sm object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <Link to={`/products/${item.slug}`} className="font-display text-lg text-ink hover:text-gold-dark">
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-muted hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-ink"
                    >
                      &minus;
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-ink"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-ink">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-sm border border-line bg-white/60 p-6">
          <h2 className="font-display text-lg text-ink">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-ink/80">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-ink/80">
            <span>Shipping</span>
            <span>{subtotal >= 100 ? 'Free' : formatPrice(5)}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-semibold text-ink">
            <span>Total</span>
            <span>{formatPrice(subtotal >= 100 ? subtotal : subtotal + 5)}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="mt-6 w-full rounded-full bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-gold-dark"
          >
            Checkout
          </button>
          <p className="mt-3 text-center text-xs text-muted">Cash on delivery available</p>
        </div>
      </div>
    </div>
  )
}
