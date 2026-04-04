/**
 * AdminBanners.jsx
 * CRUD for banners using FormData (image file upload):
 *   POST  /api/banners
 *   PATCH /api/banners/:id
 *   DELETE /api/banners/:id
 *
 * Fields: titleAr, titleEn, subtitleAr, subtitleEn, linkUrl, order, isActive, image(file)
 */

import { useState, useEffect, useRef } from 'react'
import { adminBannersApi } from '../../api/adminApi'
import { LoadingSpinner, ErrorBanner } from './AdminDashboard'
import { Plus, Edit2, Trash2, X, Save, Image, Upload } from 'lucide-react'

const EMPTY_FORM = { titleAr: '', titleEn: '', subtitleAr: '', subtitleEn: '', linkUrl: '', order: '1', isActive: true, imageFile: null }

export default function AdminBanners() {
  const [banners, setBanners]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [modal, setModal]       = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [preview, setPreview]   = useState(null)
  const fileRef = useRef()

  function load() {
    setLoading(true); setError(null)
    adminBannersApi.getAll()
      .then(data => { setBanners(data.banners ?? data.data ?? data ?? []); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY_FORM); setPreview(null); setModal('add') }
  const openEdit = (b) => {
    setForm({ titleAr: b.titleAr || '', titleEn: b.titleEn || '', subtitleAr: b.subtitleAr || '', subtitleEn: b.subtitleEn || '', linkUrl: b.linkUrl || b.link || '', order: b.order ?? 1, isActive: b.isActive !== false, imageFile: null, _id: b.id })
    setPreview(b.imageUrl || b.image || null)
    setModal('edit')
  }

  const F = (key) => (v) => setForm(f => ({ ...f, [key]: v }))

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm(f => ({ ...f, imageFile: file }))
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('titleAr', form.titleAr)
      fd.append('titleEn', form.titleEn)
      fd.append('subtitleAr', form.subtitleAr)
      fd.append('subtitleEn', form.subtitleEn)
      fd.append('linkUrl', form.linkUrl)
      fd.append('order', form.order)
      fd.append('isActive', form.isActive)
      if (form.imageFile) fd.append('image', form.imageFile)

      if (modal === 'add') {
        await adminBannersApi.create(fd)
      } else {
        await adminBannersApi.update(form._id, fd)
      }
      setModal(null); load()
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try { await adminBannersApi.delete(id); setDeleteId(null); load() }
    catch (err) { alert('Delete failed: ' + err.message) }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Banners</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>Manage homepage hero slider banners</p>
        </div>
        <button onClick={openAdd} style={S.primaryBtn}><Plus size={16} /> Add Banner</button>
      </div>

      {loading ? <LoadingSpinner /> : error ? <ErrorBanner message={error} /> : (
        banners.length === 0 ? (
          <EmptyState icon={Image} label="banners" onAdd={openAdd} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {banners.map(b => (
              <div key={b.id} style={S.itemCard}>
                <div style={{ height: 160, borderRadius: 10, overflow: 'hidden', background: 'var(--bg-topbar)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {b.imageUrl || b.image
                    ? <img src={b.imageUrl || b.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Image size={40} color="var(--text-placeholder)" />
                  }
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{b.titleEn || b.titleAr || 'Untitled'}</div>
                  {b.subtitleEn && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{b.subtitleEn}</div>}
                  {(b.linkUrl || b.link) && <div style={{ fontSize: 12, color: 'var(--primary)', marginTop: 4 }}>{b.linkUrl || b.link}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg-topbar)', padding: '3px 10px', borderRadius: 20 }}>Order: {b.order}</span>
                    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: b.isActive !== false ? '#d1fae5' : '#fee2e2', color: b.isActive !== false ? '#065f46' : '#b91c1c' }}>
                      {b.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(b)} style={S.iconBtn}><Edit2 size={15} color="#2563eb" /></button>
                    <button onClick={() => setDeleteId(b.id)} style={S.iconBtn}><Trash2 size={15} color="#dc2626" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Add / Edit modal */}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Banner' : 'Edit Banner'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FF label="Title (English)"    value={form.titleEn}    onChange={F('titleEn')} />
            <FF label="Title (Arabic)"     value={form.titleAr}    onChange={F('titleAr')} />
            <FF label="Subtitle (English)" value={form.subtitleEn} onChange={F('subtitleEn')} />
            <FF label="Subtitle (Arabic)"  value={form.subtitleAr} onChange={F('subtitleAr')} />
            <FF label="Link URL"           value={form.linkUrl}    onChange={F('linkUrl')} placeholder="/shop" />
            <FF label="Display Order"      type="number" value={form.order} onChange={F('order')} />
          </div>

          {/* Active toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: 'var(--text)' }}>
            <input type="checkbox" checked={form.isActive} onChange={e => F('isActive')(e.target.checked)} />
            Active (visible on site)
          </label>

          {/* Image upload */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Banner Image</div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            <button type="button" onClick={() => fileRef.current.click()} style={{ ...S.ghostBtn, marginBottom: 10 }}>
              <Upload size={15} /> {form.imageFile ? form.imageFile.name : 'Choose image…'}
            </button>
            {preview && <img src={preview} alt="preview" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={() => setModal(null)} style={S.ghostBtn}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={S.primaryBtn}>
              <Save size={15} /> {saving ? 'Saving…' : 'Save Banner'}
            </button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Banner" onClose={() => setDeleteId(null)} small>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Delete this banner? This cannot be undone.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={() => setDeleteId(null)} style={S.ghostBtn}>Cancel</button>
            <button onClick={() => handleDelete(deleteId)} style={{ ...S.primaryBtn, background: '#dc2626' }}><Trash2 size={14} /> Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function EmptyState({ icon: Icon, label, onAdd }) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: 16, border: '2px dashed var(--border)', padding: 60, textAlign: 'center' }}>
      <Icon size={48} color="var(--text-placeholder)" style={{ margin: '0 auto 16px' }} />
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>No {label} yet.</p>
      <button onClick={onAdd} style={{ ...S.primaryBtn, margin: '0 auto' }}><Plus size={16} /> Add {label.replace(/s$/, '')}</button>
    </div>
  )
}

function Modal({ title, onClose, children, small }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--bg)', borderRadius: 16, width: '100%', maxWidth: small ? 420 : 640, maxHeight: '90vh', overflow: 'auto', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}><X size={20} /></button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
      </div>
    </div>
  )
}

function FF({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ background: 'var(--bg-topbar)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: 'var(--text)', outline: 'none' }} />
    </div>
  )
}

const S = {
  itemCard:   { background: 'var(--bg)', borderRadius: 14, border: '1px solid var(--border)', padding: 16, boxShadow: 'var(--shadow-sm)' },
  primaryBtn: { display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  ghostBtn:   { display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  iconBtn:    { background: 'var(--bg-topbar)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
}
