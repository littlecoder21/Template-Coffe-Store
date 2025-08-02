export interface MenuItem {
  _id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  category: {
    en: string;
    ar: string;
  };
  price: number;
  originalPrice?: number;
  image: string;
  isDiscounted: boolean;
  discountPercentage: number;
  ingredients?: {
    en: string[];
    ar: string[];
  };
  allergens?: {
    en: string[];
    ar: string[];
  };
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  isAvailable: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  _id: string;
  title: {
    en: string;
    ar: string;
  };
  description?: {
    en: string;
    ar: string;
  };
  image: string;
  category: {
    en: string;
    ar: string;
  };
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface SearchFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isDiscounted?: boolean;
  isFeatured?: boolean;
  allergens?: string[];
  tags?: string[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type Language = 'en' | 'ar';

export interface Category {
  en: string;
  ar: string;
  count?: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  discountPercentage?: number;
}