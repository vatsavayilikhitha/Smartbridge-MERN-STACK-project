import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiPackage, FiMapPin, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = ['COD', 'UPI', 'Card', 'NetBanking'];

export default function Checkout() {
  const { state: priceState } = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1: address, 2: payment, 3: confirm
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);

  const itemsPrice = priceState?.itemsPrice || cart.totalPrice || 0;
  const shippingPrice = priceState?.shippingPrice ?? (itemsPrice > 999 ? 0 : 99);
  const taxPrice = priceState?.taxPrice || Math.round(itemsPrice * 0.05);
  const totalPrice = priceState?.totalPrice || itemsPrice + shippingPrice + taxPrice;

  const handlePlaceOrder = async () => {
    if (!cart.items?.length) {
      toast.error('Your cart is empty');
      return;
    }
    setPlacing(true);
    try {
      const orderItems = cart.items.map((item) => ({
        product: item.product?._id || item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: address,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      // Simulate payment for COD
      if (paymentMethod === 'COD') {
        await api.put(`/orders/${data.order._id}/pay`);
      }

      await clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const StepIndicator = ({ num, label, icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: step >= num ? 'var(--primary)' : 'var(--beige-400)',
        color: step >= num ? 'var(--cream)' : 'var(--text-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700,
        transition: 'all var(--transition-base)',
      }}>
        {step > num ? '✓' : num}
      </div>
      <span style={{ fontWeight: step >= num ? 700 : 400, color: step >= num ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.9375rem' }}>
        {label}
      </span>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--burgundy-900)', padding: 'var(--space-10) 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)', marginBottom: 'var(--space-5)' }}>Checkout</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <StepIndicator num={1} label="Address" icon={<FiMapPin />} />
            <div style={{ flex: 1, maxWidth: 80, height: 2, background: step >= 2 ? 'var(--burgundy-400)' : 'var(--burgundy-700)', borderRadius: 2 }} />
            <StepIndicator num={2} label="Payment" icon={<FiCreditCard />} />
            <div style={{ flex: 1, maxWidth: 80, height: 2, background: step >= 3 ? 'var(--burgundy-400)' : 'var(--burgundy-700)', borderRadius: 2 }} />
            <StepIndicator num={3} label="Confirm" icon={<FiCheckCircle />} />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-8)', alignItems: 'start' }}>

          {/* Main Content */}
          <div>
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <FiMapPin color="var(--primary)" /> Shipping Address
                  </h3>
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Street Address *</label>
                      <input
                        className="form-input"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="Flat / House No., Street Name"
                        required
                        id="checkout-street"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input className="form-input" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" required id="checkout-city" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State *</label>
                        <input className="form-input" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="State" required id="checkout-state" />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                      <div className="form-group">
                        <label className="form-label">Pincode *</label>
                        <input className="form-input" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} placeholder="6-digit pincode" required maxLength={6} id="checkout-pincode" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <input className="form-input" value={address.country} disabled style={{ background: 'var(--beige-300)', cursor: 'not-allowed' }} />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!address.street || !address.city || !address.state || !address.pincode) {
                          toast.error('Please fill all address fields'); return;
                        }
                        setStep(2);
                      }}
                      className="btn btn-primary btn-lg"
                      style={{ alignSelf: 'flex-start' }}
                      id="continue-to-payment-btn"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <FiCreditCard color="var(--primary)" /> Payment Method
                  </h3>
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                          padding: 'var(--space-4)',
                          border: `2px solid ${paymentMethod === method ? 'var(--primary)' : 'var(--border)'}`,
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          background: paymentMethod === method ? 'var(--burgundy-100)' : 'var(--cream)',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          style={{ accentColor: 'var(--primary)', width: 18, height: 18 }}
                        />
                        <div>
                          <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{method}</p>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            {method === 'COD' ? 'Pay when your order arrives' :
                             method === 'UPI' ? 'GPay, PhonePe, Paytm, etc.' :
                             method === 'Card' ? 'Credit or Debit card' : 'Internet banking'}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button onClick={() => setStep(1)} className="btn btn-ghost">← Back</button>
                    <button onClick={() => setStep(3)} className="btn btn-primary" id="continue-to-confirm-btn">Review Order →</button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <FiCheckCircle color="var(--success)" /> Review & Confirm
                  </h3>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

                  <div>
                    <p className="sidebar-title">Shipping To</p>
                    <div style={{ background: 'var(--beige-300)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <p style={{ fontWeight: 700 }}>{user?.name}</p>
                      <p style={{ color: 'var(--text-secondary)' }}>{address.street}, {address.city}, {address.state} — {address.pincode}</p>
                    </div>
                  </div>

                  <div>
                    <p className="sidebar-title">Payment Method</p>
                    <div style={{ background: 'var(--beige-300)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <p style={{ fontWeight: 700 }}>{paymentMethod}</p>
                    </div>
                  </div>

                  <div>
                    <p className="sidebar-title">Order Items ({cart.items?.length})</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {cart.items?.map((item) => (
                        <div key={item.product?._id || item.product} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--beige-300)', borderRadius: 'var(--radius-md)' }}>
                          <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                          <span style={{ flex: 1, fontWeight: 700, fontSize: '0.9375rem' }}>{item.name}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>×{item.quantity}</span>
                          <span style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button onClick={() => setStep(2)} className="btn btn-ghost">← Back</button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placing}
                      className="btn btn-primary btn-lg"
                      id="place-order-btn"
                    >
                      {placing ? 'Placing Order...' : `Place Order — ₹${totalPrice.toLocaleString('en-IN')}`}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div className="card">
              <div className="card-header">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem' }}>Price Details</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {[
                    { label: `Subtotal (${cart.items?.length} items)`, value: `₹${itemsPrice.toLocaleString('en-IN')}` },
                    { label: 'Shipping', value: shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}` },
                    { label: 'GST (5%)', value: `₹${taxPrice.toLocaleString('en-IN')}` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <span style={{ fontWeight: 700 }}>{value}</span>
                    </div>
                  ))}
                  <div className="divider" />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.0625rem' }}>Total Amount</span>
                    <span className="price-current">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
