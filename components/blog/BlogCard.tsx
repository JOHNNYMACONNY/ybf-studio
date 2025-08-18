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
    <Card className="p-0 overflow-hidden group">
      <Link href={`/blog/${post.slug}`}>
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={400}
          height={225}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="p-6">
          <p className="text-sm font-medium text-amber">{post.category}</p>
          <h3 className="mt-2 font-semibold text-card-title">{post.title}</h3>
          <p className="mt-2 text-sm text-neutral-400">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-amber">
            Read More <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default BlogCard;
