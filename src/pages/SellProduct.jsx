import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../constants/categories';
import { createListing } from '../services/listingService';
import ProductCard from '../components/ProductCard';
import {
  PlusCircle,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  RotateCcw,
  Loader2,
  ExternalLink,
  ListOrdered,
} from 'lucide-react';

const CONDITIONS = ['Like New', 'Good', 'Fair'];

export default function SellProduct() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0] || 'Books',
    price: '',
    condition: 'Good',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProduct, setCreatedProduct] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image file selection & thumbnail preview
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file (PNG, JPG, JPEG, WebP).');
        return;
      }

      // Max size limit: 5MB
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size exceeds 5MB limit. Please choose a smaller photo.');
        return;
      }

      setErrorMessage('');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      setErrorMessage('You must be logged in to create a listing.');
      return;
    }

    const { name, category, price, condition, description } = formData;

    // Field validations
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

    if (!imageFile) {
      setErrorMessage('Please select an image of your item to upload.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await createListing({
        title: name.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        condition,
        imageFile,
        userId: user.id,
      });

      if (error) {
        setErrorMessage(error.message || 'Failed to save listing. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setCreatedProduct(data);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred while posting the item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      category: CATEGORIES[0] || 'Books',
      price: '',
      condition: 'Good',
      description: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setCreatedProduct(null);
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
            Upload your second-hand textbooks, cycles, or hostel essentials to the Supabase campus marketplace
          </p>
        </div>

        {/* If product was successfully created in Supabase */}
        {createdProduct ? (
          <div className="sell-success-container">
            <div className="auth-alert success-alert" role="status">
              <CheckCircle2 size={22} />
              <div>
                <strong>Listing Published Successfully!</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                  Your listing has been saved to the database and your image was stored in the{' '}
                  <code>product-images</code> bucket. Other NITJ students can now view it on the marketplace.
                </p>
              </div>
            </div>

            <div className="preview-card-wrapper">
              <h3 className="preview-heading">Your Live Marketplace Card:</h3>
              <div style={{ maxWidth: '320px', margin: '0 auto' }}>
                <ProductCard product={createdProduct} />
              </div>
            </div>

            <div className="preview-actions-row">
              <Link to={`/product/${createdProduct.id}`} className="btn-curved-black">
                <ExternalLink size={16} />
                <span>View Live Listing</span>
              </Link>

              <Link to="/my-listings" className="btn-curved-outline">
                <ListOrdered size={16} />
                <span>Manage My Listings</span>
              </Link>

              <button
                type="button"
                className="btn-curved-grey"
                onClick={handleResetForm}
              >
                <PlusCircle size={16} />
                <span>List Another Item</span>
              </button>
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
                  disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              {/* Image Selection */}
              <div className="form-group">
                <label className="form-label">Product Image *</label>
                <div className="image-upload-box">
                  <input
                    id="product-image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="file-input-hidden"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="product-image-file" className="file-upload-label">
                    <ImageIcon size={24} />
                    <span>Click to select product image</span>
                    <span className="upload-hint">Image will be uploaded to Supabase Storage under your student ID folder</span>
                  </label>

                  {imagePreview && (
                    <div className="image-preview-thumbnail">
                      <img src={imagePreview} alt="Selected preview" />
                      <button
                        type="button"
                        className="remove-img-btn"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        disabled={isSubmitting}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="sell-form-actions">
                <button
                  type="submit"
                  className="btn-curved-black sell-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={17} className="spin-icon" />
                      <span>Uploading &amp; Publishing...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={17} />
                      <span>Publish Listing</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-curved-grey"
                  onClick={handleResetForm}
                  disabled={isSubmitting}
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
