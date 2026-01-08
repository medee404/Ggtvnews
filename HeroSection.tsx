
import React, { useState, useEffect } from 'react';
import { WP_Post } from '../types';

interface HeroSectionProps {
  posts: WP_Post[];
  onReadMore: (post: WP_Post) => void;
  getCategoryName: (post: WP_Post) => string | undefined;
}

const HeroSection: React.FC<HeroSectionProps> = ({ posts, onReadMore, getCategoryName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle news every 6 seconds
  useEffect(() => {
    if (isPaused || posts.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [posts.length, isPaused]);

  if (posts.length === 0) return null;

  const currentPost = posts[currentIndex];
  const imageUrl = currentPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${currentPost.id}/1200/600`;
  const categoryName = getCategoryName(currentPost);

  return (
    <div 
      className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px] group mb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out">
        <img 
          key={currentPost.id}
          src={imageUrl} 
          alt={currentPost.title.rendered} 
          className="w-full h-full object-cover animate-image-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white w-full md:w-3/4 animate-fade-in-up">
        {categoryName && (
          <span className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest shadow-lg">
            {categoryName}
          </span>
        )}
        <h1 
          className="text-3xl md:text-5xl font-black mb-4 leading-tight drop-shadow-md" 
          dangerouslySetInnerHTML={{ __html: currentPost.title.rendered }} 
        />
        <div 
          className="text-gray-200 mb-8 hidden md:block text-lg line-clamp-2 max-w-2xl" 
          dangerouslySetInnerHTML={{ __html: currentPost.excerpt.rendered.replace(/<[^>]*>?/gm, '') }} 
        />
        <button
          onClick={() => onReadMore(currentPost)}
          className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl"
        >
          Read Full Story
        </button>
      </div>

      {/* Controls & Pagination Indicators */}
      <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 flex items-center space-x-3 z-20">
        {posts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 transition-all duration-500 rounded-full ${
              idx === currentIndex ? 'w-10 bg-blue-500' : 'w-2 bg-white/40 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar (Auto-change indicator) */}
      <div className="absolute bottom-0 left-0 h-1.5 bg-white/20 w-full">
        <div 
          key={currentIndex}
          className="h-full bg-blue-500 animate-progress"
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes image-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-image-zoom { animation: image-zoom 20s linear infinite alternate; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-progress { animation: progress 6s linear forwards; }
      `}} />
    </div>
  );
};

export default HeroSection;
