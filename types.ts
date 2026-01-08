
export interface WP_Post {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: WP_Media[];
  };
  link: string;
  categories: number[];
}

export interface WP_Category {
  id: number;
  name: string;
  slug: string;
}

export interface WP_Media {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    sizes: {
        full: {
            source_url: string;
        }
    }
  }
}
