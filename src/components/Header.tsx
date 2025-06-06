"use client";

export default function Header() {
  return (
<header className="relative z-10 w-full h-[200px] bg-black text-white px-20 flex flex-col justify-center">
  <div className="flex items-center text-sm">
    {/* 로고 */}
    <div className="text-xl font-semibold whitespace-nowrap mr-36">오늘의 니체</div>

    {/* 네비게이션: 왼쪽에서 살짝 떨어뜨리기 */}
    <nav className="flex gap-8 ml-36">
      <a href="#" className="hover:underline">홈</a>
      <a href="#" className="hover:underline">게시판</a>
      <a href="#" className="hover:underline">로그인</a>
      <a href="#" className="hover:underline">회원가입</a>
    </nav>
  </div>
</header>

  );
}
