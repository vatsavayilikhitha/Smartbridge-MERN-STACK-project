import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft, FiStar } from 'react-icons/fi';
import api from '../api/axios';
import Loader from '../components/Loader';
import StarRating from '../components/StarRating';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => { setProduct(data.product); setActiveImg(0); })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullPage />;
  if (!product) return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <div className="empty-state-icon">😢</div>
      <h3>Product not found</h3>
      <Link to="/products" className="btn btn-primary">Back to Products</Link>
    </div>
  );

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(product._id, qty);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      toast.success('Review submitted!');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`}>{product.category}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{product.name}</span>
        </div>

        {/* Product Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>

          {/* Images */}
          <div>
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              background: 'var(--beige-300)',
              aspectRatio: '1',
              marginBottom: 'var(--space-4)',
            }}>
              <img
                src={product.images?.[activeImg] || 'https://via.placeholder.com/500?text=ShopEZ'}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
              />
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 72, height: 72,
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: `2px solid ${activeImg === i ? 'var(--primary)' : 'var(--border)'}`,
                      padding: 0,
                      cursor: 'pointer',
                      background: 'var(--beige-300)',
                      transition: 'border-color var(--transition-fast)',
                    }}
                  >
                    <img src={img} alt={`View ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <span className="badge badge-muted">{product.category}</span>
              {product.isFeatured && <span className="badge badge-primary">Featured</span>}
              {product.stock === 0 && <span className="badge badge-error">Out of Stock</span>}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: 'var(--space-4)' }}>
              {product.name}
            </h1>

            {product.brand && (
              <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-3)', fontSize: '0.9375rem' }}>
                Brand: <strong style={{ color: 'var(--text-secondary)' }}>{product.brand}</strong>
              </p>
            )}

            <div style={{ marginBottom: 'var(--space-5)' }}>
              <StarRating rating={product.rating} numReviews={product.numReviews} size={18} />
            </div>

            {/* Price */}
            <div style={{
              background: 'var(--cream)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
              marginBottom: 'var(--space-6)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <span className="price-current" style={{ fontSize: '2rem' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {discount > 0 && (
                  <>
                    <span className="price-original" style={{ fontSize: '1.125rem' }}>
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.875rem' }}>
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              {discount > 0 && (
                <p style={{ fontSize: '0.875rem', color: 'var(--success)' }}>
                  You save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                </p>
              )}
            </div>

            {/* Stock */}
            <p style={{ fontSize: '0.875rem', marginBottom: 'var(--space-5)', fontWeight: 700 }}>
              Availability:{' '}
              <span style={{ color: product.stock > 10 ? 'var(--success)' : product.stock > 0 ? 'var(--warning)' : 'var(--error)' }}>
                {product.stock > 10 ? `In Stock (${product.stock} available)` : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
            </p>

            {/* Quantity */}
            {product.stock > 0 && (
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quantity</p>
                <div className="quantity-selector">
                  <button className="quantity-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}><FiMinus size={14} /></button>
                  <span className="quantity-value">{qty}</span>
                  <button className="quantity-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}><FiPlus size={14} /></button>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                id="product-add-to-cart"
              >
                <FiShoppingCart size={18} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <Link to="/cart" className="btn btn-secondary btn-lg" onClick={handleAddToCart} id="buy-now-btn">
                Buy Now
              </Link>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div style={{ marginTop: 'var(--space-5)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {product.tags.map(tag => (
                  <span key={tag} className="badge badge-muted">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Description & Reviews */}
        <div className="card">
          <div className="card-header">
            <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none' }}>
              {['description', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  id={`tab-${tab}`}
                >
                  {tab === 'description' ? 'Description' : `Reviews (${product.numReviews})`}
                </button>
              ))}
            </div>
          </div>
          <div className="card-body">
            {activeTab === 'description' ? (
              <div>
                <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '1rem' }}>
                  {product.description}
                </p>
              </div>
            ) : (
              <div>
                {/* Existing Reviews */}
                {product.reviews?.length === 0 ? (
                  <div className="empty-state" style={{ padding: 'var(--space-10) 0' }}>
                    <div className="empty-state-icon">⭐</div>
                    <h3>No reviews yet</h3>
                    <p>Be the first to review this product!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                    {product.reviews.map((review) => (
                      <div key={review._id} style={{
                        background: 'var(--beige-300)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-5)',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                          <div>
                            <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{review.name}</p>
                            <StarRating rating={review.rating} size={14} />
                          </div>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            {new Date(review.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Write Review */}
                {user && (
                  <div>
                    <div className="divider" />
                    <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-5)' }}>Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                      <div className="form-group">
                        <label className="form-label">Your Rating</label>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              style={{
                                fontSize: '1.75rem',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: star <= reviewForm.rating ? 'var(--warning)' : 'var(--beige-600)',
                                transition: 'color var(--transition-fast)',
                              }}
                            >★</button>
                          ))}
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Your Review</label>
                        <textarea
                          className="form-textarea"
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          required
                          rows={4}
                          placeholder="Share your experience with this product..."
                          style={{ resize: 'vertical' }}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submittingReview}
                        id="submit-review-btn"
                        style={{ alignSelf: 'flex-start' }}
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                )}
                {!user && (
                  <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                    <Link to="/login" className="btn btn-primary">Login to Write a Review</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
