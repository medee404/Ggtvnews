
import React from 'react';
import { WP_Post } from '../types';

interface TickerProps {
  posts: WP_Post[];
}

const BreakingNewsTicker: React.FC<TickerProps> = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700 py-3 mb-8 overflow-hidden relative flex items-center shadow-sm">
      <div className="bg-red-600 text-white text-xs font-black px-4 py-1 rounded-r-full absolute left-0 z-10 flex items-center space-x-2 animate-pulse">
        <span className="w-2 h-2 bg-white rounded-full"></span>
        <span>BREAKING NEWS</span>
      </div>
      
      <div className="flex whitespace-nowrap animate-ticker pl-40">
        {posts.concat(posts).map((post, idx) => (
          <div key={`${post.id}-${idx}`} className="flex items-center mx-8">
            <span className="text-blue-600 dark:text-blue-400 font-bold mr-2">•</span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-500 transition-colors cursor-pointer" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
};

export default BreakingNewsTicker;
