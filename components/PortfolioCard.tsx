import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';

interface PortfolioCardProps {
  project: {
    title: string;
    artist: string;
    imageUrl: string;
    url: string;
  };
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project }) => {
  return (
    <div className="card-interactive group overflow-hidden p-0">
      <Link href={project.url} target="_blank" rel="noopener noreferrer">
        <div className="relative">
          <Image
            src={project.imageUrl}
            alt={project.title}
            width={400}
            height={400}
            className="w-full h-auto object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <PlayCircle className="h-16 w-16 text-white hover:scale-110 transition-transform duration-200" />
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-card-title text-display">{project.title}</h3>
          <p className="text-neutral-500">{project.artist}</p>
        </div>
      </Link>
    </div>
  );
};

export default PortfolioCard;