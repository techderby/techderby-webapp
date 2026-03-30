import { Link } from 'react-router';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export function InsightsPage() {
  const categories = [
    'All Articles',
    'Careers in Tech',
    'Software Engineering',
    'AI & Data',
    'Startup Ecosystem',
    'Employer Insights',
    'Community Stories',
  ];

  const featuredArticle = {
    title: 'The Future of Tech in the East Midlands',
    summary: 'Exploring how Derby is becoming a hub for innovation, talent, and opportunity in the regional tech ecosystem.',
    author: 'Tech Derby Team',
    date: 'March 1, 2026',
    readTime: '5 min read',
    category: 'Startup Ecosystem',
  };

  const articles = [
    {
      id: '1',
      title: 'Breaking Into Tech: A Guide for Career Changers',
      summary: 'Practical advice for professionals looking to transition into technology roles.',
      author: 'Sarah Johnson',
      date: 'February 28, 2026',
      readTime: '7 min read',
      category: 'Careers in Tech',
    },
    {
      id: '2',
      title: 'AI Skills in Demand: What Employers Are Looking For',
      summary: 'An analysis of the AI and machine learning skills that are most sought after by regional employers.',
      author: 'David Chen',
      date: 'February 25, 2026',
      readTime: '6 min read',
      category: 'AI & Data',
    },
    {
      id: '3',
      title: 'Derby\'s Growing Startup Scene',
      summary: 'A look at the innovative startups making waves in Derby and the East Midlands.',
      author: 'Emma Williams',
      date: 'February 22, 2026',
      readTime: '8 min read',
      category: 'Startup Ecosystem',
    },
    {
      id: '4',
      title: 'Remote Work and Regional Tech Hubs',
      summary: 'How Derby benefits from the shift to remote and hybrid work models.',
      author: 'Tech Derby Team',
      date: 'February 18, 2026',
      readTime: '5 min read',
      category: 'Employer Insights',
    },
    {
      id: '5',
      title: 'Essential Software Engineering Skills for 2026',
      summary: 'The technical skills and soft skills that will make you stand out.',
      author: 'Michael Brown',
      date: 'February 15, 2026',
      readTime: '6 min read',
      category: 'Software Engineering',
    },
    {
      id: '6',
      title: 'Community Spotlight: Member Success Stories',
      summary: 'How Tech Derby members have grown their careers and networks.',
      author: 'Tech Derby Team',
      date: 'February 10, 2026',
      readTime: '4 min read',
      category: 'Community Stories',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Tech Derby Insights
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Stories, advice, and analysis from Derby's tech community — covering careers,
            innovation, startups, and the regional digital economy.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === 'All Articles'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-8 md:p-12">
            <span className="inline-block text-xs px-3 py-1 bg-primary text-white rounded-full mb-4">
              Featured
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {featuredArticle.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
              {featuredArticle.summary}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span>{featuredArticle.author}</span>
              <span>•</span>
              <span>{featuredArticle.date}</span>
              <span>•</span>
              <span>{featuredArticle.readTime}</span>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Read Article
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Recent Articles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group"
              >
                {/* Article Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Article Image</span>
                </div>

                <div className="p-6">
                  <span className="inline-block text-xs px-2 py-1 bg-accent/10 text-accent rounded-md mb-3">
                    {article.category}
                  </span>

                  <h3 className="font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {article.summary}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>

                  <button className="text-sm font-medium text-primary flex items-center group-hover:gap-2 transition-all">
                    Read More
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="hover:border-primary hover:text-primary">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Stay Informed
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Subscribe to receive the latest insights from Derby's tech community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
