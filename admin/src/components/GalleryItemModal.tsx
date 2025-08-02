import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { galleryAPI } from '../services/api';
import { X, Save, Image } from 'lucide-react';
import toast from 'react-hot-toast';

interface GalleryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
  onSuccess: () => void;
}

interface GalleryItemForm {
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  image: string;
  category: {
    en: string;
    ar: string;
  };
  isActive: boolean;
  order: number;
}

const GalleryItemModal: React.FC<GalleryItemModalProps> = ({
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
    formState: { errors }
  } = useForm<GalleryItemForm>();

  useEffect(() => {
    if (item) {
      reset({
        title: item.title,
        description: item.description,
        image: item.image,
        category: item.category,
        isActive: item.isActive,
        order: item.order || 0
      });
    } else {
      reset({
        title: { en: '', ar: '' },
        description: { en: '', ar: '' },
        image: '',
        category: { en: '', ar: '' },
        isActive: true,
        order: 0
      });
    }
  }, [item, reset]);

  const createMutation = useMutation(galleryAPI.create, {
    onSuccess: () => {
      toast.success('Gallery item created successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create gallery item');
    }
  });

  const updateMutation = useMutation(
    (data: GalleryItemForm) => galleryAPI.update(item._id, data),
    {
      onSuccess: () => {
        toast.success('Gallery item updated successfully');
        onSuccess();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update gallery item');
      }
    }
  );

  const onSubmit = async (data: GalleryItemForm) => {
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
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {item ? 'Edit Gallery Item' : 'Add New Gallery Item'}
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
                  <label className="form-label">Title (English)</label>
                  <input
                    {...register('title.en', { required: 'English title is required' })}
                    className={`form-input ${errors.title?.en ? 'border-red-500' : ''}`}
                    placeholder="Enter English title"
                  />
                  {errors.title?.en && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.en.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Title (Arabic)</label>
                  <input
                    {...register('title.ar', { required: 'Arabic title is required' })}
                    className={`form-input ${errors.title?.ar ? 'border-red-500' : ''}`}
                    placeholder="Enter Arabic title"
                  />
                  {errors.title?.ar && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.ar.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Description (English)</label>
                  <textarea
                    {...register('description.en')}
                    className="form-input form-textarea"
                    placeholder="Enter English description (optional)"
                  />
                </div>
                
                <div>
                  <label className="form-label">Description (Arabic)</label>
                  <textarea
                    {...register('description.ar')}
                    className="form-input form-textarea"
                    placeholder="Enter Arabic description (optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category (English)</label>
                  <input
                    {...register('category.en', { required: 'English category is required' })}
                    className={`form-input ${errors.category?.en ? 'border-red-500' : ''}`}
                    placeholder="e.g., Interior, Food, Events"
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
                    placeholder="e.g., داخلية، طعام، أحداث"
                  />
                  {errors.category?.ar && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.ar.message}</p>
                  )}
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="form-label">Image URL</label>
                <input
                  {...register('image', { required: 'Image URL is required' })}
                  className={`form-input ${errors.image ? 'border-red-500' : ''}`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                )}
              </div>

              {/* Order */}
              <div>
                <label className="form-label">Display Order</label>
                <input
                  type="number"
                  {...register('order', { valueAsNumber: true })}
                  className="form-input"
                  placeholder="0"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Lower numbers appear first in the gallery
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="rounded border-gray-300"
                />
                <label className="form-label mb-0">Active</label>
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

export default GalleryItemModal;