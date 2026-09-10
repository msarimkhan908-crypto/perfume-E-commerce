import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const navLinkClass = ({ isActive }) =>
  `text-sm uppercase tracking-wide transition hover:text-gold-dark ${
    isActive ? 'text-gold-dark' : 'text-ink'
  }`

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="font-display text-2xl tracking-wide text-ink">
          Essence
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
          {user && (
            <NavLink to="/orders" className={navLinkClass}>
              My Orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-sm uppercase tracking-wide text-ink hover:text-gold-dark">
            Cart
            {itemCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm text-muted">Hi, {user.name.split(' ')[0]}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm uppercase tracking-wide text-ink hover:text-gold-dark"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden text-sm uppercase tracking-wide text-ink hover:text-gold-dark sm:block">
              Login
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="text-ink md:hidden"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-3 border-t border-line bg-paper px-4 py-4 md:hidden">
          <NavLink to="/" className={navLinkClass} end onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Shop
          </NavLink>
          {user && (
            <NavLink to="/orders" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              My Orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Admin
            </NavLink>
          )}
          {user ? (
            <button type="button" onClick={handleLogout} className="text-left text-sm uppercase tracking-wide text-ink">
              Logout
            </button>
          ) : (
            <NavLink to="/login" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Login
            </NavLink>
          )}
        </nav>
      )}
    </header>
  )
}
