import {
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Mail,
  Heart,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        {/* Brand statement column */}
        <div className="footer-brand-col">
          <div className="footer-brand-logo">
            <div className="brand-logo-icon">
              <ShoppingBag size={18} />
            </div>
            <span className="brand-name">
              NITJ <span className="brand-accent">eBay</span>
            </span>
          </div>
          <p className="footer-description">
            A peer-to-peer campus marketplace exclusively for students of Dr. B.
            R. Ambedkar National Institute of Technology, Jalandhar.
          </p>
          <div className="campus-badge">
            <MapPin size={14} />
            <span>GT Road, Amritsar Bypass, Jalandhar, Punjab 144008</span>
          </div>
        </div>

        {/* Section 1: About Us */}
        <div className="footer-col">
          <h4 className="footer-col-title">About Us</h4>
          <ul className="footer-links-list">
            <li>
              <a href="#about" onClick={(e) => e.preventDefault()}>
                Our Mission
              </a>
            </li>
            <li>
              <a href="#how-it-works" onClick={(e) => e.preventDefault()}>
                How NITJ eBay Works
              </a>
            </li>
            <li>
              <a href="#sustainability" onClick={(e) => e.preventDefault()}>
                Eco-Friendly Re-use
              </a>
            </li>
            <li>
              <a href="#student-team" onClick={(e) => e.preventDefault()}>
                Student Developer Team
              </a>
            </li>
          </ul>
        </div>

        {/* Section 2: Contact Us */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact Us</h4>
          <ul className="footer-links-list">
            <li>
              <a href="mailto:support@nitjebay.local" onClick={(e) => e.preventDefault()}>
                <Mail size={13} style={{ display: 'inline', marginRight: '6px' }} />
                support@nitjebay.in
              </a>
            </li>
            <li>
              <a href="#hostel-help" onClick={(e) => e.preventDefault()}>
                Hostel Rep Contacts
              </a>
            </li>
            <li>
              <a href="#help-faq" onClick={(e) => e.preventDefault()}>
                Help &amp; FAQs
              </a>
            </li>
            <li>
              <a href="#report-listing" onClick={(e) => e.preventDefault()}>
                Report a Listing
              </a>
            </li>
          </ul>
        </div>

        {/* Section 3: Selling Policies */}
        <div className="footer-col">
          <h4 className="footer-col-title">Selling Policies</h4>
          <ul className="footer-links-list">
            <li>
              <a href="#fair-pricing" onClick={(e) => e.preventDefault()}>
                Fair Pricing Guidelines
              </a>
            </li>
            <li>
              <a href="#prohibited-items" onClick={(e) => e.preventDefault()}>
                Prohibited Items List
              </a>
            </li>
            <li>
              <a href="#handover-safety" onClick={(e) => e.preventDefault()}>
                <ShieldCheck size={13} style={{ display: 'inline', marginRight: '6px' }} />
                Campus Handover Safety
              </a>
            </li>
            <li>
              <a href="#verification" onClick={(e) => e.preventDefault()}>
                Student ID Verification
              </a>
            </li>
          </ul>
        </div>

        {/* Section 4: NITJ Community */}
        <div className="footer-col">
          <h4 className="footer-col-title">NITJ Community</h4>
          <ul className="footer-links-list">
            <li>
              <a
                href="https://www.nitj.ac.in"
                target="_blank"
                rel="noreferrer"
                className="external-link"
              >
                <span>NITJ Official Portal</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="#student-welfare" onClick={(e) => e.preventDefault()}>
                Dean Student Welfare (DSW)
              </a>
            </li>
            <li>
              <a href="#clubs" onClick={(e) => e.preventDefault()}>
                Technical &amp; Cultural Clubs
              </a>
            </li>
            <li>
              <a href="#alumni" onClick={(e) => e.preventDefault()}>
                Alumni Donation Drives
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer bottom bar */}
      <div className="footer-bottom">
        <p className="copyright-text">
          &copy; {new Date().getFullYear()} NITJ eBay. Built with{' '}
          <Heart size={13} style={{ display: 'inline', color: '#ef4444', verticalAlign: 'middle' }} /> for NIT
          Jalandhar students.
        </p>
        <p className="disclaimer-text">
          Independent student project. Not an official commercial service of NIT Jalandhar.
        </p>
      </div>
    </footer>
  );
}
