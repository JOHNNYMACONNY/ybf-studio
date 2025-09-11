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
  style: "Lead with hooks, use bullets/lists, highlight benefits over features, keep sentences short (8-12 words), use commas instead of em-dashes",
  vocabulary: ["vibe", "collab", "grind", "level up", "flow", "unlock", "inspire", "elevate", "real", "dope", "fire", "tap in", "lock in", "roll out"],
  avoid: ["corporate speak", "over-explaining", "academic tone", "watered down slang", "exclamation marks", "em-dashes", "overly excited punctuation"]
};

// News sources and keywords
const NEWS_SOURCES = {
  reddit: {
    subreddits: ['WeAreTheMusicMakers', 'edmproduction', 'trap', 'hiphopheads', 'audioengineering', 'mixingmastering'],
    keywords: ['daw', 'ableton', 'pro tools', 'sampler', 'beat', 'mixing', 'mastering', 'synth', 'midi', 'mic', 'recording', 'studio', 'vocal', 'rap', 'hip hop', 'trap', 'r&b', 'pop']
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

IMPORTANT: Format the response as HTML, not markdown. Use proper HTML tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>.

Structure:
1. Hook - bold claim or question (use <h2>)
2. What's happening (simple explanation in <p>)
3. Why producers should care (use <h3> and <p>)
4. How to level up from this (use <ul> and <li>)
5. Call to action (use <p>)

Voice: Direct, confident, conversational. Use slang naturally. Keep sentences short. Lead with benefits.
  `,
  
  tutorial: `
Create a tutorial blog post in Johnny Maconny's voice about: {topic}

IMPORTANT: Format the response as HTML, not markdown. Use proper HTML tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>.

Structure:
1. Hook - what they'll unlock (use <h2>)
2. Why this matters for their grind (use <h3> and <p>)
3. Step-by-step breakdown (use <ul> and <li>)
4. Common mistakes to avoid (use <h3> and <p>)
5. How to level up further (use <p>)

Voice: Like teaching a homie. Direct, no fluff. Use "you" language. Include real examples.
  `,
  
  gearReview: `
Review this music gear in Johnny Maconny's voice: {product}

IMPORTANT: Format the response as HTML, not markdown. Use proper HTML tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>.

Structure:
1. Hook - is it worth the hype? (use <h2>)
2. What it does (simple breakdown in <p>)
3. Real-world testing results (use <h3> and <p>)
4. Pros and cons (keep it real, use <ul> and <li>)
5. Who should cop this (use <h3> and <p>)
6. Final verdict (use <p>)

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
    const newsItems = await collectNews(source || 'reddit');
    
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
    if (source === 'reddit' || source === 'all') {
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

  } catch (error) {
    console.error('Error collecting news:', error);
  }

  return newsItems;
}

// Filter content for relevance
async function filterRelevantContent(newsItems: any[]) {
  const allKeywords = NEWS_SOURCES.reddit.keywords;

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

// Convert markdown to HTML
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Convert headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Convert bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Convert italic text
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Convert unordered lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  
  // Convert ordered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>');
  
  // Convert line breaks to paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  // Convert single line breaks to <br>
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

// Generate content using OpenRouter API
async function generateContentWithAI(prompt: string) {
  try {
    // Check if OpenRouter API key is available
    if (!process.env.OPENROUTER_API_KEY) {
      console.log('OpenRouter API key not found, using fallback content generation');
      return generateFallbackContent(prompt);
    }

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
            content: `You are Johnny Maconny, writing for YBF Studio's music production blog. ${VOICE_CONFIG.personality}. Tone: ${VOICE_CONFIG.tone}. Style: ${VOICE_CONFIG.style}. Use these words naturally: ${VOICE_CONFIG.vocabulary.join(', ')}. Avoid: ${VOICE_CONFIG.avoid.join(', ')}.

WRITING RULES:
- NO exclamation marks (!) - use periods instead
- NO em-dashes (—) - use commas or periods instead  
- NO overly excited punctuation
- Keep it conversational but professional
- Use periods, commas, and question marks only

IMPORTANT: Always format your response as HTML, not markdown. Use proper HTML tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>. Do not use markdown syntax like #, *, -, etc.`
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
      const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/i) || content.match(/<h2[^>]*>(.*?)<\/h2>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : 'Music Production Update';
      
      // Content is already HTML, just clean it up
      const htmlContent = content.trim();
      
      // Generate excerpt (first 150 characters, strip HTML tags)
      const plainText = htmlContent.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
      const excerpt = plainText.substring(0, 150) + '...';
      
      return {
        title,
        content: htmlContent,
        excerpt
      };
    }
  } catch (error) {
    console.error('Error generating content with AI:', error);
  }

  // Fallback to basic content generation
  return generateFallbackContent(prompt);
}

// Fallback content generation when AI is not available
function generateFallbackContent(prompt: string) {
  const title = 'Music Production Update';
  const content = `
    <h2>What's Poppin' in the Music Game</h2>
    <p>Yo, producers! There's some real talk happening in the industry right now that you need to tap into.</p>
    
    <h3>Why This Matters for Your Grind</h3>
    <p>This isn't just some random news — this directly impacts how you're making beats and building your sound. Here's what you need to know:</p>
    
    <ul>
      <li>Level up your production game</li>
      <li>Stay ahead of the trends</li>
      <li>Connect with the community</li>
    </ul>
    
    <h3>How to Lock In</h3>
    <p>Don't just read this and keep it moving. Take action, experiment with new techniques, and keep pushing your sound forward.</p>
    
    <p><strong>Ready to elevate your production? Let's get it! 🔥</strong></p>
  `;
  
  const excerpt = "Stay updated with the latest music production trends and techniques that matter for your grind.";
  
  return {
    title,
    content,
    excerpt
  };
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
    // Try to get images from Supabase storage first
    const { data: images } = await supabase.storage
      .from('blog-images')
      .list('', { limit: 100 });

    if (images && images.length > 0) {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      return `/assets/blogImages/${randomImage.name}`;
    }
  } catch (error) {
    console.error('Error getting random image from storage:', error);
  }

  // Fallback to default image
  return '/assets/blog-beat-selection.jpg';
}
