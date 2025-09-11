import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Card from '../ui/Card';

interface BlogCardProps {
  post: {
    title: string;
    excerpt: string;
    slug: string;
    imageUrl: string;
    category: string;
  };
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div 
      className="card-3d-spline rounded-xl p-0 overflow-hidden group hover:border-emerald-500/35 transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(38, 38, 38, 0.4) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(38, 38, 38, 0.3) 100%)'
      }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={400}
          height={225}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="p-6">
          <p className="text-sm font-medium text-emerald-400">{post.category}</p>
          <h3 className="mt-2 font-semibold text-white group-hover:text-emerald-300 transition-colors duration-300">{post.title}</h3>
          <p className="mt-2 text-sm text-neutral-300">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300">
            Read More <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
