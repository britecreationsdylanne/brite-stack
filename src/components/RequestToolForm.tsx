import { useState } from 'react';
import { Send, CheckCircle, Lightbulb } from 'lucide-react';

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
    <div className="bg-[#F4F7FC] rounded-2xl p-8 md:p-10">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-[#31D7CA] rounded-xl flex items-center justify-center">
          <Lightbulb size={24} className="text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-[#272D3F]">Request a Tool</h2>
      </div>
      <p className="text-[#466F88] mb-8 text-lg">
        Have an idea for a new AI tool? Let us know!
      </p>

      {submitted ? (
        <div className="flex items-center gap-3 text-[#008182] bg-[#E1E7EF] p-4 rounded-xl">
          <CheckCircle size={24} />
          <span className="font-medium">Your email client should open. Thanks for your suggestion!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="toolName" className="block text-sm font-medium text-[#272D3F] mb-2">
              Tool Name
            </label>
            <input
              type="text"
              id="toolName"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              required
              placeholder="e.g., Policy Summarizer"
              className="w-full px-5 py-4 bg-white text-[#272D3F] rounded-xl border-2 border-[#E1E7EF] focus:border-[#31D7CA] focus:outline-none transition-colors placeholder:text-[#A9C1CB]"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#272D3F] mb-2">
              Description / Use Case
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe what this tool would do and how it would help..."
              className="w-full px-5 py-4 bg-white text-[#272D3F] rounded-xl border-2 border-[#E1E7EF] focus:border-[#31D7CA] focus:outline-none transition-colors placeholder:text-[#A9C1CB] resize-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-[#FC883A] text-white font-semibold uppercase tracking-wide rounded-xl hover:bg-[#e07a35] transition-colors shadow-lg hover:shadow-xl"
          >
            <Send size={18} />
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
}
