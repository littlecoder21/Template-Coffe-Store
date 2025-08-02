# Coffee Shop Website

A modern, bilingual (English/Arabic) coffee shop website built with React, Express, and MongoDB. Features a beautiful UI with hero slider, search functionality, gallery, and comprehensive menu management.

## Features

- 🌍 **Bilingual Support**: Full English and Arabic language support with RTL layout
- 🎠 **Hero Slider**: Dynamic slider showcasing featured items and promotions
- 🔍 **Advanced Search**: Search functionality with filters for categories, price, and more
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 🖼️ **Gallery**: Showcase dining environment with category filtering
- 📋 **Menu Management**: Comprehensive menu with categories, pricing, and nutritional info
- 🎨 **Modern UI**: Beautiful, professional design with smooth animations
- ⚡ **Fast Performance**: Optimized for speed and user experience

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **React i18next** for internationalization
- **Lucide React** for icons
- **Framer Motion** for animations
- **React Slick** for carousel/slider
- **Tailwind CSS** for styling

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **CORS** for cross-origin requests
- **Multer** for file uploads (future use)

## Project Structure

```
coffee-shop-website/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── contexts/      # React contexts
│   │   ├── types/         # TypeScript types
│   │   └── i18n/         # Internationalization
│   └── package.json
├── server/                # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── seed.js          # Database seeding
│   └── package.json
└── package.json          # Root package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coffee-shop-website
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cd ../server
   cp .env.example .env
   
   # Edit .env with your MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/coffee-shop
   ```

4. **Seed the database**
   ```bash
   cd server
   node seed.js
   ```

5. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Available Scripts

#### Root Directory
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend client
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install dependencies for all packages

#### Server Directory
- `npm run dev` - Start server with nodemon (development)
- `npm start` - Start server in production mode
- `node seed.js` - Seed the database with sample data

#### Client Directory
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## API Endpoints

### Menu Items
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get items by category
- `GET /api/menu/discounted` - Get discounted items
- `GET /api/menu/featured` - Get featured items
- `GET /api/menu/:id` - Get specific menu item
- `GET /api/menu/categories/all` - Get all categories

### Gallery
- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery/category/:category` - Get items by category
- `GET /api/gallery/:id` - Get specific gallery item
- `GET /api/gallery/categories/all` - Get all categories

### Search
- `GET /api/search` - Search menu items
- `GET /api/search/advanced` - Advanced search with filters
- `GET /api/search/suggestions` - Get search suggestions

## Features in Detail

### Bilingual Support
- Automatic language detection
- RTL layout for Arabic
- Complete translations for all content
- Language switching with persistent storage

### Hero Slider
- Auto-playing slider with discount items
- Smooth transitions and animations
- Call-to-action buttons
- Responsive design

### Search Functionality
- Real-time search with debouncing
- Category filtering
- Price range filtering
- Discount and featured item filters
- Search suggestions

### Menu System
- Categorized menu items
- Detailed item information
- Nutritional information
- Allergen warnings
- Pricing with discounts
- Image galleries

### Gallery
- Category-based filtering
- Lightbox modal for image viewing
- Responsive grid layout
- Image optimization

## Customization

### Adding New Menu Items
1. Use the seed script as a template
2. Add items to the database via API or seed file
3. Images should be hosted externally or in the uploads folder

### Modifying Styles
- Edit CSS variables in `client/src/index.css`
- Modify Tailwind classes in components
- Update color scheme in CSS variables

### Adding New Languages
1. Add translations to `client/src/i18n/index.ts`
2. Update the language detection logic
3. Test RTL layout for new languages

## Deployment

### Frontend (React)
```bash
cd client
npm run build
# Deploy the build folder to your hosting service
```

### Backend (Express)
```bash
cd server
npm start
# Deploy to your preferred hosting service (Heroku, Vercel, etc.)
```

### Environment Variables for Production
- `MONGODB_URI` - Your production MongoDB connection string
- `PORT` - Port for the server (usually set by hosting service)
- `NODE_ENV` - Set to 'production'

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**Note**: This is a demonstration project. For production use, consider adding:
- User authentication
- Admin panel for content management
- Payment processing
- Order management system
- Real-time notifications
- Analytics and tracking