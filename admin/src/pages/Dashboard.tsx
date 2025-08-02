import React from 'react';
import { useQuery } from 'react-query';
import { menuAPI, galleryAPI } from '../services/api';
import {
  Coffee,
  Image,
  TrendingUp,
  Users,
  DollarSign,
  Star
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: menuStats } = useQuery('menuStats', menuAPI.getStats);
  const { data: galleryStats } = useQuery('galleryStats', galleryAPI.getStats);

  const stats = [
    {
      name: 'Total Menu Items',
      value: menuStats?.data?.totalItems || 0,
      icon: Coffee,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Available Items',
      value: menuStats?.data?.availableItems || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      name: 'Featured Items',
      value: menuStats?.data?.featuredItems || 0,
      icon: Star,
      color: 'bg-yellow-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Gallery Items',
      value: galleryStats?.data?.totalItems || 0,
      icon: Image,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your coffee shop management dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Menu Categories Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Menu Categories</h3>
          </div>
          <div className="card-body">
            {menuStats?.data?.categoryStats?.length > 0 ? (
              <div className="space-y-3">
                {menuStats.data.categoryStats.map((category: any) => (
                  <div key={category._id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{category._id}</span>
                    <span className="text-sm text-gray-500">{category.count} items</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No category data available</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Gallery Categories</h3>
          </div>
          <div className="card-body">
            {galleryStats?.data?.categoryStats?.length > 0 ? (
              <div className="space-y-3">
                {galleryStats.data.categoryStats.map((category: any) => (
                  <div key={category._id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{category._id}</span>
                    <span className="text-sm text-gray-500">{category.count} items</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No category data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="btn btn-primary">
              <Coffee size={16} />
              Add Menu Item
            </button>
            <button className="btn btn-secondary">
              <Image size={16} />
              Add Gallery Item
            </button>
            <button className="btn btn-outline">
              <Users size={16} />
              Manage Admins
            </button>
            <button className="btn btn-outline">
              <DollarSign size={16} />
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Coffee size={16} className="text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New menu item added</p>
                <p className="text-sm text-gray-500">Cappuccino was added to the menu</p>
              </div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Image size={16} className="text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Gallery updated</p>
                <p className="text-sm text-gray-500">New coffee shop interior photos added</p>
              </div>
              <div className="text-sm text-gray-500">4 hours ago</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star size={16} className="text-yellow-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Featured item updated</p>
                <p className="text-sm text-gray-500">Espresso marked as featured</p>
              </div>
              <div className="text-sm text-gray-500">1 day ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;