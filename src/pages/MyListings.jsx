import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SAMPLE_PRODUCTS, DEMO_USER } from '../data/products';
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
} from 'lucide-react';

export default function MyListings() {
  // Initialize with demo user listings (products with isDemoUser: true)
  const [listings, setListings] = useState(() =>
    SAMPLE_PRODUCTS.filter((p) => p.isDemoUser)
  );

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'available', 'sold'
  const [noticeMessage, setNoticeMessage] = useState(
    'Demo Actions: Edit, Delete, and Mark as Sold operate in local state for testing.'
  );

  // Toggle listing status between available and sold
  const handleToggleStatus = (id) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'sold' ? 'available' : 'sold';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
    setNoticeMessage(
      `Listing #${id} status updated in local demo state! (Changes are not persisted to a backend yet).`
    );
  };

  // Delete listing from local view
  const handleDeleteListing = (id) => {
    const itemToDelete = listings.find((p) => p.id === id);
    if (window.confirm(`Are you sure you want to remove "${itemToDelete?.name}"?`)) {
      setListings((prev) => prev.filter((item) => item.id !== id));
      setNoticeMessage(
        `Listing #${id} removed from local demo state! (No real database was modified).`
      );
    }
  };

  // Demo edit handler
  const handleEditClick = (item) => {
    alert(
      `Edit Listing for "${item.name}":\n\nEditing form with backend persistence will be implemented in later phases.`
    );
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

        {/* Demo User Info Banner */}
        <div className="demo-user-profile-card">
          <div className="demo-user-header">
            <div className="demo-user-avatar">
              <User size={20} />
            </div>
            <div>
              <div className="demo-user-name-row">
                <h3 className="demo-user-name">{DEMO_USER.name}</h3>
                <span className="demo-user-tag">Demo User Profile</span>
                <span className="demo-user-badge">
                  <ShieldCheck size={12} />
                  <span>Verified (Demo)</span>
                </span>
              </div>
              <p className="demo-user-sub">
                <Mail size={13} style={{ display: 'inline', marginRight: '4px' }} />
                {DEMO_USER.email} &bull; {DEMO_USER.branch}
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

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-icon-circle">
              <ListOrdered size={32} />
            </div>
            <h3 className="empty-title">No listings found in this tab</h3>
            <p className="empty-description">
              You do not have any items marked as{' '}
              <strong>"{activeTab}"</strong>.
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
                      onClick={() => handleToggleStatus(product.id)}
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
                      {/* Visual Edit Control */}
                      <button
                        type="button"
                        className="control-icon-btn edit-icon-btn"
                        onClick={() => handleEditClick(product)}
                        title="Edit listing (Demo control)"
                        aria-label="Edit listing"
                      >
                        <Edit3 size={15} />
                      </button>

                      {/* Visual Delete Control */}
                      <button
                        type="button"
                        className="control-icon-btn delete-icon-btn"
                        onClick={() => handleDeleteListing(product.id)}
                        title="Delete listing (Demo control)"
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
      </div>
    </div>
  );
}
