
import React, { useEffect, useState } from 'react';
import { WP_Post } from '../types';
import { X, Facebook, Twitter, Linkedin, Link, Calendar, Sparkles, Loader2 } from './icons/Icons';
import { GoogleGenAI } from '@google/genai';

interface NewsModalProps {
  post: WP_Post;
  onClose: () => void;
  categoryName?: string;
}

const NewsModal: React.FC<NewsModalProps> = ({ post, onClose, categoryName }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const generateSummary = async () => {
    setIsSummarizing(true);
    setSummaryError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const plainTextContent = post.content.rendered.replace(/<[^>]*>?/gm, '');
      const prompt = `Summarize the following news article in 3-4 bullet points. Focus on the most important facts. Keep it professional and concise. Article: ${plainTextContent}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      if (response.text) {
        setSummary(response.text);
      }
    } catch (err) {
      console.error('Summarization failed:', err);
      setSummaryError('Failed to generate AI summary. Please try again later.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.full?.source_url || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${post.id}/800/400`;
  const postDate = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const shareOnFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.link)}`, '_blank');
  const shareOnTwitter = () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(post.link)}&text=${encodeURIComponent(post.title.rendered)}`, '_blank');
  const shareOnLinkedIn = () => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(post.link)}&title=${encodeURIComponent(post.title.rendered)}`, '_blank');
  const copyLink = () => {
    navigator.clipboard.writeText(post.link);
    alert('Link copied to clipboard!');
  };
  
  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md z-[100] flex justify-center items-center p-4 md:p-8 animate-fade-in-fast" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative animate-modal-pop border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="fixed md:absolute top-4 right-4 text-gray-400 hover:text-white transition-all z-[110] p-3 bg-gray-900/80 rounded-full hover:scale-110 active:scale-95">
          <X className="w-6 h-6"/>
        </button>

        <div className="relative h-64 md:h-[450px]">
            <img src={imageUrl} alt={post.title.rendered} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
                {categoryName && (
                    <span className="inline-block bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-lg mb-4 uppercase tracking-widest">
                        {categoryName}
                    </span>
                )}
                <h1 className="text-2xl md:text-5xl font-black mb-4 leading-tight drop-shadow-lg" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                <div className="flex items-center text-sm font-medium text-gray-300">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{postDate}</span>
                </div>
            </div>
        </div>
        
        <div className="p-6 md:p-12">
            {/* AI Summary Section */}
            <div className="mb-10 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-3xl overflow-hidden relative group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 p-2 rounded-xl text-white">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">AI Quick Summary</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Save time with machine-generated insights</p>
                        </div>
                    </div>
                    {!summary && !isSummarizing && (
                        <button 
                            onClick={generateSummary}
                            className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-sm font-bold px-6 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                            Generate Summary
                        </button>
                    )}
                </div>

                {isSummarizing && (
                    <div className="flex items-center justify-center py-8 space-x-3 text-blue-600 dark:text-blue-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="font-medium">Gemini is analyzing the article...</span>
                    </div>
                )}

                {summary && (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl animate-fade-in border border-white/50 dark:border-gray-700/50">
                        <div className="whitespace-pre-wrap leading-relaxed">{summary}</div>
                    </div>
                )}

                {summaryError && (
                    <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl text-center">
                        {summaryError}
                    </div>
                )}
            </div>

            <div className="prose md:prose-xl dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-3xl prose-img:shadow-2xl" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Share Article</span>
                    <div className="h-px w-8 bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="flex space-x-3">
                    <button onClick={shareOnFacebook} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-blue-600 hover:text-white transition-all group">
                        <Facebook className="w-5 h-5 text-blue-600 group-hover:text-white" />
                    </button>
                    <button onClick={shareOnTwitter} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-sky-500 hover:text-white transition-all group">
                        <Twitter className="w-5 h-5 text-sky-500 group-hover:text-white" />
                    </button>
                    <button onClick={shareOnLinkedIn} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-blue-700 hover:text-white transition-all group">
                        <Linkedin className="w-5 h-5 text-blue-700 group-hover:text-white" />
                    </button>
                    <button onClick={copyLink} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-800 hover:text-white transition-all group">
                        <Link className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;

const style = document.createElement('style');
style.innerHTML = `
@keyframes modal-pop {
  from { opacity: 0; transform: scale(0.95) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-modal-pop {
  animation: modal-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.prose blockquote {
    border-left-color: #2563eb;
    font-style: italic;
    font-size: 1.25em;
    color: #4b5563;
}
.dark .prose blockquote { color: #9ca3af; }
`;
document.head.appendChild(style);
