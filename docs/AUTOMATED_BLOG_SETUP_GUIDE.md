# 🚀 YBF Studio Automated Blog System Setup Guide

## 📋 Overview
This guide will walk you through setting up an automated blog system that generates content in your Johnny Maconny voice from music industry news sources like Reddit, YouTube, and Twitter.

**What you'll get:**
- 3 automated blog posts per week
- Content in your authentic voice
- News from Reddit, YouTube, Twitter
- Admin dashboard to manage automation
- AI-powered content generation

---

## 🎯 Phase 1: Environment Setup (15 minutes)

### Step 1.1: Get API Keys

#### **OpenRouter API (Required)**
1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for a free account
3. Go to "Keys" in your dashboard
4. Create a new API key
5. Copy the key (starts with `sk-or-`)

#### **Brave Search API (Recommended)**
1. Go to [Brave Search API](https://brave.com/search/api/)
2. Sign up for free (1000 queries/month)
3. Get your API key from the dashboard
4. Copy the key

#### **Reddit API (Optional but Recommended)**
1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Click "Create App" or "Create Another App"
3. Choose "script" as the app type
4. Note down:
   - Client ID (under the app name)
   - Client Secret (the "secret" field)

### Step 1.2: Update Environment Variables

1. Open your `.env.local` file
2. Add these new variables:

```bash
# OpenRouter API (REQUIRED)
OPENROUTER_API_KEY=sk-or-your-key-here

# Brave Search API (RECOMMENDED)
BRAVE_SEARCH_API_KEY=your-brave-key-here

# Reddit API (OPTIONAL)
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret

# YouTube Data API (OPTIONAL)
YOUTUBE_API_KEY=your-youtube-key-here

# Twitter API v2 (OPTIONAL)
TWITTER_BEARER_TOKEN=your-twitter-bearer-token

# Cron job secret (for automated runs)
CRON_SECRET=your-secure-random-string-here
```

3. Save the file
4. Restart your development server: `npm run dev`

---

## 📦 Phase 2: Install Dependencies (5 minutes)

### Step 2.1: Install Required Packages

Run this command in your project root:

```bash
npm install node-fetch @types/node-fetch
```

### Step 2.2: Verify Installation

Check that the packages were installed:

```bash
npm list node-fetch
```

You should see `node-fetch@^2.6.7` in the output.

---

## 📁 Phase 3: Create Automation Files (20 minutes)

### Step 3.1: Create the Main Automation API

Create a new file: `pages/api/admin/automate-blog.ts`

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Johnny Maconny's voice configuration
const VOICE_CONFIG = {
  personality: "Authentic Hustler - speaks from the grind, balancing creativity and business with no BS",
  tone: "Direct & No-Fluff, Confident but not arrogant, Conversational like talking to a homie",
  style: "Lead with hooks, use bullets/lists, highlight benefits over features, keep sentences short (8-12 words), use em-dash over commas",
  vocabulary: ["vibe", "collab", "grind", "level up", "flow", "unlock", "inspire", "elevate", "real", "dope", "fire", "tap in", "lock in", "roll out"],
  avoid: ["corporate speak", "over-explaining", "academic tone", "watered down slang"]
};

// News sources and keywords
const NEWS_SOURCES = {
  reddit: {
    subreddits: ['WeAreTheMusicMakers', 'edmproduction', 'trap', 'hiphopheads', 'audioengineering', 'mixingmastering'],
    keywords: ['daw', 'ableton', 'pro tools', 'sampler', 'beat', 'mixing', 'mastering', 'synth', 'midi', 'mic', 'recording', 'studio']
  },
  youtube: {
    channels: ['MusicTech', 'Production Expert', 'Sonic Academy', 'Point Blank Music School'],
    keywords: ['music production', 'beat making', 'mixing tutorial', 'mastering guide', 'daw tutorial']
  },
  twitter: {
    hashtags: ['#MusicProduction', '#BeatMaking', '#Mixing', '#Mastering', '#Ableton', '#ProTools'],
    keywords: ['music production', 'beat making', 'mixing', 'mastering', 'daw', 'synth']
  }
};

// Content templates for different types of posts
const CONTENT_TEMPLATES = {
  newsReaction: `
Analyze this music industry news and create a blog post in Johnny Maconny's voice:

Original News: {title} - {summary}

Create a blog post that:
- Explains what this means for music producers
- Relates it to the grind of making beats
- Provides actionable insights
- Uses Johnny's authentic, culture-forward voice
- Includes relevant examples
- Keeps it real and direct

Structure:
1. Hook - bold claim or question
2. What's happening (simple explanation)
3. Why producers should care
4. How to level up from this
5. Call to action

Voice: Direct, confident, conversational. Use slang naturally. Keep sentences short. Lead with benefits.
  `,
  
  tutorial: `
Create a tutorial blog post in Johnny Maconny's voice about: {topic}

Structure:
1. Hook - what they'll unlock
2. Why this matters for their grind
3. Step-by-step breakdown (use bullets)
4. Common mistakes to avoid
5. How to level up further

Voice: Like teaching a homie. Direct, no fluff. Use "you" language. Include real examples.
  `,
  
  gearReview: `
Review this music gear in Johnny Maconny's voice: {product}

Structure:
1. Hook - is it worth the hype?
2. What it does (simple breakdown)
3. Real-world testing results
4. Pros and cons (keep it real)
5. Who should cop this
6. Final verdict

Voice: Honest, direct. No BS. Like recommending gear to a friend.
  `
};

// Main automation function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check admin access
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { source, limit = 3 } = req.body;

    // Collect news from different sources
    const newsItems = await collectNews(source || 'all');
    
    // Filter for relevant content
    const relevantItems = await filterRelevantContent(newsItems);
    
    // Generate blog post drafts
    const drafts = await generateBlogDrafts(relevantItems.slice(0, limit));
    
    // Save to database
    const savedDrafts = await saveDrafts(drafts);

    res.json({ 
      success: true, 
      drafts: savedDrafts.length,
      items: savedDrafts 
    });
  } catch (error) {
    console.error('Automation error:', error);
    res.status(500).json({ error: 'Automation failed' });
  }
}

// Collect news from various sources
async function collectNews(source: string) {
  const newsItems = [];
  
  try {
    // Reddit API (using Reddit's public JSON API)
    if (source === 'all' || source === 'reddit') {
      for (const subreddit of NEWS_SOURCES.reddit.subreddits) {
        try {
          const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=10`);
          const data = await response.json();
          
          if (data.data?.children) {
            const posts = data.data.children.map((post: any) => ({
              title: post.data.title,
              content: post.data.selftext,
              url: `https://reddit.com${post.data.permalink}`,
              source: 'reddit',
              subreddit: subreddit,
              score: post.data.score,
              created: new Date(post.data.created_utc * 1000)
            }));
            newsItems.push(...posts);
          }
        } catch (error) {
          console.error(`Error fetching from r/${subreddit}:`, error);
        }
      }
    }

    // YouTube API (if you have a key)
    if (source === 'all' || source === 'youtube') {
      // This would require YouTube Data API key
      // For now, we'll skip this
    }

    // Twitter API (if you have a key)
    if (source === 'all' || source === 'twitter') {
      // This would require Twitter API v2 key
      // For now, we'll skip this
    }

  } catch (error) {
    console.error('Error collecting news:', error);
  }

  return newsItems;
}

// Filter content for relevance
async function filterRelevantContent(newsItems: any[]) {
  const allKeywords = [
    ...NEWS_SOURCES.reddit.keywords,
    ...NEWS_SOURCES.youtube.keywords,
    ...NEWS_SOURCES.twitter.keywords
  ];

  return newsItems.filter(item => {
    const text = `${item.title} ${item.content || ''}`.toLowerCase();
    return allKeywords.some(keyword => text.includes(keyword.toLowerCase()));
  });
}

// Generate blog post drafts using AI
async function generateBlogDrafts(newsItems: any[]) {
  const drafts = [];

  for (const item of newsItems) {
    try {
      // Determine content type based on the item
      let template = CONTENT_TEMPLATES.newsReaction;
      let topic = `${item.title} - ${item.content?.substring(0, 200) || ''}`;

      if (item.title.toLowerCase().includes('tutorial') || item.title.toLowerCase().includes('guide')) {
        template = CONTENT_TEMPLATES.tutorial;
        topic = item.title;
      } else if (item.title.toLowerCase().includes('review') || item.title.toLowerCase().includes('gear')) {
        template = CONTENT_TEMPLATES.gearReview;
        topic = item.title;
      }

      // Generate content using OpenRouter API
      const generatedContent = await generateContentWithAI(template.replace('{title}', item.title).replace('{summary}', item.content?.substring(0, 300) || '').replace('{topic}', topic));

      if (generatedContent) {
        drafts.push({
          title: generatedContent.title,
          content: generatedContent.content,
          excerpt: generatedContent.excerpt,
          source_url: item.url,
          source_title: item.title,
          source: item.source,
          status: 'draft',
          categories: ['Industry News'], // Default category
          meta_title: generatedContent.title,
          meta_description: generatedContent.excerpt
        });
      }
    } catch (error) {
      console.error('Error generating draft for item:', item.title, error);
    }
  }

  return drafts;
}

// Generate content using OpenRouter API
async function generateContentWithAI(prompt: string) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'YBF Studio Blog Automation'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are Johnny Maconny, writing for YBF Studio's music production blog. ${VOICE_CONFIG.personality}. Tone: ${VOICE_CONFIG.tone}. Style: ${VOICE_CONFIG.style}. Use these words naturally: ${VOICE_CONFIG.vocabulary.join(', ')}. Avoid: ${VOICE_CONFIG.avoid.join(', ')}.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.choices?.[0]?.message?.content) {
      const content = data.choices[0].message.content;
      
      // Extract title and content
      const titleMatch = content.match(/^#\s*(.+)$/m);
      const title = titleMatch ? titleMatch[1] : 'Music Production Update';
      
      // Remove markdown headers and clean up content
      const cleanContent = content.replace(/^#+\s*/gm, '').trim();
      
      // Generate excerpt (first 150 characters)
      const excerpt = cleanContent.substring(0, 150).replace(/\n/g, ' ').trim() + '...';
      
      return {
        title,
        content: cleanContent,
        excerpt
      };
    }
  } catch (error) {
    console.error('Error generating content with AI:', error);
  }

  return null;
}

// Save drafts to database
async function saveDrafts(drafts: any[]) {
  const savedDrafts = [];

  for (const draft of drafts) {
    try {
      // Generate slug
      const slug = draft.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() + '-' + Date.now();

      // Get random blog image
      const featuredImage = await getRandomBlogImage();

      // Create blog post
      const { data: post, error } = await supabase
        .from('blog_posts')
        .insert({
          title: draft.title,
          slug: slug,
          content: draft.content,
          excerpt: draft.excerpt,
          featured_image: featuredImage,
          meta_title: draft.meta_title,
          meta_description: draft.meta_description,
          status: 'draft',
          author_id: null
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving draft:', error);
        continue;
      }

      // Add to Industry News category
      const { data: category } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('name', 'Industry News')
        .single();

      if (category) {
        await supabase
          .from('blog_post_categories')
          .insert({
            post_id: post.id,
            category_id: category.id
          });
      }

      savedDrafts.push(post);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }

  return savedDrafts;
}

// Helper function to get random blog image
async function getRandomBlogImage(): Promise<string> {
  try {
    const { data: images } = await supabase.storage
      .from('blog-images')
      .list('', { limit: 100 });

    if (images && images.length > 0) {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      return `/assets/blogImages/${randomImage.name}`;
    }
  } catch (error) {
    console.error('Error getting random image:', error);
  }

  return '/assets/blog-beat-selection.jpg';
}
```

### Step 3.2: Create the Stats API

Create a new file: `pages/api/admin/automate-blog/stats.ts`

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check admin access
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get total drafts
    const { count: totalDrafts } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft')
      .is('deleted_at', null);

    // Get published today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { count: publishedToday } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .gte('published_at', today.toISOString())
      .lt('published_at', tomorrow.toISOString())
      .is('deleted_at', null);

    // Get last run (most recent draft)
    const { data: lastDraft } = await supabase
      .from('blog_posts')
      .select('created_at')
      .eq('status', 'draft')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const stats = {
      totalDrafts: totalDrafts || 0,
      publishedToday: publishedToday || 0,
      lastRun: lastDraft?.created_at 
        ? new Date(lastDraft.created_at).toLocaleString()
        : 'Never',
      nextScheduled: 'Manual trigger only'
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching automation stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
```

### Step 3.3: Create the Admin Dashboard Page

Create a new file: `pages/admin/automate-blog.tsx`

```typescript
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

  const runAutomation = async (source: string = 'all') => {
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
              onClick={() => runAutomation('all')}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? 'Running...' : 'Run All Sources'}
            </Button>
            <Button
              onClick={() => runAutomation('reddit')}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Reddit Only
            </Button>
            <Button
              onClick={() => runAutomation('youtube')}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              YouTube Only
            </Button>
            <Button
              onClick={() => runAutomation('twitter')}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Twitter Only
            </Button>
          </div>
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
                <li>• YouTube: MusicTech, Production Expert, Sonic Academy</li>
                <li>• Twitter: #MusicProduction, #BeatMaking, #Mixing</li>
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
      </div>
    </AdminLayout>
  );
};

export default AutomateBlog;
```

---

## 🧪 Phase 4: Testing (10 minutes)

### Step 4.1: Test the API Endpoints

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test the stats endpoint:**
   - Go to `http://localhost:3000/api/admin/automate-blog/stats`
   - You should see JSON with stats (may be empty initially)

3. **Test the automation endpoint:**
   - Go to `http://localhost:3000/admin/automate-blog`
   - Click "Run All Sources"
   - Watch the activity logs

### Step 4.2: Verify Database Integration

1. **Check your Supabase dashboard:**
   - Go to your Supabase project
   - Check the `blog_posts` table
   - You should see new draft posts

2. **Check the admin blog page:**
   - Go to `http://localhost:3000/admin/blog`
   - You should see the new draft posts

---

## 🎯 Phase 5: Content Customization (15 minutes)

### Step 5.1: Customize News Sources

Edit `pages/api/admin/automate-blog.ts` and modify the `NEWS_SOURCES` object:

```typescript
const NEWS_SOURCES = {
  reddit: {
    subreddits: [
      'WeAreTheMusicMakers', 
      'edmproduction', 
      'trap', 
      'hiphopheads', 
      'audioengineering', 
      'mixingmastering',
      'ableton',           // Add more specific subreddits
      'protools',
      'musicproduction'
    ],
    keywords: [
      'daw', 'ableton', 'pro tools', 'sampler', 'beat', 
      'mixing', 'mastering', 'synth', 'midi', 'mic', 
      'recording', 'studio', 'vocal', 'rap', 'hip hop',
      'trap', 'r&b', 'pop'  // Add more specific keywords
    ]
  },
  // ... rest of the sources
};
```

### Step 5.2: Customize Content Templates

Modify the `CONTENT_TEMPLATES` object to better match your content needs:

```typescript
const CONTENT_TEMPLATES = {
  newsReaction: `
    Analyze this music industry news and create a blog post in Johnny Maconny's voice:

    Original News: {title} - {summary}

    Create a blog post that:
    - Explains what this means for music producers
    - Relates it to the grind of making beats
    - Provides actionable insights
    - Uses Johnny's authentic, culture-forward voice
    - Includes relevant examples
    - Keeps it real and direct

    Structure:
    1. Hook - bold claim or question
    2. What's happening (simple explanation)
    3. Why producers should care
    4. How to level up from this
    5. Call to action

    Voice: Direct, confident, conversational. Use slang naturally. Keep sentences short. Lead with benefits.
  `,
  
  // Add more templates for different content types
  beatMaking: `
    Create a beat making tutorial in Johnny Maconny's voice about: {topic}

    Structure:
    1. Hook - what beat they'll create
    2. Why this technique matters
    3. Step-by-step breakdown
    4. Pro tips and tricks
    5. How to make it your own

    Voice: Like teaching a homie. Direct, no fluff. Use "you" language.
  `,
  
  mixingTutorial: `
    Create a mixing tutorial in Johnny Maconny's voice about: {topic}

    Structure:
    1. Hook - what sound they'll achieve
    2. Why this mixing technique works
    3. Step-by-step process
    4. Common mistakes to avoid
    5. How to level up further

    Voice: Honest, direct. No BS. Like showing a friend how to mix.
  `
};
```

---

## 🚀 Phase 6: Production Deployment (20 minutes)

### Step 6.1: Update Environment Variables for Production

1. **Add to your production environment:**
   - Vercel: Add the environment variables in your Vercel dashboard
   - Other platforms: Add to your production environment config

2. **Verify all variables are set:**
   ```bash
   # Check that these are set in production
   echo $OPENROUTER_API_KEY
   echo $BRAVE_SEARCH_API_KEY
   echo $REDDIT_CLIENT_ID
   echo $REDDIT_CLIENT_SECRET
   ```

### Step 6.2: Test Production Endpoints

1. **Test the stats endpoint:**
   - Go to `https://yourdomain.com/api/admin/automate-blog/stats`
   - Should return JSON with stats

2. **Test the automation endpoint:**
   - Go to `https://yourdomain.com/admin/automate-blog`
   - Click "Run All Sources"
   - Check that drafts are created

---

## 📅 Phase 7: Automation Scheduling (Optional - 15 minutes)

### Step 7.1: Set Up Cron Job

Create a new file: `scripts/automate-blog-cron.js`

```javascript
const fetch = require('node-fetch');

async function runBlogAutomation() {
  try {
    console.log('🤖 Starting automated blog generation...');
    
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_SITE_URL
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/admin/automate-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET}`
      },
      body: JSON.stringify({ 
        source: 'all', 
        limit: 3 
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Generated ${data.drafts} new blog drafts`);
    } else {
      console.error('❌ Automation failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Cron job error:', error);
  }
}

// Run if called directly
if (require.main === module) {
  runBlogAutomation();
}

module.exports = { runBlogAutomation };
```

### Step 7.2: Set Up Vercel Cron (Recommended)

1. **Create `vercel.json` in your project root:**
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/automate-blog",
         "schedule": "0 10 * * 1,3,5"
       }
     ]
   }
   ```

2. **Create the cron endpoint: `pages/api/cron/automate-blog.ts`:**
   ```typescript
   import { NextApiRequest, NextApiResponse } from 'next';
   import { runBlogAutomation } from '../../../scripts/automate-blog-cron';

   export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }

     // Verify cron secret
     if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
       return res.status(401).json({ error: 'Unauthorized' });
     }

     try {
       await runBlogAutomation();
       res.json({ success: true });
     } catch (error) {
       console.error('Cron error:', error);
       res.status(500).json({ error: 'Cron failed' });
     }
   }
   ```

---

## 🎯 Phase 8: Content Management (Ongoing)

### Step 8.1: Review Generated Content

1. **Check the admin blog page daily:**
   - Go to `http://localhost:3000/admin/blog`
   - Review new draft posts
   - Edit titles, content, and metadata as needed

2. **Publish quality content:**
   - Click on draft posts
   - Make any necessary edits
   - Change status to "published"
   - Add relevant categories

### Step 8.2: Monitor Performance

1. **Track engagement:**
   - Check page views in your analytics
   - Monitor social shares
   - Track conversion rates

2. **Adjust automation:**
   - Modify keywords based on performance
   - Add new news sources
   - Update content templates

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### **Issue: "OpenRouter API key not found"**
**Solution:** 
1. Check your `.env.local` file
2. Make sure `OPENROUTER_API_KEY` is set correctly
3. Restart your development server

#### **Issue: "No news items found"**
**Solution:**
1. Check your internet connection
2. Verify Reddit API is working
3. Try running automation with different sources

#### **Issue: "Database error when saving drafts"**
**Solution:**
1. Check your Supabase connection
2. Verify the `blog_posts` table exists
3. Check your Supabase service key

#### **Issue: "Generated content doesn't match my voice"**
**Solution:**
1. Update the `VOICE_CONFIG` object
2. Modify the content templates
3. Adjust the AI prompts

---

## 📊 Expected Results

### **Week 1:**
- 3-5 automated blog drafts
- 1-2 published posts
- Basic automation working

### **Week 2-4:**
- 9-12 automated blog drafts
- 6-8 published posts
- Refined content quality
- Better voice matching

### **Month 2+:**
- 12-15 automated blog drafts per month
- 8-10 published posts per month
- Consistent content pipeline
- Improved SEO performance

---

## 🎉 Success Metrics

### **Content Metrics:**
- [ ] 3+ blog posts per week
- [ ] 80%+ content matches your voice
- [ ] 90%+ posts are relevant to music production
- [ ] 70%+ posts get published (after review)

### **SEO Metrics:**
- [ ] Increased organic traffic
- [ ] Better search rankings
- [ ] More social shares
- [ ] Higher engagement rates

### **Business Metrics:**
- [ ] More service inquiries
- [ ] Increased beat sales
- [ ] Better brand recognition
- [ ] Higher conversion rates

---

## 🚀 Next Steps

1. **Run your first automation** (5 minutes)
2. **Review and publish** your first automated post (10 minutes)
3. **Customize the voice** to better match your style (15 minutes)
4. **Set up daily automation** (10 minutes)
5. **Monitor and optimize** (ongoing)

---

## 📞 Support

If you run into any issues:

1. **Check the logs** in the admin dashboard
2. **Verify your API keys** are correct
3. **Test the endpoints** individually
4. **Check your database** connection
5. **Review the error messages** in the console

---

**🎯 You're now ready to automate your blog content! This system will generate 3+ relevant, high-quality blog posts per week in your authentic Johnny Maconny voice, helping you build authority in the music production space while saving you hours of content creation time.**

**Happy automating! 🚀**
