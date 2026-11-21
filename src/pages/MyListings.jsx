import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getUserListings,
  markListingAsSold,
  deleteListing,
  updateListing,
} from '../services/listingService';
import { CATEGORIES } from '../constants/categories';
import ProductCard from '../components/ProductCard';
import {
  ListOrdered,
  PlusCircle,
  Edit3,
  Trash2,
  RefreshCw,
  Info,
  User,
  Mail,
  ShieldCheck,
  AlertCircle,
  X,
  Check,
  Loader2,
} from 'lucide-react';

const CONDITIONS = ['Like New', 'Good', 'Fair'];

export default function MyListings() {
  const { user } = useAuth();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'available', 'sold'
  const [noticeMessage, setNoticeMessage] = useState('');

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: 'Books',
    price: '',
    condition: 'Good',
    description: '',
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  const studentName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'NITJ Student';
  const studentEmail = user?.email || 'student@nitj.ac.in';

  // Fetch logged-in student's listings from Supabase
  const loadUserListings = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);

    const { data, error: fetchErr } = await getUserListings(user.id);

    if (fetchErr) {
      console.error('Error fetching user listings:', fetchErr);
      setError(fetchErr.message || 'Failed to load your listings.');
      setListings([]);
    } else {
      setListings(data || []);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadUserListings();
  }, [loadUserListings]);

  // Toggle listing status between available and sold
  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'sold' ? 'available' : 'sold';

    const { error: updateErr } = await markListingAsSold(item.id, nextStatus);

    if (updateErr) {
      alert(`Failed to update status: ${updateErr.message}`);
      return;
    }

    setListings((prev) =>
      prev.map((l) => (l.id === item.id ? { ...l, status: nextStatus } : l))
    );

    setNoticeMessage(
      `Listing "${item.title || item.name}" marked as ${nextStatus.toUpperCase()} successfully.`
    );
  };

  // Delete listing from Supabase database and storage
  const handleDeleteListing = async (item) => {
    const itemTitle = item.title || item.name || 'this listing';
    if (!window.confirm(`Are you sure you want to permanently delete "${itemTitle}"?`)) {
      return;
    }

    const { error: delErr } = await deleteListing(item.id, item.image_path);

    if (delErr) {
      alert(`Failed to delete listing: ${delErr.message}`);
      return;
    }

    setListings((prev) => prev.filter((l) => l.id !== item.id));
    setNoticeMessage(`Listing "${itemTitle}" was permanently deleted from the marketplace.`);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      title: item.title || item.name || '',
      category: item.category || 'Books',
      price: item.price || '',
      condition: item.condition || 'Good',
      description: item.description || '',
    });
    setEditImageFile(null);
    setEditImagePreview(item.image || null);
    setEditError('');
  };

  const handleCloseEdit = () => {
    setEditingItem(null);
    setEditImageFile(null);
    setEditImagePreview(null);
    setEditError('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setEditError('Please select a valid image file.');
        return;
      }
      setEditError('');
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  // Save changes to Supabase
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditError('');

    if (!editFormData.title.trim()) {
      setEditError('Product title cannot be empty.');
      return;
    }

    const numPrice = Number(editFormData.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setEditError('Please enter a valid price in INR.');
      return;
    }

    setIsSavingEdit(true);

    try {
      const updates = {
        title: editFormData.title.trim(),
        category: editFormData.category,
        price: numPrice,
        condition: editFormData.condition,
        description: editFormData.description.trim(),
      };

      if (editImageFile) {
        updates.imageFile = editImageFile;
      }

      const { data, error: saveErr } = await updateListing(
        editingItem.id,
        updates,
        user.id
      );

      if (saveErr) {
        setEditError(saveErr.message || 'Failed to update listing.');
        setIsSavingEdit(false);
        return;
      }

      // Update in local state
      setListings((prev) =>
        prev.map((l) => (l.id === editingItem.id ? { ...l, ...data } : l))
      );

      setNoticeMessage(`Listing "${editFormData.title}" updated successfully.`);
      handleCloseEdit();
    } catch (err) {
      setEditError(err.message || 'Failed to save edits.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Filter listings based on active tab
  const filteredListings = listings.filter((item) => {
    if (activeTab === 'available') return item.status === 'available';
    if (activeTab === 'sold') return item.status === 'sold';
    return true;
  });

  return (
    <div className="my-listings-page">
      <div className="container">
        {/* Page Header */}
        <div className="my-listings-header">
          <div>
            <h1 className="section-title">My Campus Listings</h1>
            <p className="section-subtitle">
              Manage items you have listed for sale to fellow NITJ students
            </p>
          </div>

          <Link to="/sell" className="btn-curved-black">
            <PlusCircle size={17} />
            <span>Post New Listing</span>
          </Link>
        </div>

        {/* Authenticated Student Profile Card */}
        <div className="demo-user-profile-card">
          <div className="demo-user-header">
            <div className="demo-user-avatar">
              <User size={20} />
            </div>
            <div>
              <div className="demo-user-name-row">
                <h3 className="demo-user-name">{studentName}</h3>
                <span className="demo-user-tag">Authenticated Seller</span>
                <span className="demo-user-badge">
                  <ShieldCheck size={12} />
                  <span>Verified NITJ Student</span>
                </span>
              </div>
              <p className="demo-user-sub">
                <Mail size={13} style={{ display: 'inline', marginRight: '4px' }} />
                {studentEmail} &bull; NIT Jalandhar
              </p>
            </div>
          </div>
        </div>

        {/* Notice Banner */}
        {noticeMessage && (
          <div className="demo-notice-banner" style={{ margin: '1.25rem 0' }}>
            <Info size={17} />
            <span>{noticeMessage}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="listings-tabs-bar">
          <button
            type="button"
            className={`listings-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>All Listings</span>
            <span className="tab-count">{listings.length}</span>
          </button>

          <button
            type="button"
            className={`listings-tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            <span>Available</span>
            <span className="tab-count">
              {listings.filter((l) => l.status === 'available').length}
            </span>
          </button>

          <button
            type="button"
            className={`listings-tab ${activeTab === 'sold' ? 'active' : ''}`}
            onClick={() => setActiveTab('sold')}
          >
            <span>Sold</span>
            <span className="tab-count">
              {listings.filter((l) => l.status === 'sold').length}
            </span>
          </button>
        </div>

        {/* Listings Display */}
        {loading ? (
          <div className="auth-loading-container" role="status" aria-live="polite">
            <div className="auth-loading-spinner" />
            <p className="auth-loading-text">Loading your listings from Supabase...</p>
          </div>
        ) : error ? (
          <div className="empty-state-box">
            <div className="empty-icon-circle" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
              <AlertCircle size={32} />
            </div>
            <h3 className="empty-title">Error loading listings</h3>
            <p className="empty-description">{error}</p>
            <button
              type="button"
              className="btn-curved-black"
              onClick={loadUserListings}
            >
              <RefreshCw size={16} />
              <span>Retry</span>
            </button>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-icon-circle">
              <ListOrdered size={32} />
            </div>
            <h3 className="empty-title">No listings found</h3>
            <p className="empty-description">
              {activeTab === 'all'
                ? "You haven't listed any items for sale yet. Turn your unused textbooks or appliances into cash!"
                : `You do not have any items currently marked as "${activeTab}".`}
            </p>
            <Link to="/sell" className="btn-curved-black">
              <PlusCircle size={16} />
              <span>List an Item Now</span>
            </Link>
          </div>
        ) : (
          <div className="product-grid" style={{ marginTop: '1.5rem' }}>
            {filteredListings.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showStatus={true}
                customActions={
                  <div className="my-listing-controls">
                    {/* Mark as Sold / Available toggle */}
                    <button
                      type="button"
                      className={`btn-curved-outline control-btn ${
                        product.status === 'sold' ? 'btn-mark-avail' : 'btn-mark-sold'
                      }`}
                      onClick={() => handleToggleStatus(product)}
                      title={
                        product.status === 'sold'
                          ? 'Mark this item as available again'
                          : 'Mark this item as sold'
                      }
                    >
                      <RefreshCw size={13} />
                      <span>
                        {product.status === 'sold'
                          ? 'Mark as Available'
                          : 'Mark as Sold'}
                      </span>
                    </button>

                    <div className="control-btn-group">
                      {/* Real Edit Control */}
                      <button
                        type="button"
                        className="control-icon-btn edit-icon-btn"
                        onClick={() => handleOpenEdit(product)}
                        title="Edit listing details"
                        aria-label="Edit listing"
                      >
                        <Edit3 size={15} />
                      </button>

                      {/* Real Delete Control */}
                      <button
                        type="button"
                        className="control-icon-btn delete-icon-btn"
                        onClick={() => handleDeleteListing(product)}
                        title="Delete listing"
                        aria-label="Delete listing"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        )}

        {/* Edit Listing Modal */}
        {editingItem && (
          <div className="edit-modal-overlay" role="dialog" aria-modal="true">
            <div className="edit-modal-card">
              <div className="edit-modal-header">
                <div>
                  <h3 className="edit-modal-title">Edit Listing</h3>
                  <p className="edit-modal-subtitle">Update your product information</p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={handleCloseEdit}
                  disabled={isSavingEdit}
                >
                  <X size={20} />
                </button>
              </div>

              {editError && (
                <div className="auth-alert error-alert" style={{ margin: '1rem 0' }}>
                  <AlertCircle size={16} />
                  <span>{editError}</span>
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="edit-modal-form">
                <div className="form-group">
                  <label className="form-label">Product Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    disabled={isSavingEdit}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      name="category"
                      className="form-select"
                      value={editFormData.category}
                      onChange={handleEditChange}
                      disabled={isSavingEdit}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price in INR (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      min="1"
                      className="form-input"
                      value={editFormData.price}
                      onChange={handleEditChange}
                      disabled={isSavingEdit}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Condition *</label>
                  <div className="condition-radio-group">
                    {CONDITIONS.map((cond) => (
                      <label
                        key={cond}
                        className={`condition-radio-pill ${
                          editFormData.condition === cond ? 'active' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="condition"
                          value={cond}
                          checked={editFormData.condition === cond}
                          onChange={handleEditChange}
                          className="sr-only"
                          disabled={isSavingEdit}
                        />
                        <span>{cond}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="form-textarea"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    disabled={isSavingEdit}
                    required
                  />
                </div>

                {/* Optional Image Replacement */}
                <div className="form-group">
                  <label className="form-label">Update Image (Optional)</label>
                  <div className="edit-image-row">
                    {editImagePreview && (
                      <img
                        src={editImagePreview}
                        alt="Current listing"
                        className="edit-image-thumb"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="form-input"
                      disabled={isSavingEdit}
                    />
                  </div>
                </div>

                <div className="edit-modal-actions">
                  <button
                    type="submit"
                    className="btn-curved-black"
                    disabled={isSavingEdit}
                  >
                    {isSavingEdit ? (
                      <>
                        <Loader2 size={16} className="spin-icon" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn-curved-grey"
                    onClick={handleCloseEdit}
                    disabled={isSavingEdit}
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
