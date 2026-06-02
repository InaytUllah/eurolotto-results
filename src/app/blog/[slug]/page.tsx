import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/data/blog';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'Blog Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  return getAllBlogPosts().slice(0, 50).map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white truncate max-w-[200px]">{post.title}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {post.category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{post.readTime}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {post.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {new Date(post.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </header>

      <div className="prose dark:prose-dark max-w-none text-gray-700 dark:text-gray-300">
        {post.content.split('\n\n').map((paragraph, i) => {
          if (paragraph.startsWith('## ')) {
            return <h2 key={i} className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">{paragraph.replace('## ', '')}</h2>;
          }
          if (paragraph.startsWith('### ')) {
            return <h3 key={i} className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">{paragraph.replace('### ', '')}</h3>;
          }
          return <p key={i}>{paragraph}</p>;
        })}
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Links */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Related Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Link href={`/${post.gameSlug}`} className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            {post.category} Results
          </Link>
          <Link href={`/hot-cold-numbers?game=${post.gameSlug}`} className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Hot & Cold Numbers
          </Link>
          <Link href={`/number-generator?game=${post.gameSlug}`} className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Number Generator
          </Link>
          <Link href="/predictions" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Predictions
          </Link>
          <Link href="/jackpot-tracker" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Jackpot Tracker
          </Link>
          <Link href="/blog" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            All Blog Posts
          </Link>
        </div>
      </div>

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { '@type': 'Organization', name: 'Euro Lotto Results' },
          }),
        }}
      />
    </article>
  );
}
