/**
 * AdminDashboard.jsx
 * Quick-launch cards for each admin section.
 * (No /api/admin/dashboard endpoint exists in the backend.)
 */

import { Link } from 'react-router-dom'
import { Package, ShoppingCart, Users, Image, Tag, Store, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const SECTIONS = [
  {
    path: '/admin/products',
    label: 'Products',
    desc: 'Add, edit, or delete products in the store',
    icon: Package,
    color: '#E8607A', bg: '#fdf2f5',
  },
  {
    path: '/admin/orders',
    label: 'Orders',
    desc: 'View your store orders and their status',
    icon: ShoppingCart,
    color: '#2563eb', bg: '#eff6ff',
  },
  {
    path: '/admin/users',
    label: 'Users',
    desc: 'Browse registered customer accounts',
    icon: Users,
    color: '#7c3aed', bg: '#f5f3ff',
  },
  {
    path: '/admin/banners',
    label: 'Banners',
    desc: 'Manage the homepage hero slider banners',
    icon: Image,
    color: '#0369a1', bg: '#e0f2fe',
  },
  {
    path: '/admin/categories',
    label: 'Categories',
    desc: 'Create and organise product categories',
    icon: Tag,
    color: '#059669', bg: '#ecfdf5',
  },
  {
    path: '/admin/brands',
    label: 'Brands',
    desc: 'Add brand logos shown in the store carousel',
    icon: Store,
    color: '#d97706', bg: '#fffbeb',
  },
]

export default function AdminDashboard() {
  const { user } = useApp()

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)' }}>
          Welcome back, {user?.firstName} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
          What would you like to manage today?
        </p>
      </div>

      {/* Section cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {SECTIONS.map(({ path, label, desc, icon: Icon, color, bg }) => (
          <Link
            key={path}
            to={path}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: 'var(--bg)', borderRadius: 16,
                border: '1px solid var(--border)',
                padding: 24, cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'box-shadow 0.15s, transform 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={24} color={color} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)', marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>{desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color, fontWeight: 600 }}>
                Open <ArrowRight size={13} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Shared helpers used by other admin pages
export function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320 }}>
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div className="admin-spinner" style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 14px' }} />
        <span style={{ fontSize: 14 }}>Loading…</span>
      </div>
    </div>
  )
}

export function ErrorBanner({ message }) {
  return (
    <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 12, padding: '16px 20px', color: '#b91c1c', fontSize: 14 }}>
      <strong>Error: </strong>{message}
    </div>
  )
}
