"use client";
import Header from "@/components/Header";
import { mockPosts } from "@/data/mockPosts";
import PostCard from "@/components/board/PostCard";

export default function BoardPage() {
  return (
    <>
    <Header/>
    <main className="min-h-screen px-20 py-16 bg-[#ecefed] font-sans">
      {/* 페이지 타이틀 */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold mb-2 text-black">토론 게시판</h1>
        <p className="text-gray-600">
          니체 철학에 대한 생각과 해석, 토론을 동료 사상가들과 나누는 공간입니다.
        </p>
      </section>

      {/* 게시판 전체 구조 */}
      <section className="flex gap-10">
        {/* 왼쪽: 카테고리 영역 */}
        <aside className="w-1/4">
          {/* 검색창 */}
          <input
            type="text"
            placeholder="게시글 검색..."
            className="w-full px-4 py-2 mb-6 rounded border border-gray-300 text-black"
          />

          {/* 카테고리 리스트 */}
          <div className="flex flex-col gap-2">
            <CategoryItem title="전체 게시글" count={464} active />
            <CategoryItem title="자유 게시판" count={203} />
            <CategoryItem title="철학 토론" count={127} />
            <CategoryItem title="명언 해석" count={89} />
            <CategoryItem title="니체 연구" count={45} />
          </div>
        </aside>

        {/* 오른쪽: 게시글 리스트 */}
        <section className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">최근 게시글</h2>
            <button className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800">
              글작성
            </button>
          </div>

          {/* 게시글 카드 리스트 (샘플 3개) */}
          <div className="flex flex-col gap-4 text-black">
            {mockPosts.map((post, i) => (
                <PostCard
                key={post.id}
                category={post.category}
                title={post.title}
                author={post.author}
                views={post.views}
                comments={post.comments}
                likes={post.likes}
                time={post.time}
                />
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="mt-8 flex justify-center gap-2">
            <Pagination current={1} total={5} />
          </div>
        </section>
      </section>
    </main>
    </>
  );
}

// ------------------------------
// 임시 컴포넌트들 (파일 분리 예정)
// ------------------------------

function CategoryItem({ title, count, active = false }: { title: string; count: number; active?: boolean }) {
  return (
    <div
      className={`flex justify-between items-center px-4 py-2 rounded ${
        active ? "bg-black text-white" : "bg-white text-black"
      } cursor-pointer hover:bg-gray-200`}
    >
      <span>{title}</span>
      <span className="text-sm opacity-60">{count}</span>
    </div>
  );
}

function Pagination({ current, total }: { current: number; total: number }) {
  return (
    <>
      <button className="px-2 py-1 rounded border">←</button>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`px-2 py-1 rounded border ${i + 1 === current ? "bg-black text-white" : ""}`}
        >
          {i + 1}
        </button>
      ))}
      <button className="px-2 py-1 rounded border">→</button>
    </>
  );
}
