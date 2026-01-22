import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = "https://cosmetic-landing.vercel.app"; // Vercel 배포 도메인

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "화장품 소량제조 전문 | REDMEDICOS",
    template: "%s | REDMEDICOS",
  },
  description:
    "100개부터 시작하는 화장품 소량제조. 스킨케어, 메이크업, 선케어까지 제형 개발부터 패키지, 인허가 대행까지 원스톱 서비스.",
  alternates: {
    canonical: siteUrl,
    languages: { ko: `${siteUrl}/` },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "화장품 소량제조 전문 | 당신만의 브랜드를 시작하세요",
    description:
      "최소 100개부터 제작 가능. 스킨케어, 메이크업, 클렌징, 선케어 등 모든 카테고리 지원. 제형 개발부터 인허가까지 원스톱.",
    siteName: "REDMEDICOS",
    locale: "ko_KR",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "REDMEDICOS - 화장품 소량제조 전문",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "화장품 소량제조 전문 | REDMEDICOS",
    description: "100개부터 시작하는 맞춤 화장품 제조. 당신만의 브랜드를 시작하세요.",
    images: [`${siteUrl}/og-image.png`],
  },
  keywords: [
    "화장품 소량제조",
    "화장품 OEM",
    "화장품 ODM",
    "맞춤 화장품 제조",
    "화장품 위탁생산",
    "스킨케어 제조",
    "화장품 브랜드 런칭",
    "소량 OEM",
    "화장품 인허가",
    "REDMEDICOS",
  ],
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  category: "business",
  verification: {
    // google: "구글서치콘솔코드",
    // naver: "네이버서치어드바이저코드",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} antialiased bg-zinc-950 text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
