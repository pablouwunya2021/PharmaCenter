import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/signup';
import Cart from './pages/cart';
import LoginPage from './pages/LoginPage';
import CompraPage from './pages/CompraPage';
import Inventory from './pages/Inventory';
import Header from './components/Header';

import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';

const MainLayout = ({ children }) => (
  <>
    <Header />
    {children}
  </>
);

function App() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
      <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
      <Route path="/compra/:id" element={<MainLayout><CompraPage /></MainLayout>} />

      {/* Panel Admin (solo admins) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="inventory" element={<Inventory />} />
      </Route>
    </Routes>
  );
}

export default App;
