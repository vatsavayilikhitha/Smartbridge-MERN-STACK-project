import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Other'];

const emptyForm = { name: '', description: '', price: '', originalPrice: '', category: 'Electronics', brand: '', stock: '', images: '', isFeatured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?pageSize=100');
      setProducts(data.products);
    } catch (err) { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, images: p.images.join(', '), price: String(p.price), originalPrice: String(p.originalPrice), stock: String(p.stock) });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, price: Number(form.price), originalPrice: Number(form.originalPrice) || Number(form.price), stock: Number(form.stock), images: form.images.split(',').map(s => s.trim()).filter(Boolean) };
      if (editing) {
        const { data } = await api.put(`/products/${editing}`, payload);
        setProducts(products.map(p => p._id === editing ? data.product : p));
        toast.success('Product updated');
      } else {
        const { data } = await api.post('/products', payload);
        setProducts([data.product, ...products]);
        toast.success('Product created');
      }
      setModalOpen(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--burgundy-900)', color: 'var(--cream)', padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}>Manage Products</h1>
            <p style={{ color: 'var(--beige-500)', marginTop: 'var(--space-1)' }}>{products.length} products total</p>
          </div>
          <button onClick={openCreate} className="btn" style={{ background: 'var(--cream)', color: 'var(--primary)' }} id="add-product-btn">
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div className="card">
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <img src={p.images?.[0] || 'https://via.placeholder.com/48'} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    </td>
                    <td style={{ fontWeight: 700, maxWidth: 200 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      {p.isFeatured && <span className="badge badge-primary" style={{ marginTop: 4 }}>Featured</span>}
                    </td>
                    <td><span className="badge badge-muted">{p.category}</span></td>
                    <td style={{ fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</td>
                    <td>
                      <span style={{ color: p.stock === 0 ? 'var(--error)' : p.stock < 10 ? 'var(--warning)' : 'var(--success)', fontWeight: 700 }}>
                        {p.stock}
                      </span>
                    </td>
                    <td>{p.rating.toFixed(1)} ★ ({p.numReviews})</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button onClick={() => openEdit(p)} className="btn btn-sm" style={{ background: 'var(--beige-300)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} id={`edit-product-${p._id}`}><FiEdit2 size={14} /></button>
                        <button onClick={() => handleDelete(p._id)} className="btn btn-sm btn-danger" id={`delete-product-${p._id}`}><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal" style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="btn btn-icon btn-ghost"><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. Wireless Headphones" />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-input" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input className="form-input" type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} min="0" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input className="form-input" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} placeholder="e.g. Samsung" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input className="form-input" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Featured</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
                    <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
                    <label htmlFor="featured" style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Mark as Featured</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Image URLs (comma-separated)</label>
                <input className="form-input" value={form.images} onChange={e => setForm({...form, images: e.target.value})} placeholder="https://...jpg, https://...jpg" />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting} id="save-product-btn">
                  {submitting ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
