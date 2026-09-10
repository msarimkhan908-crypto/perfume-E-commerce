export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl">Essence</h3>
          <p className="mt-2 max-w-xs text-sm text-paper/70">
            Curated fine fragrances for every story you wear. Crafted notes, lasting impressions.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wide text-gold-light">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-paper/70">
            <li>Eau de Parfum</li>
            <li>Eau de Toilette</li>
            <li>Oud &amp; Attar</li>
            <li>Gift Sets</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wide text-gold-light">Customer Care</h4>
          <ul className="mt-3 space-y-2 text-sm text-paper/70">
            <li>Cash on Delivery</li>
            <li>Order Tracking</li>
            <li>Returns &amp; Exchanges</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 py-4 text-center text-xs text-paper/50">
        &copy; {new Date().getFullYear()} Essence Perfumery. All rights reserved.
      </div>
    </footer>
  )
}
