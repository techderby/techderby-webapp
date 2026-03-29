import { FileText, User, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function ExpressPage() {
  const articles = [
    {
      title: 'From Teacher to Tech: One Member\'s Journey',
      category: 'Career Stories',
      date: 'March 10, 2026',
      excerpt: 'How Sarah made the switch from education to software development...',
    },
    {
      title: 'Building AI Products at Rolls-Royce',
      category: 'Technical',
      date: 'March 5, 2026',
      excerpt: 'A deep dive into machine learning applications in aerospace...',
    },
    {
      title: 'Derby\'s Startup Scene: 2026 Landscape',
      category: 'Innovation',
      date: 'February 28, 2026',
      excerpt: 'Exploring the growing startup ecosystem in the East Midlands...',
    },
    {
      title: 'Women in Tech Leadership Panel Highlights',
      category: 'Community',
      date: 'February 20, 2026',
      excerpt: 'Key insights from our recent Tech Star Women leadership event...',
    },
    {
      title: 'Mastering React Hooks: A Practical Guide',
      category: 'Technical',
      date: 'February 15, 2026',
      excerpt: 'Advanced patterns and best practices for React development...',
    },
    {
      title: 'The Power of Community: 10 Years of Tech Derby',
      category: 'Reflection',
      date: 'February 1, 2026',
      excerpt: 'Looking back at a decade of building Derby\'s tech community...',
    },
  ];

  return (
    <div>
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              Editorial Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Express!
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Stories, insights, and deep dives from Derby's tech community. 
              Real experiences, technical knowledge, and industry perspectives.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Latest Articles
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">All</Button>
              <Button variant="ghost" size="sm">Career</Button>
              <Button variant="ghost" size="sm">Technical</Button>
              <Button variant="ghost" size="sm">Community</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.title}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <div className="p-6">
                  <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700 mb-3">
                    {article.category}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>Author</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Want to Contribute?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're always looking for community members to share their stories and expertise.
          </p>
          <Button size="lg">
            Submit Your Story
          </Button>
        </div>
      </section>
    </div>
  );
}
