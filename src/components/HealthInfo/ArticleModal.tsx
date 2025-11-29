import { HealthArticle } from '../../lib/supabase';
import { X, Calendar, User } from 'lucide-react';

interface ArticleModalProps {
  article: HealthArticle;
  onClose: () => void;
}

export function ArticleModal({ article, onClose }: ArticleModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full mb-3">
                {article.category}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {article.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {article.summary}
            </p>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {article.content}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
