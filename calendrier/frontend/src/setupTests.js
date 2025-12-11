// src/setupTests.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.confirm and window.prompt
global.confirm = vi.fn(() => true);
global.prompt = vi.fn(() => 'Test Event');

// Mock import.meta.env for Vitest
if (typeof import.meta === 'undefined') {
  global.import = {
    meta: {
      env: {
        DEV: true,
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'test-key',
      },
    },
  };
}

