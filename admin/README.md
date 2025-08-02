# Coffee Shop Admin Panel

A modern, secure admin panel for managing the coffee shop website content and operations.

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control
- 👥 **User Management** - Create, edit, and manage admin users with different roles
- ☕ **Menu Management** - Full CRUD operations for menu items with bilingual support
- 🖼️ **Gallery Management** - Manage gallery images with categories and ordering
- 📊 **Dashboard** - Overview statistics and quick actions
- 🔒 **Role-Based Access** - Admin, Manager, and Editor roles with different permissions
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations

## Tech Stack

- **Frontend**: React 18, TypeScript, React Router, React Query
- **UI Components**: Custom CSS with modern design system
- **Icons**: Lucide React
- **Forms**: React Hook Form with validation
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios with interceptors

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MongoDB database
- Coffee Shop Backend API running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The admin panel will be available at `http://localhost:3001`

### Default Login

- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@coffeeshop.com`

⚠️ **Important**: Change the default password after first login for security.

## User Roles

### Admin
- Full access to all features
- Can manage other admin users
- Can perform all CRUD operations
- Can view system statistics

### Manager
- Can manage menu and gallery items
- Can view reports and statistics
- Cannot manage other admin users
- Can perform bulk operations

### Editor
- Can create and edit menu/gallery items
- Cannot delete items
- Cannot manage other users
- Limited access to system features

## Features Overview

### Dashboard
- Overview statistics (total items, categories, etc.)
- Quick action buttons
- Recent activity feed
- Category breakdown charts

### Menu Management
- Create, edit, and delete menu items
- Bilingual support (English/Arabic)
- Category management
- Pricing and discount management
- Nutritional information
- Bulk operations (delete, toggle availability)
- Search and filtering
- Pagination

### Gallery Management
- Upload and manage gallery images
- Category organization
- Image ordering
- Bulk operations
- Search and filtering
- Responsive grid layout

### Admin Management
- Create and manage admin users
- Role assignment
- Account status management
- Last login tracking
- Security features

### Profile Management
- Update personal information
- Change password
- View account summary
- Security tips

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt password hashing
- **Rate Limiting** - Protection against brute force attacks
- **Account Locking** - Automatic account lockout after failed attempts
- **Role-Based Access** - Granular permission system
- **Input Validation** - Server-side and client-side validation
- **CSRF Protection** - Built-in CSRF protection
- **Secure Headers** - Security headers implementation

## API Integration

The admin panel communicates with the backend API through:

- **Authentication**: `/api/admin/login`, `/api/admin/logout`
- **Menu Management**: `/api/admin/menu/*`
- **Gallery Management**: `/api/admin/gallery/*`
- **User Management**: `/api/admin/admins/*`
- **Profile Management**: `/api/admin/profile/*`

## Development

### Project Structure

```
admin/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── App.tsx           # Main app component
│   └── index.tsx         # Entry point
├── package.json
└── README.md
```

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Environment Variables

Create a `.env` file in the admin directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `build` folder to your web server

3. Ensure the backend API is accessible from the deployed domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Coffee Shop Website and follows the same license terms.