import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { menuAPI } from '../services/api';
import { MenuItem } from '../types';
import MenuItemCard from '../components/MenuItemCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [discountedItems, setDiscountedItems] = useState<MenuItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [discountedResponse, featuredResponse] = await Promise.all([
        menuAPI.getDiscounted(),
        menuAPI.getFeatured()
      ]);
      
      setDiscountedItems(discountedResponse.data);
      setFeaturedItems(featuredResponse.data);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hero slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <ChevronRight className="text-white" size={24} />,
    prevArrow: <ChevronLeft className="text-white" size={24} />,
  };

  // Sample hero slides (in production, this would come from API)
  const heroSlides = [
    {
      id: 1,
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      ctaText: t('hero.cta'),
      ctaLink: '/menu',
      discountPercentage: 20
    },
    {
      id: 2,
      title: t('hero.discount'),
      subtitle: 'Special offers on premium coffee and desserts',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      ctaText: 'View Offers',
      ctaLink: '/menu',
      discountPercentage: 15
    },
    {
      id: 3,
      title: 'Cozy Atmosphere',
      subtitle: 'Experience our welcoming dining environment',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      ctaText: 'View Gallery',
      ctaLink: '/gallery',
      discountPercentage: null
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        <Slider {...sliderSettings} className="h-full">
          {heroSlides.map((slide) => (
            <div key={slide.id} className="relative h-screen">
              <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl mx-auto px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 opacity-90">
                    {slide.subtitle}
                  </p>
                  {slide.discountPercentage && (
                    <div className="bg-red-500 text-white px-6 py-2 rounded-full text-lg font-bold mb-8 inline-block">
                      {slide.discountPercentage}% OFF
                    </div>
                  )}
                  <Link
                    to={slide.ctaLink}
                    className="btn btn-primary text-lg px-8 py-4 inline-flex items-center"
                  >
                    {slide.ctaText}
                    <ArrowRight size={20} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Featured Items Section */}
      <section className="py-16 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('menu.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('menu.subtitle')}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading"></div>
              <span className="ml-2">{t('common.loading')}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.slice(0, 6).map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/menu" className="btn btn-primary">
              {t('menu.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Discounted Items Section */}
      {discountedItems.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('hero.discount')}
              </h2>
              <p className="text-xl text-gray-600">
                Don't miss out on our special offers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {discountedItems.slice(0, 6).map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Preview Section */}
      <section className="py-16 bg-background-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('about.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('about.description')}
              </p>
              <Link to="/about" className="btn btn-primary">
                Learn More
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Coffee Shop Interior"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Preview Section */}
      <section className="py-16 bg-primary-color text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('contact.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('contact.subtitle')}
          </p>
          <Link to="/contact" className="btn btn-outline bg-white text-primary-color hover:bg-gray-100">
            Visit Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;