import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import SellProduct from './pages/SellProduct';
import MyListings from './pages/MyListings';
import NotFound from './pages/NotFound';
import './App.css';

/**
 * Root Component with React Router and Supabase Auth Provider
 */
export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* 1. Home Page (Public) */}
            <Route index element={<Home />} />

            {/* 2. Product Details (Public) */}
            <Route path="product/:id" element={<ProductDetails />} />

            {/* 3. Login (Public) */}
            <Route path="login" element={<Login />} />

            {/* 4. Register (Public) */}
            <Route path="register" element={<Register />} />

            {/* 5. Sell Product (Protected - Requires Auth) */}
            <Route
              path="sell"
              element={
                <ProtectedRoute>
                  <SellProduct />
                </ProtectedRoute>
              }
            />

            {/* 6. My Listings (Protected - Requires Auth) */}
            <Route
              path="my-listings"
              element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              }
            />

            {/* 7. Not Found (404) */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
