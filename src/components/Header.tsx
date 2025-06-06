"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderLogo from "./HeaderLogo";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined"){
            const token = localStorage.getItem("jwtToken");
            const name = localStorage.getItem("userName");
            setIsLoggedIn(!!token);
            if (name == null){
                setUserName("undefined");
            }
            if (name) setUserName(name);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userName");
        window.location.href = "/";
    }
  return (
    <header className="relative z-10 w-full h-[200px] bg-black text-white px-20 flex flex-col justify-center">
    <div className="flex items-center text-sm">
        {/* 로고 */}
        <HeaderLogo />

        {/* 네비게이션 */}
        <nav className="flex gap-8 ml-36">
        <Link href="/" className="hover:underline">홈</Link>
        <Link href="/board" className="hover:underline">게시판</Link>
        {isLoggedIn ? (
            <>
                <span className="text-grey-300 hover:underline">환영합니다. <span className="font-bold">{userName}</span> 님</span>
                <button onClick={handleLogout} className="hover:underline">로그아웃</button>
            </>
            ) : (
            <>
                <Link href="/login" className="hover:underline">로그인</Link>
                <Link href="#" className="hover:underline">회원가입</Link>
            </>
        )}
        </nav>
    </div>
    </header>

  );
}
