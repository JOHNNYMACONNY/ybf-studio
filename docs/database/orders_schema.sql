-- Orders table schema for YBF Studio admin dashboard
-- This schema supports both beat purchases and service orders

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create orders table for all types of orders (beats and services)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Order identification
    order_number TEXT UNIQUE NOT NULL, -- Human-readable order number (e.g., ORD-2024-001)
    
    -- Customer information
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    
    -- Order details
    order_type TEXT NOT NULL CHECK (order_type IN ('beat', 'service')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    
    -- Financial information
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Payment information
    stripe_payment_intent_id TEXT,
    stripe_session_id TEXT,
    payment_method TEXT,
    
    -- Order items (JSONB for flexibility)
    items JSONB NOT NULL, -- Array of order items with details
    
    -- Shipping/Delivery information
    delivery_method TEXT DEFAULT 'digital', -- digital, email, etc.
    download_links JSONB, -- Array of download URLs and expiration dates
    delivery_date TIMESTAMP WITH TIME ZONE,
    
    -- Notes and communication
    customer_notes TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Soft delete
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create order_items table for detailed item tracking
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Item identification
    item_type TEXT NOT NULL CHECK (item_type IN ('beat', 'service')),
    item_id UUID NOT NULL, -- Reference to beats.id or services.id
    
    -- Item details
    item_name TEXT NOT NULL,
    item_description TEXT,
    item_metadata JSONB, -- Additional item-specific data
    
    -- Pricing
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- License information (for beats)
    license_type TEXT, -- mp3, wav, exclusive (for beats)
    license_duration TEXT, -- perpetual, 1-year, etc.
    
    -- Service information (for services)
    service_category TEXT, -- mixing, mastering, etc.
    turnaround_time TEXT, -- 3-5 days, etc.
    
    -- Delivery
    download_url TEXT,
    download_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_history table for tracking status changes
CREATE TABLE IF NOT EXISTS order_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Change details
    field_name TEXT NOT NULL, -- status, payment_status, etc.
    old_value TEXT,
    new_value TEXT NOT NULL,
    
    -- Change metadata
    changed_by TEXT, -- admin user or system
    change_reason TEXT,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_type ON orders(order_type);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_deleted_at ON orders(deleted_at);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_item_type ON order_items(item_type);
CREATE INDEX IF NOT EXISTS idx_order_items_item_id ON order_items(item_id);

CREATE INDEX IF NOT EXISTS idx_order_history_order_id ON order_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_history_created_at ON order_history(created_at DESC);

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    sequence_part TEXT;
    order_num TEXT;
BEGIN
    year_part := EXTRACT(YEAR FROM NOW())::TEXT;
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 9 FOR 3) AS INTEGER)), 0) + 1
    INTO sequence_part
    FROM orders
    WHERE order_number LIKE 'ORD-' || year_part || '-%'
    AND deleted_at IS NULL;
    
    order_num := 'ORD-' || year_part || '-' || LPAD(sequence_part::TEXT, 3, '0');
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
    BEFORE UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- Create trigger to log order history changes
CREATE OR REPLACE FUNCTION log_order_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO order_history (order_id, field_name, old_value, new_value, changed_by)
        VALUES (NEW.id, 'status', OLD.status, NEW.status, 'system');
    END IF;
    
    -- Log payment status changes
    IF OLD.payment_status IS DISTINCT FROM NEW.payment_status THEN
        INSERT INTO order_history (order_id, field_name, old_value, new_value, changed_by)
        VALUES (NEW.id, 'payment_status', OLD.payment_status, NEW.payment_status, 'system');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_order_changes_trigger
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION log_order_changes();

-- Create views for common queries
CREATE OR REPLACE VIEW active_orders AS
SELECT * FROM orders WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW pending_orders AS
SELECT * FROM orders 
WHERE deleted_at IS NULL 
AND status = 'pending';

CREATE OR REPLACE VIEW completed_orders AS
SELECT * FROM orders 
WHERE deleted_at IS NULL 
AND status = 'completed';

CREATE OR REPLACE VIEW paid_orders AS
SELECT * FROM orders 
WHERE deleted_at IS NULL 
AND payment_status = 'paid';

-- Create function to get order statistics
CREATE OR REPLACE FUNCTION get_order_stats()
RETURNS TABLE(
    total_orders BIGINT,
    total_revenue DECIMAL(10,2),
    pending_orders BIGINT,
    completed_orders BIGINT,
    avg_order_value DECIMAL(10,2),
    beat_orders BIGINT,
    service_orders BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
        COALESCE(AVG(total_amount), 0) as avg_order_value,
        COUNT(*) FILTER (WHERE order_type = 'beat') as beat_orders,
        COUNT(*) FILTER (WHERE order_type = 'service') as service_orders
    FROM orders 
    WHERE deleted_at IS NULL
    AND payment_status = 'paid';
END;
$$ LANGUAGE plpgsql;

-- Create function to get orders by date range
CREATE OR REPLACE FUNCTION get_orders_by_date_range(start_date DATE, end_date DATE)
RETURNS TABLE(
    order_id UUID,
    order_number TEXT,
    customer_name TEXT,
    customer_email TEXT,
    order_type TEXT,
    status TEXT,
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.order_number,
        o.customer_name,
        o.customer_email,
        o.order_type,
        o.status,
        o.total_amount,
        o.created_at
    FROM orders o
    WHERE o.deleted_at IS NULL
    AND DATE(o.created_at) BETWEEN start_date AND end_date
    ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing
INSERT INTO orders (customer_name, customer_email, order_type, status, payment_status, subtotal, total_amount, items) VALUES
(
    'John Doe',
    'jmaconny@ybfstudio.com',
    'beat',
    'completed',
    'paid',
    29.99,
    29.99,
    '[{"item_type": "beat", "item_id": "550e8400-e29b-41d4-a716-446655440000", "item_name": "Midnight Dreams", "license_type": "mp3", "unit_price": 29.99, "quantity": 1, "total_price": 29.99}]'
),
(
    'Jane Smith',
    'jmaconny@ybfstudio.com',
    'service',
    'processing',
    'paid',
    150.00,
    150.00,
    '[{"item_type": "service", "item_id": "660e8400-e29b-41d4-a716-446655440000", "item_name": "Stereo Mix", "service_category": "mixing", "unit_price": 150.00, "quantity": 1, "total_price": 150.00}]'
),
(
    'Bob Wilson',
    'jmaconny@ybfstudio.com',
    'beat',
    'pending',
    'pending',
    49.99,
    49.99,
    '[{"item_type": "beat", "item_id": "770e8400-e29b-41d4-a716-446655440000", "item_name": "Urban Flow", "license_type": "wav", "unit_price": 49.99, "quantity": 1, "total_price": 49.99}]'
)
ON CONFLICT (order_number) DO NOTHING;

-- Grant necessary permissions (adjust based on your Supabase setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON order_items TO authenticated;
-- GRANT SELECT ON order_history TO authenticated;
-- GRANT SELECT ON active_orders TO authenticated;
-- GRANT SELECT ON pending_orders TO authenticated;
-- GRANT SELECT ON completed_orders TO authenticated;
-- GRANT SELECT ON paid_orders TO authenticated;
-- GRANT EXECUTE ON FUNCTION get_order_stats() TO authenticated;
-- GRANT EXECUTE ON FUNCTION get_orders_by_date_range(DATE, DATE) TO authenticated;

-- Comments for documentation
COMMENT ON TABLE orders IS 'Stores all orders (beats and services) for YBF Studio';
COMMENT ON TABLE order_items IS 'Stores individual items within each order';
COMMENT ON TABLE order_history IS 'Tracks all changes to orders for audit purposes';
COMMENT ON COLUMN orders.order_number IS 'Human-readable order number (e.g., ORD-2024-001)';
COMMENT ON COLUMN orders.items IS 'JSONB array containing order item details';
COMMENT ON COLUMN orders.download_links IS 'JSONB array containing download URLs and expiration dates';
COMMENT ON COLUMN order_items.item_metadata IS 'Additional item-specific data in JSON format'; 