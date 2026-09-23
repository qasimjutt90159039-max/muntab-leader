import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { BLOG_POSTS } from '../data/blog';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const BlogPage: React.FC = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Leather Journal & Articles' }]} />

        <div className="mt-6 mb-12 text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#8C5D38] font-semibold">The Leather Journal</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1511] mt-2">
            Guides, Craftsmanship & Care Articles
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Expert insights from master tanners and artisans at Mutalib's Leather Factory Multan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-[#EBE5DF] flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                <Link to={`/blog/${post.slug}`} className="block aspect-16/10 overflow-hidden bg-stone-100">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-[11px] text-stone-500 mb-2">
                    <span className="font-semibold text-[#8C5D38] uppercase">{post.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.publishedDate}</span>
                    </span>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-base font-serif font-bold text-[#1E1511] hover:text-[#8C5D38] line-clamp-2 transition-colors">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">By {post.author}</span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-xs text-[#8C5D38] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#1E1511]">Article Not Found</h2>
        <Link to="/blog" className="mt-4 inline-block text-xs text-[#8C5D38] underline font-semibold">
          Return to Leather Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Journal', path: '/blog' }, { label: post.title }]} />

        <div className="bg-white border border-[#EBE5DF] p-6 sm:p-10 shadow-xs mt-6">
          <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
            <span className="font-semibold text-[#8C5D38] uppercase">{post.category}</span>
            <span>·</span>
            <span>Published on {post.publishedDate}</span>
            <span>·</span>
            <span>By {post.author}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#1E1511] leading-tight mb-6">
            {post.title}
          </h1>

          <div className="aspect-16/9 overflow-hidden bg-stone-100 mb-8 border border-stone-200">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line space-y-4">
            {post.content}
          </div>

          <div className="mt-10 pt-6 border-t border-[#EBE5DF] flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[11px] bg-[#FAF8F5] border border-[#EBE5DF] text-stone-600 px-2.5 py-1">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
