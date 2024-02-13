import { render, screen, fireEvent } from '@testing-library/react';
import { LoginComponent } from '../components/User/LoginComponent';
import { AuthProvider } from '../context/AuthContext';
import React from 'react';

describe('LoginComponent', () => {
  const mockLogin = jest.fn();
  const mockCloseModal = jest.fn();

  beforeEach(() => {
    render(
      <AuthProvider value={{ login: mockLogin }}>
        <LoginComponent closeModal={mockCloseModal} />
      </AuthProvider>
    );
  });

  it('renders email and password fields and a submit button', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('updates email and password fields on user input', () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'hehe@xxx.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    expect(emailInput.value).toBe('hehe@xxx.com');
    expect(passwordInput.value).toBe('Password123');
  });
});
