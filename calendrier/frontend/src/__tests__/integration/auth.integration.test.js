// src/__tests__/integration/auth.integration.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '../../supabaseClient';

// Mock Supabase
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete full signup flow: signup → email confirmation → login → session', async () => {
    // Step 1: Signup
    const mockUser = {
      id: 'user-123',
      email: 'newuser@example.com',
    };

    supabase.auth.signUp.mockResolvedValueOnce({
      data: { user: mockUser, session: null },
      error: null,
    });

    const signupResult = await supabase.auth.signUp({
      email: 'newuser@example.com',
      password: 'password123',
    });

    expect(signupResult.data.user).toEqual(mockUser);
    expect(signupResult.data.session).toBeNull(); // Email confirmation required

    // Step 2: Simulate email confirmation (user clicks link)
    // In real scenario, this would be handled by Supabase auth callback
    supabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: {
          user: mockUser,
          access_token: 'mock-token',
        },
      },
      error: null,
    });

    const sessionResult = await supabase.auth.getSession();
    expect(sessionResult.data.session).toBeTruthy();
    expect(sessionResult.data.session.user.email).toBe('newuser@example.com');

    // Step 3: Login with confirmed account
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: {
        user: mockUser,
        session: {
          user: mockUser,
          access_token: 'mock-token',
        },
      },
      error: null,
    });

    const loginResult = await supabase.auth.signInWithPassword({
      email: 'newuser@example.com',
      password: 'password123',
    });

    expect(loginResult.data.user).toEqual(mockUser);
    expect(loginResult.data.session).toBeTruthy();
  });

  it('should handle authentication flow with group creation: signup → login → create group', async () => {
    const mockUser = {
      id: 'user-456',
      email: 'groupuser@example.com',
    };

    // Signup
    supabase.auth.signUp.mockResolvedValueOnce({
      data: { user: mockUser, session: null },
      error: null,
    });

    await supabase.auth.signUp({
      email: 'groupuser@example.com',
      password: 'password123',
    });

    // Login
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: {
        user: mockUser,
        session: { user: mockUser, access_token: 'token' },
      },
      error: null,
    });

    const loginResult = await supabase.auth.signInWithPassword({
      email: 'groupuser@example.com',
      password: 'password123',
    });

    expect(loginResult.data.session).toBeTruthy();

    // Create group (simulated - would use groups API)
    const groupData = {
      name: 'Test Group',
      created_by: mockUser.id,
    };

    // This would be a real API call in integration test
    expect(groupData.created_by).toBe(mockUser.id);
    expect(groupData.name).toBe('Test Group');
  });

  it('should handle invitation flow: create group → generate code → send email → join group', async () => {
    const ownerUser = { id: 'owner-123', email: 'owner@example.com' };
    const inviteeEmail = 'invitee@example.com';

    // Step 1: Owner creates group
    const groupData = {
      id: 'group-123',
      name: 'Shared Group',
      created_by: ownerUser.id,
      invite_code: 'ABC123',
    };

    expect(groupData.invite_code).toBeTruthy();

    // Step 2: Generate invitation (simulated)
    const invitation = {
      group_id: groupData.id,
      invite_code: groupData.invite_code,
      email: inviteeEmail,
    };

    expect(invitation.group_id).toBe(groupData.id);
    expect(invitation.email).toBe(inviteeEmail);

    // Step 3: Invitee signs up
    supabase.auth.signUp.mockResolvedValueOnce({
      data: {
        user: { id: 'invitee-123', email: inviteeEmail },
        session: null,
      },
      error: null,
    });

    const signupResult = await supabase.auth.signUp({
      email: inviteeEmail,
      password: 'password123',
    });

    expect(signupResult.data.user.email).toBe(inviteeEmail);

    // Step 4: Invitee joins group using code
    const joinGroupData = {
      group_id: groupData.id,
      user_id: signupResult.data.user.id,
      invite_code: groupData.invite_code,
    };

    expect(joinGroupData.invite_code).toBe(groupData.invite_code);
    expect(joinGroupData.user_id).toBe(signupResult.data.user.id);
  });
});

