import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/signup'
import Cart from './pages/cart';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  )
}

export default App