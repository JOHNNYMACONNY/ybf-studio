import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="rounded-xl bg-black ring-1 ring-neutral-800/60 overflow-hidden">
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex justify-between items-center text-left p-6 hover:bg-neutral-900 transition"
          >
            <span className="font-semibold">{item.question}</span>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
            />
          </button>
          {openIndex === index && (
            <div className="px-6 pb-6 text-neutral-400 animate-fadeUp">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;