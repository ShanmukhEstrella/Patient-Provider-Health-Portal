import { useState, useEffect } from 'react';
import { supabase, HealthArticle } from '../../lib/supabase';
import { BookOpen, Calendar, User } from 'lucide-react';
import { ArticleModal } from './ArticleModal';

export function HealthInfoPage() {
  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      const { data, error } = await supabase
        .from('health_articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;

      setArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  }

  const categories = ['all', ...new Set(articles.map(a => a.category))];
  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  if (loading) {
    return <div className="text-center py-8">Loading health information...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Health Information</h2>
        <p className="text-gray-600 mt-1">Latest health news and wellness tips</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-teal-300'
            }`}
          >
            {category === 'all' ? 'All Topics' : category}
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No articles found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <article
              key={article.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.summary}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <button className="text-teal-600 text-sm font-medium hover:text-teal-700">
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}
