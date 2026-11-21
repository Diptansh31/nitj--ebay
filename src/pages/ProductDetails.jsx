import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListingById } from '../services/listingService';
import {
  ArrowLeft,
  Tag,
  Sparkles,
  ShieldCheck,
  Mail,
  MapPin,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await getListingById(id);

      if (isMounted) {
        if (fetchErr || !data) {
          setError(fetchErr?.message || 'Listing not found.');
          setProduct(null);
        } else {
          setProduct(data);
        }
        setLoading(false);
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container details-not-found-container">
        <div className="auth-loading-container" role="status" aria-live="polite">
          <div className="auth-loading-spinner" />
          <p className="auth-loading-text">Loading product details from Supabase...</p>
        </div>
      </div>
    );
  }

  // Fallback if product does not exist
  if (error || !product) {
    return (
      <div className="container details-not-found-container">
        <div className="empty-state-box">
          <div className="empty-icon-circle">
            <AlertCircle size={36} />
          </div>
          <h2 className="empty-title">Product Not Found</h2>
          <p className="empty-description">
            {error || `We couldn't find any campus listing with ID #${id}. It may have been removed or purchased by another student.`}
          </p>
          <Link to="/" className="btn-curved-black">
            <ArrowLeft size={16} />
            <span>Return to Marketplace</span>
          </Link>
        </div>
      </div>
    );
  }

  const { title, price, category, condition, image, description, seller, status } = product;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price || 0);

  const getConditionClass = (cond) => {
    const c = cond?.toLowerCase() || '';
    if (c.includes('like new') || c.includes('mint')) return 'condition-like-new';
    if (c.includes('good')) return 'condition-good';
    return 'condition-fair';
  };

  const isSold = status === 'sold';

  // Construct mailto link with pre-filled subject and friendly body
  const sellerEmail = seller?.email || 'student@nitj.ac.in';
  const sellerName = seller?.name || 'Fellow NITJ Student';

  const mailSubject = encodeURIComponent(`[NITJ eBay] Inquiry about: ${title}`);
  const mailBody = encodeURIComponent(
    `Hi ${sellerName},\n\nI saw your listing for "${title}" on NITJ eBay (₹${price}) and I would like to buy it. Are you available for handover on campus?\n\nThanks!\n[Your Name]\n[Your Hostel/Room]`
  );
  const mailtoLink = `mailto:${sellerEmail}?subject=${mailSubject}&body=${mailBody}`;

  const handleCopyEmail = () => {
    if (sellerEmail) {
      navigator.clipboard.writeText(sellerEmail);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

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
            <span className="breadcrumb-current">{title}</span>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="product-details-grid">
          {/* Left Column: Image & Safety Card */}
          <div className="details-media-col">
            <div className="details-image-card">
              <img
                src={image}
                alt={title}
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
            <h1 className="details-product-title">{title}</h1>

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
              <p className="details-description-text">{description || 'No description provided.'}</p>
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

                <div className="seller-verification-badge verified">
                  <CheckCircle2 size={15} />
                  <span>Verified NITJ Student</span>
                </div>
              </div>

              {/* Seller details row */}
              <div className="seller-details-list">
                <div className="seller-detail-item">
                  <GraduationCap size={16} className="seller-icon" />
                  <div>
                    <span className="seller-detail-label">Seller Name</span>
                    <p className="seller-detail-val">{sellerName}</p>
                  </div>
                </div>

                <div className="seller-detail-item">
                  <Mail size={16} className="seller-icon" />
                  <div>
                    <span className="seller-detail-label">College Email</span>
                    <a href={`mailto:${sellerEmail}`} className="seller-email-link">
                      {sellerEmail}
                    </a>
                  </div>
                </div>

                <div className="seller-detail-item">
                  <MapPin size={16} className="seller-icon" />
                  <div>
                    <span className="seller-detail-label">Campus Handover</span>
                    <p className="seller-detail-val">NIT Jalandhar Campus &amp; Hostels</p>
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
                  onClick={handleCopyEmail}
                >
                  <span>{copySuccess ? 'Copied to Clipboard!' : 'Copy Email'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
