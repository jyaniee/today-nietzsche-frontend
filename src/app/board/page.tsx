"use client";

import Header from "@/components/Header";
// import { mockPosts } from "@/data/mockPosts";
import PostCard from "@/components/board/PostCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useMemo } from "react";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  authorName: string;
  views: number;
  likes: number;
  time: string;
}


export default function BoardPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 3;

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("전체 게시글");
  
    const filteredPosts = useMemo(() => {
      let temp = posts;

      if (selectedCategory !== "전체 게시글") {
        temp = temp.filter((post) => post.category === selectedCategory);
      }

      if (searchTerm.trim() !== "") {
        const term = searchTerm.trim().toLowerCase();
        temp = temp.filter((post) => post.title.toLowerCase().includes(term));
      }

      return temp;
    }, [posts, selectedCategory, searchTerm]);


    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);
    const totalPage = useMemo(() => Math.ceil(filteredPosts.length / postsPerPage), [filteredPosts]);



    const CATEGORY_ORDER = [
      "전체 게시글",
      "자유 게시판",
      "철학 토론",
      "명언 해석",
      "니체 연구"
    ];

    const categoryCounts = useMemo(() => {
      const counts: Record<string, number> = {};

      for (const post of posts) {
        const category = post.category || "기타";
        counts[category] = (counts[category] || 0) + 1;
      }

      return counts;
    }, [posts]);

    console.log("posts.length:", posts.length, "| totalPage:", totalPage);

    useEffect(() => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/login")
        return
      }

      // 인증 체크
      fetch("http://localhost:8080/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            setIsAuthorized(true)
          } else {
            router.push("/login")
          }
        })
        .catch(() => router.push("/login"))
        .finally(() => setIsLoading(false));

        
      // 게시글 불러오기
      fetch("http://localhost:8080/api/posts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("받아온 게시글:", data);
        setPosts(data)})
      .catch((err) => console.error("게시글 불러오기 실패:", err));
    }, []);


    if (isLoading) return null;
    if(!isAuthorized) return null; // 로딩 중 or 리디렉션 대기

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
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            className="w-full px-4 py-2 mb-6 rounded border border-gray-300 text-black"
          />

        {/* 카테고리 리스트 */}
        <div className="flex flex-col gap-2">
          {CATEGORY_ORDER.map((category, index) => {
            const count =
              category === "전체 게시글"
                ? posts.length
                : posts.filter((post: any) => post.category === category).length;

            return (
              <CategoryItem
                key={category}
                title={category}
                count={count}
                active={category == selectedCategory}
                onClick={()=> {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
              />
            );
          })}
        </div>

        </aside>

        {/* 오른쪽: 게시글 리스트 */}
        <section className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">최근 게시글</h2>
            <Link href="/board/write">
              <button className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800">
              글작성
              </button>
            </Link>

          </div>

          {/* 게시글 카드 리스트 (샘플 3개) */}
          <div className="flex flex-col gap-4 text-black">
            {currentPosts.map((post: any) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  category={post.category}
                  title={post.title}
                  author={post.authorName}
                  views={post.views}
                  comments={post.commentCount} // 댓글 구현 전 임시 0
                  likes={post.likes}
                  time={post.time}
                />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPage > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Pagination current={currentPage} total={totalPage} onPageChange={setCurrentPage} />
            </div>
          )}
        </section>
      </section>
    </main>
    </>
  );
}

// ------------------------------
// 임시 컴포넌트들 (파일 분리 예정)
// ------------------------------

function CategoryItem({ title, count, active = false, onClick }: { title: string; count: number; active?: boolean; onClick?: () => void; }) {
  return (
    <div
      onClick={onClick}
      className={`flex justify-between items-center px-4 py-2 rounded ${
        active ? "bg-black text-white" : "bg-white text-black"
      } cursor-pointer hover:bg-gray-200`}
    >
      <span>{title}</span>
      <span className="text-sm opacity-60">{count}</span>
    </div>
  );
}

function Pagination({
  current,
  total,
  onPageChange,
}: {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const pages = [];
  for (let i = 1; i <= total; i++) {
    pages.push(i);
  }

  return (
    <div className="flex gap-2 items-center">
      {/* 이전 페이지 */}
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        이전
      </button>

      {/* 페이지 번호 버튼 */}
      {pages.map((page) => (
        <button
          key={`page-${page}`}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded ${
            page === current ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지 */}
      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        다음
      </button>
    </div>
  );
}


