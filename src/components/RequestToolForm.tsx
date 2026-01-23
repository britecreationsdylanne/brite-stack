import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

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
    <div className="bg-[#466F88] rounded-xl p-6 md:p-8">
      <h2 className="text-xl font-semibold text-white mb-2">Request a Tool</h2>
      <p className="text-[#A9C1CB] mb-6">
        Have an idea for a new AI tool? Let us know!
      </p>

      {submitted ? (
        <div className="flex items-center gap-3 text-[#31D7CA]">
          <CheckCircle size={24} />
          <span>Your email client should open. Thanks for your suggestion!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="toolName" className="block text-sm text-[#E1E7EF] mb-2">
              Tool Name
            </label>
            <input
              type="text"
              id="toolName"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              required
              placeholder="e.g., Policy Summarizer"
              className="w-full px-4 py-3 bg-[#272D3F] text-white rounded-lg border-2 border-transparent focus:border-[#31D7CA] focus:outline-none transition-colors placeholder:text-[#7DA3AF]"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm text-[#E1E7EF] mb-2">
              Description / Use Case
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Describe what this tool would do and how it would help..."
              className="w-full px-4 py-3 bg-[#272D3F] text-white rounded-lg border-2 border-transparent focus:border-[#31D7CA] focus:outline-none transition-colors placeholder:text-[#7DA3AF] resize-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-[#FC883A] text-white font-semibold uppercase tracking-wide rounded-lg hover:bg-[#e07a35] transition-colors"
          >
            <Send size={18} />
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
}
