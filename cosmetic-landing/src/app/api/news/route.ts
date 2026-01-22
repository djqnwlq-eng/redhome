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

function parseBeautynuryItem(itemXml: string): NewsItem | null {
  const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
  const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
  const dateMatch = itemXml.match(/<dc:date>([\s\S]*?)<\/dc:date>/);
  const thumbMatch = itemXml.match(/<thumbimg>([\s\S]*?)<\/thumbimg>/);

  if (!titleMatch || !linkMatch) return null;

  const title = extractCDATA(titleMatch[1]);
  const link = extractCDATA(linkMatch[1]);

  // 썸네일 URL 생성 (상대 경로를 절대 경로로)
  let thumbnail = '';
  if (thumbMatch && thumbMatch[1]) {
    const thumbPath = thumbMatch[1].trim();
    if (thumbPath) {
      thumbnail = thumbPath.startsWith('http')
        ? thumbPath
        : `https://www.beautynury.com${thumbPath}`;
    }
  }

  return {
    title,
    link,
    description: title,
    thumbnail,
    pubDate: dateMatch ? dateMatch[1].trim() : '',
    source: '뷰티누리',
  };
}

export async function GET() {
  try {
    // 뷰티누리 RSS - 화장품/뷰티 전문 뉴스
    const response = await fetch('https://www.beautynury.com/rss', {
      next: { revalidate: 3600 }, // 1시간 캐시
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error('RSS fetch failed');
    }

    const xml = await response.text();

    // 모든 item 추출
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const items: NewsItem[] = [];
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 6) {
      const parsed = parseBeautynuryItem(match[1]);
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
