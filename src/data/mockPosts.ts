import { Post } from "@/types/Post";

export const mockPosts: Post[] = [
  {
    id: 1,
    category: "철학 토론",
    title: "니체의 ‘초인’ 개념에 대한 현대적 해석",
    author: "유저1",
    views: 234,
    comments: 12,
    likes: 45,
    time: "2시간 전",
  },
  {
    id: 2,
    category: "명언 해석",
    title: "‘신은 죽었다’는 말의 진정한 의미는?",
    author: "유저2",
    views: 198,
    comments: 8,
    likes: 30,
    time: "4시간 전",
  },
  {
    id: 3,
    category: "자유",
    title: "심심하네요. 같이 롤 하실분 구합니다.",
    author: "유저3",
    views: 120,
    comments: 4,
    likes: 10,
    time: "6시간 전",
  },
];
