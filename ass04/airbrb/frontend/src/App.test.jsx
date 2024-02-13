// This file can be deleted if you'd like
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders learn react link', () => {
  render(<Router><App /></Router>);
  const linkElement = screen.getByText(/o/i); // random letter
  expect(linkElement).toBeInTheDocument();
});
