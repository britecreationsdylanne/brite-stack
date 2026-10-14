import { useState, useEffect, useCallback } from 'react';
import type { Role } from './useAuth';

export type Visibility = 'public' | 'private';

export interface AdminUser {
  email: string;
  name: string;
  title: string;
  department: string;
  picture: string;
  status: 'active' | 'inactive';
  role: Role;
  access_enabled: boolean;  // master switch: false = cannot sign in to BriteStack
  seeded_admin: boolean;
  overrides: Record<string, boolean>;  // explicit per-tool overrides only
}

export interface LastSync {
  ran_at: string;
  ran_by: string;
  status: 'ok' | 'error';
  created: number;
  updated: number;
  deactivated: number;
  error: string | null;
}

interface AdminResponse {
  users: AdminUser[];
  tool_settings: Record<string, Visibility>;
  inactive_count: number;
  last_sync: LastSync | null;
}

async function putJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

/** Effective on/off for a user + tool: explicit override wins, else the tool default. */
export function isEnabled(user: AdminUser, toolId: string, settings: Record<string, Visibility>): boolean {
  const ov = user.overrides[toolId];
  if (ov !== undefined) return ov;
  return settings[toolId] !== 'private';
}

export function useAdmin(enabled: boolean) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [toolSettings, setToolSettings] = useState<Record<string, Visibility>>({});
  const [inactiveCount, setInactiveCount] = useState(0);
  const [lastSync, setLastSync] = useState<LastSync | null>(null);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users?include_inactive=${includeInactive ? 1 : 0}`, { credentials: 'same-origin' });
      if (!res.ok) throw new Error(`Could not load users (${res.status})`);
      const data: AdminResponse = await res.json();
      setUsers(data.users);
      setToolSettings(data.tool_settings);
      setInactiveCount(data.inactive_count);
      setLastSync(data.last_sync);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load users');
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  /** Toggle one cell. Writes an override only when the new value differs from the tool default. */
  const toggleAccess = async (email: string, toolId: string) => {
    const user = users.find((u) => u.email === email);
    if (!user) return;
    const next = !isEnabled(user, toolId, toolSettings);
    const toolDefault = toolSettings[toolId] !== 'private';
    const override: boolean | null = next === toolDefault ? null : next;

    const prev = users;
    setUsers((list) => list.map((u) => {
      if (u.email !== email) return u;
      const overrides = { ...u.overrides };
      if (override === null) delete overrides[toolId]; else overrides[toolId] = override;
      return { ...u, overrides };
    }));
    try {
      await putJson(`/api/admin/users/${encodeURIComponent(email)}/access/${encodeURIComponent(toolId)}`, { enabled: override });
    } catch (err) {
      setUsers(prev);
      setError(err instanceof Error ? err.message : 'Could not save');
    }
  };

  const setRole = async (email: string, role: Role) => {
    const prev = users;
    setUsers((list) => list.map((u) => (u.email === email ? { ...u, role } : u)));
    try {
      await putJson(`/api/admin/users/${encodeURIComponent(email)}/role`, { role });
    } catch (err) {
      setUsers(prev);
      setError(err instanceof Error ? err.message : 'Could not save');
    }
  };

  const setEnabled = async (email: string, enabled: boolean) => {
    const prev = users;
    setUsers((list) => list.map((u) => (u.email === email ? { ...u, access_enabled: enabled } : u)));
    try {
      await putJson(`/api/admin/users/${encodeURIComponent(email)}/enabled`, { enabled });
    } catch (err) {
      setUsers(prev);
      setError(err instanceof Error ? err.message : 'Could not save');
    }
  };

  const setVisibility = async (toolId: string, visibility: Visibility) => {
    const prev = toolSettings;
    setToolSettings((s) => ({ ...s, [toolId]: visibility }));
    try {
      await putJson(`/api/admin/tools/${encodeURIComponent(toolId)}/visibility`, { visibility });
    } catch (err) {
      setToolSettings(prev);
      setError(err instanceof Error ? err.message : 'Could not save');
    }
  };

  const sync = async () => {
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/sync', { method: 'POST', credentials: 'same-origin' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || `Sync failed (${res.status})`);
      await load();
      return data as { created: number; updated: number; deactivated: number; total: number };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
      return null;
    } finally {
      setSyncing(false);
    }
  };

  return {
    users, toolSettings, inactiveCount, lastSync,
    includeInactive, setIncludeInactive,
    loading, syncing, error, clearError: () => setError(null),
    reload: load, toggleAccess, setRole, setEnabled, setVisibility, sync,
  };
}
