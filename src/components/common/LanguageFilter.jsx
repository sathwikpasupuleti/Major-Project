import React from 'react';
import { LANGUAGES } from '../../data/mockData';

export default function LanguageFilter({
  selectedLanguage,
  onSelectLanguage,
  includeAll = true,
  className = '',
}) {
  const options = includeAll ? ['All', ...LANGUAGES] : LANGUAGES;

  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium no-scrollbar ${className}`}>
      {options.map((lang) => {
        const isActive = (selectedLanguage || 'All') === lang;
        return (
          <button
            key={lang}
            onClick={() => onSelectLanguage(lang)}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-600/20 font-semibold'
                : 'bg-[#1B1C2E] text-zinc-400 hover:text-white hover:bg-[#25273F] border border-purple-900/30'
            }`}
          >
            {lang === 'Telugu' && 'తెలుగు · '}
            {lang === 'Hindi' && 'हिन्दी · '}
            {lang === 'Tamil' && 'தமிழ் · '}
            {lang}
          </button>
        );
      })}
    </div>
  );
}
