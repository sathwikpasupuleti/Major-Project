import React from 'react';
import { Music, Compass, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No songs found',
  description = 'Try adjusting your search keywords, mood filters, or language settings.',
  actionLabel,
  actionLink,
  onAction,
  icon: Icon = Music,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#1B1C2E]/60 border border-purple-900/30 my-6">
      <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        actionLink ? (
          <Link
            to={actionLink}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg transition-colors shadow-lg shadow-purple-600/20"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg transition-colors shadow-lg shadow-purple-600/20 cursor-pointer"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}
