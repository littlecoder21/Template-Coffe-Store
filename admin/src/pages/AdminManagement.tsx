import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { authAPI } from '../services/api';
import { Plus, Edit, Trash2, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminModal from '../components/AdminModal';
import { useAuth } from '../contexts/AuthContext';

const AdminManagement: React.FC = () => {
  const { admin: currentAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  
  const queryClient = useQueryClient();

  // Fetch admins
  const { data: adminsData, isLoading } = useQuery('admins', authAPI.getAdmins);

  // Mutations
  const deleteMutation = useMutation(authAPI.deleteAdmin, {
    onSuccess: () => {
      queryClient.invalidateQueries(['admins']);
      toast.success('Admin deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete admin');
    }
  });

  const handleEdit = (admin: any) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (id === currentAdmin?.id) {
      toast.error('Cannot delete your own account');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this admin?')) {
      deleteMutation.mutate(id);
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

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 'badge-success' : 'badge-error';
  };

  const admins = adminsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600">Manage admin users and permissions</p>
        </div>
        <button
          onClick={() => {
            setEditingAdmin(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Admin
        </button>
      </div>

      {/* Admins Table */}
      <div className="card">
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="loading mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading admins...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin: any) => (
                    <tr key={admin._id}>
                      <td>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {admin.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {admin.firstName} {admin.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-sm text-gray-900">{admin.username}</span>
                      </td>
                      <td>
                        <span className="text-sm text-gray-900">{admin.email}</span>
                      </td>
                      <td>
                        <span className={`badge ${getRoleBadge(admin.role)} capitalize`}>
                          {admin.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(admin.isActive)}`}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-gray-500">
                          {admin.lastLogin 
                            ? new Date(admin.lastLogin).toLocaleDateString()
                            : 'Never'
                          }
                        </span>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(admin)}
                            className="btn btn-outline btn-sm"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          {admin._id !== currentAdmin?.id && (
                            <button
                              onClick={() => handleDelete(admin._id)}
                              className="btn btn-danger btn-sm"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Role Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Admin</h3>
            </div>
          </div>
          <div className="card-body">
            <p className="text-sm text-gray-600">
              Full access to all features including admin management, menu management, 
              gallery management, and system settings.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Manager</h3>
            </div>
          </div>
          <div className="card-body">
            <p className="text-sm text-gray-600">
              Can manage menu items, gallery items, and view reports. 
              Cannot manage other admin users.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Editor</h3>
            </div>
          </div>
          <div className="card-body">
            <p className="text-sm text-gray-600">
              Can create and edit menu items and gallery items. 
              Cannot delete items or manage other users.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAdmin(null);
        }}
        admin={editingAdmin}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingAdmin(null);
          queryClient.invalidateQueries(['admins']);
        }}
      />
    </div>
  );
};

export default AdminManagement;