import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

export default function Cart() {
  const { cart, cartLoading } = useCart();

  const itemsPrice = cart.totalPrice || 0;
  const shippingPrice = itemsPrice > 999 ? 0 : 99;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  if (cartLoading) return <Loader fullPage />;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--burgundy-900)', padding: 'var(--space-10) 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}>Your Cart</h1>
          <p style={{ color: 'var(--beige-500)', marginTop: 'var(--space-1)' }}>
            {cart.items?.length || 0} {cart.items?.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        {!cart.items?.length ? (
          <div className="empty-state" style={{ minHeight: '50vh' }}>
            <div className="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }} id="empty-cart-shop-btn">
              <FiShoppingBag /> Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-8)', alignItems: 'start' }}>

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem' }}>Cart Items</h3>
                <Link to="/products" style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 700 }}>
                  + Add More Items
                </Link>
              </div>
              {cart.items.map((item) => (
                <CartItem key={item.product?._id || item.product} item={item} />
              ))}
            </div>

            {/* Order Summary */}
            <div style={{ position: 'sticky', top: 90 }}>
              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem' }}>Order Summary</h3>
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                    <SummaryRow label="Subtotal" value={`₹${itemsPrice.toLocaleString('en-IN')}`} />
                    <SummaryRow
                      label="Shipping"
                      value={shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                      valueStyle={{ color: shippingPrice === 0 ? 'var(--success)' : undefined }}
                    />
                    <SummaryRow label="Tax (5%)" value={`₹${taxPrice.toLocaleString('en-IN')}`} />
                    {shippingPrice > 0 && (
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', background: 'var(--beige-300)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
                        Add ₹{(999 - itemsPrice).toLocaleString('en-IN')} more for free shipping
                      </p>
                    )}
                  </div>

                  <div className="divider" />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text-primary)' }}>Total</span>
                    <span className="price-current" style={{ fontSize: '1.5rem' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>

                  <Link
                    to="/checkout"
                    state={{ itemsPrice, shippingPrice, taxPrice, totalPrice }}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                    id="proceed-to-checkout-btn"
                  >
                    Proceed to Checkout <FiArrowRight />
                  </Link>

                  <Link to="/products" className="btn btn-ghost" style={{ width: '100%', marginTop: 'var(--space-3)' }}>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Trust Badges */}
              <div style={{
                marginTop: 'var(--space-4)',
                background: 'var(--cream)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}>
                {['🔒 Secure SSL checkout', '🚚 Fast delivery in 3-5 days', '↩️ 30-day easy returns'].map((t) => (
                  <p key={t} style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, valueStyle = {} }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>{label}</span>
      <span style={{ fontWeight: 700, color: 'var(--text-primary)', ...valueStyle }}>{value}</span>
    </div>
  );
}
