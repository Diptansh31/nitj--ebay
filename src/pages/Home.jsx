import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import { SAMPLE_PRODUCTS } from '../data/products';
import { ShieldCheck, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read selected category from URL search params (?category=Books) or default to 'All'
  const selectedCategory = searchParams.get('category') || 'All';

  // Filter products based on selectedCategory
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return SAMPLE_PRODUCTS;
    }
    return SAMPLE_PRODUCTS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  // Compute item counts per category for pills
  const categoryCounts = useMemo(() => {
    const counts = {};
    SAMPLE_PRODUCTS.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleSelectCategory = (category) => {
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const handleResetCategory = () => {
    setSearchParams({});
  };

  return (
    <div className="home-content">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <ShieldCheck size={16} />
            <span>NITJ Students Only • Safe Campus Handover</span>
          </div>

          <h1 className="hero-title">
            Buy &amp; Sell Second-Hand Essentials Inside{' '}
            <span className="hero-highlight">NIT Jalandhar</span>
          </h1>

          <p className="hero-subtitle">
            Pass on your engineering textbooks, hostel room coolers, lab
            equipment, cycles, and calculators to fellow campus juniors. Save
            money, reduce waste, and connect directly.
          </p>

          <div className="hero-cta-group">
            <a href="#products-section" className="btn-curved-black hero-primary-btn">
              <span>Browse Campus Items</span>
              <ArrowRight size={17} />
            </a>

            <a href="/sell" className="btn-curved-grey hero-secondary-btn">
              <span>List an Item for Sale</span>
            </a>
          </div>

          {/* Quick Hero Highlights */}
          <div className="hero-stats-row">
            <div className="hero-stat-card">
              <div className="stat-icon-wrapper">
                <Zap size={18} />
              </div>
              <div>
                <h4 className="stat-label">Zero Commission</h4>
                <p className="stat-desc">Direct peer-to-peer student deals</p>
              </div>
            </div>

            <div className="hero-stat-card">
              <div className="stat-icon-wrapper">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="stat-label">Campus Verified</h4>
                <p className="stat-desc">Exchange right at your hostel gates</p>
              </div>
            </div>

            <div className="hero-stat-card">
              <div className="stat-icon-wrapper">
                <RefreshCw size={18} />
              </div>
              <div>
                <h4 className="stat-label">Circulate &amp; Save</h4>
                <p className="stat-desc">Senior-to-junior reuse ecosystem</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Section */}
      <div className="container">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          totalItemsCount={SAMPLE_PRODUCTS.length}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* 3. Products Grid Section */}
      <div className="container" id="products-section">
        <ProductGrid
          products={filteredProducts}
          selectedCategory={selectedCategory}
          onResetCategory={handleResetCategory}
        />
      </div>
    </div>
  );
}
