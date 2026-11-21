import ProductCard from './ProductCard';
import { PackageOpen, RotateCcw } from 'lucide-react';

export default function ProductGrid({
  products = [],
  selectedCategory,
  onResetCategory,
}) {
  const isFiltered = selectedCategory && selectedCategory !== 'All';

  // Empty state if category has no products
  if (products.length === 0) {
    return (
      <section className="product-grid-section">
        <div className="empty-state-box">
          <div className="empty-icon-circle">
            <PackageOpen size={36} />
          </div>
          <h3 className="empty-title">No products found</h3>
          <p className="empty-description">
            There are currently no items listed under{' '}
            <strong>"{selectedCategory}"</strong> by students. Check back soon
            or be the first to sell!
          </p>
          {isFiltered && (
            <button
              type="button"
              className="btn-curved-black reset-filter-btn"
              onClick={onResetCategory}
            >
              <RotateCcw size={16} />
              <span>Show All Products</span>
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="product-grid-section" aria-label="Available products">
      {/* Grid Header Info */}
      <div className="product-grid-header">
        <div>
          <h2 className="section-title">
            {isFiltered ? `${selectedCategory} Items` : 'Fresh Listings on Campus'}
          </h2>
          <p className="section-subtitle">
            Showing {products.length} {products.length === 1 ? 'item' : 'items'} available for local handover at NITJ
          </p>
        </div>

        {isFiltered && (
          <button
            type="button"
            className="btn-curved-outline clear-filter-btn"
            onClick={onResetCategory}
          >
            <RotateCcw size={14} />
            <span>Clear filter</span>
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
