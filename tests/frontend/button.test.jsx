import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

function Button({ onClick, disabled = false, children }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

test('renderiza el botón habilitado y accesible por role/name', () => {
  render(<Button onClick={() => {}}>Aceptar</Button>);
  const btn = screen.getByRole('button', { name: /aceptar/i });
  expect(btn).toBeInTheDocument();
  expect(btn).toBeEnabled();
});

test('dispara onClick al hacer clic', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(<Button onClick={onClick}>Enviar</Button>);
  await user.click(screen.getByRole('button', { name: /enviar/i }));
  expect(onClick).toHaveBeenCalledTimes(1);
});
