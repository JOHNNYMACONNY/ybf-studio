import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import { AdminConsultationOverview } from '../../lib/consultation';
import { CalendarService } from '../../lib/calendar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

export default function AdminConsultations() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [consultations, setConsultations] = useState<AdminConsultationOverview[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<AdminConsultationOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<AdminConsultationOverview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'reschedule' | 'cancel' | 'notes'>('notes');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [rescheduleData, setRescheduleData] = useState({
    start_at: '',
    end_at: '',
    duration_minutes: 60,
    notes: ''
  });
  const [cancelData, setCancelData] = useState({
    reason: '',
    notes: ''
  });
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    const user = session?.user as { isAdmin?: boolean; role?: string } | undefined;
    const isAdmin = Boolean(user?.isAdmin || user?.role === 'admin');
    if (!session || !isAdmin) {
      router.push('/admin');
      return;
    }
    fetchConsultations();
  }, [session, status, router]);

  useEffect(() => {
    filterConsultations();
  }, [filterConsultations]);

  const fetchConsultations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/consultations');
      if (response.ok) {
        const data = await response.json();
        setConsultations(data);
      } else {
        console.error('Failed to fetch consultations');
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterConsultations = useCallback(() => {
    let filtered = consultations;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(consultation =>
        consultation.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.client_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.client_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.package_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(consultation => consultation.status === statusFilter);
    }

    setFilteredConsultations(filtered);
  }, [consultations, searchTerm, statusFilter]);

  const openModal = (consultation: AdminConsultationOverview, type: 'reschedule' | 'cancel' | 'notes') => {
    setSelectedConsultation(consultation);
    setModalType(type);
    
    if (type === 'reschedule') {
      const startDate = new Date(consultation.start_at);
      const endDate = new Date(consultation.end_at);
      setRescheduleData({
        start_at: startDate.toISOString().slice(0, 16),
        end_at: endDate.toISOString().slice(0, 16),
        duration_minutes: consultation.duration_minutes,
        notes: ''
      });
    } else if (type === 'cancel') {
      setCancelData({ reason: '', notes: '' });
    } else if (type === 'notes') {
      setAdminNotes(consultation.admin_notes || '');
    }
    
    setIsModalOpen(true);
  };

  const handleReschedule = async () => {
    if (!selectedConsultation) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/consultations/${selectedConsultation.id}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rescheduleData)
      });

      if (response.ok) {
        await fetchConsultations();
        setIsModalOpen(false);
        setSelectedConsultation(null);
      } else {
        const error = await response.json();
        alert(`Failed to reschedule: ${error.error}`);
      }
    } catch (error) {
      console.error('Error rescheduling consultation:', error);
      alert('An error occurred while rescheduling');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedConsultation) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/consultations/${selectedConsultation.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cancelData)
      });

      if (response.ok) {
        await fetchConsultations();
        setIsModalOpen(false);
        setSelectedConsultation(null);
      } else {
        const error = await response.json();
        alert(`Failed to cancel: ${error.error}`);
      }
    } catch (error) {
      console.error('Error cancelling consultation:', error);
      alert('An error occurred while cancelling');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNotes = async () => {
    if (!selectedConsultation) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/consultations/${selectedConsultation.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNotes })
      });

      if (response.ok) {
        await fetchConsultations();
        setIsModalOpen(false);
        setSelectedConsultation(null);
      } else {
        const error = await response.json();
        alert(`Failed to update notes: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('An error occurred while updating notes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return CalendarService.formatDateForDisplay(dateString);
  };

  const formatTime = (dateString: string) => {
    return CalendarService.formatTimeForDisplay(dateString);
  };

  if (status === 'loading' || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Consultation Management</h1>
          <p className="text-gray-600 mt-2">Manage all consultation bookings and appointments</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <Input
                type="text"
                placeholder="Search by client name, email, or package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchConsultations} className="w-full">
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Consultations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConsultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {consultation.client_first_name} {consultation.client_last_name}
                        </div>
                        <div className="text-sm text-gray-500">{consultation.client_email}</div>
                        {consultation.client_company && (
                          <div className="text-xs text-gray-400">{consultation.client_company}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {consultation.package_name || 'Custom Consultation'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {consultation.duration_minutes} minutes
                        </div>
                        {consultation.package_price_cents !== undefined && (
                          <div className="text-xs text-gray-400">
                            ${(consultation.package_price_cents / 100).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{formatDate(consultation.start_at)}</div>
                        <div className="text-sm text-gray-500">{formatTime(consultation.start_at)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultation.status)}`}>
                        {consultation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openModal(consultation, 'notes')}
                        >
                          Notes
                        </Button>
                        {consultation.status !== 'cancelled' && consultation.status !== 'completed' && (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => openModal(consultation, 'reschedule')}
                            >
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openModal(consultation, 'cancel')}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredConsultations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No consultations found</div>
            </div>
          )}
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={
          modalType === 'reschedule' ? 'Reschedule Consultation' :
          modalType === 'cancel' ? 'Cancel Consultation' :
          'Update Admin Notes'
        }>
          <div className="p-6">
            {modalType === 'reschedule' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <Input
                      type="datetime-local"
                      value={rescheduleData.start_at}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, start_at: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <Input
                      type="datetime-local"
                      value={rescheduleData.end_at}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, end_at: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={rescheduleData.duration_minutes}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, duration_minutes: parseInt(e.target.value) })}
                    min="15"
                    max="480"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={rescheduleData.notes}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleReschedule} disabled={isSubmitting}>
                    {isSubmitting ? 'Rescheduling...' : 'Reschedule'}
                  </Button>
                </div>
              </div>
            )}

            {modalType === 'cancel' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Reason *</label>
                  <select
                    value={cancelData.reason}
                    onChange={(e) => setCancelData({ ...cancelData, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select a reason</option>
                    <option value="Client Request">Client Request</option>
                    <option value="Schedule Conflict">Schedule Conflict</option>
                    <option value="Technical Issues">Technical Issues</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    value={cancelData.notes}
                    onChange={(e) => setCancelData({ ...cancelData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCancel} disabled={isSubmitting || !cancelData.reason}>
                    {isSubmitting ? 'Cancelling...' : 'Cancel Consultation'}
                  </Button>
                </div>
              </div>
            )}

            {modalType === 'notes' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Add internal notes about this consultation..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateNotes} disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Notes'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}


