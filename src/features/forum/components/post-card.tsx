import { Link } from '@tanstack/react-router';
import { Heart, MessageSquare, Bookmark, Share2 } from 'lucide-react';
import React from 'react';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

interface PostCardProps {
  id: string;
  title: string;
  author: { name: string; href?: string; avatar?: string };
  time: string;
  excerpt: React.ReactNode;
  image?: string;
  likes?: number;
  comments?: number;
}

export const PostCard: React.FC<PostCardProps> = ({
  id: _id,
  title,
  author,
  time,
  excerpt,
  image,
  likes = 0,
  comments = 0,
}) => {
  return (
    <Card className="rounded-lg">
      <div className="p-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <Avatar className="w-14 h-14">
                {author.avatar ? (
                  <AvatarImage src={author.avatar} alt={author.name} />
                ) : (
                  <AvatarFallback className="text-lg">
                    {author.name?.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-[18px] leading-6 font-semibold text-slate-900">
                  {title}
                </h3>
                <div className="mt-1 flex items-center gap-3 text-sm">
                  <Link
                    to={author.href || '#'}
                    className="text-blue-600 text-sm"
                  >
                    {author.name}
                  </Link>
                  <span className="text-slate-500">|</span>
                  <span className="text-sm text-slate-500">{time}</span>
                </div>
              </div>
            </div>
            <div className="text-lg ">{excerpt}</div>
          </div>

          <div className="flex flex-col gap-4">
            {image && (
              <div className="overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`${title} thumbnail`}
                  className="w-full h-[500px] object-cover rounded-lg"
                />
              </div>
            )}

            <div className="mt-3 text-slate-500">
              <div className="flex items-center gap-2">
                <span>{likes} lượt thích</span>
                <span>·</span>
                <span>{comments} bình luận</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-6 ">
                <button aria-label="Like">
                  <div className="flex items-center gap-2">
                    <Heart /> <span>Thích</span>
                  </div>
                </button>
                <button aria-label="Comment">
                  <div className="flex items-center gap-2">
                    <MessageSquare /> <span>Bình luận</span>
                  </div>
                </button>
                <button aria-label="Save">
                  <div className="flex items-center gap-2">
                    <Bookmark /> <span>Lưu</span>
                  </div>
                </button>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Share2 /> <span>Chia sẻ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
