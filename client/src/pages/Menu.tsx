import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, X } from 'lucide-react';
import { menuAPI } from '../services/api';
import { MenuItem } from '../types';
import MenuItemCard from '../components/MenuItemCard';

const Menu: React.FC = () => {
  const { t } = useTranslation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [filters, setFilters] = useState({
    isDiscounted: false,
    isFeatured: false,
  });

  useEffect(() => {
    loadMenuData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [selectedCategory, searchQuery, priceRange, filters]);

  const loadMenuData = async () => {
    try {
      const [menuResponse, categoriesResponse] = await Promise.all([
        menuAPI.getAll(),
        menuAPI.getCategories()
      ]);
      
      setMenuItems(menuResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error loading menu data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...menuItems];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => 
        item.category.en === selectedCategory || item.category.ar === selectedCategory
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.en.toLowerCase().includes(query) ||
        item.name.ar.toLowerCase().includes(query) ||
        item.description.en.toLowerCase().includes(query) ||
        item.description.ar.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(item => item.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(item => item.price <= parseFloat(priceRange.max));
    }

    // Other filters
    if (filters.isDiscounted) {
      filtered = filtered.filter(item => item.isDiscounted);
    }
    if (filters.isFeatured) {
      filtered = filtered.filter(item => item.isFeatured);
    }

    setMenuItems(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setFilters({ isDiscounted: false, isFeatured: false });
    loadMenuData();
  };

  const hasActiveFilters = selectedCategory || searchQuery || priceRange.min || priceRange.max || filters.isDiscounted || filters.isFeatured;

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-background-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('menu.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('menu.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline flex items-center gap-2"
              >
                <Filter size={16} />
                {t('search.filters')}
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                >
                  <X size={16} />
                  {t('search.clearFilters')}
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('search.category')}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color"
                  >
                    <option value="">{t('search.category')}</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('search.minPrice')}
                  </label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('search.maxPrice')}
                  </label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    placeholder="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.isDiscounted}
                      onChange={(e) => setFilters(prev => ({ ...prev, isDiscounted: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-color focus:ring-primary-color"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {t('search.discounted')}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.isFeatured}
                      onChange={(e) => setFilters(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-color focus:ring-primary-color"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {t('search.featured')}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Category Pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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

      {/* Menu Items */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading"></div>
              <span className="ml-2">{t('common.loading')}</span>
            </div>
          ) : menuItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('search.noResults')}
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={clearFilters}
                className="btn btn-primary mt-4"
              >
                {t('search.clearFilters')}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;