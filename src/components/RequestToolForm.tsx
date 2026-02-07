import { useState } from 'react';
import { Send, CheckCircle, Plus, AlertCircle } from 'lucide-react';

interface RequestToolFormProps {
  userEmail?: string;
  userName?: string;
  onSubmitToFirestore?: (data: {
    toolName: string;
    description: string;
    requesterName: string;
    requesterEmail: string;
  }) => Promise<void>;
}

export function RequestToolForm({ userEmail, userName, onSubmitToFirestore }: RequestToolFormProps) {
  const [requesterName, setRequesterName] = useState('');
  const [toolName, setToolName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const formData = {
        toolName,
        description,
        requesterName: requesterName || userName || 'A BriteStack user',
        requesterEmail: userEmail || 'unknown@brite.co',
      };

      // Save to Firestore first (primary storage + Ideas tab)
      if (onSubmitToFirestore) {
        await onSubmitToFirestore(formData);
      }

      // Send email notification (fire-and-forget, don't block success)
      fetch('https://britestack-email-function-279545860595.us-central1.run.app/send-tool-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userName: userName || 'A BriteStack user',
          userEmail: userEmail || 'unknown@brite.co',
        }),
      }).catch((emailErr) => {
        console.error('Email notification error (non-blocking):', emailErr);
      });

      setStatus('success');
      setRequesterName('');
      setToolName('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting tool request:', error);
      setStatus('error');
      setErrorMessage('Failed to submit. Please try again later.');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 20px',
    border: '2px solid rgba(49, 215, 202, 0.2)',
    borderRadius: '14px',
    fontSize: '15px',
    fontFamily: 'inherit',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    outline: 'none',
  };

  // Success state
  if (status === 'success') {
    return (
      <div className="form-container" style={{ background: '#272D3F', borderRadius: '24px', padding: '45px', boxShadow: '0 10px 40px rgba(39, 45, 63, 0.4)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #31D7CA, #14B8A6)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <CheckCircle size={40} color="white" />
          </div>
          <h3 style={{ fontSize: '26px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
            Request Submitted!
          </h3>
          <p style={{ color: '#A9C1CB', fontSize: '16px', marginBottom: '30px', lineHeight: 1.6 }}>
            Thanks for your suggestion! We've received your tool request and will review it soon.
          </p>
          <button
            onClick={() => setStatus('idle')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 32px',
              background: 'rgba(49, 215, 202, 0.2)',
              color: '#31D7CA',
              border: '2px solid rgba(49, 215, 202, 0.3)',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container" style={{ background: '#272D3F', borderRadius: '24px', padding: '45px', boxShadow: '0 10px 40px rgba(39, 45, 63, 0.4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
        <div style={{
          width: '52px',
          height: '52px',
          background: 'linear-gradient(135deg, #31D7CA, #008182)',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Plus size={26} color="white" />
        </div>
        <h3 style={{ fontSize: '26px', fontWeight: 700, color: 'white', margin: 0 }}>Request a Tool</h3>
      </div>
      <p style={{ color: '#A9C1CB', fontSize: '16px', marginBottom: '30px' }}>
        Have an idea for a new AI tool? Let us know!
      </p>

      {/* Error message */}
      {status === 'error' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#EF4444',
          background: 'rgba(239, 68, 68, 0.1)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          marginBottom: '22px',
        }}>
          <AlertCircle size={24} />
          <span style={{ fontWeight: 500 }}>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#31D7CA', marginBottom: '10px' }}>
            Your Name
          </label>
          <input
            type="text"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            required
            disabled={status === 'loading'}
            placeholder="Enter your name"
            style={{
              ...inputStyle,
              opacity: status === 'loading' ? 0.6 : 1,
            }}
          />
        </div>

        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#31D7CA', marginBottom: '10px' }}>
            Tool Name
          </label>
          <input
            type="text"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            required
            disabled={status === 'loading'}
            placeholder="e.g., Policy Summarizer"
            style={{
              ...inputStyle,
              opacity: status === 'loading' ? 0.6 : 1,
            }}
          />
        </div>

        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#31D7CA', marginBottom: '10px' }}>
            Description / Use Case
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={status === 'loading'}
            placeholder="Describe what this tool would do and how it would help..."
            style={{
              ...inputStyle,
              resize: 'none',
              height: '120px',
              opacity: status === 'loading' ? 0.6 : 1,
            }}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '16px 36px',
            background: status === 'loading'
              ? 'linear-gradient(135deg, #9CA3AF, #6B7280)'
              : 'linear-gradient(135deg, #FC883A, #F97316)',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            boxShadow: status === 'loading'
              ? 'none'
              : '0 8px 25px rgba(252, 136, 58, 0.4)',
          }}
        >
          {status === 'loading' ? (
            <>
              <div style={{
                width: '18px',
                height: '18px',
                border: '2px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              Sending...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Request
            </>
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
