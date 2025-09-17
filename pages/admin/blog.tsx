import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import AdminLayout from '../../components/AdminLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
// Dynamically import RichTextEditor to avoid SSR conflicts
const RichTextEditor = dynamic(() => import('../../components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-neutral-800 rounded-lg h-[300px] flex items-center justify-center">
      <div className="text-neutral-400">Loading editor...</div>
    </div>
  )
});

import { Plus, Edit, Trash2, Search } from 'lucide-react';
import ImagePickerModal from '../../components/admin/ImagePickerModal';

type UserWithAdmin = {
  isAdmin?: boolean;
  [key: string]: unknown;
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  categories: string[];
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface AdminBlogPageProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' }
];

const AdminBlogPage: React.FC<AdminBlogPageProps> = ({ initialPosts, categories }) => {
  const { data: session, status } = useSession();
  const user = session?.user as UserWithAdmin | undefined;
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Filter posts based on search and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' ||
                           (post.categories || []).some(cat => cat.toLowerCase() === categoryFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddPost = async (postData: Partial<BlogPost>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add blog post');
      }

      const { post } = await response.json();
      setPosts([post, ...posts]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding blog post:', error);
      alert(`Error adding blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = async (postId: string, postData: Partial<BlogPost>) => {
    setLoading(true);
    console.log('🚀 FRONTEND: Starting blog post update');
    console.log('🚀 FRONTEND: Post ID:', postId);
    console.log('🚀 FRONTEND: Post data being sent:', JSON.stringify(postData, null, 2));
    console.log('🚀 FRONTEND: Status in postData:', postData.status);

    try {
      const response = await fetch(`/api/admin/blog?id=${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      console.log('🚀 FRONTEND: Response status:', response.status);
      console.log('🚀 FRONTEND: Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update blog post');
      }

      const { post } = await response.json();
      setPosts(posts.map(p => p.id === postId ? post : p));
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert(`Error updating blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/blog?id=${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete blog post');
      }

      setPosts(posts.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert(`Error deleting blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500 text-white';
      case 'draft':
        return 'bg-yellow-500 text-black';
      case 'archived':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!session || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-100 mb-4">Admin Access Required</h1>
          <p className="text-neutral-400 mb-6">Please sign in with an admin account to access the blog management.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-100">Blog Management</h1>
            <p className="text-neutral-400 mt-2">Manage your blog posts and content</p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Blog Posts List */}
        <div className="bg-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Categories
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-700 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-neutral-100">
                          {post.title}
                        </div>
                        <div className="text-sm text-neutral-400 mt-1">
                          {post.excerpt.substring(0, 100)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(post.categories || []).map((category, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs bg-neutral-600 text-neutral-300 rounded"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-400">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="text-amber-500 hover:text-amber-400 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">No blog posts found</div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Post
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Post Modal */}
      {(isAddModalOpen || editingPost) && (
        <BlogPostModal
          post={editingPost}
          categories={categories}
          onSave={(postId: string, data: Partial<BlogPost>) => {
            if (editingPost) {
              handleEditPost(postId, data);
            } else {
              handleAddPost(data);
            }
          }}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingPost(null);
          }}
          loading={loading}
        />
      )}
    </AdminLayout>
  );
};

// Blog Post Modal Component
interface BlogPostModalProps {
  post?: BlogPost | null;
  categories: BlogCategory[];
  onSave: (postId: string, data: Partial<BlogPost>) => void;
  onClose: () => void;
  loading: boolean;
}

const BlogPostModal: React.FC<BlogPostModalProps> = ({ post, categories, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    featured_image: post?.featured_image || '',
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    status: post?.status || 'draft',
    categories: post?.categories || []
  });

  const [showImagePicker, setShowImagePicker] = useState(false);

  // Helper to convert Google Drive URLs to viewable format
  const convertDriveLinkToViewUrl = (url: string) => {
    try {
      // file/d/{id}/view -> uc?export=view&id={id}
      const match1 = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
      if (match1?.[1]) return `https://drive.google.com/uc?export=view&id=${match1[1]}`;
      // uc?id={id} -> uc?export=view&id={id}
      const u = new URL(url);
      const id = u.searchParams.get('id');
      if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
      return url;
    } catch {
      return url;
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (post) {
      onSave(post.id, formData);
    } else {
      onSave('', formData);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-neutral-100 mb-6">
          {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Title *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title..."
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Content *
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Write your blog post content..."
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Excerpt
            </label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description of the post..."
              rows={3}
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Featured Image <span className="text-neutral-500 text-xs">(URL or pick from library)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                onBlur={() => {
                  if (formData.featured_image && formData.featured_image.includes('drive.google.com')) {
                    const viewUrl = convertDriveLinkToViewUrl(formData.featured_image);
                    setFormData((fd) => ({ ...fd, featured_image: viewUrl }));
                  }
                }}
                placeholder="https://example.com/image.jpg, /assets/blogImages/image.png, or Google Drive link"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100"
              />
              <button
                type="button"
                onClick={() => setShowImagePicker(true)}
                className="px-3 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-neutral-100"
              >
                Choose…
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Tip: You can paste a Google Drive link; it will auto-convert to a viewable URL.
            </p>

            {formData.featured_image ? (
              <div className="mt-3 rounded border border-neutral-700 overflow-hidden">
                <Image src={formData.featured_image} alt="Featured preview" width={400} height={224} className="w-full max-h-56 object-cover" />
              </div>
            ) : null}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Categories ({categories.length} available)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.length === 0 && <p className="text-red-500">No categories available</p>}
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          categories: [...formData.categories, category.name]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          categories: formData.categories.filter(c => c !== category.name)
                        });
                      }
                    }}
                    className="rounded border-neutral-600 bg-neutral-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-neutral-300">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Status
            </label>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </div>

          {/* SEO Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Meta Title
              </label>
              <Input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="SEO title for search engines..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Meta Description
              </label>
              <Input
                type="text"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="SEO description for search engines..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-700">
            <Button
              type="button"
              onClick={onClose}
              className="bg-neutral-700 hover:bg-neutral-600 text-neutral-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title || !formData.content}
              className="bg-amber-500 hover:bg-amber-600 text-black disabled:opacity-50"
            >
              {loading ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
            </Button>
          </div>
        </form>
      </div>

      <ImagePickerModal
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={(url) => setFormData((fd) => ({ ...fd, featured_image: url }))}
      />
    </Modal>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const user = session?.user as UserWithAdmin | undefined;

  if (!session || !user?.isAdmin) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  try {
    // Build a robust base URL from the incoming request headers
    const forwardedProto = (context.req.headers['x-forwarded-proto'] as string) || undefined;
    const forwardedHost = (context.req.headers['x-forwarded-host'] as string) || undefined;
    const host = (forwardedHost || context.req.headers.host)!;
    const protocol = forwardedProto || (host?.includes('localhost') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;

    // Fetch blog posts
    let postsData: { posts: AdminBlogPageProps['initialPosts'] } = { posts: [] };
    try {
      const postsResponse = await fetch(`${baseUrl}/api/admin/blog?page=1&limit=50`);
      postsData = postsResponse.ok ? await postsResponse.json() : { posts: [] };
    } catch (err) {
      console.error('Error fetching posts from API:', err);
      postsData = { posts: [] };
    }

    // Fetch categories directly from database (since API requires auth)
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('blog_categories')
      .select('*')
      .is('deleted_at', null)
      .order('name');
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
    }
    
    const categories: BlogCategory[] = categoriesData || [];
    console.log('Fetched categories:', categories.length);

    return {
      props: {
        initialPosts: postsData.posts || [],
        categories
      }
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return {
      props: {
        initialPosts: [],
        categories: []
      }
    };
  }
};

export default AdminBlogPage; 