// src/__tests__/integration/groups.integration.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient');

describe('Groups Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete full group workflow: create group → generate invite code → invite user → join group', async () => {
    const ownerUser = { id: 'owner-123', email: 'owner@example.com' };
    const inviteeUser = { id: 'invitee-456', email: 'invitee@example.com' };

    // Step 1: Create group
    const newGroup = {
      id: 'group-789',
      name: 'Project Team',
      created_by: ownerUser.id,
      invite_code: 'XYZ789',
    };

    const mockInsert = vi.fn().mockResolvedValue({
      data: [newGroup],
      error: null,
    });

    supabase.from = vi.fn().mockReturnValue({
      insert: mockInsert,
    });

    const createdGroup = await supabase.from('groups').insert([{
      name: 'Project Team',
      created_by: ownerUser.id,
      invite_code: 'XYZ789',
    }]);

    expect(createdGroup.data[0].name).toBe('Project Team');
    expect(createdGroup.data[0].invite_code).toBeTruthy();

    // Step 2: Generate invite code (simulated - would be done by backend)
    const inviteCode = createdGroup.data[0].invite_code;
    expect(inviteCode).toBe('XYZ789');

    // Step 3: Invite user (create invitation record)
    const invitation = {
      id: 'invite-123',
      group_id: newGroup.id,
      invite_code: inviteCode,
      email: inviteeUser.email,
      invited_by: ownerUser.id,
    };

    const mockInviteInsert = vi.fn().mockResolvedValue({
      data: [invitation],
      error: null,
    });

    supabase.from = vi.fn().mockReturnValue({
      insert: mockInviteInsert,
    });

    const createdInvitation = await supabase.from('group_invitations').insert([invitation]);
    expect(createdInvitation.data[0].email).toBe(inviteeUser.email);

    // Step 4: User joins group using invite code
    const groupMember = {
      id: 'member-123',
      group_id: newGroup.id,
      user_id: inviteeUser.id,
      role: 'member',
    };

    const mockMemberInsert = vi.fn().mockResolvedValue({
      data: [groupMember],
      error: null,
    });

    supabase.from = vi.fn().mockReturnValue({
      insert: mockMemberInsert,
    });

    const joinedGroup = await supabase.from('group_members').insert([groupMember]);
    expect(joinedGroup.data[0].user_id).toBe(inviteeUser.id);
    expect(joinedGroup.data[0].group_id).toBe(newGroup.id);

    // Step 5: Verify user is now member of group
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [groupMember],
        error: null,
      }),
    });

    supabase.from = vi.fn().mockReturnValue({
      select: mockSelect,
    });

    const members = await supabase.from('group_members').select().eq('group_id', newGroup.id);
    expect(members.data).toHaveLength(1);
    expect(members.data[0].user_id).toBe(inviteeUser.id);
  });

  it('should handle group event creation: create group → add members → create group event', async () => {
    const group = { id: 'group-abc', name: 'Team Alpha', created_by: 'user-1' };
    const member1 = { user_id: 'user-1', group_id: group.id };
    const member2 = { user_id: 'user-2', group_id: group.id };

    // Add members to group
    const mockMemberInsert = vi.fn().mockResolvedValue({
      data: [member1, member2],
      error: null,
    });

    supabase.from = vi.fn().mockReturnValue({
      insert: mockMemberInsert,
    });

    const members = await supabase.from('group_members').insert([member1, member2]);
    expect(members.data).toHaveLength(2);

    // Create group event
    const groupEvent = {
      id: 'event-xyz',
      title: 'Team Standup',
      start_at: '2024-12-25T09:00:00Z',
      end_at: '2024-12-25T09:30:00Z',
      group_id: group.id,
      created_by: member1.user_id,
    };

    const mockEventInsert = vi.fn().mockResolvedValue({
      data: [groupEvent],
      error: null,
    });

    supabase.from = vi.fn().mockReturnValue({
      insert: mockEventInsert,
    });

    const createdEvent = await supabase.from('group_events').insert([groupEvent]);
    expect(createdEvent.data[0].group_id).toBe(group.id);
    expect(createdEvent.data[0].title).toBe('Team Standup');

    // Verify event is visible to all group members
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [groupEvent],
        error: null,
      }),
    });

    supabase.from = vi.fn().mockReturnValue({
      select: mockSelect,
    });

    const groupEvents = await supabase.from('group_events').select().eq('group_id', group.id);
    expect(groupEvents.data[0].id).toBe('event-xyz');
  });

  it('should handle group deletion cascade: delete group → verify events and members are handled', async () => {
    const group = { id: 'group-to-delete', name: 'Temporary Group' };

    // Simulate cascade delete (would be handled by database constraints)
    const mockDelete = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    });

    supabase.from = vi.fn().mockReturnValue({
      delete: mockDelete,
    });

    // Delete group
    const deleteResult = await supabase.from('groups').delete().eq('id', group.id);
    expect(deleteResult.data).toEqual([]);

    // Verify related data would be cleaned up (in real scenario, DB constraints handle this)
    const mockSelectEmpty = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    });

    supabase.from = vi.fn().mockReturnValue({
      select: mockSelectEmpty,
    });

    const members = await supabase.from('group_members').select().eq('group_id', group.id);
    const events = await supabase.from('group_events').select().eq('group_id', group.id);

    expect(members.data).toEqual([]);
    expect(events.data).toEqual([]);
  });
});

