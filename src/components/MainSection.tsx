"use client";

export default function MainSection() {
  return (
    <section className="relative h-[calc(100vh-200px)] bg-neutral-100 overflow-hidden" style={{ backgroundColor: "#ecefed" }}>
      <div className="flex justify-between items-center h-full px-20 relative z-10">
        {/* 왼쪽 텍스트 */}
        <div className="max-w-xl ml-[100px]">
          <h1 className="text-4xl font-bold text-black mb-2">프레드리히 니체</h1>
          <p className="text-gray-500 mb-6 text-lg">오늘의 명언</p>
          <blockquote className="text-xl leading-relaxed mb-2 font-light text-black">
            “나를 죽이지 못하는 것은 나를 더 강하게 만든다.”
          </blockquote>
          <p className="text-sm text-gray-600 mb-6">– 프레드리히 니체</p>
          <button className="px-6 py-2 border border-gray-500 rounded-md hover:bg-gray-300 transition text-black font-light">
            다른 명언
          </button>

          {/* 설명 문단 */}
          <div className="mt-12 text-sm text-gray-600 leading-relaxed max-w-md">
            철학사에서 가장 영향력 있는 사상가 중 한 명인 니체의 깊이 있는 사상과
            현실적인 아이디어를 엄선된 명언을 통해 매일 만나보세요.
          </div>
        </div>
      </div>
    </section>
  );
}
