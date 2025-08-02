import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { menuAPI } from '../services/api';
import { X, Save, Coffee } from 'lucide-react';
import toast from 'react-hot-toast';

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
  onSuccess: () => void;
}

interface MenuItemForm {
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  category: {
    en: string;
    ar: string;
  };
  price: number;
  originalPrice?: number;
  image: string;
  isDiscounted: boolean;
  discountPercentage: number;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  isAvailable: boolean;
  isFeatured: boolean;
  tags: string[];
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<MenuItemForm>();

  const isDiscounted = watch('isDiscounted');

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        isDiscounted: item.isDiscounted,
        discountPercentage: item.discountPercentage,
        ingredients: item.ingredients || [],
        allergens: item.allergens || [],
        nutritionalInfo: item.nutritionalInfo || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        },
        isAvailable: item.isAvailable,
        isFeatured: item.isFeatured,
        tags: item.tags || []
      });
    } else {
      reset({
        name: { en: '', ar: '' },
        description: { en: '', ar: '' },
        category: { en: '', ar: '' },
        price: 0,
        originalPrice: 0,
        image: '',
        isDiscounted: false,
        discountPercentage: 0,
        ingredients: [],
        allergens: [],
        nutritionalInfo: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        },
        isAvailable: true,
        isFeatured: false,
        tags: []
      });
    }
  }, [item, reset]);

  const createMutation = useMutation(menuAPI.create, {
    onSuccess: () => {
      toast.success('Menu item created successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create menu item');
    }
  });

  const updateMutation = useMutation(
    (data: MenuItemForm) => menuAPI.update(item._id, data),
    {
      onSuccess: () => {
        toast.success('Menu item updated successfully');
        onSuccess();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update menu item');
      }
    }
  );

  const onSubmit = async (data: MenuItemForm) => {
    setIsLoading(true);
    try {
      if (item) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {item ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Name (English)</label>
                  <input
                    {...register('name.en', { required: 'English name is required' })}
                    className={`form-input ${errors.name?.en ? 'border-red-500' : ''}`}
                    placeholder="Enter English name"
                  />
                  {errors.name?.en && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.en.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Name (Arabic)</label>
                  <input
                    {...register('name.ar', { required: 'Arabic name is required' })}
                    className={`form-input ${errors.name?.ar ? 'border-red-500' : ''}`}
                    placeholder="Enter Arabic name"
                  />
                  {errors.name?.ar && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.ar.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Description (English)</label>
                  <textarea
                    {...register('description.en', { required: 'English description is required' })}
                    className={`form-input form-textarea ${errors.description?.en ? 'border-red-500' : ''}`}
                    placeholder="Enter English description"
                  />
                  {errors.description?.en && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.en.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Description (Arabic)</label>
                  <textarea
                    {...register('description.ar', { required: 'Arabic description is required' })}
                    className={`form-input form-textarea ${errors.description?.ar ? 'border-red-500' : ''}`}
                    placeholder="Enter Arabic description"
                  />
                  {errors.description?.ar && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.ar.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category (English)</label>
                  <input
                    {...register('category.en', { required: 'English category is required' })}
                    className={`form-input ${errors.category?.en ? 'border-red-500' : ''}`}
                    placeholder="e.g., Coffee, Tea, Dessert"
                  />
                  {errors.category?.en && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.en.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Category (Arabic)</label>
                  <input
                    {...register('category.ar', { required: 'Arabic category is required' })}
                    className={`form-input ${errors.category?.ar ? 'border-red-500' : ''}`}
                    placeholder="e.g., قهوة، شاي، حلويات"
                  />
                  {errors.category?.ar && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.ar.message}</p>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                    className={`form-input ${errors.price ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('originalPrice')}
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('isDiscounted')}
                    className="rounded border-gray-300"
                  />
                  <label className="form-label mb-0">Discounted</label>
                </div>
              </div>

              {isDiscounted && (
                <div>
                  <label className="form-label">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    {...register('discountPercentage')}
                    className="form-input"
                    placeholder="0"
                  />
                </div>
              )}

              {/* Image */}
              <div>
                <label className="form-label">Image URL</label>
                <input
                  {...register('image')}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('isAvailable')}
                    className="rounded border-gray-300"
                  />
                  <label className="form-label mb-0">Available</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="rounded border-gray-300"
                  />
                  <label className="form-label mb-0">Featured</label>
                </div>
              </div>

              {/* Nutritional Information */}
              <div className="card">
                <div className="card-header">
                  <h4 className="text-md font-medium">Nutritional Information</h4>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="form-label">Calories</label>
                      <input
                        type="number"
                        {...register('nutritionalInfo.calories')}
                        className="form-input"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="form-label">Protein (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        {...register('nutritionalInfo.protein')}
                        className="form-input"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="form-label">Carbs (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        {...register('nutritionalInfo.carbs')}
                        className="form-input"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="form-label">Fat (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        {...register('nutritionalInfo.fat')}
                        className="form-input"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  {isLoading ? (
                    <>
                      <div className="loading"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {item ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;