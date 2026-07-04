import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRotateCcw, FiStar } from 'react-icons/fi';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const CATEGORIES = [
  { name: 'Electronics', emoji: '📱', color: '#FAF0F3' },
  { name: 'Clothing', emoji: '👔', color: '#F5EFE6' },
  { name: 'Books', emoji: '📚', color: '#FAF0F3' },
  { name: 'Home & Kitchen', emoji: '🏠', color: '#F5EFE6' },
  { name: 'Sports', emoji: '⚽', color: '#FAF0F3' },
  { name: 'Beauty', emoji: '✨', color: '#F5EFE6' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/featured')
      .then(({ data }) => setFeatured(data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'var(--burgundy-900)',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 70% 50%, rgba(196, 99, 122, 0.15) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(74, 14, 33, 0.6) 0%, transparent 50%)`,
        }} />
        <div style={{
          position: 'absolute',
          right: '-5%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '45%',
          height: '80%',
          background: 'var(--burgundy-800)',
          borderRadius: '60% 0 0 60%',
          opacity: 0.4,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: 'var(--space-24) var(--space-6)' }}>
          <div style={{ maxWidth: 640 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--cream)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              lineHeight: 1.15,
              marginBottom: 'var(--space-6)',
            }}>
              Effortless Shopping,<br />
              <em style={{ color: 'var(--burgundy-300)', fontStyle: 'italic' }}>Exceptional</em> Products
            </h1>

            <p style={{
              color: 'var(--beige-400)',
              fontSize: '1.125rem',
              lineHeight: 1.7,
              marginBottom: 'var(--space-8)',
              maxWidth: 500,
            }}>
              Discover thousands of products across every category. Secure checkout, fast delivery, and hassle-free returns — all in one place.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link
                to="/products"
                className="btn btn-lg"
                style={{ background: 'var(--cream)', color: 'var(--primary)' }}
                id="hero-shop-btn"
              >
                Shop Now <FiArrowRight />
              </Link>
              <Link
                to="/register"
                className="btn btn-lg btn-secondary"
                style={{ borderColor: 'rgba(245, 239, 230, 0.5)', color: 'var(--cream)' }}
                id="hero-register-btn"
              >
                Join Free
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 'var(--space-8)', marginTop: 'var(--space-12)', flexWrap: 'wrap' }}>
              {[
                { num: '12+', label: 'Product Categories' },
                { num: '100%', label: 'Secure Checkout' },
                { num: '24/7', label: 'Customer Support' },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--cream)' }}>{s.num}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--beige-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section style={{ background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 0,
            divideX: '1px solid var(--border)',
          }}>
            {[
              { icon: <FiTruck size={22} />, title: 'Free Shipping', desc: 'On orders above ₹999' },
              { icon: <FiShield size={22} />, title: 'Secure Payments', desc: '100% protected checkout' },
              { icon: <FiRotateCcw size={22} />, title: 'Easy Returns', desc: '30-day return policy' },
              { icon: <FiStar size={22} />, title: 'Quality Products', desc: 'Curated & verified sellers' },
            ].map((f, i) => (
              <div
                key={f.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-6)',
                  borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{
                  width: 48, height: 48,
                  background: 'var(--burgundy-100)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontFamily: 'var(--font-body)', marginBottom: 2 }}>{f.title}</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{ background: 'var(--beige-300)' }}>
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="section-divider" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 'var(--space-4)',
          }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                style={{ textDecoration: 'none' }}
                id={`cat-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div
                  style={{
                    background: 'var(--cream)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-6) var(--space-4)',
                    textAlign: 'center',
                    transition: 'all var(--transition-base)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.background = 'var(--burgundy-100)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--cream)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>{cat.emoji}</div>
                  <p style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <h2 className="section-title">Featured Products</h2>
              <div className="section-divider" style={{ margin: 'var(--space-3) 0' }} />
              <p className="section-subtitle" style={{ marginBottom: 0 }}>Handpicked selections for you</p>
            </div>
            <Link to="/products" className="btn btn-secondary" id="view-all-products-btn">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div style={{ marginTop: 'var(--space-10)' }}><Loader /></div>
          ) : featured.length === 0 ? (
            <div className="empty-state" style={{ marginTop: 'var(--space-10)' }}>
              <div className="empty-state-icon">📦</div>
              <h3>No featured products yet</h3>
              <p>Check back later or browse all products.</p>
              <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Browse Products</Link>
            </div>
          ) : (
            <div className="product-grid" style={{ marginTop: 'var(--space-8)' }}>
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: 'var(--burgundy-800)', padding: 'var(--space-16) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--cream)',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            marginBottom: 'var(--space-4)',
          }}>
            Ready to Start Shopping?
          </h2>
          <p style={{ color: 'var(--beige-400)', fontSize: '1.125rem', marginBottom: 'var(--space-8)' }}>
            Join thousands of happy shoppers on ShopEZ today.
          </p>
          <Link
            to="/register"
            className="btn btn-lg"
            style={{ background: 'var(--cream)', color: 'var(--primary)' }}
            id="cta-register-btn"
          >
            Create Free Account <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
