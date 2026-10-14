import { useMemo, useState } from 'react';
import { RefreshCw, Search, ShieldCheck, Lock, Globe } from 'lucide-react';
import type { Tool } from '../data/tools';
import { useAdmin, isEnabled, type AdminUser } from '../hooks/useAdmin';
import { Toggle } from './Toggle';

interface AdminPageProps {
  tools: Tool[];
  currentEmail: string;
}

const NAVY = '#272D3F';
const TEAL = '#31D7CA';
const ORANGE = '#FC883A';
const BORDER = '#E6EDF0';
const MUTED = '#6B7A86';

const NAME_COL_WIDTH = 240;
const TOOL_COL_WIDTH = 104;

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function initials(name: string, email: string) {
  const src = name || email.split('@')[0].replace('.', ' ');
  return src.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export function AdminPage({ tools, currentEmail }: AdminPageProps) {
  const admin = useAdmin(true);
  const [query, setQuery] = useState('');
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const liveTools = useMemo(() => tools.filter((t) => !t.comingSoon), [tools]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return admin.users;
    return admin.users.filter((u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.title.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q)
    );
  }, [admin.users, query]);

  const handleSync = async () => {
    setSyncMsg(null);
    const r = await admin.sync();
    if (r) setSyncMsg(`Synced ${r.total} people from BigQuery: ${r.created} new, ${r.updated} updated, ${r.deactivated} deactivated.`);
  };

  const canChangeRole = (u: AdminUser) => !u.seeded_admin && u.email !== currentEmail;

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '360px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: MUTED }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people…"
            style={{
              width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: `1px solid ${BORDER}`,
              background: 'white', fontSize: '14px', fontFamily: 'inherit', color: NAVY, outline: 'none',
            }}
          />
        </div>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: NAVY, cursor: 'pointer', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={admin.includeInactive}
            onChange={(e) => admin.setIncludeInactive(e.target.checked)}
            style={{ accentColor: NAVY }}
          />
          Show inactive{admin.inactiveCount > 0 ? ` (${admin.inactiveCount})` : ''}
        </label>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {admin.lastSync && (
            <span style={{ fontSize: '12px', color: NAVY, opacity: 0.75 }} title={admin.lastSync.error || undefined}>
              Last sync {formatWhen(admin.lastSync.ran_at)}
              {admin.lastSync.ran_by ? ` by ${admin.lastSync.ran_by.split('@')[0]}` : ''}
              {admin.lastSync.status === 'error' ? ' (failed)' : ''}
            </span>
          )}
          <button
            onClick={handleSync}
            disabled={admin.syncing}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px',
              border: 'none', background: NAVY, color: 'white', fontSize: '13px', fontWeight: 600, cursor: admin.syncing ? 'wait' : 'pointer',
              fontFamily: 'inherit', opacity: admin.syncing ? 0.7 : 1, boxShadow: '0 4px 15px rgba(39, 45, 63, 0.25)',
            }}
          >
            <RefreshCw size={14} className={admin.syncing ? 'animate-spin' : ''} />
            {admin.syncing ? 'Syncing…' : 'Sync from BigQuery'}
          </button>
        </div>
      </div>

      {(admin.error || syncMsg) && (
        <div
          style={{
            marginBottom: '12px', padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
            background: admin.error ? '#FDECEC' : '#E6FAF8', color: admin.error ? '#B3261E' : NAVY,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <span>{admin.error || syncMsg}</span>
          <button onClick={() => { admin.clearError(); setSyncMsg(null); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'inherit', fontFamily: 'inherit' }}>✕</button>
        </div>
      )}

      {/* Matrix */}
      <div
        style={{
          background: 'white', borderRadius: '16px', border: `1px solid ${BORDER}`, overflow: 'auto',
          maxHeight: 'calc(100vh - 320px)', minHeight: '240px', boxShadow: '0 10px 40px rgba(39, 45, 63, 0.08)',
        }}
      >
        <table style={{ borderCollapse: 'separate', borderSpacing: 0, fontSize: '13px', color: NAVY, minWidth: '100%' }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, position: 'sticky', left: 0, top: 0, zIndex: 3, width: NAME_COL_WIDTH, minWidth: NAME_COL_WIDTH, textAlign: 'left', paddingLeft: '16px', boxShadow: `1px 0 0 ${BORDER}` }}>
                Person
              </th>
              <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 2, minWidth: '170px', textAlign: 'left' }}>Title</th>
              <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 2, minWidth: '92px' }}>Role</th>
              {liveTools.map((t) => {
                const vis = admin.toolSettings[t.id] ?? 'public';
                const isPrivate = vis === 'private';
                return (
                  <th key={t.id} style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 2, width: TOOL_COL_WIDTH, minWidth: TOOL_COL_WIDTH, verticalAlign: 'bottom', whiteSpace: 'normal', textTransform: 'none', letterSpacing: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, lineHeight: 1.25, textAlign: 'center', maxWidth: '92px', color: NAVY, minHeight: '28px', display: 'flex', alignItems: 'flex-end' }} title={t.name}>
                        {t.name}
                      </span>
                      <button
                        onClick={() => admin.setVisibility(t.id, isPrivate ? 'public' : 'private')}
                        title={isPrivate ? 'Private: off for everyone unless switched on' : 'Public: on for everyone unless switched off'}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '999px',
                          border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: 700, letterSpacing: '0.02em', fontFamily: 'inherit',
                          background: isPrivate ? ORANGE : TEAL, color: isPrivate ? 'white' : NAVY,
                        }}
                      >
                        {isPrivate ? <Lock size={10} /> : <Globe size={10} />}
                        {isPrivate ? 'Private' : 'Public'}
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {admin.loading && admin.users.length === 0 ? (
              <tr><td colSpan={3 + liveTools.length} style={{ padding: '40px', textAlign: 'center', color: MUTED }}>Loading people…</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={3 + liveTools.length} style={{ padding: '40px', textAlign: 'center', color: MUTED }}>
                  {admin.users.length === 0 ? 'No people yet. Hit "Sync from BigQuery" to pull the team in.' : 'No one matches that search.'}
                </td>
              </tr>
            ) : filteredUsers.map((u) => {
              const inactive = u.status === 'inactive';
              return (
                <tr key={u.email} className="admin-row" style={{ opacity: inactive ? 0.55 : 1 }}>
                  <td style={{ ...tdStyle, position: 'sticky', left: 0, zIndex: 1, background: 'white', paddingLeft: '16px', width: NAME_COL_WIDTH, minWidth: NAME_COL_WIDTH, boxShadow: `1px 0 0 ${BORDER}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {u.picture ? (
                        <img src={u.picture} alt="" referrerPolicy="no-referrer" style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: '#EEF3F5' }} />
                      ) : (
                        <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: NAVY, color: TEAL, fontSize: '10px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {initials(u.name, u.email)}
                        </span>
                      )}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }} title={u.email}>
                        {u.name || u.email}
                      </span>
                      {inactive && (
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '999px', background: '#EEF3F5', color: MUTED, flexShrink: 0 }}>Inactive</span>
                      )}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px', color: MUTED }} title={u.department ? `${u.title} · ${u.department}` : u.title}>
                    {u.title}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <button
                      onClick={() => canChangeRole(u) && admin.setRole(u.email, u.role === 'admin' ? 'user' : 'admin')}
                      disabled={!canChangeRole(u)}
                      title={u.seeded_admin ? 'Built-in admin' : u.email === currentEmail ? 'That is you' : `Make ${u.role === 'admin' ? 'user' : 'admin'}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '999px', border: 'none',
                        cursor: canChangeRole(u) ? 'pointer' : 'default', fontSize: '11px', fontWeight: 700, fontFamily: 'inherit',
                        background: u.role === 'admin' ? NAVY : '#EEF3F5', color: u.role === 'admin' ? 'white' : MUTED,
                      }}
                    >
                      {u.role === 'admin' && <ShieldCheck size={11} />}
                      {u.role === 'admin' ? 'Admin' : 'User'}
                    </button>
                  </td>
                  {liveTools.map((t) => {
                    const on = isEnabled(u, t.id, admin.toolSettings);
                    const overridden = u.overrides[t.id] !== undefined;
                    return (
                      <td key={t.id} style={{ ...tdStyle, textAlign: 'center' }}>
                        <Toggle
                          checked={on}
                          marked={overridden}
                          onChange={() => admin.toggleAccess(u.email, t.id)}
                          title={`${t.name}: ${on ? 'on' : 'off'}${overridden ? ' (set by an admin)' : ' (tool default)'}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: '12px', fontSize: '12px', color: NAVY, opacity: 0.7 }}>
        Switching a tile off hides it from that person's BriteStack. Public tools are on for everyone until switched off; private tools are off until switched on. An orange dot marks a switch set by hand.
      </p>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  background: '#F7FAFB',
  borderBottom: `1px solid ${BORDER}`,
  padding: '10px 8px',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: '#4A5865',
  textAlign: 'center',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  borderBottom: `1px solid ${BORDER}`,
  padding: '6px 8px',
  height: '42px',
  verticalAlign: 'middle',
};
