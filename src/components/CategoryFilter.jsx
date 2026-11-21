import {
  Layers,
  BookOpen,
  Laptop,
  Armchair,
  Shirt,
  Trophy,
  Package,
} from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

// Category icon helper
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

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  totalItemsCount,
  categoryCounts = {},
}) {
  return (
    <section className="category-filter-section" aria-label="Filter products by category">
      <div className="category-filter-header">
        <div>
          <h2 className="section-title">Explore Categories</h2>
          <p className="section-subtitle">
            Filter second-hand essentials listed by fellow NITJ students
          </p>
        </div>
      </div>

      <div className="category-pills-container">
        {/* "All" button */}
        <button
          type="button"
          className={`category-pill ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => onSelectCategory('All')}
        >
          <Layers size={16} />
          <span>All</span>
          {totalItemsCount !== undefined && (
            <span className="pill-count">{totalItemsCount}</span>
          )}
        </button>

        {/* Dynamically mapped categories */}
        {CATEGORIES.map((category) => {
          const count = categoryCounts[category] || 0;
          const isActive = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(category)}
            >
              {getCategoryIcon(category)}
              <span>{category}</span>
              {count > 0 && <span className="pill-count">{count}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
