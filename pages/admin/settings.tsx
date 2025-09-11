import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { 
  Settings, 
  Users, 
  Database, 
  Activity, 
  Save, 
  RefreshCw, 
  Plus,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Setting {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  category: string;
  description: string;
  is_public: boolean;
  is_required: boolean;
}

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  permissions: Record<string, unknown>;
  is_active: boolean;
  last_login: string;
  login_count: number;
  created_at: string;
}

interface SystemBackup {
  id: number;
  backup_name: string;
  backup_type: string;
  file_size: number;
  status: string;
  created_at: string;
}

interface SystemLog {
  id: number;
  level: string;
  category: string;
  message: string;
  created_at: string;
}

interface SystemInfo {
  database: {
    settings_count: number;
    users_count: number;
    backups_count: number;
    logs_count: number;
  };
  environment: {
    node_version: string;
    platform: string;
    memory_usage: {
      heapUsed: number;
      heapTotal: number;
      external: number;
    };
    uptime: number;
  };
  timestamp: string;
}

const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('site');
  const [, setLoading] = useState(true);
  const [, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Settings state
  const [settings, setSettings] = useState<Record<string, Setting[]>>({});
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'viewer',
    permissions: {}
  });

  // Backups state
  const [backups, setBackups] = useState<SystemBackup[]>([]);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [newBackup, setNewBackup] = useState({
    backup_name: '',
    backup_type: 'full'
  });

  // System info state
  const [, setSystemInfo] = useState<SystemInfo | null>(null);
  const [, setLogs] = useState<SystemLog[]>([]);

  // Email test state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTest, setEmailTest] = useState({
    to_email: '',
    subject: 'Test Email from YBF Studio',
    message: 'This is a test email to verify email configuration.'
  });

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSettings(),
        loadUsers(),
        loadBackups(),
        loadSystemInfo(),
        loadLogs()
      ]);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings?type=settings');
      const data = await response.json();
      if (response.ok) {
        setSettings(data.settings);
        // Initialize editing state
        const editingState: Record<string, string> = {};
        Object.values(data.settings).flat().forEach((setting: unknown) => {
          const typedSetting = setting as Setting;
          editingState[typedSetting.setting_key] = typedSetting.setting_value;
        });
        setEditingSettings(editingState);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/settings?type=users');
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadBackups = async () => {
    try {
      const response = await fetch('/api/admin/settings?type=backups');
      const data = await response.json();
      if (response.ok) {
        setBackups(data.backups);
      }
    } catch (error) {
      console.error('Failed to load backups:', error);
    }
  };

  const loadSystemInfo = async () => {
    try {
      const response = await fetch('/api/admin/settings?type=system_info');
      const data = await response.json();
      if (response.ok) {
        setSystemInfo(data.system_info);
      }
    } catch (error) {
      console.error('Failed to load system info:', error);
    }
  };

  const loadLogs = async () => {
    try {
      const response = await fetch('/api/admin/settings?type=logs&limit=50');
      const data = await response.json();
      if (response.ok) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const handleSettingChange = (settingKey: string, value: string) => {
    setEditingSettings(prev => ({
      ...prev,
      [settingKey]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const settingsToUpdate = Object.entries(editingSettings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));

      const response = await fetch('/api/admin/settings?type=bulk_settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsToUpdate })
      });

      if (response.ok) {
        setSuccess('Settings saved successfully');
        await loadSettings();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to save settings');
      }
    } catch {
      setError('Failed to save settings');
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/admin/settings?type=user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        setSuccess('User created successfully');
        setShowUserModal(false);
        setNewUser({ email: '', name: '', role: 'viewer', permissions: {} });
        await loadUsers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to create user');
      }
    } catch {
      setError('Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/settings?type=user&id=${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });

      if (response.ok) {
        setSuccess('User updated successfully');
        setEditingUser(null);
        await loadUsers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update user');
      }
    } catch {
      setError('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/settings?type=user&id=${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccess('User deleted successfully');
        await loadUsers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete user');
      }
    } catch {
      setError('Failed to delete user');
    }
  };

  const handleCreateBackup = async () => {
    try {
      const response = await fetch('/api/admin/settings?type=backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBackup)
      });

      if (response.ok) {
        setSuccess('Backup created successfully');
        setShowBackupModal(false);
        setNewBackup({ backup_name: '', backup_type: 'full' });
        await loadBackups();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to create backup');
      }
    } catch {
      setError('Failed to create backup');
    }
  };

  const handleDeleteBackup = async (backupId: number) => {
    if (!confirm('Are you sure you want to delete this backup?')) return;

    try {
      const response = await fetch(`/api/admin/settings?type=backup&id=${backupId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccess('Backup deleted successfully');
        await loadBackups();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete backup');
      }
    } catch {
      setError('Failed to delete backup');
    }
  };

  const handleTestEmail = async () => {
    try {
      const response = await fetch('/api/admin/settings?type=test_email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailTest)
      });

      if (response.ok) {
        setSuccess('Test email sent successfully');
        setShowEmailModal(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to send test email');
      }
    } catch {
      setError('Failed to send test email');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };


  const tabs = [
    { id: 'site', name: 'Site Settings', icon: Settings },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'backups', name: 'Backups', icon: Database },
    { id: 'system', name: 'System Info', icon: Activity }
  ];

  return (
    <AdminLayout>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings & Configuration</h1>
          <button
            onClick={loadData}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-500">{success}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-500">{error}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-neutral-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-amber text-amber'
                      : 'border-transparent text-neutral-400 hover:text-neutral-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Site Settings Tab */}
          {activeTab === 'site' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Site Configuration</h2>
                <button
                  onClick={handleSaveSettings}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save All Settings
                </button>
              </div>

              {Object.entries(settings).map(([category, categorySettings]) => (
                <div key={category} className="card-base">
                  <h3 className="text-lg font-medium mb-4 capitalize">{category} Settings</h3>
                  <div className="space-y-4">
                    {categorySettings.map((setting) => (
                      <div key={setting.id} className="space-y-2">
                        <label className="block text-sm font-medium">
                          {setting.description || setting.setting_key}
                          {setting.is_required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {setting.setting_type === 'boolean' ? (
                          <select
                            value={editingSettings[setting.setting_key] || setting.setting_value}
                            onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
                            className="input-base w-full"
                          >
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                          </select>
                        ) : setting.setting_type === 'number' ? (
                          <input
                            type="number"
                            value={editingSettings[setting.setting_key] || setting.setting_value}
                            onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
                            className="input-base w-full"
                          />
                        ) : setting.setting_type === 'json' ? (
                          <textarea
                            value={editingSettings[setting.setting_key] || setting.setting_value}
                            onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
                            className="input-base w-full h-20"
                            placeholder="Enter JSON data"
                          />
                        ) : (
                          <input
                            type="text"
                            value={editingSettings[setting.setting_key] || setting.setting_value}
                            onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
                            className="input-base w-full"
                          />
                        )}
                        <p className="text-xs text-neutral-500">
                          Key: {setting.setting_key} | Type: {setting.setting_type}
                          {setting.is_public && ' | Public'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Email Test Section */}
              <div className="card-base">
                <h3 className="text-lg font-medium mb-4">Email Configuration Test</h3>
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Test Email Configuration
                </button>
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">User Management</h2>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add User
                </button>
              </div>

              <div className="card-base">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Last Login</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-neutral-800">
                          <td className="py-3 px-4">{user.name}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`badge-${user.role === 'admin' ? 'accent' : user.role === 'editor' ? 'success' : 'neutral'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`badge-${user.is_active ? 'success' : 'neutral'}`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {user.last_login ? formatDate(user.last_login) : 'Never'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="btn-ghost text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="btn-ghost text-sm text-red-500"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Backups Tab */}
          {activeTab === 'backups' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">System Backups</h2>
                <button
                  onClick={() => setShowBackupModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Backup
                </button>
              </div>

              <div className="card-base">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Size</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Created</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backups.map((backup) => (
                        <tr key={backup.id} className="border-b border-neutral-800">
                          <td className="py-3 px-4">{backup.backup_name}</td>
                          <td className="py-3 px-4">
                            <span className="badge-neutral">{backup.backup_type}</span>
                          </td>
                          <td className="py-3 px-4">
                            {backup.file_size ? formatFileSize(backup.file_size) : 'N/A'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`badge-${backup.status === 'completed' ? 'success' : 'neutral'}`}>
                              {backup.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{formatDate(backup.created_at)}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleDeleteBackup(backup.id)}
                              className="btn-ghost text-sm text-red-500"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* System Info Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">System Information</h2>
              <div className="card-base">
                <p className="text-neutral-400">System information will be available in future updates.</p>
              </div>
            </div>
          )}
    </div>

      {/* Modals */}
      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add New User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="input-base w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="input-base w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="input-base w-full"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="btn-primary flex-1"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  disabled
                  className="input-base w-full bg-neutral-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="input-base w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="input-base w-full"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingUser.is_active}
                    onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="btn-primary flex-1"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Create Backup</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Backup Name</label>
                <input
                  type="text"
                  value={newBackup.backup_name}
                  onChange={(e) => setNewBackup({ ...newBackup, backup_name: e.target.value })}
                  className="input-base w-full"
                  placeholder="e.g., Full Backup - Dec 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Backup Type</label>
                <select
                  value={newBackup.backup_type}
                  onChange={(e) => setNewBackup({ ...newBackup, backup_type: e.target.value })}
                  className="input-base w-full"
                >
                  <option value="full">Full Backup</option>
                  <option value="partial">Partial Backup</option>
                  <option value="settings_only">Settings Only</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBackupModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBackup}
                className="btn-primary flex-1"
              >
                Create Backup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Test Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Test Email Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">To Email</label>
                <input
                  type="email"
                  value={emailTest.to_email}
                  onChange={(e) => setEmailTest({ ...emailTest, to_email: e.target.value })}
                  className="input-base w-full"
                  placeholder="jmaconny@ybfstudio.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  value={emailTest.subject}
                  onChange={(e) => setEmailTest({ ...emailTest, subject: e.target.value })}
                  className="input-base w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={emailTest.message}
                  onChange={(e) => setEmailTest({ ...emailTest, message: e.target.value })}
                  className="input-base w-full h-20"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEmailModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleTestEmail}
                className="btn-primary flex-1"
              >
                Send Test Email
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettingsPage; 