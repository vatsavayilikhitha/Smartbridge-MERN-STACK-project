import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product._id || item.product, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.product._id || item.product, item.quantity + 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.product._id || item.product);
  };

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-4)',
      padding: 'var(--space-5)',
      background: 'var(--cream)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      alignItems: 'center',
    }}>
      {/* Image */}
      <div style={{
        width: 80, height: 80,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        flexShrink: 0,
        background: 'var(--beige-300)',
      }}>
        <img
          src={item.image || 'https://via.placeholder.com/80?text=Item'}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          marginBottom: 'var(--space-1)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {item.name}
        </h4>
        <p className="price-current" style={{ fontSize: '1rem' }}>
          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          ₹{item.price.toLocaleString('en-IN')} each
        </p>
      </div>

      {/* Quantity */}
      <div className="quantity-selector">
        <button
          className="quantity-btn"
          onClick={handleDecrement}
          disabled={item.quantity <= 1}
          id={`cart-decrement-${item.product._id || item.product}`}
        >
          <FiMinus size={14} />
        </button>
        <span className="quantity-value">{item.quantity}</span>
        <button
          className="quantity-btn"
          onClick={handleIncrement}
          disabled={item.quantity >= item.stock}
          id={`cart-increment-${item.product._id || item.product}`}
        >
          <FiPlus size={14} />
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        className="btn btn-icon"
        style={{ color: 'var(--error)', border: '1.5px solid var(--error)', background: 'var(--error-bg)' }}
        title="Remove from cart"
        id={`cart-remove-${item.product._id || item.product}`}
      >
        <FiTrash2 size={16} />
      </button>
    </div>
  );
}
