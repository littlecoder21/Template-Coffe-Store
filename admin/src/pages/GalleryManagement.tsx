import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { galleryAPI } from '../services/api';
import { Plus, Search, Edit, Trash2, Eye, Move } from 'lucide-react';
import toast from 'react-hot-toast';
import GalleryItemModal from '../components/GalleryItemModal';

const GalleryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const queryClient = useQueryClient();

  // Fetch gallery items
  const { data: galleryData, isLoading } = useQuery(
    ['gallery', currentPage, searchTerm, selectedCategory],
    () => galleryAPI.getAll({
      page: currentPage,
      limit: 12,
      search: searchTerm,
      category: selectedCategory
    })
  );

  // Fetch categories
  const { data: categories } = useQuery('galleryCategories', galleryAPI.getCategories);

  // Mutations
  const deleteMutation = useMutation(galleryAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(['gallery']);
      toast.success('Gallery item deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete gallery item');
    }
  });

  const bulkDeleteMutation = useMutation(
    (ids: string[]) => galleryAPI.bulkOperation({ action: 'delete', ids }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['gallery']);
        setSelectedItems([]);
        toast.success('Selected items deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete selected items');
      }
    }
  );

  const toggleActiveMutation = useMutation(
    (ids: string[]) => galleryAPI.bulkOperation({ action: 'toggle-active', ids }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['gallery']);
        setSelectedItems([]);
        toast.success('Status updated successfully');
      },
      onError: () => {
        toast.error('Failed to update status');
      }
    }
  );

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
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

  const handleToggleActive = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to update');
      return;
    }
    toggleActiveMutation.mutate(selectedItems);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === galleryData?.data?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(galleryData?.data?.map((item: any) => item._id) || []);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const galleryItems = galleryData?.data || [];
  const totalPages = galleryData?.pagination?.pages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600">Manage your coffee shop gallery images</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Gallery Item
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
                  placeholder="Search gallery items..."
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
                  onClick={handleToggleActive}
                  className="btn btn-outline btn-sm"
                >
                  Toggle Status
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

      {/* Gallery Grid */}
      <div className="card">
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="loading mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading gallery items...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {galleryItems.map((item: any) => (
                  <div key={item._id} className="group relative">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => handleSelectItem(item._id)}
                        className="absolute top-2 left-2 z-10 rounded border-gray-300"
                      />
                      
                      <img
                        src={item.image}
                        alt={item.title.en}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg">
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                        </div>
                      </div>
                      
                      <div className="absolute top-2 right-2">
                        <span className={`badge ${
                          item.isActive ? 'badge-success' : 'badge-error'
                        }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h3 className="font-medium text-gray-900">{item.title.en}</h3>
                      <p className="text-sm text-gray-500">{item.title.ar}</p>
                      <div className="mt-1">
                        <span className="badge badge-info">{item.category.en}</span>
                      </div>
                      {item.description?.en && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description.en}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
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

      {/* Gallery Item Modal */}
      <GalleryItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          queryClient.invalidateQueries(['gallery']);
        }}
      />
    </div>
  );
};

export default GalleryManagement;