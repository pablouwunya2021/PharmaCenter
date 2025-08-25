import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

function InputForm({ onSubmit }) {
  const [value, setValue] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
        setValue('');
      }}
    >
      <label htmlFor="name">Nombre</label>
      <input id="name" value={value} onChange={(e) => setValue(e.target.value)} />
      <button type="submit">Guardar</button>
    </form>
  );
}

test('asocia label a input y envía el valor', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();

  render(<InputForm onSubmit={onSubmit} />);

  const input = screen.getByLabelText(/nombre/i);
  await user.type(input, 'Ana');
  await user.click(screen.getByRole('button', { name: /guardar/i }));

  expect(onSubmit).toHaveBeenCalledWith('Ana');
  expect(input).toHaveValue('');
});
