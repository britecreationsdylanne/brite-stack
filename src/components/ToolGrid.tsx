import { ToolCard } from './ToolCard';
import type { Tool } from '../data/tools';
import { Search } from 'lucide-react';

interface ToolGridProps {
  tools: Tool[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export function ToolGrid({ tools, isFavorite, onToggleFavorite }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-[#272D3F] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_8px_30px_rgba(39,45,63,0.3)]">
          <Search size={32} className="text-[#31D7CA]" />
        </div>
        <p className="text-[#272D3F] text-xl font-medium">No tools found</p>
        <p className="text-[#272D3F]/70 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          isFavorite={isFavorite(tool.id)}
          onToggleFavorite={() => onToggleFavorite(tool.id)}
        />
      ))}
    </div>
  );
}
