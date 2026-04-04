/**
 * AdminUsers.jsx
 * GET /users — list all registered users
 */

import { useState, useEffect } from 'react'
import { adminUsersApi } from '../../api/adminApi'
import { LoadingSpinner, ErrorBanner } from './AdminDashboard'

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    adminUsersApi.getAll()
      .then(data => { setUsers(data.users ?? data.data ?? data ?? []); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Users</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>{users.length} registered users</p>
      </div>

      <div style={S.card}>
        {loading ? <LoadingSpinner /> : error ? <ErrorBanner message={error} /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-topbar)' }}>
                  {['User', 'Email', 'Phone', 'Gender', 'Joined'].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No users found.</td></tr>
                ) : users.map(u => (
                  <tr key={u.id} style={{ borderTop: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={TD}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
                            {(u.firstName?.[0] || u.email?.[0] || '?').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={TD}>{u.email || '—'}</td>
                    <td style={{ ...TD, color: 'var(--text-secondary)' }}>{u.phone || '—'}</td>
                    <td style={TD}>
                      {u.gender ? (
                        <span style={{ background: u.gender === 'FEMALE' ? '#fdf2f5' : '#eff6ff', color: u.gender === 'FEMALE' ? 'var(--primary)' : '#2563eb', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                          {u.gender}
                        </span>
                      ) : '—'}
                    </td>
                    <td style={{ ...TD, color: 'var(--text-secondary)', fontSize: 13 }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
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
  card: { background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' },
}
