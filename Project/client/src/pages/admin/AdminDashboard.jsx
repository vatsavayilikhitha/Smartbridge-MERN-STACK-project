import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import api from '../../api/axios';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/orders/stats'),
          api.get('/orders'),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.orders.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader fullPage />;

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString('en-IN') || 0}`, icon: <FiDollarSign size={24} />, color: 'var(--success)' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiPackage size={24} />, color: 'var(--primary)' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: <FiAlertCircle size={24} />, color: 'var(--warning)' },
    { label: 'Delivered', value: stats?.deliveredOrders || 0, icon: <FiTrendingUp size={24} />, color: 'var(--success)' },
  ];

  const statusColor = (s) => ({
    Pending: 'var(--warning)', Processing: 'var(--info)', Shipped: 'var(--primary)',
    Delivered: 'var(--success)', Cancelled: 'var(--error)',
  }[s] || 'var(--text-muted)');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--burgundy-900)', color: 'var(--cream)', padding: 'var(--space-12) 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)', marginBottom: 'var(--space-2)' }}>Seller Dashboard</h1>
          <p style={{ color: 'var(--beige-500)' }}>Manage your ShopEZ store</p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
            <Link to="/seller/products" className="btn btn-secondary" style={{ borderColor: 'var(--beige-500)', color: 'var(--cream)' }}>Manage Products</Link>
            <Link to="/seller/orders" className="btn" style={{ background: 'var(--cream)', color: 'var(--primary)' }}>Manage Orders</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-10) var(--space-6)' }}>
        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-10)' }}>
          {statCards.map((card) => (
            <div key={card.label} style={{
              background: 'var(--cream)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 'var(--radius-md)',
                background: card.color + '20', color: card.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {card.icon}
              </div>
              <div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.label}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem' }}>Recent Orders</h3>
            <Link to="/seller/orders" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-8)' }}>No orders yet</td></tr>
                ) : recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td><Link to={`/seller/orders`} style={{ color: 'var(--primary)', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.875rem' }}>#{order._id.slice(-6).toUpperCase()}</Link></td>
                    <td>{order.user?.name || 'Unknown'}</td>
                    <td style={{ fontWeight: 700 }}>₹{order.totalPrice.toLocaleString('en-IN')}</td>
                    <td>
                      <span className="badge" style={{ background: statusColor(order.orderStatus) + '20', color: statusColor(order.orderStatus) }}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
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
