import { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusColor = (s) => ({
  Pending: 'var(--warning)', Processing: 'var(--info)', Shipped: 'var(--primary)',
  Delivered: 'var(--success)', Cancelled: 'var(--error)',
}[s] || 'var(--text-muted)');

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.orders);
    } catch (err) { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      setOrders(orders.map(o => o._id === orderId ? data.order : o));
      toast.success(`Order status updated to ${status}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const filtered = orders.filter(o => {
    const matchStatus = filter ? o.orderStatus === filter : true;
    const matchSearch = search ? (o._id.includes(search) || o.user?.name?.toLowerCase().includes(search.toLowerCase()) || o.user?.email?.toLowerCase().includes(search.toLowerCase())) : true;
    return matchStatus && matchSearch;
  });

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--burgundy-900)', color: 'var(--cream)', padding: 'var(--space-10) 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}>Manage Orders</h1>
          <p style={{ color: 'var(--beige-500)', marginTop: 'var(--space-1)' }}>{orders.length} total orders</p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="form-input"
              placeholder="Search by ID or customer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
              id="order-search"
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button onClick={() => setFilter('')} className={`btn btn-sm ${filter === '' ? 'btn-primary' : 'btn-ghost'}`}>All</button>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Update Status</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-10)' }}>No orders found</td></tr>
                ) : filtered.map(order => (
                  <tr key={order._id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>#{order._id.slice(-6).toUpperCase()}</span></td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{order.user?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                    </td>
                    <td>{order.orderItems?.length} items</td>
                    <td style={{ fontWeight: 700 }}>₹{order.totalPrice.toLocaleString('en-IN')}</td>
                    <td>
                      <span className="badge" style={{ background: order.isPaid ? 'var(--success-bg)' : 'var(--error-bg)', color: order.isPaid ? 'var(--success)' : 'var(--error)' }}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{ background: statusColor(order.orderStatus) + '20', color: statusColor(order.orderStatus) }}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={e => handleStatusChange(order._id, e.target.value)}
                        className="form-select"
                        style={{ padding: 'var(--space-1) var(--space-2)', fontSize: '0.875rem', minWidth: 130 }}
                        id={`status-select-${order._id}`}
                      >
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
