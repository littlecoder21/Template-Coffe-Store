import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { menuAPI } from '../services/api';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import MenuItemModal from '../components/MenuItemModal';

const MenuManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const queryClient = useQueryClient();

  // Fetch menu items
  const { data: menuData, isLoading } = useQuery(
    ['menu', currentPage, searchTerm, selectedCategory],
    () => menuAPI.getAll({
      page: currentPage,
      limit: 10,
      search: searchTerm,
      category: selectedCategory
    })
  );

  // Fetch categories
  const { data: categories } = useQuery('menuCategories', menuAPI.getCategories);

  // Mutations
  const deleteMutation = useMutation(menuAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(['menu']);
      toast.success('Menu item deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete menu item');
    }
  });

  const bulkDeleteMutation = useMutation(
    (ids: string[]) => menuAPI.bulkOperation({ action: 'delete', ids }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['menu']);
        setSelectedItems([]);
        toast.success('Selected items deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete selected items');
      }
    }
  );

  const toggleAvailabilityMutation = useMutation(
    (ids: string[]) => menuAPI.bulkOperation({ action: 'toggle-availability', ids }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['menu']);
        setSelectedItems([]);
        toast.success('Availability updated successfully');
      },
      onError: () => {
        toast.error('Failed to update availability');
      }
    }
  );

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to delete');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      bulkDeleteMutation.mutate(selectedItems);
    }
  };

  const handleToggleAvailability = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to update');
      return;
    }
    toggleAvailabilityMutation.mutate(selectedItems);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === menuData?.data?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(menuData?.data?.map((item: any) => item._id) || []);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const menuItems = menuData?.data || [];
  const totalPages = menuData?.pagination?.pages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage your coffee shop menu items</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Menu Item
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="form-label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input form-select"
              >
                <option value="">All Categories</option>
                {categories?.data?.map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setCurrentPage(1);
                }}
                className="btn btn-outline w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedItems.length} item(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleToggleAvailability}
                  className="btn btn-outline btn-sm"
                >
                  Toggle Availability
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="btn btn-danger btn-sm"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items Table */}
      <div className="card">
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="loading mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading menu items...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={selectedItems.length === menuItems.length && menuItems.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item: any) => (
                      <tr key={item._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => handleSelectItem(item._id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name.en}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                        </td>
                        <td>
                          <div>
                            <p className="font-medium text-gray-900">{item.name.en}</p>
                            <p className="text-sm text-gray-500">{item.name.ar}</p>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-info">{item.category.en}</span>
                        </td>
                        <td>
                          <div>
                            <p className="font-medium">${item.price}</p>
                            {item.isDiscounted && (
                              <p className="text-sm text-red-600 line-through">
                                ${item.originalPrice}
                              </p>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            item.isAvailable ? 'badge-success' : 'badge-error'
                          }`}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            item.isFeatured ? 'badge-warning' : 'badge-info'
                          }`}>
                            {item.isFeatured ? 'Featured' : 'Regular'}
                          </span>
                        </td>
                        <td>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="btn btn-outline btn-sm"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="btn btn-danger btn-sm"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="btn btn-outline btn-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="btn btn-outline btn-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Menu Item Modal */}
      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          queryClient.invalidateQueries(['menu']);
        }}
      />
    </div>
  );
};

export default MenuManagement;