import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../components/AdminLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface FAQFormData {
  question: string;
  answer: string;
  category: string;
  sort_order: string;
  status: string;
}

const FAQAdmin: React.FC = () => {
  const { data: session } = useSession();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingFaq, setDeletingFaq] = useState<FAQ | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState<FAQFormData>({
    question: '',
    answer: '',
    category: 'general',
    sort_order: '0',
    status: 'active'
  });

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  const fetchFAQs = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/admin/faq?${params}`);
      const data = await response.json();

      if (response.ok) {
        setFaqs(data.faqs);
        setTotalPages(data.pagination.totalPages);
      } else {
        setToast({ message: 'Failed to fetch FAQs', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setToast({ message: 'Error fetching FAQs', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingFaq 
        ? `/api/admin/faq?id=${editingFaq.id}`
        : '/api/admin/faq';
      
      const method = editingFaq ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sort_order: parseInt(formData.sort_order)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ 
          message: editingFaq ? 'FAQ updated successfully' : 'FAQ created successfully', 
          type: 'success' 
        });
        setShowModal(false);
        resetForm();
        fetchFAQs();
      } else {
        setToast({ message: data.error || 'Failed to save FAQ', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      setToast({ message: 'Error saving FAQ', type: 'error' });
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sort_order: faq.sort_order.toString(),
      status: faq.status
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deletingFaq) return;

    try {
      const response = await fetch(`/api/admin/faq?id=${deletingFaq.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setToast({ message: 'FAQ deleted successfully', type: 'success' });
        setShowDeleteModal(false);
        setDeletingFaq(null);
        fetchFAQs();
      } else {
        const data = await response.json();
        setToast({ message: data.error || 'Failed to delete FAQ', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      setToast({ message: 'Error deleting FAQ', type: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      sort_order: '0',
      status: 'active'
    });
    setEditingFaq(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      general: { color: 'bg-blue-100 text-blue-800', label: 'General' },
      technical: { color: 'bg-purple-100 text-purple-800', label: 'Technical' },
      timing: { color: 'bg-orange-100 text-orange-800', label: 'Timing' },
      revisions: { color: 'bg-pink-100 text-pink-800', label: 'Revisions' }
    };
    
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.general;
    
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
            <h1 className="text-2xl font-bold text-white">FAQ Management</h1>
            <p className="text-neutral-400">Manage frequently asked questions and answers</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add FAQ
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-neutral-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="timing">Timing</option>
              <option value="revisions">Revisions</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* FAQs Table */}
        <div className="bg-neutral-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-neutral-400">Loading FAQs...</div>
          ) : faqs.length === 0 ? (
            <div className="p-8 text-center text-neutral-400">No FAQs found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Question</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Sort Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700">
                  {faqs.map((faq) => (
                    <tr key={faq.id} className="hover:bg-neutral-700/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{faq.question}</div>
                          <div className="text-sm text-neutral-400 mt-1 line-clamp-2">{faq.answer}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getCategoryBadge(faq.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(faq.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {faq.sort_order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {new Date(faq.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(faq)}
                            className="text-neutral-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeletingFaq(faq);
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

      {/* FAQ Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Question</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Answer</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="timing">Timing</option>
                <option value="revisions">Revisions</option>
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
              </select>
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
              {editingFaq ? 'Update FAQ' : 'Create FAQ'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingFaq(null);
        }}
        title="Delete FAQ"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-neutral-300">
            Are you sure you want to delete this FAQ? This action cannot be undone.
          </p>
          <div className="bg-neutral-700 p-3 rounded-md">
            <p className="text-sm font-medium text-white">{deletingFaq?.question}</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingFaq(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete FAQ
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

export default FAQAdmin; 