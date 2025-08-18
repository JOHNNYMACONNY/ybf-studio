export interface Post {
  title: string;
  excerpt: string;
  slug: string;
  imageUrl: string;
  category: string;
  date: string;
  author: string;
  authorAvatar: string;
  content: string;
}

const allPosts: Post[] = [
  { 
    title: '5 Common Mistakes to Avoid When Mixing Vocals', 
    excerpt: 'Learn how to get clean, professional-sounding vocals by avoiding these simple but critical errors.', 
    slug: 'mixing-vocals-mistakes', 
    imageUrl: '/images/blog1.jpg', 
    category: 'Mixing Tips',
    date: 'October 26, 2023',
    author: 'Bobby',
    authorAvatar: '/images/avatar.png',
    content: `
      <p>Getting vocals to sit perfectly in a mix is both an art and a science. Here are five common mistakes that can ruin an otherwise great vocal track:</p>
      <h3>1. Over-compressing</h3>
      <p>While compression is essential for taming dynamics, too much of it can squash the life out of a performance. Use multiple stages of light compression instead of one heavy-handed compressor.</p>
      <h3>2. Not Using De-essing</h3>
      <p>Sibilance (the harsh 's' and 't' sounds) can be incredibly distracting. A de-esser is a specific tool designed to target these frequencies without affecting the overall vocal tone.</p>
      <h3>3. Ignoring EQ</h3>
      <p>Every voice is different. Use a surgical EQ to cut out muddy low-mid frequencies (around 200-500Hz) and add a touch of "air" with a high-shelf boost above 10kHz.</p>
    `
  },
  { 
    title: 'How to Choose the Right Beat for Your Song', 
    excerpt: 'Your beat selection can make or break a track. Here’s our guide to finding the perfect instrumental.', 
    slug: 'choosing-the-right-beat', 
    imageUrl: '/images/blog2.jpg', 
    category: 'Beat Making',
    date: 'October 15, 2023',
    author: 'Bobby',
    authorAvatar: '/images/avatar.png',
    content: `<p>The instrumental is the foundation of your song. Choosing the right one is critical. Consider the key, tempo, and most importantly, the emotion. Does it match the story you're trying to tell with your lyrics? Don't be afraid to experiment with different genres to find the perfect fit.</p>`
  },
  // Add full content for other posts here...
];

export function getAllPosts() {
  return allPosts;
}

export function getPostBySlug(slug: string) {
  return allPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, count: number = 2) {
  return allPosts.filter(post => post.slug !== currentSlug).slice(0, count);
}