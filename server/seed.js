const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const GalleryItem = require('./models/GalleryItem');
require('dotenv').config();

const sampleMenuItems = [
  {
    name: {
      en: 'Espresso',
      ar: 'إسبريسو'
    },
    description: {
      en: 'Strong and concentrated coffee shot',
      ar: 'قهوة قوية ومركزة'
    },
    category: {
      en: 'Coffee',
      ar: 'قهوة'
    },
    price: 12.00,
    originalPrice: 15.00,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isDiscounted: true,
    discountPercentage: 20,
    ingredients: {
      en: ['Arabica Coffee Beans', 'Water'],
      ar: ['حبوب قهوة أرابيكا', 'ماء']
    },
    allergens: {
      en: [],
      ar: []
    },
    nutritionalInfo: {
      calories: 5,
      protein: 0.5,
      carbs: 1,
      fat: 0
    },
    isAvailable: true,
    isFeatured: true,
    tags: ['espresso', 'coffee', 'strong']
  },
  {
    name: {
      en: 'Cappuccino',
      ar: 'كابتشينو'
    },
    description: {
      en: 'Espresso with steamed milk and milk foam',
      ar: 'إسبريسو مع حليب مبخر ورغوة الحليب'
    },
    category: {
      en: 'Coffee',
      ar: 'قهوة'
    },
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isDiscounted: false,
    discountPercentage: 0,
    ingredients: {
      en: ['Espresso', 'Steamed Milk', 'Milk Foam'],
      ar: ['إسبريسو', 'حليب مبخر', 'رغوة الحليب']
    },
    allergens: {
      en: ['Milk'],
      ar: ['حليب']
    },
    nutritionalInfo: {
      calories: 120,
      protein: 8,
      carbs: 12,
      fat: 6
    },
    isAvailable: true,
    isFeatured: true,
    tags: ['cappuccino', 'coffee', 'milk']
  },
  {
    name: {
      en: 'Green Tea',
      ar: 'شاي أخضر'
    },
    description: {
      en: 'Refreshing and healthy green tea',
      ar: 'شاي أخضر منعش وصحي'
    },
    category: {
      en: 'Tea',
      ar: 'شاي'
    },
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isDiscounted: false,
    discountPercentage: 0,
    ingredients: {
      en: ['Green Tea Leaves', 'Hot Water'],
      ar: ['أوراق الشاي الأخضر', 'ماء ساخن']
    },
    allergens: {
      en: [],
      ar: []
    },
    nutritionalInfo: {
      calories: 2,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    isAvailable: true,
    isFeatured: false,
    tags: ['green tea', 'tea', 'healthy']
  },
  {
    name: {
      en: 'Chocolate Cake',
      ar: 'كيك الشوكولاتة'
    },
    description: {
      en: 'Rich and moist chocolate cake',
      ar: 'كيك شوكولاتة غني ورطب'
    },
    category: {
      en: 'Desserts',
      ar: 'حلويات'
    },
    price: 25.00,
    originalPrice: 30.00,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isDiscounted: true,
    discountPercentage: 17,
    ingredients: {
      en: ['Flour', 'Chocolate', 'Eggs', 'Sugar', 'Butter'],
      ar: ['طحين', 'شوكولاتة', 'بيض', 'سكر', 'زبدة']
    },
    allergens: {
      en: ['Gluten', 'Eggs', 'Milk'],
      ar: ['جلوتين', 'بيض', 'حليب']
    },
    nutritionalInfo: {
      calories: 350,
      protein: 6,
      carbs: 45,
      fat: 18
    },
    isAvailable: true,
    isFeatured: true,
    tags: ['chocolate', 'cake', 'dessert']
  },
  {
    name: {
      en: 'Croissant',
      ar: 'كرواسون'
    },
    description: {
      en: 'Buttery and flaky French pastry',
      ar: 'معجنات فرنسية زبدية ومقرمشة'
    },
    category: {
      en: 'Snacks',
      ar: 'وجبات خفيفة'
    },
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isDiscounted: false,
    discountPercentage: 0,
    ingredients: {
      en: ['Flour', 'Butter', 'Yeast', 'Salt', 'Sugar'],
      ar: ['طحين', 'زبدة', 'خميرة', 'ملح', 'سكر']
    },
    allergens: {
      en: ['Gluten', 'Milk'],
      ar: ['جلوتين', 'حليب']
    },
    nutritionalInfo: {
      calories: 280,
      protein: 5,
      carbs: 30,
      fat: 15
    },
    isAvailable: true,
    isFeatured: false,
    tags: ['croissant', 'pastry', 'french']
  },
  {
    name: {
      en: 'Fresh Orange Juice',
      ar: 'عصير برتقال طازج'
    },
    description: {
      en: 'Freshly squeezed orange juice',
      ar: 'عصير برتقال طازج معصور'
    },
    category: {
      en: 'Beverages',
      ar: 'مشروبات'
    },
    price: 20.00,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isDiscounted: false,
    discountPercentage: 0,
    ingredients: {
      en: ['Fresh Oranges'],
      ar: ['برتقال طازج']
    },
    allergens: {
      en: [],
      ar: []
    },
    nutritionalInfo: {
      calories: 110,
      protein: 2,
      carbs: 26,
      fat: 0
    },
    isAvailable: true,
    isFeatured: false,
    tags: ['orange juice', 'fresh', 'healthy']
  }
];

const sampleGalleryItems = [
  {
    title: {
      en: 'Cozy Interior',
      ar: 'داخلية دافئة'
    },
    description: {
      en: 'Our comfortable seating area with warm lighting',
      ar: 'منطقة الجلوس المريحة مع إضاءة دافئة'
    },
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: {
      en: 'Interior',
      ar: 'داخلي'
    },
    isActive: true,
    order: 1
  },
  {
    title: {
      en: 'Outdoor Seating',
      ar: 'جلوس خارجي'
    },
    description: {
      en: 'Enjoy coffee in the fresh air',
      ar: 'استمتع بالقهوة في الهواء الطلق'
    },
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: {
      en: 'Exterior',
      ar: 'خارجي'
    },
    isActive: true,
    order: 2
  },
  {
    title: {
      en: 'Barista Station',
      ar: 'محطة الباريستا'
    },
    description: {
      en: 'Watch our expert baristas at work',
      ar: 'شاهد خبراء الباريستا في العمل'
    },
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: {
      en: 'Interior',
      ar: 'داخلي'
    },
    isActive: true,
    order: 3
  },
  {
    title: {
      en: 'Premium Coffee',
      ar: 'قهوة مميزة'
    },
    description: {
      en: 'Our signature coffee blends',
      ar: 'خلطات القهوة المميزة'
    },
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: {
      en: 'Drinks',
      ar: 'مشروبات'
    },
    isActive: true,
    order: 4
  },
  {
    title: {
      en: 'Delicious Desserts',
      ar: 'حلويات لذيذة'
    },
    description: {
      en: 'Freshly baked pastries and cakes',
      ar: 'معجنات وكيك طازج'
    },
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: {
      en: 'Food',
      ar: 'طعام'
    },
    isActive: true,
    order: 5
  },
  {
    title: {
      en: 'Garden View',
      ar: 'إطلالة على الحديقة'
    },
    description: {
      en: 'Peaceful garden seating area',
      ar: 'منطقة جلوس هادئة في الحديقة'
    },
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: {
      en: 'Exterior',
      ar: 'خارجي'
    },
    isActive: true,
    order: 6
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-shop');
    console.log('Connected to MongoDB');

    // Clear existing data
    await MenuItem.deleteMany({});
    await GalleryItem.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample menu items
    const menuItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`Inserted ${menuItems.length} menu items`);

    // Insert sample gallery items
    const galleryItems = await GalleryItem.insertMany(sampleGalleryItems);
    console.log(`Inserted ${galleryItems.length} gallery items`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();