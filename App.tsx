
import React, { useState, useEffect, useMemo } from 'react';
import { fetchPosts, fetchCategories } from './services/wordpressService';
import { WP_Post, WP_Category } from './types';
import { ThemeProvider } from './contexts/ThemeContext';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BreakingNewsTicker from './components/BreakingNewsTicker';
import NewsCard from './components/NewsCard';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import NewsModal from './components/NewsModal';
import Spinner from './components/Spinner';
import ScrollToTopButton from './components/ScrollToTopButton';

const App: React.FC = () => {
    // Initial high-quality demo data so the site is NEVER empty
    const demoPosts: WP_Post[] = [
        {
            id: 101,
            date: new Date().toISOString(),
            title: { rendered: "जीजीटीवी न्यूज़ में आपका स्वागत है - ताज़ा खबरें यहाँ देखें" },
            content: { rendered: "<p>हम आपको दुनिया भर की ताज़ा खबरें पहुँचाने के लिए प्रतिबद्ध हैं। यदि असली न्यूज़ लोड होने में समस्या आ रही है, तो आप इस डेमो मोड में वेबसाइट का अनुभव ले सकते हैं।</p> <p>हमारी टीम लगातार बेहतर सर्विस के लिए काम कर रही है।</p>" },
            excerpt: { rendered: "Ggtv News पर आपका स्वागत है। यहाँ आपको राजनीति, खेल और मनोरंजन की हर खबर मिलेगी।" },
            featured_media: 0,
            link: "#",
            categories: [1]
        },
        {
            id: 102,
            date: new Date().toISOString(),
            title: { rendered: "Tech News: Future of AI in 2025" },
            content: { rendered: "Artificial Intelligence is evolving faster than ever. From healthcare to space exploration, AI is making significant impacts." },
            excerpt: { rendered: "Discover how AI is shaping the future of technology and human interaction." },
            featured_media: 0,
            link: "#",
            categories: [1]
        },
        {
            id: 103,
            date: new Date().toISOString(),
            title: { rendered: "Sports: World Cup preparations in full swing" },
            content: { rendered: "Teams are gearing up for the upcoming international championships with intense training sessions." },
            excerpt: { rendered: "Latest updates from the world of sports and upcoming tournaments." },
            featured_media: 0,
            link: "#",
            categories: [1]
        }
    ];

    const [posts, setPosts] = useState<WP_Post[]>(demoPosts);
    const [categories, setCategories] = useState<WP_Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedPost, setSelectedPost] = useState<WP_Post | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [isUsingDemoData, setIsUsingDemoData] = useState(true);

    const loadData = async (showSpinner = false, signal?: AbortSignal) => {
        if (showSpinner) setIsLoading(true);
        try {
            const [fetchedPosts, fetchedCategories] = await Promise.all([
                fetchPosts(undefined, signal),
                fetchCategories(signal)
            ]);
            
            if (fetchedPosts && fetchedPosts.length > 0) {
                setPosts(fetchedPosts);
                setIsUsingDemoData(false);
            }

            if (fetchedCategories && fetchedCategories.length > 0) {
                const visibleCategories = fetchedCategories.filter(cat => cat.slug !== 'uncategorized');
                setCategories(visibleCategories);
            }
            setLastUpdated(new Date());
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.warn("Live API connection failed. Staying in Sample Mode.");
                setIsUsingDemoData(true);
            }
        } finally {
             if (!signal || !signal.aborted) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        // Try to load live data, but don't block the UI
        loadData(true, controller.signal);

        const intervalId = setInterval(() => {
            loadData(false); 
        }, 120000); 

        return () => {
            controller.abort();
            clearInterval(intervalId);
        };
    }, []);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesCategory = selectedCategory === null || post.categories.includes(selectedCategory);
            const matchesSearch = searchTerm === '' || 
                post.title.rendered.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [posts, selectedCategory, searchTerm]);

    const handleSelectCategory = (categoryId: number | null) => {
        setSelectedCategory(categoryId);
    };

    const handleReadMore = (post: WP_Post) => {
        setSelectedPost(post);
    };

    const getCategoryName = (post: WP_Post): string | undefined => {
        if (!post || !post.categories.length || !categories.length) return undefined;
        const category = categories.find(cat => cat.id === post.categories[0]);
        return category?.name;
    };

    return (
        <ThemeProvider>
            <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans transition-colors duration-300">
                <Header 
                    categories={categories} 
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
                
                <BreakingNewsTicker posts={posts.slice(0, 10)} />

                <main className="container mx-auto px-4 py-4">
                    {/* Status Banner */}
                    <div className="flex items-center justify-between mb-6">
                        <div className={`flex items-center space-x-2 text-[10px] font-bold px-3 py-1 rounded-full border ${isUsingDemoData ? 'text-amber-600 bg-amber-50 border-amber-200 animate-pulse' : 'text-green-600 bg-green-50 border-green-200'}`}>
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            <span>{isUsingDemoData ? 'SAMPLES LOADED (CONNECTING TO LIVE SERVER...)' : 'LIVE NEWS CONNECTED'}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                            Updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    </div>

                    {isLoading && isUsingDemoData && posts.length === demoPosts.length ? (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                                    <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                                </div>
                            </div>
                            <div className="h-full bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse hidden lg:block"></div>
                         </div>
                    ) : (
                        <>
                            {filteredPosts.length > 0 && !searchTerm && (
                                <HeroSection 
                                    posts={filteredPosts.slice(0, 3)} 
                                    onReadMore={handleReadMore} 
                                    getCategoryName={getCategoryName} 
                                />
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <h2 className="text-2xl font-black mb-6 flex items-center">
                                        <span className="w-1.5 h-6 bg-blue-600 mr-3 rounded-full"></span>
                                        {searchTerm ? 'Search Results' : 'Latest News'}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {filteredPosts.map(post => (
                                            <NewsCard key={post.id} post={post} onReadMore={handleReadMore} categoryName={getCategoryName(post)} />
                                        ))}
                                    </div>
                                </div>
                                <Sidebar trendingPosts={posts.slice(0, 5)} onPostClick={handleReadMore}/>
                            </div>
                        </>
                    )}
                </main>
                <Footer />
                {selectedPost && <NewsModal post={selectedPost} onClose={() => setSelectedPost(null)} categoryName={getCategoryName(selectedPost)} />}
                <ScrollToTopButton />
            </div>
        </ThemeProvider>
    );
};

export default App;
