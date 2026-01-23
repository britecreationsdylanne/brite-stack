import { ToolCard } from './ToolCard';
import type { Tool } from '../data/tools';

interface ToolGridProps {
  tools: Tool[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export function ToolGrid({ tools, isFavorite, onToggleFavorite }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#A9C1CB] text-lg">No tools found</p>
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
