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
        <div className="w-16 h-16 bg-[#466F88] rounded-full flex items-center justify-center mx-auto mb-4">
          <Search size={32} className="text-[#A9C1CB]" />
        </div>
        <p className="text-[#A9C1CB] text-xl font-medium">No tools found</p>
        <p className="text-[#7DA3AF] text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
