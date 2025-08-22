import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/signup'
import Cart from './pages/cart';
import LoginPage from './pages/LoginPage';
import CompraPage from './pages/CompraPage';
import Inventory from './pages/Inventory'
import Header from './components/Header'

// Layout que incluye el Header
const MainLayout = ({ children }) => (
  <>
    <Header />
    {children}
  </>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={
        <MainLayout>
          <Cart />
        </MainLayout>
      } />
      <Route path="/login" element={
        <MainLayout>
          <LoginPage />
        </MainLayout>
      } />
      <Route path="/compra/:id" element={
        <MainLayout>
          <CompraPage />
        </MainLayout>
      } />
      <Route path="/inventory" element={
        <MainLayout>
          <Inventory />
        </MainLayout>
      } />
    </Routes>
  )
}

export default App