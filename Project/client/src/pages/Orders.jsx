import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../api/axios';
import Loader from '../components/Loader';

const statusColor = (s) => ({
  Pending: 'var(--warning)',
  Processing: 'var(--info)',
  Shipped: 'var(--primary)',
  Delivered: 'var(--success)',
  Cancelled: 'var(--error)',
}[s] || 'var(--text-muted)');

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--burgundy-900)', padding: 'var(--space-10) 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}>My Orders</h1>
          <p style={{ color: 'var(--beige-500)', marginTop: 'var(--space-1)' }}>{orders.length} orders placed</p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        {orders.length === 0 ? (
          <div className="empty-state" style={{ minHeight: '50vh' }}>
            <div className="empty-state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {orders.map((order) => (
              <div key={order._id} className="card" style={{ overflow: 'visible' }}>
                {/* Order Header */}
                <div
                  style={{
                    padding: 'var(--space-5) var(--space-6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    cursor: 'pointer',
                    flexWrap: 'wrap',
                  }}
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  id={`order-row-${order._id}`}
                >
                  <div style={{
                    width: 44, height: 44,
                    background: 'var(--burgundy-100)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary)',
                    flexShrink: 0,
                  }}>
                    <FiPackage size={20} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9375rem', color: 'var(--primary)' }}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {order.orderItems.length} items
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p className="price-current" style={{ fontSize: '1.125rem' }}>₹{order.totalPrice.toLocaleString('en-IN')}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{order.paymentMethod}</p>
                  </div>

                  <span className="badge" style={{ background: statusColor(order.orderStatus) + '20', color: statusColor(order.orderStatus), flexShrink: 0 }}>
                    {order.orderStatus}
                  </span>

                  <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                    {expanded === order._id ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </div>

                {/* Expanded Details */}
                {expanded === order._id && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: 'var(--space-5) var(--space-6)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-5)' }}>
                      <div>
                        <p className="sidebar-title">Shipping Address</p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                          {order.shippingAddress.street},<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                          {order.shippingAddress.pincode}, {order.shippingAddress.country}
                        </p>
                      </div>
                      <div>
                        <p className="sidebar-title">Payment Info</p>
                        <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{order.paymentMethod}</p>
                        <span className="badge" style={{ background: order.isPaid ? 'var(--success-bg)' : 'var(--error-bg)', color: order.isPaid ? 'var(--success)' : 'var(--error)' }}>
                          {order.isPaid ? '✓ Paid' : '✗ Unpaid'}
                        </span>
                      </div>
                    </div>

                    <p className="sidebar-title" style={{ marginBottom: 'var(--space-3)' }}>Items Ordered</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {order.orderItems.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--beige-300)', borderRadius: 'var(--radius-md)' }}>
                          <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                          <span style={{ flex: 1, fontWeight: 700, fontSize: '0.9375rem' }}>{item.name}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>×{item.quantity}</span>
                          <span style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price breakdown */}
                    <div style={{ marginTop: 'var(--space-5)', background: 'var(--beige-300)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxWidth: 300, marginLeft: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                        <span>₹{order.itemsPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                        <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Tax</span>
                        <span>₹{order.taxPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ height: 1, background: 'var(--border)' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                        <span>Total</span>
                        <span className="price-current">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
