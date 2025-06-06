import Image from "next/image";
import Header from "@/components/Header"
import MainSection from "@/components/MainSection";

export default function Home() {
  return (
    <main className="relative z-0 min-h-screen bg-neutral-100 flex flex-col">
      <div className="absolute top-0 right-[120px] h-screen z-30 pointer-events-none">
        <img
          src="/nietzsche.png"
          alt="프리드리히 니체 이미지"
          className="h-full object-contain"
        />
      </div>
      <Header />
      <MainSection />
    </main>

  );
}
