import { useState } from 'react';
import { Send, CheckCircle, Plus } from 'lucide-react';

export function RequestToolForm() {
  const [toolName, setToolName] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create mailto link
    const subject = encodeURIComponent(`Tool Request: ${toolName}`);
    const body = encodeURIComponent(
      `Tool Name: ${toolName}\n\nDescription/Use Case:\n${description}`
    );

    window.location.href = `mailto:dylanne.crugnale@brite.co?subject=${subject}&body=${body}`;

    setSubmitted(true);
    setToolName('');
    setDescription('');

    // Reset submitted state after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
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

  return (
    <div style={{ background: '#272D3F', borderRadius: '24px', padding: '45px', boxShadow: '0 10px 40px rgba(39, 45, 63, 0.4)' }}>
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

      {submitted ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#31D7CA',
          background: 'rgba(49, 215, 202, 0.1)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(49, 215, 202, 0.2)',
        }}>
          <CheckCircle size={24} />
          <span style={{ fontWeight: 500 }}>Your email client should open. Thanks for your suggestion!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#31D7CA', marginBottom: '10px' }}>
              Tool Name
            </label>
            <input
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              required
              placeholder="e.g., Policy Summarizer"
              style={inputStyle}
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
              placeholder="Describe what this tool would do and how it would help..."
              style={{ ...inputStyle, resize: 'none', height: '120px' }}
            />
          </div>

          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 36px',
              background: 'linear-gradient(135deg, #FC883A, #F97316)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(252, 136, 58, 0.4)',
            }}
          >
            <Send size={18} />
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
}
