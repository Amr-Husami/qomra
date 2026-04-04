/**
 * AdminOrders.jsx
 * GET /api/orders/my — shows current user's orders
 */

import { useState, useEffect } from 'react'
import { adminOrdersApi } from '../../api/adminApi'
import { LoadingSpinner, ErrorBanner } from './AdminDashboard'
import { RefreshCw } from 'lucide-react'

const STATUS_STYLE = {
  PENDING:    { bg: '#fef3c7', color: '#b45309' },
  PROCESSING: { bg: '#dbeafe', color: '#1d4ed8' },
  SHIPPED:    { bg: '#e0f2fe', color: '#0369a1' },
  DELIVERED:  { bg: '#d1fae5', color: '#065f46' },
  CANCELLED:  { bg: '#fee2e2', color: '#b91c1c' },
}

export default function AdminOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  function load() {
    setLoading(true); setError(null)
    adminOrdersApi.getAll()
      .then(data => { setOrders(data.orders ?? data.data ?? data ?? []); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Orders</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>{orders.length} orders found</p>
        </div>
        <button onClick={load} style={S.ghostBtn}><RefreshCw size={15} /> Refresh</button>
      </div>

      <div style={S.card}>
        {loading ? <LoadingSpinner /> : error ? <ErrorBanner message={error} /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-topbar)' }}>
                  {['Order ID', 'Items', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No orders found.</td></tr>
                ) : orders.map((order, i) => {
                  const statusKey = (order.status || '').toUpperCase()
                  const ss = STATUS_STYLE[statusKey] || { bg: '#f3f4f6', color: '#374151' }
                  return (
                    <tr key={order.id ?? i} style={{ borderTop: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={TD}><span style={{ fontWeight: 700, color: 'var(--primary)' }}>#{order.id}</span></td>
                      <td style={{ ...TD, textAlign: 'center', color: 'var(--text-secondary)' }}>
                        {order.items?.length ?? order.itemCount ?? '—'}
                      </td>
                      <td style={TD}><span style={{ fontWeight: 700 }}>{(order.total || 0).toLocaleString()}</span></td>
                      <td style={TD}>
                        <span style={{ background: ss.bg, color: ss.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                          {order.status || '—'}
                        </span>
                      </td>
                      <td style={{ ...TD, color: 'var(--text-secondary)', fontSize: 13 }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const TH = { padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }
const TD = { padding: '14px 16px', fontSize: 14, color: 'var(--text)' }
const S = {
  card:     { background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' },
  ghostBtn: { display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
}
