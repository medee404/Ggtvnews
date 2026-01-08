
import { WORDPRESS_API_URL } from '../constants';
import { WP_Post, WP_Category } from '../types';

/**
 * Enhanced fetch with timeout to prevent hanging
 */
const fetchWithTimeout = async (url: string, options: any = {}, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const fetchPosts = async (categoryId?: number, signal?: AbortSignal): Promise<WP_Post[]> => {
  const timestamp = new Date().getTime();
  let url = `${WORDPRESS_API_URL}/posts?_embed&per_page=12&_=${timestamp}`;
  
  if (categoryId) {
    url += `&categories=${categoryId}`;
  }

  try {
    const response = await fetchWithTimeout(url, { signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error: any) {
    console.warn("Could not fetch live posts:", error.message);
    throw error;
  }
};

export const fetchCategories = async (signal?: AbortSignal): Promise<WP_Category[]> => {
  const url = `${WORDPRESS_API_URL}/categories?per_page=15`;
   try {
    const response = await fetchWithTimeout(url, { signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};
