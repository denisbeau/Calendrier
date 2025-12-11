// src/features/auth/__tests__/SignUp.test.jsx
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../SignUp';
import { supabase } from '../../../supabaseClient';

vi.mock('../../../supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
  },
}));

describe('SignUp Component', () => {
  const mockOnSignedUp = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render signup form with all required fields', () => {
    render(<SignUp onSignedUp={mockOnSignedUp} />);
    
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('At least 6 characters')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to login/i })).toBeInTheDocument();
  });

  it('should show error when email and password are empty', async () => {
    render(<SignUp onSignedUp={mockOnSignedUp} />);
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email and password are required.')).toBeInTheDocument();
    });
  });

  it('should call signUp when form is submitted with valid data', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({
      data: { user: { id: '123', email: 'newuser@example.com' }, session: null },
      error: null,
    });

    supabase.auth.signUp = mockSignUp;

    render(<SignUp onSignedUp={mockOnSignedUp} />);
    
    const nameInput = screen.getByPlaceholderText('Your full name');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        {
          email: 'newuser@example.com',
          password: 'password123',
        },
        {
          data: { full_name: 'John Doe' },
        }
      );
    });
  });

  it('should show success message on successful signup', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({
      data: { user: { id: '123', email: 'newuser@example.com' }, session: null },
      error: null,
    });

    supabase.auth.signUp = mockSignUp;

    render(<SignUp onSignedUp={mockOnSignedUp} />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/sign-up succeeded/i)).toBeInTheDocument();
    });
  });

  it('should show error message on signup failure', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'User already registered' },
    });

    supabase.auth.signUp = mockSignUp;

    render(<SignUp onSignedUp={mockOnSignedUp} />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/user already registered/i)).toBeInTheDocument();
    });
  });

  it('should trim email and name fields before submission', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({
      data: { user: { id: '123' }, session: null },
      error: null,
    });

    supabase.auth.signUp = mockSignUp;

    render(<SignUp onSignedUp={mockOnSignedUp} />);
    
    const nameInput = screen.getByPlaceholderText('Your full name');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: '  John Doe  ' } });
    fireEvent.change(emailInput, { target: { value: '  test@example.com  ' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          password: 'password123',
        },
        {
          data: { full_name: 'John Doe' },
        }
      );
    });
  });

  it('should call onSignedUp when Back to login is clicked', () => {
    render(<SignUp onSignedUp={mockOnSignedUp} />);
    
    const backButton = screen.getByRole('button', { name: /back to login/i });
    fireEvent.click(backButton);

    expect(mockOnSignedUp).toHaveBeenCalled();
  });

  it('should disable submit button while loading', async () => {
    const mockSignUp = vi.fn(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: {}, error: null }), 100))
    );

    supabase.auth.signUp = mockSignUp;

    render(<SignUp onSignedUp={mockOnSignedUp} />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('At least 6 characters');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/signing up/i)).toBeInTheDocument();
  });
});

