import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--burgundy-900)',
      color: 'var(--beige-300)',
      marginTop: 'auto',
    }}>
      <div className="container" style={{ padding: 'var(--space-16) var(--space-6) var(--space-8)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-10)',
          marginBottom: 'var(--space-12)',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <div style={{
                width: 36, height: 36,
                background: 'var(--burgundy-500)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700, fontSize: '1.125rem',
                color: 'var(--cream)',
              }}>S</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--cream)' }}>
                ShopEZ
              </span>
            </div>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--beige-500)', maxWidth: 280 }}>
              Your one-stop destination for effortless online shopping. Quality products, secure checkout, fast delivery.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 36, height: 36,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--burgundy-700)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--beige-400)',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--burgundy-700)'; e.currentTarget.style.color = 'var(--cream)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--beige-400)'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-5)', fontSize: '1rem' }}>Shop</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {['All Products', 'Electronics', 'Clothing', 'Beauty', 'Home & Kitchen', 'Books'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/products?category=${item === 'All Products' ? '' : item}`}
                    style={{ color: 'var(--beige-500)', fontSize: '0.9375rem', transition: 'color var(--transition-fast)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--beige-200)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--beige-500)'}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-5)', fontSize: '1rem' }}>Account</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { label: 'My Profile', to: '/profile' },
                { label: 'My Orders', to: '/orders' },
                { label: 'Shopping Cart', to: '/cart' },
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    style={{ color: 'var(--beige-500)', fontSize: '0.9375rem', transition: 'color var(--transition-fast)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--beige-200)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--beige-500)'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-5)', fontSize: '1rem' }}>Contact Us</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--beige-500)', fontSize: '0.9375rem' }}>
                <FiMail size={15} style={{ flexShrink: 0 }} />
                support@shopez.com
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--beige-500)', fontSize: '0.9375rem' }}>
                <FiPhone size={15} style={{ flexShrink: 0 }} />
                +91 98765 43210
              </li>
            </ul>
            <div style={{
              marginTop: 'var(--space-5)',
              padding: 'var(--space-4)',
              background: 'var(--burgundy-800)',
              borderRadius: 'var(--radius-md)',
            }}>
              <p style={{ color: 'var(--beige-400)', fontSize: '0.8125rem', marginBottom: 'var(--space-3)' }}>Subscribe to our newsletter</p>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <input
                  type="email"
                  placeholder="Your email"
                  style={{
                    flex: 1, padding: 'var(--space-2) var(--space-3)',
                    background: 'var(--burgundy-700)', border: '1px solid var(--burgundy-600)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--cream)', fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
                <button style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--burgundy-500)', color: 'var(--cream)',
                  borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                  fontSize: '0.8125rem', fontWeight: 700,
                }}>
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--burgundy-700)',
          paddingTop: 'var(--space-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          <p style={{ color: 'var(--beige-700)', fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} ShopEZ. All rights reserved. Built with MERN stack.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-5)' }}>
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((item) => (
              <a
                key={item}
                href="#"
                style={{ color: 'var(--beige-700)', fontSize: '0.875rem', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--beige-400)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--beige-700)'}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
