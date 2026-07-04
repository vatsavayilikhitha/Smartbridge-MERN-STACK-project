import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Other'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/products?page=${currentPage}&pageSize=12`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      if (category && category !== 'All') url += `&category=${encodeURIComponent(category)}`;
      const { data } = await api.get(url);
      let sorted = [...data.products];
      if (sort === 'price_asc') sorted.sort((a, b) => a.price - b.price);
      if (sort === 'price_desc') sorted.sort((a, b) => b.price - a.price);
      if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
      setProducts(sorted);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, category, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--burgundy-900)', padding: 'var(--space-10) 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}>
            {keyword ? `Results for "${keyword}"` : category && category !== 'All' ? category : 'All Products'}
          </h1>
          <p style={{ color: 'var(--beige-500)', marginTop: 'var(--space-1)' }}>
            {loading ? 'Loading...' : `${total} products found`}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'flex-start' }}>

          {/* Sidebar Filters */}
          <aside className="sidebar" style={{ width: 240, flexShrink: 0, position: 'sticky', top: 90 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', marginBottom: 'var(--space-5)' }}>Filters</h3>

            {/* Category */}
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <p className="sidebar-title">Category</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setParam('category', cat === 'All' ? '' : cat)}
                    style={{
                      padding: 'var(--space-2) var(--space-3)',
                      textAlign: 'left',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: (category === cat || (cat === 'All' && !category)) ? 700 : 400,
                      background: (category === cat || (cat === 'All' && !category)) ? 'var(--burgundy-100)' : 'transparent',
                      color: (category === cat || (cat === 'All' && !category)) ? 'var(--primary)' : 'var(--text-secondary)',
                      transition: 'all var(--transition-fast)',
                      fontSize: '0.9375rem',
                    }}
                    id={`filter-cat-${cat}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="sidebar-title">Sort By</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setParam('sort', opt.value)}
                    style={{
                      padding: 'var(--space-2) var(--space-3)',
                      textAlign: 'left',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: sort === opt.value ? 700 : 400,
                      background: sort === opt.value ? 'var(--burgundy-100)' : 'transparent',
                      color: sort === opt.value ? 'var(--primary)' : 'var(--text-secondary)',
                      transition: 'all var(--transition-fast)',
                      fontSize: '0.9375rem',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(keyword || category) && (
              <button
                onClick={() => setSearchParams({})}
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', marginTop: 'var(--space-5)' }}
                id="clear-filters-btn"
              >
                <FiX size={14} /> Clear Filters
              </button>
            )}
          </aside>

          {/* Products */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <Loader />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >‹</button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`pagination-btn ${currentPage === p ? 'active' : ''}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(pages, p + 1))}
                      disabled={currentPage === pages}
                      className="pagination-btn"
                    >›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
