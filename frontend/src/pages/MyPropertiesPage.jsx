import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, HomeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { useUI } from '../context/UIContext';
import PropertyCard from '../components/property/PropertyCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyPropertiesPage = () => {
  const { userData } = useAuth();
  const { properties, loading, removeProperty } = useProperties();
  const { showToast } = useUI();
  const navigate = useNavigate();

  // Normalize current user id/role from your auth shape
  const currentUserId = userData?.id || userData?.uid || userData?._id || null;
  const role = userData?.role || 'guest';

  // helper: extract owner/agent id from property regardless of field naming
  const getPropertyOwnerId = (p) =>
    p.ownerId ?? p.agent_id ?? p.agentId ?? p.userId ?? p.user_id ?? null;

  // permissions
  const isAdmin = role === 'admin';
  const isAgent = role === 'agent';
  const canCreate = isAdmin || isAgent;

  const canEditProperty = (p) => {
    if (isAdmin) return true; // admin can edit anything
    if (isAgent) {
      const owner = getPropertyOwnerId(p);
      return owner && currentUserId && String(owner) === String(currentUserId);
    }
    return false;
    // NOTE: backend only authorizes admin/agent; sellers cannot edit/delete
  };

  const canDeleteProperty = canEditProperty; // same rule as edit

  // Data to show on "My Properties":
  // - Admin sees all properties
  // - Agent sees only their own
  const myProperties = (properties || []).filter((p) => {
    if (isAdmin) return true;
    if (isAgent) {
      const owner = getPropertyOwnerId(p);
      return owner && currentUserId && String(owner) === String(currentUserId);
    }
    // other roles see none
    return false;
  });

  const handleDeleteProperty = async (propertyId) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop || !canDeleteProperty(prop)) {
      showToast('You are not allowed to delete this property.', 'error');
      return;
    }
    if (window.confirm('Are you sure you want to delete this property?')) {
      const result = await removeProperty(propertyId);
      if (result.success) {
        showToast('Property deleted successfully!', 'success');
      } else {
        showToast(result.error || 'Failed to delete property. Please try again.', 'error');
      }
    }
  };

  const handleEditProperty = (propertyId) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop || !canEditProperty(prop)) {
      showToast('You are not allowed to edit this property.', 'error');
      return;
    }
    navigate(`/dashboard/properties/edit/${propertyId}`);
  };

  useEffect(() => {
    // If you need to trigger loading user properties explicitly, do it here.
    // Your context note says properties are already loaded, so nothing here.
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <p className="mt-2 text-gray-600">Manage your property listings</p>
        </div>

        {canCreate && (
          <Link to="/dashboard/properties/add">
            <Button>
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Property
            </Button>
          </Link>
        )}
      </motion.div>

      {myProperties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12 text-center"
        >
          <div className="p-8 bg-white rounded-lg shadow-sm">
            <HomeIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No properties yet</h3>
            <p className="mb-6 text-gray-600">Start by adding your first property listing</p>
            {canCreate && (
              <Link to="/dashboard/properties/add">
                <Button>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Your First Property
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myProperties.map((property, index) => {
            const allowEdit = canEditProperty(property);
            const allowDelete = canDeleteProperty(property);

            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <PropertyCard property={property} />

                {/* Action Buttons (render only if allowed) */}
                {(allowEdit || allowDelete) && (
                  <div className="absolute flex space-x-2 top-4 right-4">
                    {allowEdit && (
                      <button
                        onClick={() => handleEditProperty(property.id)}
                        className="p-2 transition-all duration-200 rounded-full shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white"
                        title="Edit Property"
                      >
                        <PencilIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                    {allowDelete && (
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="p-2 transition-all duration-200 rounded-full shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white"
                        title="Delete Property"
                      >
                        <TrashIcon className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      property.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : property.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesPage;
