import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Heart, MessageSquare } from 'lucide-react';
import React from 'react';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import {
  useCreateCommentMutation,
  useCreateReplyCommentMutation,
  useCreateVoteForReplyMutation,
} from '@/features/forum/services/mutations';
import {
  useGetForumPostReplyByIdQuery,
  useGetForumPostChildrenReplyByIdQuery,
} from '@/features/forum/services/queries';
import { ForumKeys } from '@/features/forum/services/queries/keys';

import type { Comment } from '@/features/forum/types';

interface PostCardProps {
  id: string;
  title: string;
  author: { name: string; href?: string; avatar?: string };
  time: string;
  excerpt: React.ReactNode;
  image?: string;
  likes?: number;
  comments?: number;
  onLike?: (postId: string, isUpvote: boolean) => void;
  onComment?: (postId: string, text: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  id: _id,
  onLike,
  onComment,
  title,
  author,
  time,
  excerpt,
  image,
  likes = 0,
  comments = 0,
}) => {
  const [liked, setLiked] = React.useState(false);
  const [localLikes, setLocalLikes] = React.useState<number>(likes ?? 0);
  const [showComposer, setShowComposer] = React.useState(false);
  const [commentText, setCommentText] = React.useState('');
  const [localComments, setLocalComments] = React.useState<
    Array<{
      id: string;
      text: string;
      author?: string;
      avatar?: string;
      time?: string;
      parentId?: string | null;
    }>
  >([]);
  const [localCommentCount, setLocalCommentCount] = React.useState<number>(
    comments ?? 0,
  );

  const [likedReplies, setLikedReplies] = React.useState<
    Record<string, boolean>
  >({});
  const [replyTargetId, setReplyTargetId] = React.useState<string | null>(null);
  const [replyTargetText, setReplyTargetText] = React.useState('');

  React.useEffect(() => {
    setLocalLikes(likes ?? 0);
  }, [likes]);
  React.useEffect(() => {
    setLocalCommentCount(comments ?? 0);
  }, [comments]);

  // fetch replies for this post
  const { data: repliesData } = useGetForumPostReplyByIdQuery(_id);
  const repliesContent = repliesData?.content || [];
  console.log('repliesContent:', repliesContent);

  //mutation
  const createVoteMutation = useCreateVoteForReplyMutation();
  const createCommentMutation = useCreateCommentMutation();
  const createReplyCommentMutation = useCreateReplyCommentMutation();
  const queryClient = useQueryClient();

  // initialize local comments from the replies query for this post
  React.useEffect(() => {
    try {
      const server = Array.isArray(repliesContent) ? repliesContent : [];
      const topLevel = server.filter((r) => !r.parentId);

      const mapped = topLevel.map((t) => ({
        id: t.id,
        text: t.content,
        author: t.userName || undefined,
        avatar: t.avtUrl || undefined,
        time: t.createdAt
          ? (() => {
              try {
                return new Date(t.createdAt).toLocaleString();
              } catch {
                return t.createdAt;
              }
            })()
          : undefined,
        parentId: t.parentId ?? null,
      }));

      if (mapped.length > 0) {
        setLocalComments(mapped);
        setLocalCommentCount(Math.max(localCommentCount, topLevel.length));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repliesContent]);

  // component to render children replies for a given parent reply id
  const ReplyChildren: React.FC<{ parentId: string }> = ({ parentId }) => {
    const { data } = useGetForumPostChildrenReplyByIdQuery(parentId);
    const children = data ?? [];
    if (!children || children.length === 0) return null;
    return (
      <div className="mt-2 ml-12 space-y-2">
        {children.map((c: Comment) => (
          <div key={c.id}>
            <div className="flex   gap-3">
              <Avatar className="w-8 h-8">
                {c.avtUrl ? (
                  <AvatarImage src={c.avtUrl} alt={c.userName ?? 'Avatar'} />
                ) : (
                  <AvatarFallback className="text-sm">
                    {c.userName?.charAt(0) ?? 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">{c.userName}</div>
                    <div className="text-sm text-slate-700">{c.content}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleString()
                        : ''}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Like reply ${c.id}`}
                        onClick={() => {
                          const next = !likedReplies[c.id];
                          setLikedReplies((s) => ({ ...s, [c.id]: next }));
                          createVoteMutation.mutate({
                            replyId: c.id,
                            isUpvote: next,
                          });
                        }}
                        className="flex items-center gap-1 text-sm"
                      >
                        <Heart
                          size={15}
                          className={`transition-colors ${likedReplies[c.id] ? 'text-red-500' : 'text-slate-700'}`}
                          fill={likedReplies[c.id] ? 'currentColor' : 'none'}
                        />
                        <span>Thích</span>
                      </button>
                      <button
                        type="button"
                        className="ml-3 text-sm text-slate-700 flex items-center gap-1"
                        onClick={() => {
                          setReplyTargetId(c.id);
                          setReplyTargetText('');
                        }}
                      >
                        <MessageSquare size={15} />
                        Trả lời
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {replyTargetId === c.id && (
              <div className="mt-2 ml-12">
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-sm">U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      autoFocus
                      value={replyTargetText}
                      onChange={(e) => setReplyTargetText(e.target.value)}
                      rows={2}
                      className="w-full p-2 border rounded-md resize-none"
                      placeholder="Viết trả lời..."
                    />
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="px-2 py-1 rounded-md text-slate-700"
                        onClick={() => {
                          setReplyTargetId(null);
                          setReplyTargetText('');
                        }}
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 rounded-md bg-blue-600 text-white"
                        onClick={() => handleReplyToReply(c.id)}
                      >
                        Đăng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setLocalLikes((s) => s + (next ? 1 : -1));
    onLike?.(_id, next);
  };

  const handleToggleComposer = () => {
    setShowComposer((s) => !s);
  };

  const handleSubmitComment = () => {
    const text = commentText.trim();
    if (!text) return;
    const newComment = {
      id: String(Date.now()),
      text,
      author: 'You',
      time: 'now',
    };
    setLocalComments((s) => [newComment, ...s]);
    setLocalCommentCount((c) => c + 1);
    setCommentText('');
    setShowComposer(false);
    // call create comment mutation for the post
    createCommentMutation.mutate(
      { postId: _id, content: text },
      {
        onSuccess: () => {
          // refresh replies for this post
          queryClient.invalidateQueries({
            queryKey: [ForumKeys.GetForumPostReplies, _id],
          });
          queryClient.invalidateQueries({
            queryKey: [ForumKeys.GetForumPostChildrenReplies, _id],
          });
        },
      },
    );
    onComment?.(_id, text);
  };

  const handleReplyToReply = (parentId: string) => {
    const text = replyTargetText.trim();
    if (!text) return;
    // optimistic close
    setReplyTargetText('');
    setReplyTargetId(null);
    createReplyCommentMutation.mutate(
      { parentReplyId: parentId, content: text },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [ForumKeys.GetForumPostChildrenReplies, parentId],
          });
          queryClient.invalidateQueries({
            queryKey: [ForumKeys.GetForumPostReplies, _id],
          });
          queryClient.invalidateQueries({
            queryKey: [ForumKeys.GetForumByIdQuery, _id],
          });
        },
      },
    );
  };
  return (
    <Card className="rounded-lg">
      <div className="p-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <div className="flex  gap-4">
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
            <div className="text-lg whitespace-pre-line break-words">
              {excerpt}
            </div>
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
                <span>{localLikes} lượt thích</span>
                <span>·</span>
                <span>{localCommentCount} bình luận</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-6 ">
                <button aria-label="Like" onClick={handleLike} type="button">
                  <div className="flex items-center gap-2">
                    <Heart
                      className={`transition-colors ${liked ? 'text-red-500' : 'text-slate-700'}`}
                      fill={liked ? 'currentColor' : 'none'}
                    />{' '}
                    <span>Thích</span>
                  </div>
                </button>
                <button
                  aria-label="Comment"
                  type="button"
                  onClick={handleToggleComposer}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare /> <span>Bình luận</span>
                  </div>
                </button>
                {/* <button aria-label="Save">
                  <div className="flex items-center gap-2">
                    <Bookmark /> <span>Lưu</span>
                  </div>
                </button> */}
              </div>
              {/* <div>
                <div className="flex items-center gap-2">
                  <Share2 /> <span>Chia sẻ</span>
                </div>
              </div> */}
            </div>

            {/* Comment composer */}
            {showComposer && (
              <div className="mt-4">
                <div className="flex gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="text-sm">U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={3}
                      className="w-full p-2 border rounded-md resize-none"
                      placeholder="Viết bình luận..."
                    />
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-md text-slate-700"
                        onClick={() => {
                          setCommentText('');
                          setShowComposer(false);
                        }}
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 rounded-md bg-blue-600 text-white"
                        onClick={handleSubmitComment}
                      >
                        Đăng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Simple comments list */}
            {localComments.length > 0 && (
              <div className="mt-4 space-y-3">
                {localComments.map((c) => (
                  <div key={c.id}>
                    <div className="flex  gap-3">
                      <Avatar className="w-9 h-9">
                        {c.avatar ? (
                          <AvatarImage
                            src={c.avatar}
                            alt={c.author ?? 'Avatar'}
                          />
                        ) : (
                          <AvatarFallback className="text-sm">
                            {c.author?.charAt(0) ?? 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex  justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium">
                              {c.author}
                            </div>
                            <div className="text-sm text-slate-700">
                              {c.text}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {c.time}
                            </div>
                            <div className="mt-1 flex items-center">
                              <button
                                type="button"
                                aria-label={`Like reply ${c.id}`}
                                onClick={() => {
                                  const next = !likedReplies[c.id];
                                  setLikedReplies((s) => ({
                                    ...s,
                                    [c.id]: next,
                                  }));
                                  createVoteMutation.mutate({
                                    replyId: c.id,
                                    isUpvote: next,
                                  });
                                }}
                                className="flex items-center gap-1 text-sm"
                              >
                                <Heart
                                  size={15}
                                  className={`transition-colors ${likedReplies[c.id] ? 'text-red-500' : 'text-slate-700'}`}
                                  fill={
                                    likedReplies[c.id] ? 'currentColor' : 'none'
                                  }
                                />
                                <span>Thích</span>
                              </button>
                              <button
                                type="button"
                                className="ml-3 flex items-center gap-1 text-sm text-slate-700"
                                onClick={() => {
                                  setReplyTargetId(c.id);
                                  setReplyTargetText('');
                                }}
                              >
                                <MessageSquare size={15} />
                                Trả lời
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {replyTargetId === c.id && (
                      <div className="mt-2 ml-12">
                        <div className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-sm">
                              U
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <textarea
                              autoFocus
                              value={replyTargetText}
                              onChange={(e) =>
                                setReplyTargetText(e.target.value)
                              }
                              rows={2}
                              className="w-full p-2 border rounded-md resize-none"
                              placeholder="Viết trả lời..."
                            />
                            <div className="mt-2 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                className="px-2 py-1 rounded-md text-slate-700"
                                onClick={() => {
                                  setReplyTargetId(null);
                                  setReplyTargetText('');
                                }}
                              >
                                Hủy
                              </button>
                              <button
                                type="button"
                                className="px-2 py-1 rounded-md bg-blue-600 text-white"
                                onClick={() => handleReplyToReply(c.id)}
                              >
                                Đăng
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <ReplyChildren parentId={c.id} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
