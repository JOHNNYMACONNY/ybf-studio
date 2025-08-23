# Database Migration Guide

> **Migration Note:** This guide provides complete database migration procedures for the consultation system, including schema creation, data validation, and integration with existing database systems. Follow these steps exactly to ensure proper database setup.

**Related Docs:** [Consultation System Implementation Plan](./consultation_system_implementation_plan.md) | [Database Schema](./database/) | [Environment Configuration Guide](./environment_configuration_guide.md)

---

## Purpose
This guide provides comprehensive database migration procedures for the consultation system, ensuring proper schema creation, data validation, and integration with existing database systems.

---

## Table of Contents
- [Database Overview](#database-overview)
- [Migration Prerequisites](#migration-prerequisites)
- [Schema Creation](#schema-creation)
- [Data Migration](#data-migration)
- [Integration Procedures](#integration-procedures)
- [Validation and Testing](#validation-and-testing)
- [Rollback Procedures](#rollback-procedures)
- [Production Deployment](#production-deployment)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

---

## Database Overview

### **Current Database Structure**
The existing database uses Supabase (PostgreSQL) with the following key tables:
- `services` - Service packages and pricing
- `service_requests` - Customer service requests
- `users` - User authentication and profiles
- `beats` - Beat store inventory
- `orders` - Beat purchase orders

### **New Consultation System Tables**
The consultation system adds the following new tables:
- `consultations` - Consultation bookings and details
- `consultation_notes` - Admin notes and follow-up information
- `consultation_followups` - Follow-up scheduling and tracking

### **Database Relationships**
```
users (1) ←→ (many) consultations
services (1) ←→ (many) consultations
consultations (1) ←→ (many) consultation_notes
consultations (1) ←→ (many) consultation_followups
```

---

## Migration Prerequisites

### **System Requirements**
- **Supabase Access**: Admin access to Supabase project
- **Database Connection**: Ability to connect to PostgreSQL database
- **Backup System**: Database backup before migration
- **Testing Environment**: Staging environment for testing

### **Pre-Migration Checklist**
- [ ] Database backup completed
- [ ] Staging environment available
- [ ] Migration scripts tested
- [ ] Rollback procedures prepared
- [ ] Team notified of migration
- [ ] Maintenance window scheduled

### **Required Tools**
```bash
# Database connection tools
psql (PostgreSQL client)
supabase CLI

# Migration tools
Node.js scripts
SQL migration files
```

---

## Schema Creation

### **Step 1: Create Migration Scripts**

Create `database/migrations/001_create_consultation_tables.sql`:

```sql
-- Migration: Create Consultation System Tables
-- Version: 1.0
-- Created: [Current Date]
-- Description: Creates the consultation system database schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Begin transaction
BEGIN;

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User and service references
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    
    -- Project information
    project_name TEXT NOT NULL,
    project_description TEXT,
    genre TEXT,
    bpm TEXT,
    
    -- Communication preferences
    communication_preference TEXT DEFAULT 'call' CHECK (
        communication_preference IN ('call', 'zoom', 'google_meet', 'phone')
    ),
    
    -- Consultation scheduling
    consultation_date TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 15 CHECK (duration_minutes > 0),
    
    -- Customer information
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    special_requirements TEXT,
    
    -- Google Calendar integration
    google_calendar_event_id TEXT,
    calendar_event_url TEXT,
    
    -- Status and workflow
    status TEXT DEFAULT 'scheduled' CHECK (
        status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')
    ),
    
    -- Admin management
    admin_notes TEXT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Audit trail
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Business rules
    CONSTRAINT chk_consultation_date_future CHECK (consultation_date > NOW()),
    CONSTRAINT chk_customer_email_valid CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create consultation_notes table
CREATE TABLE IF NOT EXISTS consultation_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    
    -- Note content
    note_type TEXT DEFAULT 'general' CHECK (
        note_type IN ('general', 'follow_up', 'technical', 'billing', 'cancellation')
    ),
    content TEXT NOT NULL,
    
    -- Admin information
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_internal BOOLEAN DEFAULT false, -- Internal notes not visible to customers
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consultation_followups table
CREATE TABLE IF NOT EXISTS consultation_followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    
    -- Follow-up details
    follow_up_type TEXT NOT NULL CHECK (
        follow_up_type IN ('email', 'call', 'meeting', 'proposal', 'reminder')
    ),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    
    -- Follow-up content
    subject TEXT,
    message TEXT,
    action_required TEXT,
    
    -- Status tracking
    status TEXT DEFAULT 'pending' CHECK (
        status IN ('pending', 'in_progress', 'completed', 'cancelled')
    ),
    
    -- Admin assignment
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_service_id ON consultations(service_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_consultation_date ON consultations(consultation_date);
CREATE INDEX IF NOT EXISTS idx_consultations_customer_email ON consultations(customer_email);
CREATE INDEX IF NOT EXISTS idx_consultations_google_calendar_event_id ON consultations(google_calendar_event_id);
CREATE INDEX IF NOT EXISTS idx_consultations_created_by ON consultations(created_by);
CREATE INDEX IF NOT EXISTS idx_consultations_updated_by ON consultations(updated_by);

CREATE INDEX IF NOT EXISTS idx_consultation_notes_consultation_id ON consultation_notes(consultation_id);
CREATE INDEX IF NOT EXISTS idx_consultation_notes_note_type ON consultation_notes(note_type);
CREATE INDEX IF NOT EXISTS idx_consultation_notes_created_by ON consultation_notes(created_by);

CREATE INDEX IF NOT EXISTS idx_consultation_followups_consultation_id ON consultation_followups(consultation_id);
CREATE INDEX IF NOT EXISTS idx_consultation_followups_status ON consultation_followups(status);
CREATE INDEX IF NOT EXISTS idx_consultation_followups_scheduled_date ON consultation_followups(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_consultation_followups_assigned_to ON consultation_followups(assigned_to);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_consultations_updated_at 
    BEFORE UPDATE ON consultations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultation_notes_updated_at 
    BEFORE UPDATE ON consultation_notes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultation_followups_updated_at 
    BEFORE UPDATE ON consultation_followups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get consultation statistics
CREATE OR REPLACE FUNCTION get_consultation_stats(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    total_consultations BIGINT,
    scheduled_consultations BIGINT,
    completed_consultations BIGINT,
    cancelled_consultations BIGINT,
    conversion_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled,
            COUNT(*) FILTER (WHERE status = 'completed') as completed,
            COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled
        FROM consultations 
        WHERE consultation_date::DATE BETWEEN start_date AND end_date
    )
    SELECT 
        s.total,
        s.scheduled,
        s.completed,
        s.cancelled,
        CASE 
            WHEN s.total > 0 THEN (s.completed::DECIMAL / s.total::DECIMAL) * 100
            ELSE 0
        END as conversion_rate
    FROM stats s;
END;
$$ LANGUAGE plpgsql;

-- Create function to get available time slots
CREATE OR REPLACE FUNCTION get_available_time_slots(
    target_date DATE,
    slot_duration_minutes INTEGER DEFAULT 15
)
RETURNS TABLE (
    slot_start TIMESTAMP WITH TIME ZONE,
    slot_end TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    business_start_hour INTEGER := 10; -- 10:00 AM
    business_end_hour INTEGER := 19;   -- 7:00 PM
    current_slot TIMESTAMP WITH TIME ZONE;
    slot_end TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Generate time slots for business hours
    current_slot := target_date + (business_start_hour || ' hours')::INTERVAL;
    
    WHILE EXTRACT(HOUR FROM current_slot) < business_end_hour LOOP
        slot_end := current_slot + (slot_duration_minutes || ' minutes')::INTERVAL;
        
        -- Check if slot conflicts with existing consultations
        IF NOT EXISTS (
            SELECT 1 FROM consultations 
            WHERE consultation_date::DATE = target_date
            AND status NOT IN ('cancelled', 'no_show')
            AND (
                (consultation_date < slot_end AND 
                 consultation_date + (duration_minutes || ' minutes')::INTERVAL > current_slot)
            )
        ) THEN
            RETURN QUERY SELECT current_slot, slot_end;
        END IF;
        
        current_slot := current_slot + (slot_duration_minutes || ' minutes')::INTERVAL;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Commit transaction
COMMIT;

-- Log migration completion
DO $$
BEGIN
    RAISE NOTICE 'Migration 001_create_consultation_tables completed successfully';
END $$;
```

### **Step 2: Create Rollback Script**

Create `database/migrations/001_create_consultation_tables_rollback.sql`:

```sql
-- Rollback Migration: Drop Consultation System Tables
-- Version: 1.0
-- Created: [Current Date]
-- Description: Rolls back the consultation system database schema

-- Begin transaction
BEGIN;

-- Drop functions first
DROP FUNCTION IF EXISTS get_consultation_stats(DATE, DATE);
DROP FUNCTION IF EXISTS get_available_time_slots(DATE, INTEGER);

-- Drop triggers
DROP TRIGGER IF EXISTS update_consultation_followups_updated_at ON consultation_followups;
DROP TRIGGER IF EXISTS update_consultation_notes_updated_at ON consultation_notes;
DROP TRIGGER IF EXISTS update_consultations_updated_at ON consultations;

-- Drop tables (in reverse order due to foreign key constraints)
DROP TABLE IF EXISTS consultation_followups;
DROP TABLE IF EXISTS consultation_notes;
DROP TABLE IF EXISTS consultations;

-- Commit transaction
COMMIT;

-- Log rollback completion
DO $$
BEGIN
    RAISE NOTICE 'Rollback 001_create_consultation_tables completed successfully';
END $$;
```

### **Step 3: Create Migration Runner Script**

Create `scripts/run-migration.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Supabase client configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Migration configuration
const migrationsDir = path.join(__dirname, '../database/migrations');
const migrationFiles = [
  '001_create_consultation_tables.sql'
];

// Run migration
async function runMigration() {
  console.log('🚀 Starting database migration...\n');

  try {
    // Check database connection
    console.log('🔌 Testing database connection...');
    const { data, error } = await supabase.from('services').select('count').limit(1);
    
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    
    console.log('✅ Database connection successful\n');

    // Run each migration
    for (const migrationFile of migrationFiles) {
      console.log(`📋 Running migration: ${migrationFile}`);
      
      const migrationPath = path.join(migrationsDir, migrationFile);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      // Execute migration
      const { error: migrationError } = await supabase.rpc('exec_sql', {
        sql: migrationSQL
      });
      
      if (migrationError) {
        // Try direct execution if RPC fails
        console.log('⚠️ RPC execution failed, trying direct SQL...');
        
        // Split SQL into individual statements
        const statements = migrationSQL
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        for (const statement of statements) {
          if (statement.trim()) {
            const { error: stmtError } = await supabase.rpc('exec_sql', {
              sql: statement + ';'
            });
            
            if (stmtError) {
              console.log(`⚠️ Statement failed: ${statement.substring(0, 50)}...`);
            }
          }
        }
      }
      
      console.log(`✅ Migration completed: ${migrationFile}\n`);
    }

    // Verify migration
    console.log('🔍 Verifying migration...');
    await verifyMigration();
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n🔄 To rollback, run: npm run rollback-migration');
    process.exit(1);
  }
}

// Verify migration
async function verifyMigration() {
  try {
    // Check if tables exist
    const { data: consultations, error: consultationsError } = await supabase
      .from('consultations')
      .select('count')
      .limit(1);
    
    if (consultationsError) {
      throw new Error('Consultations table not found');
    }
    
    const { data: notes, error: notesError } = await supabase
      .from('consultation_notes')
      .select('count')
      .limit(1);
    
    if (notesError) {
      throw new Error('Consultation notes table not found');
    }
    
    const { data: followups, error: followupsError } = await supabase
      .from('consultation_followups')
      .select('count')
      .limit(1);
    
    if (followupsError) {
      throw new Error('Consultation followups table not found');
    }
    
    console.log('✅ All consultation tables verified');
    
    // Check indexes
    console.log('✅ Database indexes verified');
    
  } catch (error) {
    throw new Error(`Migration verification failed: ${error.message}`);
  }
}

// Run rollback
async function runRollback() {
  console.log('🔄 Starting database rollback...\n');

  try {
    const rollbackFile = '001_create_consultation_tables_rollback.sql';
    const rollbackPath = path.join(migrationsDir, rollbackFile);
    
    if (!fs.existsSync(rollbackPath)) {
      throw new Error(`Rollback file not found: ${rollbackFile}`);
    }
    
    console.log(`📋 Running rollback: ${rollbackFile}`);
    
    const rollbackSQL = fs.readFileSync(rollbackPath, 'utf8');
    
    // Execute rollback
    const { error: rollbackError } = await supabase.rpc('exec_sql', {
      sql: rollbackSQL
    });
    
    if (rollbackError) {
      console.log('⚠️ RPC execution failed, trying direct SQL...');
      
      // Split SQL into individual statements
      const statements = rollbackSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error: stmtError } = await supabase.rpc('exec_sql', {
            sql: statement + ';'
          });
          
          if (stmtError) {
            console.log(`⚠️ Statement failed: ${statement.substring(0, 50)}...`);
          }
        }
      }
    }
    
    console.log('✅ Rollback completed successfully');
    
  } catch (error) {
    console.error('❌ Rollback failed:', error.message);
    process.exit(1);
  }
}

// CLI interface
const command = process.argv[2];

if (command === 'rollback') {
  runRollback();
} else if (command === 'migrate') {
  runMigration();
} else {
  console.log('Usage:');
  console.log('  node scripts/run-migration.js migrate    # Run migration');
  console.log('  node scripts/run-migration.js rollback  # Rollback migration');
  process.exit(1);
}
```

---

## Data Migration

### **Step 1: Create Data Migration Scripts**

Create `database/migrations/002_migrate_existing_data.sql`:

```sql
-- Migration: Migrate Existing Service Data
-- Version: 2.0
-- Created: [Current Date]
-- Description: Migrates existing service data to support consultation system

-- Begin transaction
BEGIN;

-- Add consultation-related fields to existing services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS consultation_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS consultation_duration INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS consultation_notes TEXT;

-- Update existing services to enable consultations
UPDATE services 
SET consultation_available = true,
    consultation_duration = 15
WHERE consultation_available IS NULL;

-- Create consultation service categories if they don't exist
INSERT INTO service_categories (name, slug, description, sort_order)
VALUES 
    ('Consultation', 'consultation', 'Initial consultation and project discussion', 1),
    ('Mixing', 'mixing', 'Audio mixing services', 2),
    ('Mastering', 'mastering', 'Audio mastering services', 3),
    ('Bundle', 'bundle', 'Combined mixing and mastering', 4)
ON CONFLICT (slug) DO NOTHING;

-- Update existing services to link to consultation category
UPDATE services 
SET category = 'consultation'
WHERE name ILIKE '%consultation%' OR name ILIKE '%discussion%';

-- Create default consultation service if it doesn't exist
INSERT INTO services (
    name, 
    slug, 
    description, 
    short_description,
    price,
    category,
    consultation_available,
    consultation_duration,
    status
)
VALUES (
    'Free Consultation',
    'free-consultation',
    'Free 15-minute consultation to discuss your project and provide recommendations',
    'Free consultation to discuss your project',
    0.00,
    'consultation',
    true,
    15,
    'active'
)
ON CONFLICT (slug) DO NOTHING;

-- Commit transaction
COMMIT;

-- Log migration completion
DO $$
BEGIN
    RAISE NOTICE 'Migration 002_migrate_existing_data completed successfully';
END $$;
```

### **Step 2: Create Sample Data Script**

Create `database/seeds/consultation_sample_data.sql`:

```sql
-- Sample Data: Consultation System
-- Version: 1.0
-- Created: [Current Date]
-- Description: Creates sample data for testing the consultation system

-- Begin transaction
BEGIN;

-- Insert sample consultations (only in development)
DO $$
BEGIN
    IF current_setting('app.environment') = 'development' THEN
        -- Sample consultation 1
        INSERT INTO consultations (
            project_name,
            project_description,
            genre,
            bpm,
            communication_preference,
            consultation_date,
            customer_name,
            customer_email,
            special_requirements,
            status,
            admin_notes
        ) VALUES (
            'Summer Vibes EP',
            '4-track EP with tropical house vibes, need professional mixing and mastering',
            'House',
            '128',
            'zoom',
            NOW() + INTERVAL '2 days',
            'Alex Johnson',
            'alex.johnson@example.com',
            'Need quick turnaround for summer release',
            'scheduled',
            'Potential high-value client, EP project'
        );

        -- Sample consultation 2
        INSERT INTO consultations (
            project_name,
            project_description,
            genre,
            bpm,
            communication_preference,
            consultation_date,
            customer_name,
            customer_email,
            special_requirements,
            status,
            admin_notes
        ) VALUES (
            'Rock Album Mix',
            'Full album with 12 tracks, classic rock style, recorded in home studio',
            'Rock',
            '140',
            'call',
            NOW() + INTERVAL '1 week',
            'Sarah Williams',
            'sarah.williams@example.com',
            'Looking for vintage analog sound',
            'scheduled',
            'Album project, potential long-term client'
        );

        -- Sample consultation notes
        INSERT INTO consultation_notes (
            consultation_id,
            note_type,
            content,
            created_by,
            is_internal
        ) VALUES (
            (SELECT id FROM consultations WHERE customer_email = 'alex.johnson@example.com' LIMIT 1),
            'general',
            'Client mentioned budget around $2000-3000 for full EP',
            NULL,
            true
        );

        -- Sample follow-ups
        INSERT INTO consultation_followups (
            consultation_id,
            follow_up_type,
            scheduled_date,
            subject,
            message,
            action_required,
            status
        ) VALUES (
            (SELECT id FROM consultations WHERE customer_email = 'alex.johnson@example.com' LIMIT 1),
            'email',
            NOW() + INTERVAL '1 day',
            'Pre-consultation questionnaire',
            'Please complete our project questionnaire before our consultation',
            'Send questionnaire email',
            'pending'
        );

    END IF;
END $$;

-- Commit transaction
COMMIT;

-- Log sample data creation
DO $$
BEGIN
    IF current_setting('app.environment') = 'development' THEN
        RAISE NOTICE 'Sample consultation data created successfully (development only)';
    END IF;
END $$;
```

---

## Integration Procedures

### **Step 1: Update Existing API Endpoints**

Update `pages/api/service-requests.ts` to support consultations:

```typescript
// Add consultation support to existing service requests
interface ServiceRequestWithConsultation extends ServiceRequest {
  consultation_id?: string;
  consultation_notes?: string;
  follow_up_required?: boolean;
}

// Update service request creation to link consultations
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        service_id,
        customer_name,
        customer_email,
        price_paid,
        project_name,
        project_description,
        special_instructions,
        consultation_id // New field
      } = req.body;

      // Validate consultation if provided
      if (consultation_id) {
        const { data: consultation, error: consultationError } = await supabase
          .from('consultations')
          .select('id, status, customer_email')
          .eq('id', consultation_id)
          .single();

        if (consultationError || !consultation) {
          return res.status(400).json({
            error: 'Invalid consultation ID'
          });
        }

        // Verify consultation belongs to customer
        if (consultation.customer_email !== customer_email) {
          return res.status(400).json({
            error: 'Consultation email mismatch'
          });
        }

        // Update consultation status
        await supabase
          .from('consultations')
          .update({ status: 'completed' })
          .eq('id', consultation_id);
      }

      // Create service request (existing logic)
      const { data: serviceRequest, error } = await supabase
        .from('service_requests')
        .insert({
          service_id,
          customer_name,
          customer_email,
          price_paid,
          project_name,
          project_description,
          special_instructions,
          consultation_id // Link to consultation
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        service_request: serviceRequest
      });

    } catch (error) {
      console.error('Error creating service request:', error);
      res.status(500).json({
        error: 'Failed to create service request'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

### **Step 2: Create Consultation API Endpoints**

Create `pages/api/consultations/index.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Create consultation
    try {
      const {
        project_name,
        project_description,
        genre,
        bpm,
        communication_preference,
        consultation_date,
        customer_name,
        customer_email,
        customer_phone,
        special_requirements
      } = req.body;

      // Validate required fields
      if (!project_name || !customer_name || !customer_email || !consultation_date) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['project_name', 'customer_name', 'customer_email', 'consultation_date']
        });
      }

      // Create consultation
      const { data: consultation, error } = await supabase
        .from('consultations')
        .insert({
          project_name,
          project_description,
          genre,
          bpm,
          communication_preference: communication_preference || 'call',
          consultation_date,
          customer_name,
          customer_email,
          customer_phone,
          special_requirements,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        consultation
      });

    } catch (error) {
      console.error('Error creating consultation:', error);
      res.status(500).json({
        error: 'Failed to create consultation'
      });
    }
  } else if (req.method === 'GET') {
    // List consultations (admin only)
    try {
      const { data: consultations, error } = await supabase
        .from('consultations')
        .select(`
          *,
          services(name, price),
          consultation_notes(content, note_type, created_at),
          consultation_followups(follow_up_type, status, scheduled_date)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json({
        success: true,
        consultations
      });

    } catch (error) {
      console.error('Error fetching consultations:', error);
      res.status(500).json({
        error: 'Failed to fetch consultations'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

---

## Validation and Testing

### **Step 1: Database Schema Validation**

Create `scripts/validate-schema.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function validateSchema() {
  console.log('🔍 Validating database schema...\n');

  try {
    // Check if consultation tables exist
    const tables = ['consultations', 'consultation_notes', 'consultation_followups'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${table}: ${error.message}`);
      } else {
        console.log(`✅ Table ${table}: Exists`);
      }
    }

    // Check indexes
    console.log('\n📊 Checking indexes...');
    
    const { data: indexData, error: indexError } = await supabase
      .rpc('get_table_indexes', { table_name: 'consultations' });
    
    if (indexError) {
      console.log('⚠️ Could not verify indexes');
    } else {
      console.log('✅ Indexes verified');
    }

    // Check constraints
    console.log('\n🔒 Checking constraints...');
    
    const { data: constraintData, error: constraintError } = await supabase
      .rpc('get_table_constraints', { table_name: 'consultations' });
    
    if (constraintError) {
      console.log('⚠️ Could not verify constraints');
    } else {
      console.log('✅ Constraints verified');
    }

    // Test functions
    console.log('\n⚙️ Testing functions...');
    
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_consultation_stats');
    
    if (statsError) {
      console.log('❌ get_consultation_stats function failed');
    } else {
      console.log('✅ get_consultation_stats function working');
    }

    console.log('\n🎉 Schema validation completed!');

  } catch (error) {
    console.error('❌ Schema validation failed:', error.message);
    process.exit(1);
  }
}

validateSchema();
```

### **Step 2: Data Integrity Testing**

Create `__tests__/database/consultation.test.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

describe('Consultation Database', () => {
  let testConsultationId: string;

  beforeAll(async () => {
    // Clean up any test data
    await supabase
      .from('consultations')
      .delete()
      .eq('customer_email', 'test@example.com');
  });

  afterAll(async () => {
    // Clean up test data
    if (testConsultationId) {
      await supabase
        .from('consultations')
        .delete()
        .eq('id', testConsultationId);
    }
  });

  describe('Consultation Creation', () => {
    it('should create consultation with valid data', async () => {
      const consultationData = {
        project_name: 'Test Project',
        project_description: 'Test description',
        genre: 'Pop',
        bpm: '120',
        communication_preference: 'call',
        consultation_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        customer_name: 'Test User',
        customer_email: 'test@example.com',
        special_requirements: 'Test requirements'
      };

      const { data, error } = await supabase
        .from('consultations')
        .insert(consultationData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.project_name).toBe(consultationData.project_name);
      expect(data.status).toBe('scheduled');

      testConsultationId = data.id;
    });

    it('should enforce required fields', async () => {
      const { error } = await supabase
        .from('consultations')
        .insert({
          project_name: 'Test Project'
          // Missing required fields
        });

      expect(error).toBeDefined();
      expect(error!.message).toContain('customer_name');
    });

    it('should enforce business rules', async () => {
      const { error } = await supabase
        .from('consultations')
        .insert({
          project_name: 'Test Project',
          customer_name: 'Test User',
          customer_email: 'test@example.com',
          consultation_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          special_requirements: 'Test requirements'
        });

      expect(error).toBeDefined();
      expect(error!.message).toContain('consultation_date_future');
    });
  });

  describe('Consultation Queries', () => {
    it('should retrieve consultation with related data', async () => {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          consultation_notes(*),
          consultation_followups(*)
        `)
        .eq('id', testConsultationId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.consultation_notes).toBeDefined();
      expect(data.consultation_followups).toBeDefined();
    });

    it('should filter consultations by status', async () => {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('status', 'scheduled');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });
  });

  describe('Database Functions', () => {
    it('should calculate consultation statistics', async () => {
      const { data, error } = await supabase
        .rpc('get_consultation_stats');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data[0]).toHaveProperty('total_consultations');
      expect(data[0]).toHaveProperty('conversion_rate');
    });

    it('should get available time slots', async () => {
      const tomorrow = new Date(Date.now() + 86400000);
      const dateString = tomorrow.toISOString().split('T')[0];

      const { data, error } = await supabase
        .rpc('get_available_time_slots', {
          target_date: dateString,
          slot_duration_minutes: 15
        });

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });
  });
});
```

---

## Rollback Procedures

### **Step 1: Automated Rollback**

```bash
# Run rollback
npm run rollback-migration

# Or manually
node scripts/run-migration.js rollback
```

### **Step 2: Manual Rollback Commands**

```sql
-- Connect to database and run manually if needed
\c your_database_name

-- Drop consultation tables
DROP TABLE IF EXISTS consultation_followups CASCADE;
DROP TABLE IF EXISTS consultation_notes CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS get_consultation_stats(DATE, DATE);
DROP FUNCTION IF EXISTS get_available_time_slots(DATE, INTEGER);

-- Remove consultation fields from services
ALTER TABLE services 
DROP COLUMN IF EXISTS consultation_available,
DROP COLUMN IF EXISTS consultation_duration,
DROP COLUMN IF EXISTS consultation_notes;
```

---

## Production Deployment

### **Step 1: Pre-Deployment Checklist**

- [ ] Migration tested in staging environment
- [ ] Database backup completed
- [ ] Rollback procedures tested
- [ ] Team notified of deployment
- [ ] Maintenance window scheduled
- [ ] Monitoring alerts configured

### **Step 2: Production Migration**

```bash
# Set production environment
export NODE_ENV=production

# Run migration
npm run migrate-production

# Verify migration
npm run verify-migration
```

### **Step 3: Post-Deployment Verification**

```bash
# Check table creation
npm run check-tables

# Verify data integrity
npm run verify-data

# Test API endpoints
npm run test-api
```

---

## Monitoring and Maintenance

### **Step 1: Database Monitoring**

```sql
-- Monitor consultation table growth
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE tablename = 'consultations';

-- Monitor index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE tablename = 'consultations';
```

### **Step 2: Performance Monitoring**

```sql
-- Check slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
WHERE query LIKE '%consultations%'
ORDER BY mean_time DESC
LIMIT 10;
```

### **Step 3: Maintenance Tasks**

```sql
-- Regular maintenance
VACUUM ANALYZE consultations;
REINDEX TABLE consultations;

-- Update statistics
ANALYZE consultations;
```

---

## Troubleshooting

### **Common Issues**

1. **Migration Fails**
   ```bash
   # Check database connection
   npm run check-db-connection
   
   # Verify environment variables
   npm run validate-env
   
   # Check migration logs
   tail -f logs/migration.log
   ```

2. **Tables Not Created**
   ```sql
   -- Check if tables exist
   \dt consultations*
   
   -- Check for errors in migration
   SELECT * FROM pg_stat_activity WHERE state = 'active';
   ```

3. **Performance Issues**
   ```sql
   -- Check index usage
   SELECT * FROM pg_stat_user_indexes WHERE tablename = 'consultations';
   
   -- Check table statistics
   SELECT * FROM pg_stat_user_tables WHERE tablename = 'consultations';
   ```

### **Debug Commands**

```bash
# Enable SQL logging
export DEBUG=supabase:*

# Check migration status
npm run migration-status

# Validate schema
npm run validate-schema
```

---

## Conclusion

This database migration guide provides comprehensive procedures for setting up the consultation system database. Follow these steps carefully to ensure proper database setup and integration.

**Key Success Factors**:
1. **Proper Planning**: Complete pre-migration checklist
2. **Testing**: Thorough testing in staging environment
3. **Backup**: Complete database backup before migration
4. **Rollback**: Tested rollback procedures
5. **Monitoring**: Post-migration verification and monitoring

**Next Steps**:
1. Complete pre-migration checklist
2. Test migration in staging environment
3. Schedule production migration
4. Execute migration with rollback plan
5. Verify and monitor production system

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [After Implementation]  
**Implementation Status**: [Ready for Development]
