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

  // Use regex to find headings since DOMParser doesn't work in SSR
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
  const tocItems: TocItem[] = [];
  let match;
  let index = 0;

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, '').trim(); // Remove any HTML tags from the text
    
    if (text) {
      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      
      tocItems.push({
        id,
        text,
        level
      });
      index++;
    }
  }
  
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

  // Use regex to add IDs to headings
  const headingRegex = /<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/gi;
  let index = 0;
  
  return htmlContent.replace(headingRegex, (match, level, attributes, content) => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    if (text) {
      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      index++;
      return `<h${level}${attributes} id="${id}">${content}</h${level}>`;
    }
    return match;
  });
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
