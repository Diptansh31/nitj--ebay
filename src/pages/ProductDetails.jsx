import { useParams, Link } from 'react-router-dom';
import { SAMPLE_PRODUCTS } from '../data/products';
import {
  ArrowLeft,
  Tag,
  Sparkles,
  ShieldCheck,
  Mail,
  MapPin,
  GraduationCap,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const productId = parseInt(id, 10);
  const product = SAMPLE_PRODUCTS.find((p) => p.id === productId);

  // Fallback if product ID does not exist
  if (!product) {
    return (
      <div className="container details-not-found-container">
        <div className="empty-state-box">
          <div className="empty-icon-circle">
            <AlertCircle size={36} />
          </div>
          <h2 className="empty-title">Product Not Found</h2>
          <p className="empty-description">
            We couldn't find any campus listing with ID #{id}. It may have been
            removed or purchased by another student.
          </p>
          <Link to="/" className="btn-curved-black">
            <ArrowLeft size={16} />
            <span>Return to Marketplace</span>
          </Link>
        </div>
      </div>
    );
  }

  const { name, price, category, condition, image, description, seller, status } =
    product;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  const getConditionClass = (cond) => {
    const c = cond?.toLowerCase() || '';
    if (c.includes('like new') || c.includes('mint')) return 'condition-like-new';
    if (c.includes('good')) return 'condition-good';
    return 'condition-fair';
  };

  const isSold = status === 'sold';

  // Construct mailto link with pre-filled subject and friendly body
  const mailSubject = encodeURIComponent(`[NITJ eBay] Inquiry about: ${name}`);
  const mailBody = encodeURIComponent(
    `Hi ${seller?.name || 'Seller'},\n\nI saw your listing for "${name}" on NITJ eBay (₹${price}) and I would like to buy it. Are you available for handover on campus?\n\nThanks!\n[Your Name]\n[Your Hostel/Room]`
  );
  const mailtoLink = `mailto:${seller?.email}?subject=${mailSubject}&body=${mailBody}`;

  return (
    <div className="product-details-page">
      <div className="container">
        {/* Navigation Breadcrumb & Back button */}
        <div className="details-header-nav">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </Link>

          <div className="details-breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to={`/?category=${encodeURIComponent(category)}`}>
              {category}
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{name}</span>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="product-details-grid">
          {/* Left Column: Image & Safety Card */}
          <div className="details-media-col">
            <div className="details-image-card">
              <img
                src={image}
                alt={name}
                className="details-main-image"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className={`condition-badge ${getConditionClass(condition)}`}>
                <Sparkles size={13} />
                <span>Condition: {condition}</span>
              </div>

              {isSold && (
                <div className="details-sold-banner">
                  <span>Item Sold</span>
                </div>
              )}
            </div>

            {/* Campus Handover Safety Tip */}
            <div className="details-safety-card">
              <div className="safety-icon-wrapper">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="safety-card-title">NITJ Campus Handover Tips</h4>
                <p className="safety-card-desc">
                  Always inspect the item in person inside campus grounds (Hostel
                  Gates, Student Activity Centre, or Canteen) before paying UPI/cash.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Pricing, Seller Details */}
          <div className="details-info-col">
            {/* Category tag */}
            <div className="details-category-row">
              <span className="product-category-tag">
                <Tag size={13} />
                <span>{category}</span>
              </span>
              <span className="details-item-id">Listing #{id}</span>
            </div>

            {/* Product Title */}
            <h1 className="details-product-title">{name}</h1>

            {/* Price Box */}
            <div className="details-price-box">
              <span className="details-price-label">Asking Price</span>
              <div className="details-price-row">
                <span className="details-price-value">{formattedPrice}</span>
                <span className="price-tag-sub">Fixed campus student price</span>
              </div>
            </div>

            {/* Product Description */}
            <div className="details-section">
              <h3 className="details-section-title">Item Description</h3>
              <p className="details-description-text">{description}</p>
            </div>

            {/* Specifications Summary */}
            <div className="details-specs-grid">
              <div className="spec-card">
                <span className="spec-label">Category</span>
                <span className="spec-value">{category}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Condition</span>
                <span className="spec-value">{condition}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Availability</span>
                <span className={`spec-value ${isSold ? 'text-sold' : 'text-available'}`}>
                  {isSold ? 'Sold' : 'Available for Pickup'}
                </span>
              </div>
            </div>

            {/* Seller Information Card */}
            <div className="seller-info-card">
              <div className="seller-header">
                <div>
                  <h3 className="seller-card-title">Seller Information</h3>
                  <p className="seller-card-subtitle">
                    Enrolled NIT Jalandhar Student
                  </p>
                </div>

                {/* Verification Status Indicator (Demo Data) */}
                <div
                  className={`seller-verification-badge ${
                    seller?.isVerified ? 'verified' : 'unverified'
                  }`}
                  title="Demo status indicator. College email verification will be connected in future phases."
                >
                  {seller?.isVerified ? (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Verified Student (Demo)</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={15} />
                      <span>Unverified (Demo)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Demo Notice */}
              <div className="demo-verification-note">
                <HelpCircle size={13} />
                <span>
                  Demo verification status only. College email authentication is not yet implemented.
                </span>
              </div>

              {/* Seller details row */}
              <div className="seller-details-list">
                <div className="seller-detail-item">
                  <GraduationCap size={16} className="seller-icon" />
                  <div>
                    <span className="seller-detail-label">Seller Name</span>
                    <p className="seller-detail-val">{seller?.name || 'Campus Student'}</p>
                    {seller?.branch && (
                      <span className="seller-sub-val">{seller.branch}</span>
                    )}
                  </div>
                </div>

                <div className="seller-detail-item">
                  <Mail size={16} className="seller-icon" />
                  <div>
                    <span className="seller-detail-label">College Email</span>
                    <a href={`mailto:${seller?.email}`} className="seller-email-link">
                      {seller?.email || 'student@nitj.ac.in'}
                    </a>
                  </div>
                </div>

                <div className="seller-detail-item">
                  <MapPin size={16} className="seller-icon" />
                  <div>
                    <span className="seller-detail-label">Hostel Handover Point</span>
                    <p className="seller-detail-val">{seller?.hostel || 'NITJ Campus Hostels'}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Contact Seller */}
              <div className="seller-contact-actions">
                <a
                  href={mailtoLink}
                  className="btn-curved-black contact-seller-btn"
                >
                  <Mail size={17} />
                  <span>Contact Seller via Email</span>
                </a>

                <button
                  type="button"
                  className="btn-curved-outline copy-email-btn"
                  onClick={() => {
                    if (seller?.email) {
                      navigator.clipboard.writeText(seller.email);
                      alert(`Copied seller email: ${seller.email}`);
                    }
                  }}
                >
                  <span>Copy Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
