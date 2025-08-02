import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { User, Shield, Calendar, Mail, Key } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { admin, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors }
  } = useForm<ProfileForm>();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors }
  } = useForm<PasswordForm>();

  const newPassword = watch('newPassword');

  React.useEffect(() => {
    if (admin) {
      resetProfile({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email
      });
    }
  }, [admin, resetProfile]);

  const updateProfileMutation = useMutation(
    (data: ProfileForm) => authAPI.updateProfile(data),
    {
      onSuccess: () => {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    }
  );

  const changePasswordMutation = useMutation(
    (data: { currentPassword: string; newPassword: string }) => 
      authAPI.changePassword(data),
    {
      onSuccess: () => {
        toast.success('Password changed successfully');
        setShowPasswordForm(false);
        resetPassword();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to change password');
      }
    }
  );

  const onProfileSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      await updateProfileMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'badge-error',
      manager: 'badge-warning',
      editor: 'badge-info'
    };
    return badges[role as keyof typeof badges] || 'badge-info';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline btn-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              {isEditing ? (
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">First Name</label>
                      <input
                        {...registerProfile('firstName', { required: 'First name is required' })}
                        className={`form-input ${profileErrors.firstName ? 'border-red-500' : ''}`}
                        placeholder="Enter first name"
                      />
                      {profileErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="form-label">Last Name</label>
                      <input
                        {...registerProfile('lastName', { required: 'Last name is required' })}
                        className={`form-input ${profileErrors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Enter last name"
                      />
                      {profileErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      {...registerProfile('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className={`form-input ${profileErrors.email ? 'border-red-500' : ''}`}
                      placeholder="Enter email"
                    />
                    {profileErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        resetProfile({
                          firstName: admin?.firstName || '',
                          lastName: admin?.lastName || '',
                          email: admin?.email || ''
                        });
                      }}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">First Name</label>
                      <p className="text-gray-900">{admin?.firstName}</p>
                    </div>
                    <div>
                      <label className="form-label">Last Name</label>
                      <p className="text-gray-900">{admin?.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <p className="text-gray-900">{admin?.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change Password */}
          <div className="card mt-6">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="btn btn-outline btn-sm"
                  >
                    Change Password
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              {showPasswordForm ? (
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                  <div>
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      {...registerPassword('currentPassword', { required: 'Current password is required' })}
                      className={`form-input ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                      placeholder="Enter current password"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      {...registerPassword('newPassword', { 
                        required: 'New password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      className={`form-input ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                      placeholder="Enter new password"
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      {...registerPassword('confirmPassword', { 
                        required: 'Please confirm your password',
                        validate: value => value === newPassword || 'Passwords do not match'
                      })}
                      className={`form-input ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="Confirm new password"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        resetPassword();
                      }}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary"
                    >
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-600">Click "Change Password" to update your password.</p>
              )}
            </div>
          </div>
        </div>

        {/* Account Summary */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Account Summary</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{admin?.fullName}</p>
                    <p className="text-sm text-gray-500">{admin?.username}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Role:</span>
                    <span className={`badge ${getRoleBadge(admin?.role)} capitalize`}>
                      {admin?.role}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm text-gray-900">{admin?.email}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Member since:</span>
                    <span className="text-sm text-gray-900">
                      {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>

                  {admin?.lastLogin && (
                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Last login:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(admin.lastLogin).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Security Tips</h3>
            </div>
            <div className="card-body">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use a strong, unique password</li>
                <li>• Never share your login credentials</li>
                <li>• Log out when using shared devices</li>
                <li>• Keep your email address updated</li>
                <li>• Report any suspicious activity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;