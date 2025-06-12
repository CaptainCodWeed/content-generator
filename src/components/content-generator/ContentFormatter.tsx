
import React from 'react';

export const formatContent = (content: string) => {
  return content.split('\n').map((paragraph, index) => {
    if (paragraph.trim() === '') return null;
    
    if (paragraph.startsWith('#') || (paragraph.length < 50 && paragraph === paragraph.toUpperCase())) {
      return (
        <h3 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3 border-r-4 border-blue-500 pr-4">
          {paragraph.replace(/^#+\s*/, '')}
        </h3>
      );
    }
    
    return (
      <p key={index} className="text-gray-700 mb-4 leading-relaxed text-justify">
        {paragraph}
      </p>
    );
  }).filter(Boolean);
};
