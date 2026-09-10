import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const linkClass = ({ isActive }) =>
  `block rounded-sm px-4 py-2.5 text-sm transition ${
    isActive ? 'bg-gold text-white' : 'text-paper/80 hover:bg-white/10'
  }`

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="flex w-60 shrink-0 flex-col bg-ink text-paper">
        <div className="px-5 py-6">
          <Link to="/" className="font-display text-xl">
            Essence
          </Link>
          <p className="text-xs text-paper/50">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/admin/categories" className={linkClass}>
            Categories
          </NavLink>
          <NavLink to="/admin/brands" className={linkClass}>
            Brands
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            Orders
          </NavLink>
        </nav>
        <div className="border-t border-paper/10 px-5 py-4">
          <p className="text-xs text-paper/60">{user?.name}</p>
          <button type="button" onClick={handleLogout} className="mt-2 text-xs text-gold-light hover:underline">
            Logout
          </button>
          <Link to="/" className="mt-1 block text-xs text-paper/50 hover:underline">
            &larr; Back to store
          </Link>
        </div>
      </aside>

      <div className="flex-1 overflow-x-auto p-6 sm:p-8">
        <Outlet />
      </div>
    </div>
  )
}
