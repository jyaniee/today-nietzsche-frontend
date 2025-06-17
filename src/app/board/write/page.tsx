"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";

const categoryList = ["자유 게시판", "철학 토론", "명언 해석", "니체 연구"];

export default function WritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const postId = searchParams.get("id");
  const mode = searchParams.get("mode");
  const isEditMode = mode === "edit";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categoryList[0]); // 기본 선택
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/login");
      return;
    }

    // 작성자 인증
    fetch("http://localhost:8080/api/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) setIsAuthorized(true);
        else router.push("/login");
      })
      .catch(() => router.push("/login"));

    // 수정 모드라면 기존 글 불러오기
    if (isEditMode && postId) {
      fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
          setCategory(data.category);
        })
        .catch(() => {
          alert("게시글을 불러오지 못했습니다.");
          router.push("/board");
        });
    }

    setIsLoading(false);
  }, [isEditMode, postId, router]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("jwtToken");
    const url = isEditMode && postId
      ? `http://localhost:8080/api/posts/${postId}`
      : "http://localhost:8080/api/posts";

    const method = isEditMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, category }),
    });

    if (res.ok) {
      router.push("/board");
    } else {
      alert(isEditMode ? "글 수정 실패" : "글 작성 실패");
    }
  };

  if (isLoading || !isAuthorized) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen px-20 py-16 bg-[#ecefed] font-sans text-black">
        <section className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6">{isEditMode ? "✏ 게시글 수정" : "✍ 글쓰기"}</h1>

          {/* 카테고리 선택 */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">카테고리</label>
            <select
              className="w-full border border-gray-300 px-4 py-2 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <input
            className="w-full border border-gray-300 px-4 py-2 mb-4 rounded"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* 내용 */}
          <textarea
            className="w-full border border-gray-300 px-4 py-2 h-48 mb-6 rounded resize-none"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex justify-end">
            <button
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              onClick={handleSubmit}
            >
              {isEditMode ? "수정 완료" : "작성 완료"}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
