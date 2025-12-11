// src/features/auth/__tests__/Login.test.jsx
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import { supabase } from '../../../supabaseClient';

vi.mock('../../../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signInWithOtp: vi.fn(),
    },
  },
}));

describe('Login Component', () => {
  const mockOnLoggedIn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form with email and password fields', () => {
    render(<Login onLoggedIn={mockOnLoggedIn} />);
    
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show error when email is empty', async () => {
    render(<Login onLoggedIn={mockOnLoggedIn} />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
    });
  });

  it('should call signInWithPassword when form is submitted with password', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' }, session: {} },
      error: null,
    });

    supabase.auth.signInWithPassword = mockSignIn;

    const { container } = render(<Login onLoggedIn={mockOnLoggedIn} />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = container.querySelector('input[type="password"]');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    if (passwordInput) {
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    }
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show error message on login failure', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: null,
      error: { status: 400, message: 'Invalid credentials' },
    });

    supabase.auth.signInWithPassword = mockSignIn;

    const { container } = render(<Login onLoggedIn={mockOnLoggedIn} />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = container.querySelector('input[type="password"]');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    if (passwordInput) {
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    }
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('should call signInWithOtp when password is empty (magic link)', async () => {
    const mockSignInOtp = vi.fn().mockResolvedValue({
      data: {},
      error: null,
    });

    supabase.auth.signInWithOtp = mockSignInOtp;

    render(<Login onLoggedIn={mockOnLoggedIn} />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignInOtp).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(screen.getByText(/magic link sent/i)).toBeInTheDocument();
    });
  });

  it('should disable inputs while loading', async () => {
    const mockSignIn = vi.fn(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: {}, error: null }), 100))
    );

    supabase.auth.signInWithPassword = mockSignIn;

    const { container } = render(<Login onLoggedIn={mockOnLoggedIn} />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = container.querySelector('input[type="password"]');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    if (passwordInput) {
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    }
    fireEvent.click(submitButton);

    expect(emailInput).toBeDisabled();
    if (passwordInput) {
      expect(passwordInput).toBeDisabled();
    }
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });

  it('should show error message for non-400 errors', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: null,
      error: { status: 500, message: 'Server error' },
    });

    supabase.auth.signInWithPassword = mockSignIn;

    const { container } = render(<Login onLoggedIn={mockOnLoggedIn} />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = container.querySelector('input[type="password"]');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    if (passwordInput) {
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    }
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });

  it('should handle network errors in signInWithPassword', async () => {
    const mockSignIn = vi.fn().mockRejectedValue(new Error('Network error'));

    supabase.auth.signInWithPassword = mockSignIn;

    const { container } = render(<Login onLoggedIn={mockOnLoggedIn} />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = container.querySelector('input[type="password"]');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    if (passwordInput) {
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    }
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument();
    });
  });

  it('should handle error in signInWithOtp', async () => {
    const mockSignInOtp = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Failed to send magic link' },
    });

    supabase.auth.signInWithOtp = mockSignInOtp;

    render(<Login onLoggedIn={mockOnLoggedIn} />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to send magic link/i)).toBeInTheDocument();
    });
  });

  it('should handle network errors in signInWithOtp', async () => {
    const mockSignInOtp = vi.fn().mockRejectedValue(new Error('Network error'));

    supabase.auth.signInWithOtp = mockSignInOtp;

    render(<Login onLoggedIn={mockOnLoggedIn} />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument();
    });
  });
});
