"use client";
import Link from "next/link";

interface PostCardProps {
  id: number;
  category: string;
  title: string;
  author: string;
  views: number;
  comments: number;
  likes: number;
  time: string;
}

export default function PostCard({
  id,
  category,
  title,
  author,
  views,
  comments,
  likes,
  time,
}: PostCardProps) {
  return (
    <Link href={`/board/${id}`}>
      <div className="bg-white p-4 rounded shadow-sm hover:shadow transition">
        <div className="flex justify-between text-sm mb-1">
          <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded">{category}</span>
          <span className="text-gray-500">{time}</span>
        </div>
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">작성자: {author}</p>
        <div className="text-xs text-gray-400 flex gap-4">
          <span>👁 {views}</span>
          <span>💬 {comments}</span>
          <span>❤️ {likes}</span>
        </div>
      </div>
    </Link>

  );
}
