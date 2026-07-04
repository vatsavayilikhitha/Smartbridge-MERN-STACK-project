import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import StarRating from './StarRating';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product._id, 1);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      style={{ textDecoration: 'none' }}
      id={`product-card-${product._id}`}
    >
      <article
        className="card"
        style={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
      >
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '66%', background: 'var(--beige-300)' }}>
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=ShopEZ'}
            alt={product.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
          {discount > 0 && (
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: 'var(--primary)',
              color: 'var(--cream)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 900,
            }}>
              -{discount}%
            </div>
          )}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(26, 11, 15, 0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--cream)',
              fontWeight: 700,
              fontSize: '1rem',
            }}>
              Out of Stock
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {/* Category */}
          <span className="badge badge-muted" style={{ alignSelf: 'flex-start' }}>
            {product.category}
          </span>

          {/* Name */}
          <h3 style={{
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.name}
          </h3>

          <StarRating rating={product.rating} numReviews={product.numReviews} size={14} />

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginTop: 'auto' }}>
            <span className="price-current">₹{product.price.toLocaleString('en-IN')}</span>
            {discount > 0 && (
              <span className="price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
            id={`add-to-cart-${product._id}`}
          >
            <FiShoppingCart size={15} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </article>
    </Link>
  );
}
