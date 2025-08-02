import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  showDetails?: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, showDetails = false }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const getLocalizedText = (obj: { en: string; ar: string }) => {
    return obj[currentLanguage as keyof typeof obj] || obj.en;
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} ${t('menu.price')}`;
  };

  return (
    <div className="card group">
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={getLocalizedText(item.name)}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x300?text=Coffee+Shop';
          }}
        />
        
        {/* Discount Badge */}
        {item.isDiscounted && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {item.discountPercentage}% {t('menu.discount')}
          </div>
        )}
        
        {/* Featured Badge */}
        {item.isFeatured && (
          <div className="absolute top-2 left-2 bg-accent-color text-primary-color px-2 py-1 rounded-full text-xs font-bold">
            ⭐ {t('search.featured')}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-color transition-colors">
            {getLocalizedText(item.name)}
          </h3>
          <div className="text-right">
            <div className="text-lg font-bold text-primary-color">
              {formatPrice(item.price)}
            </div>
            {item.originalPrice && item.originalPrice > item.price && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(item.originalPrice)}
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {getLocalizedText(item.description)}
        </p>

        <div className="flex items-center justify-between">
          <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            {getLocalizedText(item.category)}
          </span>
          
          {!showDetails && (
            <Link
              to={`/menu/${item._id}`}
              className="btn btn-outline btn-sm"
            >
              {t('common.view')}
            </Link>
          )}
        </div>

        {/* Additional Details */}
        {showDetails && (
          <div className="mt-4 space-y-3">
            {/* Ingredients */}
            {item.ingredients && item.ingredients[currentLanguage as keyof typeof item.ingredients]?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {t('menu.ingredients')}:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {item.ingredients[currentLanguage as keyof typeof item.ingredients]?.map((ingredient, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens */}
            {item.allergens && item.allergens[currentLanguage as keyof typeof item.allergens]?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {t('menu.allergens')}:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {item.allergens[currentLanguage as keyof typeof item.allergens]?.map((allergen, index) => (
                    <span
                      key={index}
                      className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nutritional Information */}
            {item.nutritionalInfo && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {t('menu.nutritionalInfo')}:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {item.nutritionalInfo.calories && (
                    <div className="flex justify-between">
                      <span>{t('menu.calories')}:</span>
                      <span className="font-medium">{item.nutritionalInfo.calories} kcal</span>
                    </div>
                  )}
                  {item.nutritionalInfo.protein && (
                    <div className="flex justify-between">
                      <span>{t('menu.protein')}:</span>
                      <span className="font-medium">{item.nutritionalInfo.protein}g</span>
                    </div>
                  )}
                  {item.nutritionalInfo.carbs && (
                    <div className="flex justify-between">
                      <span>{t('menu.carbs')}:</span>
                      <span className="font-medium">{item.nutritionalInfo.carbs}g</span>
                    </div>
                  )}
                  {item.nutritionalInfo.fat && (
                    <div className="flex justify-between">
                      <span>{t('menu.fat')}:</span>
                      <span className="font-medium">{item.nutritionalInfo.fat}g</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;