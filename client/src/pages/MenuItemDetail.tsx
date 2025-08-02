import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Star } from 'lucide-react';
import { menuAPI } from '../services/api';
import { MenuItem } from '../types';

const MenuItemDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadMenuItem();
    }
  }, [id]);

  const loadMenuItem = async () => {
    try {
      setIsLoading(true);
      const response = await menuAPI.getById(id!);
      setItem(response.data);
    } catch (error) {
      console.error('Error loading menu item:', error);
      setError('Failed to load menu item');
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalizedText = (obj: { en: string; ar: string }) => {
    const currentLang = localStorage.getItem('i18nextLng') || 'en';
    return obj[currentLang as keyof typeof obj] || obj.en;
  };

  const currentLanguage = localStorage.getItem('i18nextLng') || 'en';

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} ${t('menu.price')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="loading"></div>
        <span className="ml-2">{t('common.loading')}</span>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Menu item not found'}
          </h2>
          <Link to="/menu" className="btn btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Breadcrumb */}
      <section className="bg-background-secondary py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-primary-color">
              {t('nav.home')}
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/menu" className="text-gray-600 hover:text-primary-color">
              {t('nav.menu')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{getLocalizedText(item.name)}</span>
          </nav>
        </div>
      </section>

      {/* Item Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative">
              <img
                src={item.image}
                alt={getLocalizedText(item.name)}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x400?text=Coffee+Shop';
                }}
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {item.isDiscounted && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {item.discountPercentage}% {t('menu.discount')}
                  </div>
                )}
                {item.isFeatured && (
                  <div className="bg-accent-color text-primary-color px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Star size={14} className="mr-1" />
                    {t('search.featured')}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {getLocalizedText(item.name)}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {getLocalizedText(item.description)}
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-primary-color">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {getLocalizedText(item.category)}
                  </span>
                </div>
              </div>

              {/* Ingredients */}
              {item.ingredients && item.ingredients[currentLanguage as keyof typeof item.ingredients]?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {t('menu.ingredients')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients[currentLanguage as keyof typeof item.ingredients]?.map((ingredient, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens */}
              {item.allergens && item.allergens[currentLanguage as keyof typeof item.allergens]?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {t('menu.allergens')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.allergens[currentLanguage as keyof typeof item.allergens]?.map((allergen, index) => (
                      <span
                        key={index}
                        className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutritional Information */}
              {item.nutritionalInfo && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {t('menu.nutritionalInfo')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    {item.nutritionalInfo.calories && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('menu.calories')}:</span>
                        <span className="font-medium">{item.nutritionalInfo.calories} kcal</span>
                      </div>
                    )}
                    {item.nutritionalInfo.protein && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('menu.protein')}:</span>
                        <span className="font-medium">{item.nutritionalInfo.protein}g</span>
                      </div>
                    )}
                    {item.nutritionalInfo.carbs && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('menu.carbs')}:</span>
                        <span className="font-medium">{item.nutritionalInfo.carbs}g</span>
                      </div>
                    )}
                    {item.nutritionalInfo.fat && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('menu.fat')}:</span>
                        <span className="font-medium">{item.nutritionalInfo.fat}g</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <Link
                  to="/menu"
                  className="btn btn-outline flex items-center"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Menu
                </Link>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    // In a real app, this would add to cart or show order options
                    alert('Order functionality would be implemented here');
                  }}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MenuItemDetail;