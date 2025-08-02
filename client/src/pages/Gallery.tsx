import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { galleryAPI } from '../services/api';
import { GalleryItem } from '../types';

const Gallery: React.FC = () => {
  const { t } = useTranslation();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    loadGalleryData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadGalleryByCategory();
    } else {
      loadGalleryData();
    }
  }, [selectedCategory]);

  const loadGalleryData = async () => {
    try {
      const [galleryResponse, categoriesResponse] = await Promise.all([
        galleryAPI.getAll(),
        galleryAPI.getCategories()
      ]);
      
      setGalleryItems(galleryResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error loading gallery data:', error);
      // Fallback to sample data
      setGalleryItems(getSampleGalleryItems());
      setCategories(['Interior', 'Exterior', 'Food', 'Drinks']);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGalleryByCategory = async () => {
    try {
      const response = await galleryAPI.getByCategory(selectedCategory);
      setGalleryItems(response.data);
    } catch (error) {
      console.error('Error loading gallery by category:', error);
    }
  };

  // Sample gallery items for demonstration
  const getSampleGalleryItems = (): GalleryItem[] => [
    {
      _id: '1',
      title: { en: 'Cozy Interior', ar: 'داخلية دافئة' },
      description: { en: 'Our comfortable seating area', ar: 'منطقة الجلوس المريحة' },
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: { en: 'Interior', ar: 'داخلي' },
      isActive: true,
      order: 1,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: { en: 'Outdoor Seating', ar: 'جلوس خارجي' },
      description: { en: 'Enjoy coffee in the fresh air', ar: 'استمتع بالقهوة في الهواء الطلق' },
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: { en: 'Exterior', ar: 'خارجي' },
      isActive: true,
      order: 2,
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      title: { en: 'Premium Coffee', ar: 'قهوة مميزة' },
      description: { en: 'Our signature coffee blends', ar: 'خلطات القهوة المميزة' },
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: { en: 'Drinks', ar: 'مشروبات' },
      isActive: true,
      order: 3,
      createdAt: new Date().toISOString()
    },
    {
      _id: '4',
      title: { en: 'Delicious Desserts', ar: 'حلويات لذيذة' },
      description: { en: 'Freshly baked pastries', ar: 'معجنات طازجة' },
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: { en: 'Food', ar: 'طعام' },
      isActive: true,
      order: 4,
      createdAt: new Date().toISOString()
    },
    {
      _id: '5',
      title: { en: 'Barista Station', ar: 'محطة الباريستا' },
      description: { en: 'Watch our expert baristas at work', ar: 'شاهد خبراء الباريستا في العمل' },
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: { en: 'Interior', ar: 'داخلي' },
      isActive: true,
      order: 5,
      createdAt: new Date().toISOString()
    },
    {
      _id: '6',
      title: { en: 'Garden View', ar: 'إطلالة على الحديقة' },
      description: { en: 'Peaceful garden seating area', ar: 'منطقة جلوس هادئة في الحديقة' },
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: { en: 'Exterior', ar: 'خارجي' },
      isActive: true,
      order: 6,
      createdAt: new Date().toISOString()
    }
  ];

  const getLocalizedText = (obj: { en: string; ar: string }) => {
    const currentLang = localStorage.getItem('i18nextLng') || 'en';
    return obj[currentLang as keyof typeof obj] || obj.en;
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-background-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('gallery.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('gallery.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-primary-color text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-color text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading"></div>
              <span className="ml-2">{t('common.loading')}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item._id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={item.image}
                      alt={getLocalizedText(item.title)}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x300?text=Gallery+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                      <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-lg font-semibold mb-1">
                          {getLocalizedText(item.title)}
                        </h3>
                        {item.description && (
                          <p className="text-sm opacity-90">
                            {getLocalizedText(item.description)}
                          </p>
                        )}
                        <span className="inline-block bg-primary-color text-white px-2 py-1 rounded text-xs mt-2">
                          {getLocalizedText(item.category)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <img
              src={selectedImage.image}
              alt={getLocalizedText(selectedImage.title)}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 rounded-b-lg">
              <h3 className="text-2xl font-bold text-white mb-2">
                {getLocalizedText(selectedImage.title)}
              </h3>
              {selectedImage.description && (
                <p className="text-white opacity-90 mb-2">
                  {getLocalizedText(selectedImage.description)}
                </p>
              )}
              <span className="inline-block bg-primary-color text-white px-3 py-1 rounded text-sm">
                {getLocalizedText(selectedImage.category)}
              </span>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;