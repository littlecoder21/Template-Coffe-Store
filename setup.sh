#!/bin/bash

echo "🚀 Setting up Coffee Shop Website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your MongoDB connection string."
fi

# Go back to root
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install

# Go back to root
cd ..

echo "✅ All dependencies installed successfully!"

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Edit server/.env with your MongoDB connection string"
echo "2. Run 'cd server && node seed.js' to populate the database"
echo "3. Run 'npm run dev' to start the development servers"
echo ""
echo "🌐 The website will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"