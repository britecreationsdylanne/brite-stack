// Preview component to compare all 3 login designs
// Import this in App.tsx and render it to see all options

import { useState } from 'react';
import { LoginScreenOptionA } from './LoginScreenOptionA';
import { LoginScreenOptionB } from './LoginScreenOptionB';
import { LoginScreenOptionC } from './LoginScreenOptionC';
import { LoginScreen } from './LoginScreen';

export function LoginPreview() {
  const [activeDesign, setActiveDesign] = useState<'current' | 'A' | 'B' | 'C'>('A');

  const mockSignIn = () => {
    alert('Sign in clicked!');
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      {/* Design Selector */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/80 backdrop-blur-sm p-2 rounded-xl border border-white/10">
        {(['current', 'A', 'B', 'C'] as const).map((design) => (
          <button
            key={design}
            onClick={() => setActiveDesign(design)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeDesign === design
                ? 'bg-[#31D7CA] text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {design === 'current' ? 'Current' : `Option ${design}`}
          </button>
        ))}
      </div>

      {/* Design Label */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10">
        <p className="text-white text-sm font-medium">
          {activeDesign === 'current' && 'Current Design (Dark)'}
          {activeDesign === 'A' && 'Option A: Bright Teal Gradient + Navy Card'}
          {activeDesign === 'B' && 'Option B: Solid Teal + White Card'}
          {activeDesign === 'C' && 'Option C: Full Teal Gradient + Floating White Card'}
        </p>
      </div>

      {/* Active Design */}
      {activeDesign === 'current' && <LoginScreen onSignIn={mockSignIn} />}
      {activeDesign === 'A' && <LoginScreenOptionA onSignIn={mockSignIn} />}
      {activeDesign === 'B' && <LoginScreenOptionB onSignIn={mockSignIn} />}
      {activeDesign === 'C' && <LoginScreenOptionC onSignIn={mockSignIn} />}
    </div>
  );
}
