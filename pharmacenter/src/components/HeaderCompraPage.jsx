import { Link } from 'react-router-dom';

function HeaderCompraPage() {
  return (
    <header style={{ backgroundColor: '#673ab7', padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
        <img 
          src="/Logo.png" 
          alt="Logo Farmacia Bethesda" 
          style={{ height: '40px', marginRight: '10px' }} 
        />
        <h1 style={{ fontSize: '1.5rem', fontFamily: 'Montserrat, sans-serif' }}>Farmacia Bethesda</h1>
      </Link>
    </header>
  );
}

export default HeaderCompraPage;