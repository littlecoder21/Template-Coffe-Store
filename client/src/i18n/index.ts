import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.menu': 'Menu',
      'nav.gallery': 'Gallery',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      
      // Hero Section
      'hero.title': 'Experience Premium Coffee',
      'hero.subtitle': 'Discover the finest coffee, tea, and desserts in Saudi Arabia',
      'hero.cta': 'Explore Menu',
      'hero.discount': 'Special Offers',
      
      // Menu Section
      'menu.title': 'Our Menu',
      'menu.subtitle': 'Discover our delicious selection',
      'menu.categories': {
        'coffee': 'Coffee',
        'tea': 'Tea',
        'desserts': 'Desserts',
        'snacks': 'Snacks',
        'beverages': 'Beverages'
      },
      'menu.viewAll': 'View All',
      'menu.price': 'SAR',
      'menu.discount': 'OFF',
      'menu.originalPrice': 'Original Price',
      'menu.ingredients': 'Ingredients',
      'menu.allergens': 'Allergens',
      'menu.nutritionalInfo': 'Nutritional Information',
      'menu.calories': 'Calories',
      'menu.protein': 'Protein',
      'menu.carbs': 'Carbohydrates',
      'menu.fat': 'Fat',
      
      // Search
      'search.placeholder': 'Search for coffee, tea, desserts...',
      'search.noResults': 'No items found',
      'search.filters': 'Filters',
      'search.category': 'Category',
      'search.priceRange': 'Price Range',
      'search.minPrice': 'Min Price',
      'search.maxPrice': 'Max Price',
      'search.discounted': 'Discounted Items',
      'search.featured': 'Featured Items',
      'search.clearFilters': 'Clear Filters',
      
      // Gallery
      'gallery.title': 'Our Dining Environment',
      'gallery.subtitle': 'Experience our cozy and welcoming atmosphere',
      'gallery.categories': {
        'interior': 'Interior',
        'exterior': 'Exterior',
        'food': 'Food',
        'drinks': 'Drinks'
      },
      
      // About
      'about.title': 'About Our Coffee Shop',
      'about.subtitle': 'A story of passion and quality',
      'about.description': 'We are passionate about serving the finest coffee and creating memorable experiences for our customers.',
      'about.values': {
        'quality': 'Quality',
        'passion': 'Passion',
        'community': 'Community',
        'innovation': 'Innovation'
      },
      
      // Contact
      'contact.title': 'Visit Us',
      'contact.subtitle': 'We\'d love to hear from you',
      'contact.address': 'Address',
      'contact.phone': 'Phone',
      'contact.email': 'Email',
      'contact.hours': 'Opening Hours',
      'contact.monday': 'Monday',
      'contact.tuesday': 'Tuesday',
      'contact.wednesday': 'Wednesday',
      'contact.thursday': 'Thursday',
      'contact.friday': 'Friday',
      'contact.saturday': 'Saturday',
      'contact.sunday': 'Sunday',
      
      // Footer
      'footer.copyright': '© 2024 Coffee Shop. All rights reserved.',
      'footer.followUs': 'Follow Us',
      'footer.newsletter': 'Newsletter',
      'footer.newsletterPlaceholder': 'Enter your email',
      'footer.subscribe': 'Subscribe',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Something went wrong',
      'common.retry': 'Retry',
      'common.close': 'Close',
      'common.view': 'View',
      'common.details': 'Details',
      'language': 'Language'
    }
  },
  ar: {
    translation: {
      // Navigation
      'nav.home': 'الرئيسية',
      'nav.menu': 'القائمة',
      'nav.gallery': 'المعرض',
      'nav.about': 'من نحن',
      'nav.contact': 'اتصل بنا',
      
      // Hero Section
      'hero.title': 'جرب القهوة المميزة',
      'hero.subtitle': 'اكتشف أفضل القهوة والشاي والحلويات في المملكة العربية السعودية',
      'hero.cta': 'استكشف القائمة',
      'hero.discount': 'عروض خاصة',
      
      // Menu Section
      'menu.title': 'قائمتنا',
      'menu.subtitle': 'اكتشف تشكيلتنا اللذيذة',
      'menu.categories': {
        'coffee': 'قهوة',
        'tea': 'شاي',
        'desserts': 'حلويات',
        'snacks': 'وجبات خفيفة',
        'beverages': 'مشروبات'
      },
      'menu.viewAll': 'عرض الكل',
      'menu.price': 'ريال',
      'menu.discount': 'خصم',
      'menu.originalPrice': 'السعر الأصلي',
      'menu.ingredients': 'المكونات',
      'menu.allergens': 'مسببات الحساسية',
      'menu.nutritionalInfo': 'المعلومات الغذائية',
      'menu.calories': 'السعرات الحرارية',
      'menu.protein': 'البروتين',
      'menu.carbs': 'الكربوهيدرات',
      'menu.fat': 'الدهون',
      
      // Search
      'search.placeholder': 'ابحث عن قهوة، شاي، حلويات...',
      'search.noResults': 'لم يتم العثور على نتائج',
      'search.filters': 'المرشحات',
      'search.category': 'الفئة',
      'search.priceRange': 'نطاق السعر',
      'search.minPrice': 'الحد الأدنى للسعر',
      'search.maxPrice': 'الحد الأقصى للسعر',
      'search.discounted': 'العناصر المخفضة',
      'search.featured': 'العناصر المميزة',
      'search.clearFilters': 'مسح المرشحات',
      
      // Gallery
      'gallery.title': 'بيئة تناول الطعام لدينا',
      'gallery.subtitle': 'جرب أجواءنا الدافئة والمرحبة',
      'gallery.categories': {
        'interior': 'الداخلية',
        'exterior': 'الخارجية',
        'food': 'الطعام',
        'drinks': 'المشروبات'
      },
      
      // About
      'about.title': 'عن مقهى القهوة لدينا',
      'about.subtitle': 'قصة من الشغف والجودة',
      'about.description': 'نحن شغوفون بتقديم أفضل القهوة وخلق تجارب لا تنسى لعملائنا.',
      'about.values': {
        'quality': 'الجودة',
        'passion': 'الشغف',
        'community': 'المجتمع',
        'innovation': 'الابتكار'
      },
      
      // Contact
      'contact.title': 'زرنا',
      'contact.subtitle': 'نود أن نسمع منك',
      'contact.address': 'العنوان',
      'contact.phone': 'الهاتف',
      'contact.email': 'البريد الإلكتروني',
      'contact.hours': 'ساعات العمل',
      'contact.monday': 'الاثنين',
      'contact.tuesday': 'الثلاثاء',
      'contact.wednesday': 'الأربعاء',
      'contact.thursday': 'الخميس',
      'contact.friday': 'الجمعة',
      'contact.saturday': 'السبت',
      'contact.sunday': 'الأحد',
      
      // Footer
      'footer.copyright': '© 2024 مقهى القهوة. جميع الحقوق محفوظة.',
      'footer.followUs': 'تابعنا',
      'footer.newsletter': 'النشرة الإخبارية',
      'footer.newsletterPlaceholder': 'أدخل بريدك الإلكتروني',
      'footer.subscribe': 'اشترك',
      
      // Common
      'common.loading': 'جاري التحميل...',
      'common.error': 'حدث خطأ ما',
      'common.retry': 'إعادة المحاولة',
      'common.close': 'إغلاق',
      'common.view': 'عرض',
      'common.details': 'التفاصيل',
      'language': 'اللغة'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;