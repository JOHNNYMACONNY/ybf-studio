interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Generates a table of contents from HTML content by extracting headings
 */
export function generateTableOfContents(htmlContent: string): TocItem[] {
  if (!htmlContent) return [];

  // Create a temporary DOM element to parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Find all headings (h1, h2, h3, h4, h5, h6)
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  const tocItems: TocItem[] = [];
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const text = heading.textContent?.trim() || '';
    
    if (text) {
      // Generate a unique ID for the heading
      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      
      // Set the ID on the heading element for anchor links
      heading.id = id;
      
      tocItems.push({
        id,
        text,
        level
      });
    }
  });
  
  return tocItems;
}

/**
 * Renders the table of contents as HTML
 */
export function renderTableOfContents(tocItems: TocItem[]): string {
  if (tocItems.length === 0) return '';

  let html = '<ul class="space-y-3 text-sm text-neutral-300">';
  
  tocItems.forEach((item) => {
    const indentClass = item.level > 2 ? 'ml-4' : '';
    html += `
      <li class="${indentClass}">
        <a href="#${item.id}" class="hover:text-amber-400 transition-colors duration-300 flex items-center gap-3 group">
          <div class="w-1 h-1 bg-neutral-500 rounded-full group-hover:bg-amber-400 transition-colors"></div>
          ${item.text}
        </a>
      </li>
    `;
  });
  
  html += '</ul>';
  return html;
}

/**
 * Adds IDs to headings in HTML content for anchor linking
 */
export function addHeadingIds(htmlContent: string): string {
  if (!htmlContent) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  headings.forEach((heading, index) => {
    const text = heading.textContent?.trim() || '';
    if (text && !heading.id) {
      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      heading.id = id;
    }
  });
  
  return doc.body.innerHTML;
}

/**
 * Estimates reading time based on content length
 */
export function estimateReadingTime(htmlContent: string): number {
  if (!htmlContent) return 0;

  // Remove HTML tags and count words
  const textContent = htmlContent.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(/\s+/).length;
  
  // Average reading speed: 200-250 words per minute
  const wordsPerMinute = 225;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, minutes); // Minimum 1 minute
}
