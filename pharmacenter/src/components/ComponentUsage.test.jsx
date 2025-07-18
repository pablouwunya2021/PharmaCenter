import { render } from '@testing-library/react';

import BotonPersonalizado from './BotonPersonalizado.jsx';
import Carousel from './Carousel.jsx';
import Catalogo from './Catalogo.jsx';
import Header from './Header.jsx';
import Loader from './Loader.jsx';
import Publicidad from './Publicidad.jsx';
import Sidebar from './Sidebar.jsx';
import SignupComp from './signupcomp.jsx'; // nombre corregido a PascalCase

describe('Verificar que los componentes se pueden renderizar', () => {
  test('BotonPersonalizado', () => {
    render(<BotonPersonalizado />);
  });

  test('Carousel', () => {
    render(<Carousel />);
  });

  test('Catalogo', () => {
    render(<Catalogo />);
  });

  test('Header', () => {
    render(<Header />);
  });

  test('Loader', () => {
    render(<Loader />);
  });

  test('Publicidad', () => {
    render(<Publicidad />);
  });

  test('Sidebar', () => {
    render(<Sidebar />);
  });

  test('signupcomp', () => {
    render(<SignupComp />);
  });
});
