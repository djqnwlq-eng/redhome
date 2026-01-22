import { NextResponse } from 'next/server';

interface NewsItem {
  title: string;
  link: string;
  description: string;
  thumbnail: string;
  pubDate: string;
  source: string;
}

function extractCDATA(text: string): string {
  const cdataMatch = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return cdataMatch ? cdataMatch[1].trim() : text.trim();
}

function cleanTitle(title: string): string {
  // "제목 - 출처" 형식에서 제목만 추출
  const parts = title.split(' - ');
  if (parts.length > 1) {
    parts.pop(); // 마지막 부분(출처) 제거
    return parts.join(' - ').trim();
  }
  return title.trim();
}

function extractSource(title: string): string {
  // "제목 - 출처" 형식에서 출처 추출
  const parts = title.split(' - ');
  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }
  return '';
}

function parseGoogleNewsItem(itemXml: string): NewsItem | null {
  const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
  const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
  const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
  const sourceMatch = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/);

  if (!titleMatch || !linkMatch) return null;

  const fullTitle = extractCDATA(titleMatch[1]);
  const title = cleanTitle(fullTitle);
  const source = sourceMatch ? extractCDATA(sourceMatch[1]) : extractSource(fullTitle);

  return {
    title,
    link: linkMatch[1].trim(),
    description: title, // 구글 뉴스는 별도 description이 없어서 제목 사용
    thumbnail: '', // 구글 뉴스 RSS에는 썸네일 없음
    pubDate: pubDateMatch ? pubDateMatch[1].trim() : '',
    source,
  };
}

export async function GET() {
  try {
    // 구글 뉴스 RSS - 화장품 뷰티 검색
    const searchQuery = encodeURIComponent('화장품 뷰티');
    const response = await fetch(
      `https://news.google.com/rss/search?q=${searchQuery}&hl=ko&gl=KR&ceid=KR:ko`,
      {
        next: { revalidate: 3600 }, // 1시간 캐시
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
        },
      }
    );

    if (!response.ok) {
      throw new Error('RSS fetch failed');
    }

    const xml = await response.text();

    // 모든 item 추출
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const items: NewsItem[] = [];
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 6) {
      const parsed = parseGoogleNewsItem(match[1]);
      if (parsed && parsed.title) {
        items.push(parsed);
      }
    }

    return NextResponse.json({
      news: items,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json({
      news: [],
      error: 'Failed to fetch news',
      lastUpdated: new Date().toISOString(),
    }, { status: 500 });
  }
}
