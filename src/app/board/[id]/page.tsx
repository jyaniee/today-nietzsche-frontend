"use client";

import Header from "@/components/Header";
import { useEffect, useState, useCallback } from "react";
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

interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
}



export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(true);

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false); // 확장 가능성 (예: UI에서 하트 표시 전환 등)

  const fetchComments = useCallback(() => {
    const token = localStorage.getItem("jwtToken");
    if (!id || !token) return;

    fetch(`http://localhost:8080/api/posts/${id}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setComments(data));
    }, [id]);

    useEffect(() => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/login");
        return;
    }

    const fetchPostAndComments = async () => {
      try {
        const postRes = await fetch(`http://localhost:8080/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!postRes.ok) throw new Error("게시글을 불러올 수 없습니다.");
        const postData = await postRes.json();
        setPost(postData);

        // 좋아요 수 불러오기
        const likeRes = await fetch(`http://localhost:8080/api/posts/${id}/like-count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (likeRes.ok) {
          const count = await likeRes.json();
          setLikeCount(count);
        }

        // 댓글까지 같이 불러오기
        fetchComments();
      } catch (e) {
        router.push("/board");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPostAndComments();
  }, [id, router, fetchComments]);

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;
    if (!commentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    const res = await fetch(`http://localhost:8080/api/posts/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: commentContent }),
    });

    if (res.ok) {
      setCommentContent("");
      fetchComments();
    } else {
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleCommentDelete = async (commentId: number) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return;

  const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
  if (!confirmDelete) return;

  const res = await fetch(`http://localhost:8080/api/posts/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
  });

  if (res.ok) {
      fetchComments(); // 삭제 후 목록 갱신
    } else {
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    const res = await fetch(`http://localhost:8080/api/posts/${id}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json(); // { likeCount: number }
      setLikeCount(data.likeCount);
      setLiked(true); // 추후에 좋아요 상태 구분하려면 필요
    } else {
      alert("좋아요 처리 실패");
    }
  };

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
              작성자: <b>{post.authorName}</b> | {new Date(post.createdAt).toLocaleString()} | 조회수 {post.views} | 좋아요 {likeCount}
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
          
          {/* 댓글 작성 + 목록 */}
          <section className="mt-10">
              {/* 💬 댓글 헤더 + 좋아요 버튼 */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">💬 댓글</h2>
                <button
                  onClick={handleLike}
                  className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition"
                >
                  ❤️ 좋아요 {likeCount}
                </button>
              </div>
            {/* 댓글 작성 폼 */}
            <div className="mb-6">
              <textarea
                className="w-full border border-gray-300 px-4 py-2 rounded resize-none"
                rows={3}
                placeholder="댓글을 입력하세요"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button
                  className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
                  onClick={handleCommentSubmit}
                >
                  등록
                </button>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-4">
               {comments.length === 0 ? (
              <div className="text-gray-500">아직 댓글이 없습니다.</div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="bg-white p-4 rounded shadow relative">
                  <div className="text-sm text-gray-600">
                    <b>{c.authorName}</b> | {new Date(c.createdAt).toLocaleString()}
                  </div>
                  <div className="mt-1 text-gray-800 whitespace-pre-line">{c.content}</div>

                  {c.authorName === localStorage.getItem("userName") && (
                    <button
                      className="absolute top-2 right-2 text-xs text-red-500 hover:underline"
                      onClick={() => handleCommentDelete(c.id)}
                    >
                      삭제
                    </button>
                  )}
                </div>
              ))
            )}
            </div>
          </section>

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
