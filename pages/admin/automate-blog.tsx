import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import Button from '../../components/ui/Button';

interface AutomationStats {
  totalDrafts: number;
  publishedToday: number;
  lastRun: string;
  nextScheduled: string;
}

const AutomateBlog: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/admin/login');
      return;
    }
    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/automate-blog/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const runAutomation = async (source: string = 'reddit') => {
    setLoading(true);
    addLog(`Starting automation for source: ${source}`);
    
    try {
      const response = await fetch('/api/admin/automate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source, limit: 3 }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          addLog(`❌ Authentication required. Please log in to the admin panel.`);
          router.push('/admin/login');
          return;
        }
        const errorText = await response.text();
        addLog(`❌ HTTP Error ${response.status}: ${errorText}`);
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        addLog(`✅ Generated ${data.drafts} new blog drafts`);
        fetchStats();
      } else {
        addLog(`❌ Automation failed: ${data.error}`);
      }
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🤖 Blog Automation</h1>
          <p className="text-neutral-400">
            Automatically generate blog posts from music industry news and trends
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Total Drafts</h3>
              <p className="text-3xl font-bold text-emerald-400">{stats.totalDrafts}</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Published Today</h3>
              <p className="text-3xl font-bold text-blue-400">{stats.publishedToday}</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Last Run</h3>
              <p className="text-sm text-neutral-300">{stats.lastRun}</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Next Scheduled</h3>
              <p className="text-sm text-neutral-300">{stats.nextScheduled}</p>
            </div>
          </div>
        )}

        {/* Automation Controls */}
        <div className="bg-neutral-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Run Automation</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => runAutomation('reddit')}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? 'Running...' : 'Run Reddit Automation'}
            </Button>
            <Button
              onClick={() => runAutomation('all')}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Run All Sources
            </Button>
          </div>
          <p className="text-sm text-neutral-400 mt-4">
            This will generate 3 blog post drafts from Reddit music production communities.
          </p>
        </div>

        {/* Activity Logs */}
        <div className="bg-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Activity Logs</h2>
          <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-neutral-500">No activity yet. Run automation to see logs.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm text-neutral-300 mb-1 font-mono">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-neutral-800 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">News Sources</h3>
              <ul className="text-sm text-neutral-300 space-y-1">
                <li>• Reddit: r/WeAreTheMusicMakers, r/edmproduction, r/trap</li>
                <li>• Reddit: r/hiphopheads, r/audioengineering, r/mixingmastering</li>
                <li>• Keywords: DAW, Ableton, Pro Tools, mixing, mastering, etc.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Content Focus</h3>
              <ul className="text-sm text-neutral-300 space-y-1">
                <li>• DAWs (Ableton, Pro Tools)</li>
                <li>• Beat Production & Sampling</li>
                <li>• Mixing & Mastering</li>
                <li>• Studio Gear & Recording</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Voice Configuration */}
        <div className="bg-neutral-800 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Johnny Maconny Voice</h2>
          <div className="text-sm text-neutral-300 space-y-2">
            <p><strong>Personality:</strong> Authentic Hustler - speaks from the grind, balancing creativity and business with no BS</p>
            <p><strong>Tone:</strong> Direct & No-Fluff, Confident but not arrogant, Conversational like talking to a homie</p>
            <p><strong>Style:</strong> Lead with hooks, use bullets/lists, highlight benefits over features, keep sentences short</p>
            <p><strong>Vocabulary:</strong> vibe, collab, grind, level up, flow, unlock, inspire, elevate, real, dope, fire, tap in, lock in, roll out</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AutomateBlog;
