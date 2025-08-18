import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { getAllPosts, getPostBySlug, getRelatedPosts, Post } from '../lib/posts';
import Section from '../components/shared/Section';
import BlogCard from '../components/blog/BlogCard';
import Button from '../components/ui/Button';

interface PostPageProps {
  post: Post;
  relatedPosts: Post[];
}

const PostPage: React.FC<PostPageProps> = ({ post, relatedPosts }) => {
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="animate-fade-up-stagger animate-delay-1">
      <article>
        <header className="bg-black py-24 text-center">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-widest text-amber">{post.category}</p>
            <h1 className="mt-4 text-display-large">{post.title}</h1>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Image src={post.authorAvatar} alt={post.author} width={48} height={48} className="rounded-full" />
              <div>
                <p className="font-semibold">{post.author}</p>
                <p className="text-sm text-neutral-400">{post.date}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Image src={post.imageUrl} alt={post.title} width={1200} height={630} className="w-full h-auto rounded-xl -mt-16 shadow-lg" />
        </div>

        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <div 
            className="prose prose-invert prose-lg max-w-none prose-h3:font-display prose-h3:text-amber prose-a:text-amber hover:prose-a:text-amber/90"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>
      </article>

      <Section title="Related Articles" className="bg-black ring-1 ring-neutral-800/60">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {relatedPosts.map((relatedPost) => (
            <BlogCard key={relatedPost.slug} post={relatedPost} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/blog" passHref>
            <Button variant="secondary">View All Articles</Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({ params: { slug: post.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);
  const relatedPosts = getRelatedPosts(slug);
  return { props: { post, relatedPosts } };
};

export default PostPage;