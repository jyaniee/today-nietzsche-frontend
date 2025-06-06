import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "700"], // 필요한 굵기 (100 thin, 300 light, 400 regular, 500 medium, 700 bold)
  display: "swap",
  variable: "--font-noto-sans-kr",      // 커스텀 CSS 변수 등록
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "오늘의 니체",
  description: "니체 철학을 공유하는 공간입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
      </head>
      <body 
      className={`${notoSansKr.className} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
