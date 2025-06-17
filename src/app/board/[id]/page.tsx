"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface PostDetail {
  id: number;
  title: string;
  content: string;
  category: string;
  authorName: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`http://localhost:8080/api/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("게시글을 불러올 수 없습니다.");
        }
        return res.json();
      })
      .then((data) => setPost(data))
      .catch(() => router.push("/board"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div className="text-center mt-10 text-gray-500">불러오는 중...</div>;
  if (!post) return null;

  return (
    <>
      <Header />
      <main className="px-6 py-16 bg-[#ecefed] text-black font-sans min-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* 돌아가기 버튼 */}
          <button
            onClick={() => router.push("/board")}
            className="mb-6 px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
          >
            ← 목록으로 돌아가기
          </button>
    
          {/* 게시글 정보 */}
          <div className="mb-6">
            <span className="text-sm text-gray-500">{post.category}</span>
            <h1 className="text-3xl font-bold mt-2">{post.title}</h1>
            <div className="text-sm text-gray-600 mt-1">
              작성자: <b>{post.authorName}</b> | {new Date(post.createdAt).toLocaleString()} | 조회수 {post.views} | 좋아요 {post.likes}
            </div>
            {/* 수정된 경우 updateAt 표시 */}
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <div className="text-xs text-gray-500 mt-1">
                (수정됨: {new Date(post.updatedAt).toLocaleDateString("ko-KR")})
              </div>
            )}
          </div>
          <hr className="my-6 border-gray-300" />
          {/* 본문 내용 */}
          <div className="whitespace-pre-line text-lg leading-relaxed">
          {post.content}
          </div>

          {post.authorName === localStorage.getItem("userName") && (
          <div className="flex justify-end gap-4 mt-10">
            <button
              onClick={() => router.push(`/board/write?id=${id}&mode=edit`)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              수정
            </button>
            <button
              onClick={async () => {
                const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
                if (!confirmDelete) return;

                const token = localStorage.getItem("jwtToken");
                const res = await fetch(`http://localhost:8080/api/posts/${id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                if (res.ok) {
                  alert("삭제되었습니다.");
                  router.push("/board");
                } else {
                  alert("삭제에 실패했습니다.");
                }
              }}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              삭제
            </button>
          </div>
        )}
        </div>
      </main>
    </>
  );
}
