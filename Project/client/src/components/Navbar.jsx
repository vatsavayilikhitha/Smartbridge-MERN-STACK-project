import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiChevronDown, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        background: scrolled ? 'rgba(253, 252, 249, 0.97)' : 'var(--cream)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
        transition: 'all var(--transition-base)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="container">
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', gap: 'var(--space-6)' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36,
              background: 'var(--primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-on-dark)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.125rem',
            }}>S</div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--primary)',
              letterSpacing: '-0.02em',
            }}>
              Shop<span style={{ color: 'var(--text-secondary)' }}>EZ</span>
            </span>
          </Link>

          {/* Search Bar — Desktop */}
          <form
            onSubmit={handleSearch}
            style={{
              flex: 1, maxWidth: 480,
              display: 'flex',
              background: 'var(--beige-300)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border)',
              overflow: 'hidden',
              transition: 'all var(--transition-fast)',
            }}
            className="search-form"
          >
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: 'var(--space-2) var(--space-4)',
                border: 'none',
                background: 'transparent',
                fontSize: '0.9375rem',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: 'var(--space-2) var(--space-4)',
                background: 'var(--primary)',
                color: 'var(--text-on-dark)',
                border: 'none',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)',
                display: 'flex', alignItems: 'center',
              }}
            >
              <FiSearch size={18} />
            </button>
          </form>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }} className="nav-links">
            <NavLink
              to="/products"
              style={({ isActive }) => ({
                padding: 'var(--space-2) var(--space-3)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                borderRadius: 'var(--radius-md)',
                transition: 'all var(--transition-fast)',
              })}
            >
              Products
            </NavLink>

            {/* Cart */}
            <Link
              to="/cart"
              style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 42, height: 42,
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                transition: 'all var(--transition-fast)',
              }}
              id="cart-link"
            >
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4, right: -4,
                  background: 'var(--primary)',
                  color: 'var(--text-on-dark)',
                  borderRadius: '50%',
                  width: 18, height: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'var(--beige-300)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  id="user-menu-btn"
                >
                  <div style={{
                    width: 28, height: 28,
                    background: 'var(--primary)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-on-dark)',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name?.split(' ')[0]}</span>
                  <FiChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'var(--cream)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: 200,
                    overflow: 'hidden',
                    zIndex: 'var(--z-dropdown)',
                    animation: 'modalIn 0.15s ease',
                  }}>
                    <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border)', background: 'var(--beige-300)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{user.name}</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>
                    <div style={{ padding: 'var(--space-2)' }}>
                      <DropdownItem to="/profile" icon={<FiUser />} label="My Profile" onClick={() => setDropdownOpen(false)} />
                      <DropdownItem to="/orders" icon={<FiPackage />} label="My Orders" onClick={() => setDropdownOpen(false)} />
                      {user.role === 'admin' && (
                        <DropdownItem to="/seller" icon={<FiSettings />} label="Seller Dashboard" onClick={() => setDropdownOpen(false)} />
                      )}
                      <div style={{ height: 1, background: 'var(--border)', margin: 'var(--space-2) 0' }} />
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                          padding: 'var(--space-2) var(--space-3)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--error)',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          transition: 'background var(--transition-fast)',
                          background: 'none', border: 'none', cursor: 'pointer',
                        }}
                        id="logout-btn"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Link to="/login" className="btn btn-ghost btn-sm" id="nav-login-btn">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">Sign Up</Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: 'none', padding: 'var(--space-2)', color: 'var(--text-secondary)' }}
              className="mobile-menu-btn"
              id="mobile-menu-btn"
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          background: 'var(--cream)',
          borderTop: '1px solid var(--border)',
          padding: 'var(--space-4)',
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <input
              className="form-input"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <FiSearch />
            </button>
          </form>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Link to="/products" onClick={() => setMobileOpen(false)} style={{ padding: 'var(--space-3)', fontWeight: 700, color: 'var(--text-secondary)' }}>Products</Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)} style={{ padding: 'var(--space-3)', fontWeight: 700, color: 'var(--text-secondary)' }}>Cart ({cartCount})</Link>
            {user ? (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)} style={{ padding: 'var(--space-3)', fontWeight: 700, color: 'var(--text-secondary)' }}>My Orders</Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ padding: 'var(--space-3)', fontWeight: 700, color: 'var(--text-secondary)' }}>Profile</Link>
                {user.role === 'admin' && (
                  <Link to="/seller" onClick={() => setMobileOpen(false)} style={{ padding: 'var(--space-3)', fontWeight: 700, color: 'var(--text-secondary)' }}>Seller Dashboard</Link>
                )}
                <button onClick={handleLogout} style={{ padding: 'var(--space-3)', fontWeight: 700, color: 'var(--error)', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-secondary" style={{ marginTop: 'var(--space-2)' }}>Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .search-form { display: none !important; }
          .nav-links { gap: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
          .nav-links > a, .nav-links > div:not(:last-child) { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function DropdownItem({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        padding: 'var(--space-2) var(--space-3)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-secondary)',
        fontWeight: 700,
        fontSize: '0.9375rem',
        transition: 'background var(--transition-fast)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--beige-300)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {icon} {label}
    </Link>
  );
}
