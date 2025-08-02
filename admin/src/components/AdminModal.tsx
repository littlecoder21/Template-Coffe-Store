import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { authAPI } from '../services/api';
import { X, Save, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin?: any;
  onSuccess: () => void;
}

interface AdminForm {
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  admin,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AdminForm>();

  useEffect(() => {
    if (admin) {
      reset({
        username: admin.username,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        isActive: admin.isActive
      });
    } else {
      reset({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'editor',
        isActive: true
      });
    }
  }, [admin, reset]);

  const createMutation = useMutation(authAPI.createAdmin, {
    onSuccess: () => {
      toast.success('Admin created successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    }
  });

  const updateMutation = useMutation(
    (data: AdminForm) => authAPI.updateAdmin(admin._id, data),
    {
      onSuccess: () => {
        toast.success('Admin updated successfully');
        onSuccess();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update admin');
      }
    }
  );

  const onSubmit = async (data: AdminForm) => {
    setIsLoading(true);
    try {
      if (admin) {
        // Remove password if not provided for updates
        if (!data.password) {
          delete data.password;
        }
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
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {admin ? 'Edit Admin' : 'Add New Admin'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name</label>
                  <input
                    {...register('firstName', { required: 'First name is required' })}
                    className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Last Name</label>
                  <input
                    {...register('lastName', { required: 'Last name is required' })}
                    className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Username</label>
                <input
                  {...register('username', { required: 'Username is required' })}
                  className={`form-input ${errors.username ? 'border-red-500' : ''}`}
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {!admin && (
                <div>
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              )}

              {admin && (
                <div>
                  <label className="form-label">New Password (optional)</label>
                  <input
                    type="password"
                    {...register('password', {
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter new password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              )}

              <div>
                <label className="form-label">Role</label>
                <select
                  {...register('role', { required: 'Role is required' })}
                  className={`form-input form-select ${errors.role ? 'border-red-500' : ''}`}
                >
                  <option value="editor">Editor</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="rounded border-gray-300"
                />
                <label className="form-label mb-0">Active</label>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
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
                      {admin ? 'Update' : 'Create'}
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

export default AdminModal;