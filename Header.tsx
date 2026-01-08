
import React, { useState, useEffect } from 'react';
import { WP_Category } from '../types';
import ThemeToggle from './ThemeToggle';
import { Newspaper, Search, Menu, X } from './icons/Icons';
import { WORDPRESS_API_URL } from '../constants';

interface HeaderProps {
    categories: WP_Category[];
    selectedCategory: number | null;
    onSelectCategory: (id: number | null) => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ categories, selectedCategory, onSelectCategory, searchTerm, onSearchChange }) => {
    const [isSticky, setIsSticky] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Extracting domain name for display
    const sourceDomain = new URL(WORDPRESS_API_URL).hostname;

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItemClasses = "py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer flex-shrink-0 whitespace-nowrap border border-transparent";
    const activeNavItemClasses = "bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-y-[-1px]";
    const inactiveNavItemClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400";
    
    return (
        <header className={`bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-xl transition-all duration-300 z-50 ${isSticky ? 'fixed top-0 left-0 right-0' : 'relative'}`}>
            <div className="container mx-auto px-4">
                {/* Top Bar */}
                <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => onSelectCategory(null)}>
                            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                                <Newspaper className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Gg<span className="text-blue-600">tv</span></span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                            Source: {sourceDomain}
                        </span>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="relative group">
                            <input 
                                type="text" 
                                placeholder="Search articles..." 
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 transition-all duration-300 group-focus-within:w-80"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors"/>
                            {searchTerm && (
                                <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <ThemeToggle />
                    </div>

                    <div className="md:hidden flex items-center space-x-2">
                         <ThemeToggle />
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Navigation Bar */}
                <nav className={`md:flex md:justify-center overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen py-4' : 'max-h-0 md:max-h-none'}`}>
                    <ul className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 items-center md:flex-nowrap md:overflow-x-auto custom-scrollbar md:py-3 no-scrollbar">
                        <li>
                            <button onClick={() => { onSelectCategory(null); setIsMenuOpen(false); }} className={`${navItemClasses} ${selectedCategory === null ? activeNavItemClasses : inactiveNavItemClasses}`}>
                                All News
                            </button>
                        </li>
                        {categories.map(category => (
                            <li key={category.id}>
                                <button onClick={() => { onSelectCategory(category.id); setIsMenuOpen(false); }} className={`${navItemClasses} ${selectedCategory === category.id ? activeNavItemClasses : inactiveNavItemClasses}`}>
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </header>
    );
};

export default Header;
