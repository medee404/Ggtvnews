
import React from 'react';
import { WP_Post } from '../types';
import { Calendar, Clock } from './icons/Icons';

interface NewsCardProps {
  post: WP_Post;
  onReadMore: (post: WP_Post) => void;
  categoryName?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ post, onReadMore, categoryName }) => {
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${post.id}/400/250`;
  const postDateObj = new Date(post.date);
  const postDate = postDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isNew = (Date.now() - postDateObj.getTime()) < 24 * 60 * 60 * 1000;

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const noOfWords = content.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    return Math.ceil(minutes);
  };

  const readingTime = calculateReadingTime(post.content.rendered);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 transform">
      <div className="relative h-56 overflow-hidden">
        <img 
            src={imageUrl} 
            alt={post.title.rendered} 
            loading="lazy" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
         {categoryName && (
          <span className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg z-10">
            {categoryName}
          </span>
        )}
        {isNew && (
          <span className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg z-10 animate-pulse">
            NEW
          </span>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center space-x-4 mb-3 text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{postDate}</span>
            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{readingTime} min read</span>
        </div>
        <h3 className="text-xl font-bold mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <div className="text-gray-600 dark:text-gray-300 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
        <div className="mt-auto">
          <button
            onClick={() => onReadMore(post)}
            className="w-full py-3 rounded-xl border-2 border-gray-100 dark:border-gray-700 font-bold text-sm text-gray-900 dark:text-white hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300"
          >
            Read Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
