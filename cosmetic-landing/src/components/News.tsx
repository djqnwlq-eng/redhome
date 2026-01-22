'use client';

import { useState, useEffect, useCallback } from 'react';
import { Newspaper, ExternalLink, RefreshCw } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  description: string;
  thumbnail: string;
  pubDate: string;
  source: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news');
      const data = await response.json();

      if (data.news && data.news.length > 0) {
        setNews(data.news);
        setLastUpdated(new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }));
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();

    // 1시간마다 자동 갱신
    const interval = setInterval(fetchNews, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchNews]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      // 뷰티누리 날짜 형식: "2026-01-22 09:54:38"
      const date = new Date(dateString.replace(' ', 'T'));
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 1) return '방금 전';
      if (diffHours < 24) return `${diffHours}시간 전`;
      if (diffDays < 7) return `${diffDays}일 전`;

      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  if (loading && news.length === 0) {
    return (
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section id="news" className="py-20 bg-zinc-900/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                뷰티 산업 뉴스
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                화장품 업계 최신 소식을 확인하세요
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-zinc-500 hidden sm:block">
                {lastUpdated} 업데이트
              </span>
            )}
            <button
              onClick={fetchNews}
              disabled={loading}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-zinc-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 뉴스 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-zinc-800/50 border border-zinc-700/50 rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300"
            >
              {/* 썸네일 이미지 */}
              <div className="relative h-48 overflow-hidden bg-zinc-900">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-12 h-12 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg></div>';
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper className="w-12 h-12 text-zinc-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />

                {/* 출처 뱃지 */}
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-medium text-white bg-red-500/90 px-2.5 py-1 rounded-full">
                    {item.source}
                  </span>
                </div>

                {/* 외부 링크 아이콘 */}
                <div className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* 콘텐츠 */}
              <div className="p-5">
                <h3 className="text-white font-semibold text-base leading-relaxed mb-3 line-clamp-2 group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-700/50">
                  <span className="text-xs text-zinc-500">
                    {formatDate(item.pubDate)}
                  </span>
                  <span className="text-xs text-red-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    기사 보기 →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* 출처 */}
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600">
            뉴스 제공: 뷰티누리
          </p>
        </div>
      </div>
    </section>
  );
}
