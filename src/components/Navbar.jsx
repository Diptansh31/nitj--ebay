import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  ChevronDown,
  PlusCircle,
  LogIn,
  UserPlus,
  Home,
  Menu,
  X,
  BookOpen,
  Laptop,
  Armchair,
  Shirt,
  Trophy,
  Package,
  Layers,
  ListOrdered,
} from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

// Helper icon mapping for category dropdown items
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Books':
      return <BookOpen size={16} />;
    case 'Electronics':
      return <Laptop size={16} />;
    case 'Furniture':
      return <Armchair size={16} />;
    case 'Clothing':
      return <Shirt size={16} />;
    case 'Sports':
      return <Trophy size={16} />;
    default:
      return <Package size={16} />;
  }
};

export default function Navbar({ selectedCategory, onSelectCategory }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Active category is either prop or from URL ?category=...
  const activeCategory =
    selectedCategory || searchParams.get('category') || 'All';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (category) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);

    if (onSelectCategory) {
      onSelectCategory(category);
    }

    if (category === 'All') {
      navigate('/');
    } else {
      navigate(`/?category=${encodeURIComponent(category)}`);
    }
  };

  const handleHomeClick = () => {
    setIsMobileMenuOpen(false);
    if (onSelectCategory) {
      onSelectCategory('All');
    }
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Left: Brand Logo & NITJ badge */}
        <div className="navbar-brand-group">
          <Link
            to="/"
            className="navbar-brand-btn"
            onClick={handleHomeClick}
            aria-label="NITJ eBay Home"
          >
            <div className="brand-logo-icon">
              <ShoppingBag size={20} />
            </div>
            <div className="brand-text">
              <span className="brand-name">
                NITJ <span className="brand-accent">eBay</span>
              </span>
              <span className="brand-tag">Student Marketplace</span>
            </div>
          </Link>
        </div>

        {/* Center / Nav Items (Desktop) */}
        <nav className="navbar-nav desktop-only">
          <Link
            to="/"
            className={`nav-link-btn ${
              location.pathname === '/' && activeCategory === 'All' ? 'active' : ''
            }`}
            onClick={handleHomeClick}
          >
            <Home size={17} />
            <span>Home</span>
          </Link>

          {/* Shop by Category Dropdown */}
          <div className="dropdown-container" ref={dropdownRef}>
            <button
              type="button"
              className={`nav-link-btn category-trigger-btn ${
                activeCategory !== 'All' ? 'active' : ''
              }`}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
            >
              <Layers size={17} />
              <span>
                {activeCategory === 'All'
                  ? 'Shop by Category'
                  : `Category: ${activeCategory}`}
              </span>
              <ChevronDown
                size={16}
                className={`dropdown-chevron ${isDropdownOpen ? 'rotate' : ''}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="category-dropdown-menu">
                <button
                  type="button"
                  className={`dropdown-item ${activeCategory === 'All' ? 'selected' : ''}`}
                  onClick={() => handleCategoryClick('All')}
                >
                  <Layers size={16} />
                  <span>All Categories</span>
                </button>
                <div className="dropdown-divider" />
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`dropdown-item ${
                      activeCategory === category ? 'selected' : ''
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {getCategoryIcon(category)}
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* My Listings link */}
          <Link
            to="/my-listings"
            className={`nav-link-btn ${
              location.pathname === '/my-listings' ? 'active' : ''
            }`}
          >
            <ListOrdered size={17} />
            <span>My Listings</span>
          </Link>
        </nav>

        {/* Right: Actions (Sell item + Auth buttons) */}
        <div className="navbar-actions desktop-only">
          <Link to="/sell" className="btn-curved-black sell-btn">
            <PlusCircle size={18} />
            <span>Sell an Item</span>
          </Link>

          <div className="auth-buttons-group">
            <Link
              to="/login"
              className={`btn-curved-outline login-btn ${
                location.pathname === '/login' ? 'active-auth' : ''
              }`}
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>

            <Link
              to="/register"
              className={`btn-curved-grey register-btn ${
                location.pathname === '/register' ? 'active-auth' : ''
              }`}
            >
              <UserPlus size={16} />
              <span>Register</span>
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-menu-toggle mobile-only"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer mobile-only">
          <div className="mobile-drawer-section">
            <Link
              to="/"
              className={`mobile-drawer-item ${
                location.pathname === '/' && activeCategory === 'All' ? 'active' : ''
              }`}
              onClick={handleHomeClick}
            >
              <Home size={18} />
              <span>Home (All Items)</span>
            </Link>
            <Link
              to="/my-listings"
              className={`mobile-drawer-item ${
                location.pathname === '/my-listings' ? 'active' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ListOrdered size={18} />
              <span>My Listings</span>
            </Link>
          </div>

          <div className="mobile-drawer-section">
            <span className="mobile-drawer-label">Browse by Category</span>
            <div className="mobile-category-list">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`mobile-category-btn ${
                    activeCategory === category ? 'active' : ''
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mobile-drawer-section mobile-actions">
            <Link
              to="/sell"
              className="btn-curved-black full-width"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <PlusCircle size={18} />
              <span>Sell an Item</span>
            </Link>
            <div className="mobile-auth-row">
              <Link
                to="/login"
                className="btn-curved-outline full-width"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="btn-curved-grey full-width"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserPlus size={16} />
                <span>Register</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
