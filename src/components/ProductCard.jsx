import { Tag, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getListingImageUrl, DEFAULT_PRODUCT_IMAGE } from '../services/listingService';

export default function ProductCard({
  product,
  showStatus = false,
  customActions = null,
}) {
  const { id, name, title, price, category, condition, image, image_path, status } = product;

  // Support both title (Supabase DB schema) and name (legacy property)
  const displayTitle = title || name || 'Untitled Listing';

  // Support both pre-formatted image URL and raw image_path
  const displayImage =
    image || (image_path ? getListingImageUrl(image_path) : DEFAULT_PRODUCT_IMAGE);

  // Format price in Indian Rupee format
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price || 0);

  // Condition styling variant
  const getConditionClass = (cond) => {
    const c = cond?.toLowerCase() || '';
    if (c.includes('like new') || c.includes('mint')) return 'condition-like-new';
    if (c.includes('good')) return 'condition-good';
    return 'condition-fair';
  };

  const isSold = status === 'sold';

  return (
    <article className={`product-card ${isSold ? 'product-card-sold' : ''}`}>
      {/* Product Image Wrapper - Clickable to open details */}
      <Link
        to={`/product/${id}`}
        className="product-image-container"
        aria-label={`View details for ${displayTitle}`}
      >
        <img
          src={displayImage}
          alt={displayTitle}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
          }}
        />

        {/* Condition Badge pinned on top-right */}
        <div className={`condition-badge ${getConditionClass(condition)}`}>
          <Sparkles size={12} />
          <span>{condition || 'Good'}</span>
        </div>

        {/* Optional Status Badge (e.g. for My Listings) */}
        {showStatus && (
          <div className={`listing-status-badge ${isSold ? 'status-sold' : 'status-available'}`}>
            {isSold ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
            <span>{isSold ? 'Sold' : 'Available'}</span>
          </div>
        )}
      </Link>

      {/* Product Content Body */}
      <div className="product-card-body">
        {/* Category tag */}
        <div className="product-category-row">
          <span className="product-category-tag">
            <Tag size={12} />
            <span>{category}</span>
          </span>
        </div>

        {/* Product title - Clickable */}
        <h3 className="product-title" title={displayTitle}>
          <Link to={`/product/${id}`} className="product-title-link">
            {displayTitle}
          </Link>
        </h3>

        {/* Price & View Action */}
        <div className="product-card-footer">
          <div className="price-box">
            <span className="price-label">Price</span>
            <span className="price-value">{formattedPrice}</span>
          </div>

          <Link
            to={`/product/${id}`}
            className="btn-curved-black view-item-btn"
            aria-label={`View ${displayTitle}`}
          >
            View
          </Link>
        </div>

        {/* Optional custom management controls (e.g. for My Listings) */}
        {customActions && (
          <div className="product-card-custom-actions">
            {customActions}
          </div>
        )}
      </div>
    </article>
  );
}
