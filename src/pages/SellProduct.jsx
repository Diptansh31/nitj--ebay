import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';
import ProductCard from '../components/ProductCard';
import {
  PlusCircle,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';

const CONDITIONS = ['Like New', 'Good', 'Fair'];

export default function SellProduct() {
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0] || 'Books',
    price: '',
    condition: 'Good',
    description: '',
    imageUrl: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdPreviewProduct, setCreatedPreviewProduct] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Local file selection preview (Frontend only - no external upload)
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);
      setFormData((prev) => ({ ...prev, imageUrl: localUrl }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const { name, category, price, condition, description, imageUrl } = formData;

    // Basic frontend validation
    if (!name.trim()) {
      setErrorMessage('Please provide a product title/name.');
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setErrorMessage('Please enter a valid price in INR (e.g. 450).');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Please provide a brief description of the item.');
      return;
    }

    // Default placeholder image if none selected
    const fallbackImage =
      imageUrl ||
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';

    const newProductPreview = {
      id: 999, // Temporary demo ID
      name: name.trim(),
      category,
      price: Number(price),
      condition,
      image: fallbackImage,
      description: description.trim(),
      status: 'available',
      seller: {
        name: 'You (Current Student)',
        email: 'your.rollno@nitj.ac.in',
        hostel: 'NITJ Hostel',
        isVerified: true,
      },
    };

    setCreatedPreviewProduct(newProductPreview);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      category: CATEGORIES[0] || 'Books',
      price: '',
      condition: 'Good',
      description: '',
      imageUrl: '',
    });
    setImagePreview(null);
    setCreatedPreviewProduct(null);
    setErrorMessage('');
  };

  return (
    <div className="sell-page-container">
      <div className="container">
        {/* Header navigation */}
        <div className="sell-page-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Marketplace</span>
          </Link>
          <h1 className="section-title">List an Item for Sale</h1>
          <p className="section-subtitle">
            Pass on your textbooks, cycles, or hostel appliances to fellow NITJ students
          </p>
        </div>

        {/* Prominent Demo Notice */}
        <div className="demo-notice-banner">
          <Info size={18} />
          <span>
            <strong>Phase 2 Frontend Demo:</strong> This form is fully interactive
            on the frontend. Backend database storage and image uploading are not yet
            connected, so submitted listings are demonstrated as local previews.
          </span>
        </div>

        {/* If a preview product was submitted */}
        {createdPreviewProduct ? (
          <div className="sell-success-container">
            <div className="auth-alert success-alert">
              <CheckCircle2 size={20} />
              <div>
                <strong>Listing Preview Created Successfully!</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                  Backend integration has not been implemented yet, so this listing is
                  not saved to a database. Below is how your listing appears to other students:
                </p>
              </div>
            </div>

            <div className="preview-card-wrapper">
              <h3 className="preview-heading">Product Card Preview:</h3>
              <div style={{ maxWidth: '320px', margin: '0 auto' }}>
                <ProductCard product={createdPreviewProduct} />
              </div>
            </div>

            <div className="preview-actions-row">
              <button
                type="button"
                className="btn-curved-black"
                onClick={handleResetForm}
              >
                <PlusCircle size={16} />
                <span>List Another Item</span>
              </button>
              <Link to="/" className="btn-curved-outline">
                <span>Go to Homepage</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Form Container */
          <div className="sell-form-card">
            {errorMessage && (
              <div className="auth-alert error-alert" role="alert">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="sell-form" noValidate>
              {/* Product Name */}
              <div className="form-group">
                <label htmlFor="product-name" className="form-label">
                  Product Name / Title *
                </label>
                <input
                  id="product-name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Higher Engineering Mathematics (B.S. Grewal)"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Two columns: Category & Price */}
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="product-category" className="form-label">
                    Category *
                  </label>
                  <select
                    id="product-category"
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="product-price" className="form-label">
                    Price in INR (₹) *
                  </label>
                  <input
                    id="product-price"
                    name="price"
                    type="number"
                    min="1"
                    className="form-input"
                    placeholder="e.g. 450"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Condition Selection */}
              <div className="form-group">
                <label className="form-label">Product Condition *</label>
                <div className="condition-radio-group">
                  {CONDITIONS.map((cond) => (
                    <label
                      key={cond}
                      className={`condition-radio-pill ${
                        formData.condition === cond ? 'active' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={cond}
                        checked={formData.condition === cond}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>{cond}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="product-description" className="form-label">
                  Description *
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  rows="4"
                  className="form-textarea"
                  placeholder="Describe the condition, semester relevance, accessories included, or campus handover point..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Image Selection */}
              <div className="form-group">
                <label className="form-label">Product Image</label>
                <div className="image-upload-box">
                  <input
                    id="product-image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="file-input-hidden"
                  />
                  <label htmlFor="product-image-file" className="file-upload-label">
                    <ImageIcon size={24} />
                    <span>Click to select an image from your device</span>
                    <span className="upload-hint">Frontend preview only. No image is uploaded externally.</span>
                  </label>

                  {imagePreview && (
                    <div className="image-preview-thumbnail">
                      <img src={imagePreview} alt="Selected preview" />
                      <button
                        type="button"
                        className="remove-img-btn"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData((prev) => ({ ...prev, imageUrl: '' }));
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="sell-form-actions">
                <button type="submit" className="btn-curved-black sell-submit-btn">
                  <PlusCircle size={17} />
                  <span>Post Listing Preview</span>
                </button>
                <button
                  type="button"
                  className="btn-curved-grey"
                  onClick={handleResetForm}
                >
                  <RotateCcw size={15} />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
