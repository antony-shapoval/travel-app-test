import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders search form', () => {
  render(<App />);
  expect(screen.getByText('Пошук турів')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Країна, місто або готель')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /знайти/i })).toBeInTheDocument();
});
