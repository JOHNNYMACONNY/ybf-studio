import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  order_type: 'beat' | 'service';
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  items: Array<{
    beat_id?: string;
    service_id?: string;
    title: string;
    price: number;
    license_type?: string;
    quantity: number;
  }>;
  customer_notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  completed_at?: string;
}

interface OrderHistory {
  id: string;
  order_id: string;
  field_name: string;
  old_value?: string;
  new_value: string;
  changed_by?: string;
  change_reason?: string;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const AdminOrdersPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Filters and search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Form states for editing
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState({
    status: '',
    payment_status: '',
    admin_notes: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }

    fetchOrders();
  }, [session, status, router, pagination.page, search, statusFilter, paymentStatusFilter, orderTypeFilter, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(paymentStatusFilter && { payment_status: paymentStatusFilter }),
        ...(orderTypeFilter && { order_type: orderTypeFilter }),
        ...(startDate && endDate && { start_date: startDate, end_date: endDate })
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch orders');
      }

      setOrders(result.data.orders);
      setPagination(result.data.pagination);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders?id=${orderId}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch order details');
      }

      setSelectedOrder(result.data.order);
      setOrderHistory(result.data.history);
      setEditForm({
        status: result.data.order.status,
        payment_status: result.data.order.payment_status,
        admin_notes: result.data.order.admin_notes || ''
      });
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch order details');
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setEditingOrder(order);
    fetchOrderDetails(order.id);
    setShowOrderModal(true);
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;

    try {
      const response = await fetch(`/api/admin/orders?id=${editingOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update order');
      }

      // Update the order in the list
      setOrders(orders.map(order => 
        order.id === editingOrder.id ? { 
          ...order, 
          status: editForm.status as Order['status'],
          payment_status: editForm.payment_status as Order['payment_status'],
          admin_notes: editForm.admin_notes
        } : order
      ));

      // Update the selected order
      if (selectedOrder && selectedOrder.id === editingOrder.id) {
        setSelectedOrder({ 
          ...selectedOrder, 
          status: editForm.status as Order['status'],
          payment_status: editForm.payment_status as Order['payment_status'],
          admin_notes: editForm.admin_notes
        });
      }

      setEditingOrder(null);
      alert('Order updated successfully');
    } catch (err) {
      console.error('Error updating order:', err);
      alert(err instanceof Error ? err.message : 'Failed to update order');
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      const response = await fetch(`/api/admin/orders?id=${orderToDelete.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete order');
      }

      // Remove the order from the list
      setOrders(orders.filter(order => order.id !== orderToDelete.id));
      setOrderToDelete(null);
      setShowDeleteModal(false);
      alert('Order deleted successfully');
    } catch (err) {
      console.error('Error deleting order:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete order');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-500',
      processing: 'bg-blue-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500',
      refunded: 'bg-gray-500'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-500',
      paid: 'bg-green-500',
      failed: 'bg-red-500',
      refunded: 'bg-gray-500'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Order Management</h1>
          <button
            onClick={() => fetchOrders()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-neutral-900 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
              <input
                type="text"
                placeholder="Customer name, email, or order number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Payment Status</label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Order Type</label>
              <select
                value={orderTypeFilter}
                onChange={(e) => setOrderTypeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="beat">Beat</option>
                <option value="service">Service</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-neutral-900 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading orders...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">Error: {error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-neutral-900 divide-y divide-neutral-800">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{order.order_number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{order.customer_name}</div>
                          <div className="text-sm text-gray-400">{order.customer_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.order_type === 'beat' 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-orange-500 text-white'
                          }`}>
                            {order.order_type.charAt(0).toUpperCase() + order.order_type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPaymentStatusBadge(order.payment_status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {formatCurrency(order.total_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleOrderClick(order)}
                            className="text-blue-400 hover:text-blue-300 mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setOrderToDelete(order);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-3 bg-neutral-800 border-t border-neutral-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        disabled={pagination.page === 1}
                        className="px-3 py-1 text-sm bg-neutral-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-600"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-400">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-3 py-1 text-sm bg-neutral-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-600"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Order Details: {selectedOrder.order_number}</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Order Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Order Number</label>
                      <p className="text-white">{selectedOrder.order_number}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Customer Name</label>
                      <p className="text-white">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Customer Email</label>
                      <p className="text-white">{selectedOrder.customer_email}</p>
                    </div>
                    {selectedOrder.customer_phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Customer Phone</label>
                        <p className="text-white">{selectedOrder.customer_phone}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Order Type</label>
                      <p className="text-white capitalize">{selectedOrder.order_type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Created Date</label>
                      <p className="text-white">{formatDate(selectedOrder.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Financial Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Subtotal</label>
                      <p className="text-white">{formatCurrency(selectedOrder.subtotal)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Tax</label>
                      <p className="text-white">{formatCurrency(selectedOrder.tax_amount)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Discount</label>
                      <p className="text-white">{formatCurrency(selectedOrder.discount_amount)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Total</label>
                      <p className="text-white font-semibold">{formatCurrency(selectedOrder.total_amount)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
                <div className="bg-neutral-800 rounded-lg p-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="border-b border-neutral-700 last:border-b-0 py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">{item.title}</h4>
                                                      <p className="text-gray-400 text-sm">
                              {item.beat_id ? `License: ${item.license_type}` : `Service Item`}
                            </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white">{formatCurrency(item.price * item.quantity)}</p>
                          <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Form */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Update Order</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Payment Status</label>
                    <select
                      value={editForm.payment_status}
                      onChange={(e) => setEditForm({ ...editForm, payment_status: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleUpdateOrder}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Update Order
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Admin Notes</label>
                  <textarea
                    value={editForm.admin_notes}
                    onChange={(e) => setEditForm({ ...editForm, admin_notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add admin notes..."
                  />
                </div>
              </div>

              {/* Order History */}
              {orderHistory.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Order History</h3>
                  <div className="bg-neutral-800 rounded-lg p-4">
                    {orderHistory.map((history) => (
                      <div key={history.id} className="border-b border-neutral-700 last:border-b-0 py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white">
                              <span className="font-medium">{history.field_name}</span> changed from{' '}
                              <span className="text-gray-400">{history.old_value || 'N/A'}</span> to{' '}
                              <span className="text-green-400">{history.new_value}</span>
                            </p>
                            {history.change_reason && (
                              <p className="text-gray-400 text-sm mt-1">Reason: {history.change_reason}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">{formatDate(history.created_at)}</p>
                            {history.changed_by && (
                              <p className="text-gray-400 text-sm">by {history.changed_by}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {(selectedOrder.customer_notes || selectedOrder.admin_notes) && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedOrder.customer_notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Customer Notes</label>
                        <div className="bg-neutral-800 rounded-lg p-3">
                          <p className="text-white">{selectedOrder.customer_notes}</p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.admin_notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Admin Notes</label>
                        <div className="bg-neutral-800 rounded-lg p-3">
                          <p className="text-white">{selectedOrder.admin_notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && orderToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-900 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-white mb-4">Confirm Delete</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete order <span className="font-semibold">{orderToDelete.order_number}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setOrderToDelete(null);
                  }}
                  className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOrder}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage; 