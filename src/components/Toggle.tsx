interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  title?: string;
  /** Small dot under the switch marking an explicit per-user override */
  marked?: boolean;
}

export function Toggle({ checked, onChange, disabled, title, marked }: ToggleProps) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        title={title}
        disabled={disabled}
        onClick={onChange}
        style={{
          width: '34px',
          height: '20px',
          borderRadius: '10px',
          border: 'none',
          padding: 0,
          position: 'relative',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: checked ? '#31D7CA' : '#D5DEE3',
          opacity: disabled ? 0.5 : 1,
          transition: 'background 0.15s ease',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '16px' : '2px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            transition: 'left 0.15s ease',
          }}
        />
      </button>
      <span
        aria-hidden
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: marked ? '#FC883A' : 'transparent',
        }}
      />
    </span>
  );
}
