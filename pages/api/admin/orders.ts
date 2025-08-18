import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
  stripe_payment_intent_id?: string;
  stripe_session_id?: string;
  payment_method?: string;
  items: Array<{
    beat_id?: string;
    service_id?: string;
    title: string;
    price: number;
    license_type?: string;
    quantity: number;
  }>;
  delivery_method: string;
  download_links?: Array<{
    url: string;
    expires_at: string;
    license_type: string;
  }>;
  delivery_date?: string;
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

interface ApiResponse {
  success: boolean;
  data?: {
    orders?: Order[];
    order?: Order;
    history?: OrderHistory[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
  message?: string;
}

// Helper function to check admin authentication
async function checkAdminAuth(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return false;
  }

  // Check if user is admin based on email (consistent with NextAuth config)
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  const userEmail = session.user.email;
  
  if (!userEmail || !adminEmails.includes(userEmail)) {
    res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
    return false;
  }

  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Check authentication for all methods
  const isAuthorized = await checkAdminAuth(req, res);
  if (!isAuthorized) return;

  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ 
          success: false, 
          error: `Method ${method} Not Allowed` 
        });
    }
  } catch (error) {
    console.error('Orders API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

// GET - Fetch orders with pagination, search, and filters
async function handleGet(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const {
    page = '1',
    limit = '20',
    search = '',
    status = '',
    payment_status = '',
    order_type = '',
    start_date = '',
    end_date = '',
    id = ''
  } = req.query;

  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .is('deleted_at', null);

    // Apply filters
    if (id) {
      query = query.eq('id', id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (payment_status) {
      query = query.eq('payment_status', payment_status);
    }

    if (order_type) {
      query = query.eq('order_type', order_type);
    }

    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,order_number.ilike.%${search}%`);
    }

    if (start_date && end_date) {
      query = query.gte('created_at', `${start_date}T00:00:00`).lte('created_at', `${end_date}T23:59:59`);
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);

    // Apply pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: orders, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch orders' 
      });
    }

    // If fetching single order, also get order history
    if (id && orders && orders.length > 0) {
      const { data: history } = await supabase
        .from('order_history')
        .select('*')
        .eq('order_id', id)
        .order('created_at', { ascending: false });

      return res.status(200).json({
        success: true,
        data: {
          order: orders[0],
          history: history || []
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        orders: orders || [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    });
  }
}

// POST - Create new order (manual order creation)
async function handlePost(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const {
    customer_name,
    customer_email,
    customer_phone,
    order_type,
    items,
    subtotal,
    tax_amount = 0,
    discount_amount = 0,
    total_amount,
    customer_notes,
    admin_notes
  } = req.body;

  // Validate required fields
  if (!customer_name || !customer_email || !order_type || !items || !total_amount) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: customer_name, customer_email, order_type, items, total_amount'
    });
  }

  // Validate order type
  if (!['beat', 'service'].includes(order_type)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid order_type. Must be "beat" or "service"'
    });
  }

  // Validate items array
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Items must be a non-empty array'
    });
  }

  try {
    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        order_type,
        status: 'pending',
        payment_status: 'pending',
        subtotal,
        tax_amount,
        discount_amount,
        total_amount,
        items,
        customer_notes,
        admin_notes
      })
      .select()
      .single();

    if (orderError) {
      console.error('Create order error:', orderError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create order'
      });
    }

    // Create order items
    const orderItems = items.map((item: {
      item_type: string;
      item_id: string;
      item_name: string;
      item_description?: string;
      item_metadata?: Record<string, unknown>;
      unit_price: number;
      quantity: number;
      total_price: number;
      license_type?: string;
      license_duration?: string;
      service_category?: string;
      turnaround_time?: string;
    }) => ({
      order_id: order.id,
      item_type: item.item_type,
      item_id: item.item_id,
      item_name: item.item_name,
      item_description: item.item_description,
      item_metadata: item.item_metadata,
      unit_price: item.unit_price,
      quantity: item.quantity,
      total_price: item.total_price,
      license_type: item.license_type,
      license_duration: item.license_duration,
      service_category: item.service_category,
      turnaround_time: item.turnaround_time
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Create order items error:', itemsError);
      // Don't fail the entire operation, but log the error
    }

    return res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
}

// PUT - Update order
async function handlePut(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { id } = req.query;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Order ID is required'
    });
  }

  // Remove fields that shouldn't be updated directly
  const {
    id: _id,
    order_number,
    created_at,
    deleted_at,
    ...safeUpdateData
  } = updateData;

  try {
    // Update the order
    const { data: order, error } = await supabase
      .from('orders')
      .update(safeUpdateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update order error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update order'
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Update order error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update order'
    });
  }
}

// DELETE - Soft delete order
async function handleDelete(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Order ID is required'
    });
  }

  try {
    // Soft delete the order
    const { error } = await supabase
      .from('orders')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Delete order error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete order'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Delete order error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete order'
    });
  }
} 