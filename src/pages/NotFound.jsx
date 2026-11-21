import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-card">
          <div className="not-found-icon-circle">
            <Compass size={48} />
          </div>
          <span className="not-found-code">404</span>
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-text">
            Oops! The page you are looking for doesn't exist on NITJ eBay or may
            have been moved to another location.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn-curved-black">
              <Home size={16} />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
