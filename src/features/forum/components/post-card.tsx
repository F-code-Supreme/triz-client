import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import {
  Flag,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Repeat2,
  Trash2,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateCommentMutation,
  useCreateReplyCommentMutation,
  useCreateReportForumPostMutation,
  useCreateRepostForumPostMutation,
  useCreateVoteForReplyMutation,
  useDeleteReplyCommentMutation,
} from '@/features/forum/services/mutations';
import {
  useGetForumPostReplyByIdQuery,
  useGetForumPostChildrenReplyByIdQuery,
} from '@/features/forum/services/queries';
import { ForumKeys } from '@/features/forum/services/queries/keys';
import { formatDate } from '@/utils';

import type { User } from '@/features/auth/types';
import type { Comment } from '@/features/forum/types';

// add shared constants used for like icons
const LIKE_TRANSITION_CLASS = 'transition-colors';
const LIKE_ACTIVE_CLASS = 'text-red-500';
const LIKE_INACTIVE_CLASS = 'text-slate-700';

// New: extracted ReplyChildren component to keep PostCard lean
const ReplyChildrenExternal: React.FC<{
  isAuthenticated: boolean;
  parentId: string;
  userData?: User;
  isOwner?: boolean;
  likedReplies: Record<string, boolean>;
  setLikedReplies: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  handleDeleteComment: (id: string) => void;
  replyTargetId: string | null;
  setReplyTargetId: (id: string | null) => void;
  replyTargetText: string;
  setReplyTargetText: (t: string) => void;
  canSubmitReply: boolean;
  handleReplyToReply: (id: string) => void;
}> = ({
  isAuthenticated,
  parentId,
  userData,
  isOwner,
  likedReplies,
  setLikedReplies,
  handleDeleteComment,
  replyTargetId,
  setReplyTargetId,
  replyTargetText,
  setReplyTargetText,
  canSubmitReply,
  handleReplyToReply,
}) => {
  const { data } = useGetForumPostChildrenReplyByIdQuery(parentId);
  const children = data ?? [];
  const createVoteMutation = useCreateVoteForReplyMutation();

  if (!children || children.length === 0) return null;
  return (
    <div className="mt-2 ml-12 space-y-2">
      {children.map((c: Comment) => {
        const replyAuthorId =
          (c as any).userId ?? (c as any).createdBy ?? (c as any).authorId;
        return (
          <div key={c.id}>
            <div className="flex justify-between items-start gap-3">
              <div className="flex gap-3">
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
                          ? formatDate(
                              new Date(c.createdAt),
                              'DD/MM/YYYY HH:mm',
                            )
                          : ''}
                      </div>
                      {isAuthenticated && (
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
                              className={`${LIKE_TRANSITION_CLASS} ${likedReplies[c.id] ? LIKE_ACTIVE_CLASS : LIKE_INACTIVE_CLASS}`}
                              fill={
                                likedReplies[c.id] ? 'currentColor' : 'none'
                              }
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
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* reply-level dropdown: visible to post owner or reply author */}
              <div>
                {(isOwner || replyAuthorId === userData?.id) && (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" aria-label="Open menu" size="sm">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40" align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-red-500 cursor-pointer hover:text-red-600 flex justify-between items-center"
                        >
                          Xóa bình luận <Trash2 />
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {replyTargetId === c.id && (
              <div className="mt-2 ml-12">
                <div className="flex gap-3 items-start">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarImage src={userData?.avatarUrl} alt="avatar" />
                  </Avatar>

                  <div className="flex-1">
                    <div className="relative">
                      <textarea
                        autoFocus
                        value={replyTargetText}
                        onChange={(e) => setReplyTargetText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (canSubmitReply) handleReplyToReply(c.id);
                          }
                        }}
                        onFocus={(e) => {
                          const el = e.target as HTMLTextAreaElement;
                          setTimeout(() => {
                            try {
                              const len = el.value.length;
                              el.setSelectionRange(len, len);
                            } catch {
                              // ignore
                            }
                          }, 0);
                        }}
                        rows={1}
                        className="w-full min-h-[40px] max-h-28 resize-none border-gray-300 border-2 rounded-lg bg-white text-black placeholder-slate-400 px-4 py-3 pr-14 focus:outline-none focus:border-slate-500 transition-all text-left"
                        placeholder="Viết trả lời..."
                      />

                      <div className="absolute inset-y-0 right-2 flex items-center">
                        <button
                          type="button"
                          onClick={() => handleReplyToReply(c.id)}
                          disabled={!canSubmitReply}
                          aria-disabled={!canSubmitReply}
                          className={`h-8 w-8 rounded-lg flex items-center justify-center ${canSubmitReply ? ' text-gray-600' : 'text-slate-400 pointer-events-none'}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="currentColor"
                            aria-hidden
                          >
                            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* render nested children recursively */}
            <ReplyChildrenExternal
              isAuthenticated={isAuthenticated}
              parentId={c.id}
              userData={userData}
              isOwner={isOwner}
              likedReplies={likedReplies}
              setLikedReplies={setLikedReplies}
              handleDeleteComment={handleDeleteComment}
              replyTargetId={replyTargetId}
              setReplyTargetId={setReplyTargetId}
              replyTargetText={replyTargetText}
              setReplyTargetText={setReplyTargetText}
              canSubmitReply={canSubmitReply}
              handleReplyToReply={handleReplyToReply}
            />
          </div>
        );
      })}
    </div>
  );
};

interface PostCardProps {
  id: string;
  userData?: User;
  isOwner?: boolean;
  onDelete?: (postId: string) => void;
  title: string;
  author: { name: string; href?: string; avatar?: string };
  time: string;
  excerpt: React.ReactNode;
  image?: string;
  likes?: number;
  comments?: number;
  isAuthenticated?: boolean;
  onLike?: (postId: string, isUpvote: boolean) => void;
  onComment?: (postId: string, text: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  id: _id,
  userData,
  isOwner = false,
  onDelete,
  onLike,
  onComment,
  title,
  author,
  time,
  excerpt,
  image,
  likes = 0,
  comments = 0,
  isAuthenticated = false,
}) => {
  const [liked, setLiked] = React.useState(false);
  const [localLikes, setLocalLikes] = React.useState<number>(likes ?? 0);
  const [showComposer, setShowComposer] = React.useState(false);
  const [commentText, setCommentText] = React.useState('');
  // derived helpers for the comment composer
  const commentLength = commentText.trim().length;
  const canSubmitComment = commentLength > 0;
  const [localComments, setLocalComments] = React.useState<
    Array<{
      id: string;
      text: string;
      author?: string;
      authorId?: string;
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
  // derived helpers for reply composer
  const replyLength = replyTargetText.trim().length;
  const canSubmitReply = replyLength > 0;

  // Report dialog states
  const [showReportDialog, setShowReportDialog] = React.useState(false);
  const [reportReason, setReportReason] = React.useState('');
  const [reportDescription, setReportDescription] = React.useState('');

  React.useEffect(() => {
    setLocalLikes(likes ?? 0);
  }, [likes]);
  // fetch replies for this post
  const { data: repliesData } = useGetForumPostReplyByIdQuery(_id);
  const reportPostMutation = useCreateReportForumPostMutation();
  const repostPostMutation = useCreateRepostForumPostMutation();
  const repliesContent = repliesData?.content || [];

  //mutation
  const createVoteMutation = useCreateVoteForReplyMutation();
  const createCommentMutation = useCreateCommentMutation();
  const deleteReplyCommentMutation = useDeleteReplyCommentMutation();
  const createReplyCommentMutation = useCreateReplyCommentMutation();
  const queryClient = useQueryClient();

  // delete a comment (optimistic UI + best-effort server call)
  const handleDeleteComment = (commentId: string) => {
    deleteReplyCommentMutation.mutate(commentId, {
      onSuccess: () => {
        // refresh the top-level replies for this post
        queryClient.invalidateQueries({
          queryKey: [ForumKeys.GetForumPostReplies, _id],
        });

        // refresh all child-replies caches (some implementations use parentId as key)
        // use predicate to invalidate any query keyed by ForumKeys.GetForumPostChildrenReplies
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === ForumKeys.GetForumPostChildrenReplies,
        });

        // optimistic local removal of top-level comment if present
        setLocalComments((s) => s.filter((c) => c.id !== commentId));
        setLocalCommentCount((c) => Math.max(0, c - 1));
        toast.success('Xóa bình luận thành công!');
      },
    });
  };

  // initialize local comments from the replies query for this post
  React.useEffect(() => {
    try {
      const server = Array.isArray(repliesContent) ? repliesContent : [];
      const topLevel = server.filter((r) => !r.parentId);

      const mapped = topLevel.map((t) => ({
        id: t.id,
        text: t.content,
        author: t.userName || undefined,
        authorId: (t as any).userId ?? (t as any).createdBy ?? undefined,
        avatar: t.avtUrl || undefined,
        time: t.createdAt
          ? (() => {
              try {
                return formatDate(new Date(t.createdAt), 'DD/MM/YYYY HH:mm');
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

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setLocalLikes((s) => s + (next ? 1 : -1));
    onLike?.(_id, next);
  };
  const handleRepost = () => {
    repostPostMutation.mutate(
      {
        originalPostId: _id,
      },
      {
        onSuccess: () => {
          toast.success('Đăng lại bài viết thành công!');
        },
      },
    );
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
      authorId: userData?.id,
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

  const handleSubmitReport = () => {
    if (!reportReason) {
      toast.error('Vui lòng chọn lý do báo cáo');
      return;
    }
    if (!reportDescription.trim()) {
      toast.error('Vui lòng nhập mô tả chi tiết');
      return;
    }

    // TODO: Replace with actual report mutation
    reportPostMutation.mutate(
      {
        forumPostId: _id,
        reason: reportReason,
        description: reportDescription.trim(),
      },
      {
        onSuccess: () => {
          toast.success('Đã gửi báo cáo thành công');
          setShowReportDialog(false);
          setReportReason('');
          setReportDescription('');
        },
      },
    );
  };

  const handleCloseReportDialog = () => {
    setShowReportDialog(false);
    setReportReason('');
    setReportDescription('');
  };

  return (
    <Card className="rounded-lg">
      <div className="p-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-4">
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
              <div>
                {/* more button for owner */}
                {isAuthenticated && (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" aria-label="Open menu" size="sm">
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40" align="end">
                      <DropdownMenuGroup>
                        {isOwner && (
                          <DropdownMenuItem
                            onClick={() => {
                              onDelete?.(_id);
                            }}
                            className="text-red-500 cursor-pointer hover:text-red-600 flex justify-between items-center"
                          >
                            Xóa bài viết <Trash2 />
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            setShowReportDialog(true);
                          }}
                          className="flex justify-between items-center cursor-pointer"
                        >
                          Báo cáo <Flag />
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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

            {isAuthenticated && (
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-6 ">
                  <button aria-label="Like" onClick={handleLike} type="button">
                    <div className="flex items-center gap-2">
                      <Heart
                        className={`${LIKE_TRANSITION_CLASS} ${liked ? LIKE_ACTIVE_CLASS : LIKE_INACTIVE_CLASS}`}
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
                  <button
                    aria-label="Share"
                    onClick={handleRepost}
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <Repeat2 /> <span>Đăng lại</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Comment composer */}
            {showComposer && (
              <div className="mt-4">
                <div className="flex gap-3 items-start">
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarImage src={userData?.avatarUrl} alt="avatar" />
                  </Avatar>

                  <div className="flex-1">
                    <div className="relative">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (canSubmitComment) handleSubmitComment();
                          }
                        }}
                        rows={1}
                        className="w-full min-h-[44px] max-h-36 resize-none  border-gray-300 border-2 rounded-lg bg-white text-black placeholder-slate-400 px-4 py-3 pr-14 focus:outline-none  focus:border-slate-500 transition-all"
                        placeholder="Viết bình luận..."
                      />

                      <div className="absolute inset-y-0 right-2 flex items-center">
                        <button
                          type="button"
                          onClick={handleSubmitComment}
                          disabled={!canSubmitComment}
                          aria-disabled={!canSubmitComment}
                          className={`h-9 w-9 rounded-lg flex items-center justify-center ${canSubmitComment ? ' text-gray-600' : 'text-slate-400 pointer-events-none'}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            fill="currentColor"
                            aria-hidden
                          >
                            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                          </svg>
                        </button>
                      </div>
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
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3">
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
                              {isAuthenticated && (
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
                                      className={`${LIKE_TRANSITION_CLASS} ${likedReplies[c.id] ? LIKE_ACTIVE_CLASS : LIKE_INACTIVE_CLASS}`}
                                      fill={
                                        likedReplies[c.id]
                                          ? 'currentColor'
                                          : 'none'
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
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        {c.authorId === userData?.id && (
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                aria-label="Open menu"
                                size="sm"
                              >
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40" align="end">
                              <DropdownMenuGroup>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteComment(c.id)}
                                  className="text-red-500 cursor-pointer hover:text-red-600 flex justify-between items-center"
                                >
                                  Xóa bình luận <Trash2 />
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                    {replyTargetId === c.id && (
                      <div className="mt-2 ml-12">
                        <div className="flex gap-3 items-start">
                          <Avatar className="w-8 h-8 shrink-0">
                            <AvatarImage
                              src={userData?.avatarUrl}
                              alt="avatar"
                            />
                          </Avatar>

                          <div className="flex-1">
                            <div className="relative">
                              <textarea
                                autoFocus
                                value={replyTargetText}
                                onChange={(e) =>
                                  setReplyTargetText(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (canSubmitReply)
                                      handleReplyToReply(c.id);
                                  }
                                }}
                                rows={1}
                                className="w-full min-h-[40px] max-h-28 resize-none  border-gray-300 border-2 rounded-lg bg-white text-black placeholder-slate-400 px-4 py-3 pr-14 focus:outline-none  focus:border-slate-500 transition-all"
                                placeholder="Viết trả lời..."
                              />

                              <div className="absolute inset-y-0 right-2 flex items-center">
                                <button
                                  type="button"
                                  onClick={() => handleReplyToReply(c.id)}
                                  disabled={!canSubmitReply}
                                  aria-disabled={!canSubmitReply}
                                  className={`h-8 w-8 rounded-lg flex items-center justify-center ${canSubmitReply ? ' text-gray-600' : 'text-slate-400 pointer-events-none'}`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="14"
                                    height="14"
                                    fill="currentColor"
                                    aria-hidden
                                  >
                                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <ReplyChildrenExternal
                      isAuthenticated={isAuthenticated}
                      parentId={c.id}
                      userData={userData}
                      isOwner={isOwner}
                      likedReplies={likedReplies}
                      setLikedReplies={setLikedReplies}
                      handleDeleteComment={handleDeleteComment}
                      replyTargetId={replyTargetId}
                      setReplyTargetId={setReplyTargetId}
                      replyTargetText={replyTargetText}
                      setReplyTargetText={setReplyTargetText}
                      canSubmitReply={canSubmitReply}
                      handleReplyToReply={handleReplyToReply}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Báo cáo bài viết</DialogTitle>
            <DialogDescription>
              Vui lòng chọn lý do và mô tả chi tiết về vấn đề bạn gặp phải với
              bài viết này.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="report-reason">
                Lý do báo cáo <span className="text-red-500">*</span>
              </Label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger id="report-reason">
                  <SelectValue placeholder="Chọn lý do báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SPAM">Spam hoặc quảng cáo</SelectItem>
                  <SelectItem value="ADULT_CONTENT">
                    Nội dung người lớn
                  </SelectItem>
                  <SelectItem value="INAPPROPRIATE_CONTENT">
                    Nội dung không phù hợp
                  </SelectItem>
                  <SelectItem value="HARASSMENT">
                    Quấy rối hoặc bắt nạt
                  </SelectItem>
                  <SelectItem value="FALSE_INFORMATION">
                    Thông tin sai lệch
                  </SelectItem>
                  <SelectItem value="HATE_SPEECH">
                    Ngôn từ kích động thù địch
                  </SelectItem>
                  <SelectItem value="VIOLENCE">
                    Bạo lực hoặc nguy hiểm
                  </SelectItem>
                  <SelectItem value="COPYRIGHT_VIOLATION">
                    Vi phạm bản quyền
                  </SelectItem>
                  <SelectItem value="OTHER">Lý do khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="report-description">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="report-description"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-slate-500">
                {reportDescription.length}/500 ký tự
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseReportDialog}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSubmitReport}
              disabled={
                !reportReason ||
                !reportDescription.trim() ||
                reportPostMutation.isPending
              }
            >
              {reportPostMutation.isPending ? 'Đang gửi...' : 'Gửi báo cáo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PostCard;
