"use client";

import Link from "next/link";

export default function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center mr-36">
      <img src="/favicon.ico" alt="로고" className="w-10 h-10 mr-2" />
      <span className="text-xl font-semibold whitespace-nowrap">
        오늘의 니체
      </span>
    </Link>
  );
}