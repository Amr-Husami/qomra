/**
 * AdminProducts.jsx
 * CRUD for products using real API endpoints:
 *   POST   /api/products
 *   PATCH  /api/products/:id
 *   DELETE /api/products/:id
 */

import { useState, useEffect, useRef } from 'react'
import { adminProductsApi, adminCategoriesApi, adminBrandsApi } from '../../api/adminApi'
import { LoadingSpinner, ErrorBanner } from './AdminDashboard'
import { Plus, Search, Edit2, Trash2, X, Save, ChevronLeft, ChevronRight, Upload } from 'lucide-react'

const AGE_GROUPS = ['NEWBORN', 'INFANT', 'TODDLER', 'KIDS', 'MAMAZ']

const EMPTY_FORM = {
  nameAr: '', nameEn: '',
  descriptionAr: '', descriptionEn: '',
  price: '', stock: '',
  brandId: '', categoryId: '',
  ageGroup: 'INFANT',
  isBestSeller: false,
  isSuggestedProduct: false,
  imageFile: null,
}

export default function AdminProducts() {
  const [products, setProducts]     = useState([])
  const [total, setTotal]           = useState(0)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(1)
  const [modal, setModal]           = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [saving, setSaving]         = useState(false)
  const [deleteId, setDeleteId]     = useState(null)
  const [categories, setCategories] = useState([])
  const [brands, setBrands]         = useState([])
  const [previews, setPreviews]     = useState([])  // array of {url, file}
  const fileRef = useRef()
  const limit = 12

  // Load brands + categories for dropdowns
  useEffect(() => {
    adminCategoriesApi.getAll()
      .then(d => setCategories(d.categories ?? d.data ?? d ?? []))
      .catch(() => {})
    adminBrandsApi.getAll()
      .then(d => setBrands(d.brands ?? d.data ?? d ?? []))
      .catch(() => {})
  }, [])

  function load(p = page, q = search) {
    setLoading(true); setError(null)
    adminProductsApi.getAll({ page: p, limit, search: q })
      .then(data => {
        setProducts(data.products ?? data.data ?? data ?? [])
        setTotal(data.total ?? data.count ?? 0)
        setLoading(false)
      })
      .catch(err => { setError(err.message); setLoading(false) })
  }
  useEffect(() => { load() }, [page]) // eslint-disable-line

  const handleSearch = (e) => { e.preventDefault(); setPage(1); load(1, search) }

  const openAdd = () => { setForm(EMPTY_FORM); setPreviews([]); setModal('add') }
  const openEdit = (p) => {
    setForm({
      nameAr: p.nameAr || '', nameEn: p.nameEn || '',
      descriptionAr: p.descriptionAr || '', descriptionEn: p.descriptionEn || '',
      price: p.price ?? '', stock: p.stock ?? '',
      brandId: p.brandId ?? p.brand?.id ?? '',
      categoryId: p.categoryId ?? p.category?.id ?? '',
      ageGroup: p.ageGroup || 'INFANT',
      isBestSeller: !!p.isBestSeller,
      isSuggestedProduct: !!p.isSuggestedProduct,
      imageFile: null,
      _id: p.id,
    })
    // For edit show existing image as single preview
    const existing = p.imageUrl || p.image
    setPreviews(existing ? [{ url: existing, file: null }] : [])
    setModal('edit')
  }

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    if (modal === 'edit') {
      // edit: single image only
      const file = files[0]
      setForm(f => ({ ...f, imageFile: file }))
      setPreviews([{ url: URL.createObjectURL(file), file }])
    } else {
      // add: multiple images — append to existing selection
      const newItems = files.map(f => ({ url: URL.createObjectURL(f), file: f }))
      setPreviews(prev => [...prev, ...newItems])
    }
    // reset input so same file can be re-selected
    e.target.value = ''
  }

  const removePreview = (idx) => setPreviews(prev => prev.filter((_, i) => i !== idx))

  const F = (key) => (v) => setForm(f => ({ ...f, [key]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('nameAr',            form.nameAr)
      fd.append('nameEn',            form.nameEn)
      fd.append('descriptionAr',     form.descriptionAr)
      fd.append('descriptionEn',     form.descriptionEn)
      fd.append('price',             form.price)
      fd.append('stock',             form.stock)
      fd.append('brandId',           form.brandId)
      fd.append('categoryId',        form.categoryId)
      fd.append('ageGroup',          form.ageGroup)
      fd.append('isBestSeller',      form.isBestSeller)
      fd.append('isSuggestedProduct',form.isSuggestedProduct)
      if (modal === 'add') {
        // multiple images: append each file under the key 'images'
        previews.forEach(p => { if (p.file) fd.append('images', p.file) })
      } else {
        // edit: single replacement image
        if (form.imageFile) fd.append('image', form.imageFile)
      }

      if (modal === 'add') {
        await adminProductsApi.create(fd)
      } else {
        await adminProductsApi.update(form._id, fd)
      }
      setModal(null); load()
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try { await adminProductsApi.delete(id); setDeleteId(null); load() }
    catch (err) { alert('Delete failed: ' + err.message) }
  }

  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Products</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>{total} products</p>
        </div>
        <button onClick={openAdd} style={S.primaryBtn}><Plus size={16} /> Add Product</button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-placeholder)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
            style={{ ...S.input, paddingLeft: 38, width: '100%' }} />
        </div>
        <button type="submit" style={S.primaryBtn}>Search</button>
      </form>

      {/* Table */}
      <div style={S.card}>
        {loading ? <LoadingSpinner /> : error ? <ErrorBanner message={error} /> : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-topbar)' }}>
                    {['Name', 'Price', 'Stock', 'Category', 'Age Group', 'Flags', 'Actions'].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No products yet. Click "Add Product" to get started.</td></tr>
                  ) : products.map(p => (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={TD}>
                        <div style={{ fontWeight: 600 }}>{p.nameEn || '—'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.nameAr}</div>
                      </td>
                      <td style={TD}><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.price?.toLocaleString()}</span></td>
                      <td style={TD}>
                        <span style={{ background: (p.stock ?? 0) > 0 ? '#d1fae5' : '#fee2e2', color: (p.stock ?? 0) > 0 ? '#065f46' : '#b91c1c', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                          {p.stock ?? 0}
                        </span>
                      </td>
                      <td style={{ ...TD, color: 'var(--text-secondary)', fontSize: 13 }}>{p.category?.titleEn || p.category?.nameEn || '—'}</td>
                      <td style={{ ...TD, fontSize: 12, color: 'var(--text-secondary)' }}>{p.ageGroup || '—'}</td>
                      <td style={TD}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {p.isBestSeller && <span title="Best Seller" style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>⭐ Best</span>}
                          {p.isSuggestedProduct && <span title="Suggested" style={{ background: '#ede9fe', color: '#6d28d9', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>💡 Suggested</span>}
                        </div>
                      </td>
                      <td style={TD}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openEdit(p)} style={S.iconBtn} title="Edit"><Edit2 size={15} color="#2563eb" /></button>
                          <button onClick={() => setDeleteId(p.id)} style={S.iconBtn} title="Delete"><Trash2 size={15} color="#dc2626" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={S.pageBtn}><ChevronLeft size={16} /></button>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={S.pageBtn}><ChevronRight size={16} /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add / Edit modal */}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Product' : 'Edit Product'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FF label="Name (English)" value={form.nameEn} onChange={F('nameEn')} />
            <FF label="Name (Arabic)"  value={form.nameAr} onChange={F('nameAr')} />
            <FF label="Price" type="number" value={form.price} onChange={F('price')} />
            <FF label="Stock" type="number" value={form.stock} onChange={F('stock')} />

            {/* Category dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Category</label>
              <select value={form.categoryId} onChange={e => F('categoryId')(e.target.value)} style={{ ...S.input, marginTop: 6 }}>
                <option value="">— Select category —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.titleEn || c.nameEn || c.id}</option>
                ))}
              </select>
            </div>

            {/* Brand dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Brand</label>
              <select value={form.brandId} onChange={e => F('brandId')(e.target.value)} style={{ ...S.input, marginTop: 6 }}>
                <option value="">— Select brand —</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.nameEn || b.id}</option>
                ))}
              </select>
            </div>

            {/* Age Group dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Age Group</label>
              <select value={form.ageGroup} onChange={e => F('ageGroup')(e.target.value)} style={{ ...S.input, marginTop: 6 }}>
                {AGE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Flags */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: 'var(--text)' }}>
                <input type="checkbox" checked={form.isBestSeller} onChange={e => F('isBestSeller')(e.target.checked)} />
                ⭐ Best Seller
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: 'var(--text)' }}>
                <input type="checkbox" checked={form.isSuggestedProduct} onChange={e => F('isSuggestedProduct')(e.target.checked)} />
                💡 Suggested Product
              </label>
            </div>
          </div>

          <FF label="Description (English)" value={form.descriptionEn} onChange={F('descriptionEn')} multiline />
          <FF label="Description (Arabic)"  value={form.descriptionAr} onChange={F('descriptionAr')} multiline />

          {/* Image upload */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {modal === 'add' ? 'Product Images (you can pick multiple)' : 'Product Image'}
            </div>
            <input
              ref={fileRef} type="file" accept="image/*"
              multiple={modal === 'add'}
              onChange={handleFiles}
              style={{ display: 'none' }}
            />
            <button type="button" onClick={() => fileRef.current.click()} style={{ ...S.ghostBtn, marginBottom: 12 }}>
              <Upload size={15} /> {modal === 'add' ? 'Add images…' : 'Choose image…'}
            </button>
            {/* Preview grid */}
            {previews.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {previews.map((p, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img src={p.url} alt="" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
                    <button
                      type="button"
                      onClick={() => removePreview(idx)}
                      style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <button onClick={() => setModal(null)} style={S.ghostBtn}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={S.primaryBtn}>
              <Save size={15} /> {saving ? 'Saving…' : 'Save Product'}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal title="Delete Product" onClose={() => setDeleteId(null)} small>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Are you sure? This cannot be undone.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={() => setDeleteId(null)} style={S.ghostBtn}>Cancel</button>
            <button onClick={() => handleDelete(deleteId)} style={{ ...S.primaryBtn, background: '#dc2626' }}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────

function Modal({ title, onClose, children, small }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--bg)', borderRadius: 16, width: '100%', maxWidth: small ? 420 : 720, maxHeight: '90vh', overflow: 'auto', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}><X size={20} /></button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
      </div>
    </div>
  )
}

const labelStyle = { fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }

function FF({ label, value, onChange, type = 'text', multiline }) {
  const inputStyle = { ...S.input, width: '100%', marginTop: 6 }
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
      }
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────
const TH = { padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }
const TD = { padding: '14px 16px', fontSize: 14, color: 'var(--text)' }

const S = {
  card: { background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' },
  primaryBtn: { display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  ghostBtn:   { display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  iconBtn:    { background: 'var(--bg-topbar)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  input:      { background: 'var(--bg-topbar)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: 'var(--text)', outline: 'none' },
  pageBtn:    { background: 'var(--bg-topbar)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text)' },
}
