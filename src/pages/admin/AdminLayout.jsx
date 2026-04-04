/**
 * AdminLayout.jsx
 * ─────────────────────────────────────────────────────────────
 * Sidebar + top-bar shell for all admin pages.
 * Uses <Outlet /> so child routes (dashboard, products, etc.) render inside.
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react'
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Image, Tag, Store, LogOut, Menu, ChevronRight, Baby,
  Sun, Moon,
} from 'lucide-react'

const NAV = [
  { path: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { path: '/admin/products',   label: 'Products',   icon: Package },
  { path: '/admin/orders',     label: 'Orders',     icon: ShoppingCart },
  { path: '/admin/users',      label: 'Users',      icon: Users },
  { path: '/admin/banners',    label: 'Banners',    icon: Image },
  { path: '/admin/categories', label: 'Categories', icon: Tag },
  { path: '/admin/brands',     label: 'Brands',     icon: Store },
]

export default function AdminLayout() {
  const { user, isAdmin, logout, theme, toggleTheme } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path)

  const handleLogout = () => { logout(); navigate('/login', { state: { from: '/admin' } }) }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // Logged in but not admin → show access denied
  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', flexDirection: 'column', gap: 16, direction: 'ltr' }}>
        <div style={{ fontSize: 64 }}>🔒</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Access Denied</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Your account <strong>{user.email}</strong> does not have admin privileges.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Ask a super-admin to grant you the <code>ADMIN</code> role in the database.
        </p>
        <button onClick={handleLogout} style={{ marginTop: 8, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          Log out
        </button>
      </div>
    )
  }

  const SW = collapsed ? 68 : 240

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-topbar)', direction: 'ltr' }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside style={{
        width: SW, flexShrink: 0,
        background: 'var(--nav-dark)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 200,
        transition: 'width 0.25s ease',
        overflow: 'hidden',
        boxShadow: '2px 0 20px rgba(0,0,0,0.15)',
      }}>

        {/* Logo row */}
        <div style={{ padding: '18px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10, minHeight: 64 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Baby size={20} color="white" />
          </div>
          {!collapsed && (
            <span style={{ color: 'white', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden' }}>
              Babystore
              <span style={{ display: 'block', fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.45)', marginTop: -2 }}>Admin Panel</span>
            </span>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
          {NAV.map(({ path, label, icon: Icon, exact }) => {
            const active = isActive(path, exact)
            return (
              <Link
                key={path}
                to={path}
                title={collapsed ? label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 12px', borderRadius: 10,
                  textDecoration: 'none',
                  background: active ? 'var(--primary)' : 'transparent',
                  color: active ? 'white' : 'rgba(255,255,255,0.6)',
                  fontWeight: active ? 600 : 400,
                  fontSize: 14,
                  transition: 'background 0.15s, color 0.15s',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon size={19} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{label}</span>}
                {!collapsed && active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </Link>
            )
          })}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {!collapsed && (
            <div style={{ padding: '4px 12px 12px', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
              <div style={{ fontWeight: 600, color: 'white', fontSize: 14 }}>{user.firstName} {user.lastName}</div>
              <div style={{ fontSize: 11, marginTop: 2 }}>{user.email}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10,
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              width: '100%', fontSize: 14, whiteSpace: 'nowrap',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────── */}
      <div style={{ marginLeft: SW, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'margin-left 0.25s ease' }}>

        {/* Top bar */}
        <header style={{
          height: 64, background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', gap: 12,
          position: 'sticky', top: 0, zIndex: 100,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{ background: 'none', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)', padding: '6px 8px', borderRadius: 8, display: 'flex', alignItems: 'center' }}
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-secondary)' }}>
            <span>Admin</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>
              {NAV.find(n => isActive(n.path, n.exact))?.label || 'Page'}
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{ background: 'none', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)', padding: '6px 8px', borderRadius: 8, display: 'flex', alignItems: 'center' }}
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Go to store */}
          <Link
            to="/"
            style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, padding: '6px 14px', border: '1.5px solid var(--primary)', borderRadius: 8 }}
          >
            ← View Store
          </Link>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 24, maxWidth: 1400 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

