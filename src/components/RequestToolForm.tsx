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

  return (
    <div className="bg-[#272D3F] rounded-3xl p-10 md:p-[45px] shadow-[0_10px_40px_rgba(39,45,63,0.4)]">
      <div className="flex items-center gap-4 mb-2.5">
        <div className="w-[52px] h-[52px] bg-gradient-to-br from-[#31D7CA] to-[#008182] rounded-[14px] flex items-center justify-center">
          <Plus size={26} className="text-white" />
        </div>
        <h2 className="text-[26px] font-bold text-white">Request a Tool</h2>
      </div>
      <p className="text-[#A9C1CB] mb-[30px] text-base">
        Have an idea for a new AI tool? Let us know!
      </p>

      {submitted ? (
        <div className="flex items-center gap-3 text-[#31D7CA] bg-[#31D7CA]/10 p-4 rounded-xl border border-[#31D7CA]/20">
          <CheckCircle size={24} />
          <span className="font-medium">Your email client should open. Thanks for your suggestion!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-[22px]">
          <div>
            <label htmlFor="toolName" className="block text-sm font-semibold text-[#31D7CA] mb-2.5">
              Tool Name
            </label>
            <input
              type="text"
              id="toolName"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              required
              placeholder="e.g., Policy Summarizer"
              className="w-full px-5 py-4 bg-white/5 text-white rounded-[14px] border-2 border-[#31D7CA]/20 focus:border-[#31D7CA] focus:bg-white/[0.08] focus:outline-none transition-all placeholder:text-[#7DA3AF]"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-[#31D7CA] mb-2.5">
              Description / Use Case
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe what this tool would do and how it would help..."
              className="w-full px-5 py-4 bg-white/5 text-white rounded-[14px] border-2 border-[#31D7CA]/20 focus:border-[#31D7CA] focus:bg-white/[0.08] focus:outline-none transition-all placeholder:text-[#7DA3AF] resize-none h-[120px]"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2.5 px-9 py-4 bg-gradient-to-br from-[#FC883A] to-[#F97316] text-white font-bold uppercase tracking-wide text-sm rounded-[14px] hover:-translate-y-0.5 transition-all shadow-[0_8px_25px_rgba(252,136,58,0.4)] hover:shadow-[0_12px_35px_rgba(252,136,58,0.5)]"
          >
            <Send size={18} />
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
}
