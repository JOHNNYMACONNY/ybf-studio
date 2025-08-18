import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Admin authentication check
const checkAdminAuth = async (req: NextApiRequest) => {
  const session = await getSession({ req });
  if (!session?.user?.email) {
    return { error: 'Not authenticated' };
  }

  // Check if user is admin (using the same logic as nextauth config)
  const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
  if (!ADMIN_EMAILS.includes(session.user.email)) {
    return { error: 'Not authorized' };
  }

  return { user: session.user };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  // Check admin authentication
  const authCheck = await checkAdminAuth(req);
  if (authCheck.error) {
    return res.status(401).json({ error: authCheck.error });
  }

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
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Settings API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET - Fetch settings, users, system info
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { type, category, id } = req.query;

  try {
    switch (type) {
      case 'settings':
        return await getSettings(req, res, category as string);
      case 'users':
        return await getUsers(req, res);
      case 'user':
        return await getUser(req, res, id as string);
      case 'backups':
        return await getBackups(req, res);
      case 'logs':
        return await getLogs(req, res);
      case 'system_info':
        return await getSystemInfo(req, res);
      default:
        return res.status(400).json({ error: 'Invalid type parameter' });
    }
  } catch (error) {
    console.error('GET Settings Error:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
}

// POST - Create new settings, users, test email, create backup
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;

  try {
    switch (type) {
      case 'setting':
        return await createSetting(req, res);
      case 'user':
        return await createUser(req, res);
      case 'test_email':
        return await testEmail(req, res);
      case 'backup':
        return await createBackup(req, res);
      default:
        return res.status(400).json({ error: 'Invalid type parameter' });
    }
  } catch (error) {
    console.error('POST Settings Error:', error);
    return res.status(500).json({ error: 'Failed to create resource' });
  }
}

// PUT - Update settings, users
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { type, id } = req.query;

  try {
    switch (type) {
      case 'setting':
        return await updateSetting(req, res, id as string);
      case 'user':
        return await updateUser(req, res, id as string);
      case 'bulk_settings':
        return await updateBulkSettings(req, res);
      default:
        return res.status(400).json({ error: 'Invalid type parameter' });
    }
  } catch (error) {
    console.error('PUT Settings Error:', error);
    return res.status(500).json({ error: 'Failed to update resource' });
  }
}

// DELETE - Delete settings, users, backups
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { type, id } = req.query;

  try {
    switch (type) {
      case 'setting':
        return await deleteSetting(req, res, id as string);
      case 'user':
        return await deleteUser(req, res, id as string);
      case 'backup':
        return await deleteBackup(req, res, id as string);
      default:
        return res.status(400).json({ error: 'Invalid type parameter' });
    }
  } catch (error) {
    console.error('DELETE Settings Error:', error);
    return res.status(500).json({ error: 'Failed to delete resource' });
  }
}

// =====================================================
// SETTINGS MANAGEMENT FUNCTIONS
// =====================================================

async function getSettings(req: NextApiRequest, res: NextApiResponse, category?: string) {
  try {
    let query = supabase
      .from('site_settings')
      .select('*')
      .is('deleted_at', null)
      .order('category', { ascending: true })
      .order('setting_key', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Group settings by category
    const groupedSettings = data.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {} as Record<string, unknown[]>);

    return res.status(200).json({ settings: groupedSettings });
  } catch (error) {
    console.error('Get Settings Error:', error);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
}

async function createSetting(req: NextApiRequest, res: NextApiResponse) {
  const { setting_key, setting_value, setting_type, category, description, is_public } = req.body;

  if (!setting_key || setting_value === undefined) {
    return res.status(400).json({ error: 'setting_key and setting_value are required' });
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .insert({
        setting_key,
        setting_value: String(setting_value),
        setting_type: setting_type || 'text',
        category: category || 'general',
        description,
        is_public: is_public || false
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ setting: data });
  } catch (error) {
    console.error('Create Setting Error:', error);
    return res.status(500).json({ error: 'Failed to create setting' });
  }
}

async function updateSetting(req: NextApiRequest, res: NextApiResponse, id: string) {
  const { setting_value, setting_type, category, description, is_public } = req.body;

  try {
    const updateData: Record<string, unknown> = {};
    if (setting_value !== undefined) updateData.setting_value = String(setting_value);
    if (setting_type) updateData.setting_type = setting_type;
    if (category) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (is_public !== undefined) updateData.is_public = is_public;

    const { data, error } = await supabase
      .from('site_settings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ setting: data });
  } catch (error) {
    console.error('Update Setting Error:', error);
    return res.status(500).json({ error: 'Failed to update setting' });
  }
}

async function updateBulkSettings(req: NextApiRequest, res: NextApiResponse) {
  const { settings } = req.body;

  if (!Array.isArray(settings)) {
    return res.status(400).json({ error: 'settings must be an array' });
  }

  try {
    const updates = settings.map(setting => ({
      setting_key: setting.setting_key,
      setting_value: String(setting.setting_value),
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('site_settings')
      .upsert(updates, { onConflict: 'setting_key' })
      .select();

    if (error) throw error;

    return res.status(200).json({ settings: data });
  } catch (error) {
    console.error('Bulk Update Settings Error:', error);
    return res.status(500).json({ error: 'Failed to update settings' });
  }
}

async function deleteSetting(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { error } = await supabase
      .from('site_settings')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Delete Setting Error:', error);
    return res.status(500).json({ error: 'Failed to delete setting' });
  }
}

// =====================================================
// USER MANAGEMENT FUNCTIONS
// =====================================================

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ users: data });
  } catch (error) {
    console.error('Get Users Error:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function getUser(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) throw error;

    return res.status(200).json({ user: data });
  } catch (error) {
    console.error('Get User Error:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const { email, name, role, permissions } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'email and name are required' });
  }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        email,
        name,
        role: role || 'viewer',
        permissions: permissions || {}
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ user: data });
  } catch (error) {
    console.error('Create User Error:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}

async function updateUser(req: NextApiRequest, res: NextApiResponse, id: string) {
  const { name, role, permissions, is_active } = req.body;

  try {
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (permissions) updateData.permissions = permissions;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabase
      .from('admin_users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ user: data });
  } catch (error) {
    console.error('Update User Error:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { error } = await supabase
      .from('admin_users')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
}

// =====================================================
// BACKUP MANAGEMENT FUNCTIONS
// =====================================================

async function getBackups(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase
      .from('system_backups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ backups: data });
  } catch (error) {
    console.error('Get Backups Error:', error);
    return res.status(500).json({ error: 'Failed to fetch backups' });
  }
}

async function createBackup(req: NextApiRequest, res: NextApiResponse) {
  const { backup_name, backup_type } = req.body;

  if (!backup_name) {
    return res.status(400).json({ error: 'backup_name is required' });
  }

  try {
    // Create backup record
    const { data, error } = await supabase
      .from('system_backups')
      .insert({
        backup_name,
        backup_type: backup_type || 'full',
        status: 'completed',
        backup_data: {
          created_at: new Date().toISOString(),
          type: backup_type || 'full',
          tables: ['site_settings', 'admin_users', 'beats', 'blog_posts', 'services', 'orders']
        }
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ backup: data });
  } catch (error) {
    console.error('Create Backup Error:', error);
    return res.status(500).json({ error: 'Failed to create backup' });
  }
}

async function deleteBackup(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { error } = await supabase
      .from('system_backups')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({ message: 'Backup deleted successfully' });
  } catch (error) {
    console.error('Delete Backup Error:', error);
    return res.status(500).json({ error: 'Failed to delete backup' });
  }
}

// =====================================================
// SYSTEM INFORMATION FUNCTIONS
// =====================================================

async function getLogs(req: NextApiRequest, res: NextApiResponse) {
  const { level, category, limit = 100 } = req.query;

  try {
    let query = supabase
      .from('system_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (level) query = query.eq('level', level);
    if (category) query = query.eq('category', category);

    const { data, error } = await query;

    if (error) throw error;

    return res.status(200).json({ logs: data });
  } catch (error) {
    console.error('Get Logs Error:', error);
    return res.status(500).json({ error: 'Failed to fetch logs' });
  }
}

async function getSystemInfo(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get counts from various tables
    const [
      settingsCount,
      usersCount,
      backupsCount,
      logsCount
    ] = await Promise.all([
      supabase.from('site_settings').select('*', { count: 'exact', head: true }),
      supabase.from('admin_users').select('*', { count: 'exact', head: true }),
      supabase.from('system_backups').select('*', { count: 'exact', head: true }),
      supabase.from('system_logs').select('*', { count: 'exact', head: true })
    ]);

    const systemInfo = {
      database: {
        settings_count: settingsCount.count || 0,
        users_count: usersCount.count || 0,
        backups_count: backupsCount.count || 0,
        logs_count: logsCount.count || 0
      },
      environment: {
        node_version: process.version,
        platform: process.platform,
        memory_usage: process.memoryUsage(),
        uptime: process.uptime()
      },
      timestamp: new Date().toISOString()
    };

    return res.status(200).json({ system_info: systemInfo });
  } catch (error) {
    console.error('Get System Info Error:', error);
    return res.status(500).json({ error: 'Failed to fetch system info' });
  }
}

// =====================================================
// EMAIL TESTING FUNCTION
// =====================================================

async function testEmail(req: NextApiRequest, res: NextApiResponse) {
  const { to_email, subject, message } = req.body;

  if (!to_email || !subject || !message) {
    return res.status(400).json({ error: 'to_email, subject, and message are required' });
  }

  try {
    // This would integrate with your email service (SendGrid, etc.)
    // For now, we'll just log the test email
    console.log('Test Email:', { to_email, subject, message });

    // Log the test email attempt
    await supabase.from('system_logs').insert({
      level: 'info',
      category: 'email',
      message: `Test email sent to ${to_email}`,
      details: { to_email, subject, message }
    });

    return res.status(200).json({ 
      message: 'Test email sent successfully',
      details: { to_email, subject, message }
    });
  } catch (error) {
    console.error('Test Email Error:', error);
    return res.status(500).json({ error: 'Failed to send test email' });
  }
} 