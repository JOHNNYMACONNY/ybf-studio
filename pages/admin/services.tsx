import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../components/AdminLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  original_price?: number;
  features: string[];
  turnaround_time: string;
  category: string;
  status: string;
  featured_image?: string;
  before_audio_url?: string;
  after_audio_url?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface ServiceFormData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  original_price: string;
  features: string[];
  turnaround_time: string;
  category: string;
  status: string;
  featured_image: string;
  before_audio_url: string;
  after_audio_url: string;
  sort_order: string;
}

const ServicesAdmin: React.FC = () => {
  const { data: session } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    original_price: '',
    features: [],
    turnaround_time: '',
    category: 'mixing',
    status: 'active',
    featured_image: '',
    before_audio_url: '',
    after_audio_url: '',
    sort_order: '0'
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const fetchServices = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category', categoryFilter);

      const response = await fetch(`/api/admin/services?${params}`);
      const data = await response.json();

      if (response.ok) {
        setServices(data.services);
        setTotalPages(data.pagination.totalPages);
      } else {
        setToast({ message: 'Failed to fetch services', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setToast({ message: 'Error fetching services', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, categoryFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingService 
        ? `/api/admin/services?id=${editingService.id}`
        : '/api/admin/services';
      
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          sort_order: parseInt(formData.sort_order)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ 
          message: editingService ? 'Service updated successfully' : 'Service created successfully', 
          type: 'success' 
        });
        setShowModal(false);
        resetForm();
        fetchServices();
      } else {
        setToast({ message: data.error || 'Failed to save service', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving service:', error);
      setToast({ message: 'Error saving service', type: 'error' });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description || '',
      short_description: service.short_description || '',
      price: service.price.toString(),
      original_price: service.original_price?.toString() || '',
      features: service.features || [],
      turnaround_time: service.turnaround_time || '',
      category: service.category,
      status: service.status,
      featured_image: service.featured_image || '',
      before_audio_url: service.before_audio_url || '',
      after_audio_url: service.after_audio_url || '',
      sort_order: service.sort_order.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deletingService) return;

    try {
      const response = await fetch(`/api/admin/services?id=${deletingService.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setToast({ message: 'Service deleted successfully', type: 'success' });
        setShowDeleteModal(false);
        setDeletingService(null);
        fetchServices();
      } else {
        const data = await response.json();
        setToast({ message: data.error || 'Failed to delete service', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      setToast({ message: 'Error deleting service', type: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      short_description: '',
      price: '',
      original_price: '',
      features: [],
      turnaround_time: '',
      category: 'mixing',
      status: 'active',
      featured_image: '',
      before_audio_url: '',
      after_audio_url: '',
      sort_order: '0'
    });
    setEditingService(null);
    setNewFeature('');
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Service Management</h1>
            <p className="text-neutral-400">Manage your audio services and packages</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-neutral-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="mixing">Mixing</option>
              <option value="mastering">Mastering</option>
              <option value="bundles">Bundles</option>
            </select>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-neutral-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-neutral-400">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="p-8 text-center text-neutral-400">No services found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-neutral-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{service.name}</div>
                          <div className="text-sm text-neutral-400">{service.short_description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-neutral-300 capitalize">{service.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{formatPrice(service.price)}</div>
                        {service.original_price && (
                          <div className="text-sm text-neutral-400 line-through">
                            {formatPrice(service.original_price)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(service.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {new Date(service.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(service)}
                            className="text-neutral-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeletingService(service);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-neutral-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Service Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Short Description</label>
            <input
              type="text"
              value={formData.short_description}
              onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Original Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              >
                <option value="mixing">Mixing</option>
                <option value="mastering">Mastering</option>
                <option value="bundles">Bundles</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Turnaround Time</label>
            <input
              type="text"
              value={formData.turnaround_time}
              onChange={(e) => setFormData(prev => ({ ...prev, turnaround_time: e.target.value }))}
              placeholder="e.g., 3-5 business days"
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Features</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature..."
                  className="flex-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="space-y-1">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between bg-neutral-700 px-3 py-2 rounded-md">
                    <span className="text-white">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Featured Image URL</label>
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Before Audio URL</label>
              <input
                type="url"
                value={formData.before_audio_url}
                onChange={(e) => setFormData(prev => ({ ...prev, before_audio_url: e.target.value }))}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">After Audio URL</label>
            <input
              type="url"
              value={formData.after_audio_url}
              onChange={(e) => setFormData(prev => ({ ...prev, after_audio_url: e.target.value }))}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingService(null);
        }}
        title="Delete Service"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-neutral-300">
            Are you sure you want to delete &quot;{deletingService?.name}&quot;? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingService(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Service
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AdminLayout>
  );
};

export default ServicesAdmin; 