import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
 * Phase 2 Root Component with React Router Configuration
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 1. Home Page */}
          <Route index element={<Home />} />

          {/* 2. Product Details */}
          <Route path="product/:id" element={<ProductDetails />} />

          {/* 3. Login */}
          <Route path="login" element={<Login />} />

          {/* 4. Register */}
          <Route path="register" element={<Register />} />

          {/* 5. Sell Product */}
          <Route path="sell" element={<SellProduct />} />

          {/* 6. My Listings */}
          <Route path="my-listings" element={<MyListings />} />

          {/* 7. Not Found (404) */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
