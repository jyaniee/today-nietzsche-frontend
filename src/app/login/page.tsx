"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
        const res = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok){
            const data = await res.json();
            localStorage.setItem("jwtToken", data.token); // 토큰 저장
            localStorage.setItem("userName", data.name); // 사용자 이름 저장
            alert("로그인 성공");
            router.push("/") // 홈으로 이동
        } else {
            const err = await res.json();
            setErrorMsg(errorMsg || "로그인 실패");
        } 
    } catch (error) {
        setErrorMsg("서버와 연결할 수 없습니다.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-black">로그인</h2>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded text-black"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-3 py-2 border rounded text-black"
          required
        />

        {errorMsg && (
            <p className="text-red-500 text-sm mb-4">{errorMsg}</p>
            )}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </main>
  );
}
