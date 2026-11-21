import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Shared Layout Component
 * Provides sticky Navbar at the top and campus Footer at the bottom across all routes
 */
export default function Layout() {
  return (
    <div className="home-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
