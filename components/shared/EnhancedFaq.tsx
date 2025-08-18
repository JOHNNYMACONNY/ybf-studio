import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

interface EnhancedFaqProps {
  items: FaqItem[];
  categories?: string[];
}

const EnhancedFaq: React.FC<EnhancedFaqProps> = ({ items, categories }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            All Questions
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      
      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <div key={index} className="border border-neutral-700 rounded-lg">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-800 transition-colors"
            >
              <span className="font-medium text-white">{item.question}</span>
              {openItems.has(index) ? (
                <ChevronUp className="h-5 w-5 text-neutral-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-neutral-400" />
              )}
            </button>
            {openItems.has(index) && (
              <div className="px-6 pb-4">
                <p className="text-neutral-300 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedFaq; 