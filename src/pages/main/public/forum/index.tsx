// import { Link } from '@tanstack/react-router';
// import { Search } from 'lucide-react';
import React from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import MinimalTiptapEditor from '@/components/ui/minimal-tiptap/minimal-tiptap';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import PostCard from '@/features/forum/components/post-card';
import {
  useCreateForumPostMutation,
  useCreateVoteMutation,
} from '@/features/forum/services/mutations';
import { useGetForumPostsQuery } from '@/features/forum/services/queries';
import { DefaultLayout } from '@/layouts/default-layout';
import { cleanHtml, formatISODate, htmlExcerpt } from '@/utils/string/string';

const tabs = [
  { id: 'popular', label: 'Hay nhất' },
  { id: 'latest', label: 'Mới nhất' },
  { id: 'top', label: 'Hàng đầu' },
  { id: 'rising', label: 'Đang nổi' },
];

const ForumPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(tabs[0].id);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

  // query forum posts
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetForumPostsQuery({
      pageSize: 2,
      pageIndex: 0,
    });

  const createVoteMutation = useCreateVoteMutation();
  const createForumPostMutation = useCreateForumPostMutation();
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [postTitle, setPostTitle] = React.useState('');
  const [answer, setAnswer] = React.useState<string>('');
  const canSubmit = true;

  React.useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!data?.pages) return [];
  const forumPosts = data.pages.flatMap((page) => page.content || []);

  return (
    <DefaultLayout meta={{ title: 'Cộng đồng TRIZ' }} className="bg-slate-100">
      {/* Figma-styled tabs bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-6 px-4 py-3">
          <nav className="flex items-center gap-6" aria-label="Forum tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`relative inline-block pb-2 text-sm font-medium ${
                  activeTab === t.id ? 'text-primary' : 'text-muted-foreground'
                }`}
                aria-current={activeTab === t.id ? 'page' : undefined}
              >
                {t.label}
                {activeTab === t.id && (
                  <span className="absolute -bottom-0 left-1/2 top-auto block h-0.5 w-10 -translate-x-1/2 rounded bg-primary" />
                )}
              </button>
            ))}
          </nav>

          {/* <div className="ml-auto flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm trên TRIZ ..." className="pl-10" />
            </div>

            <Link
              to={'/forum'}
              className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-white"
            >
              Tạo chủ đề
            </Link>
          </div> */}
        </div>
      </div>

      {/* Page content: two-column layout (main feed + right sidebar) */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-4 flex flex-col gap-6">
            {/* Composer (from Figma node 3239:16193) */}
            <div className=" flex items-center gap-4 p-4 border bg-white border-slate-200 rounded-lg">
              <div className="shrink-0">
                <Avatar>
                  <AvatarImage
                    src="https://www.figma.com/api/mcp/asset/91674c6e-5dd9-4b53-b75a-2a5856946d5b"
                    alt="avatar"
                  />
                </Avatar>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setShowCreateDialog(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ')
                    setShowCreateDialog(true);
                }}
                className="flex flex-1 items-center gap-4 rounded-lg bg-slate-100 border border-slate-200 px-4 py-4 cursor-text"
              >
                <div className="flex-1">
                  <div className="text-[18px] font-medium text-slate-400">
                    Chia sẻ suy nghĩ hoặc bài viết của bạn
                  </div>
                </div>
              </div>

              {/* Create post dialog */}
              <Dialog
                open={showCreateDialog}
                onOpenChange={(open) => !open && setShowCreateDialog(false)}
              >
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Tạo bài viết mới</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm text-slate-600">Tiêu đề</label>
                      <Input
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="Tiêu đề bài viết"
                      />
                    </div>

                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <div>
                            <MinimalTiptapEditor
                              value={answer}
                              onChange={(v) =>
                                setAnswer(
                                  typeof v === 'string' ? v : JSON.stringify(v),
                                )
                              }
                              output="html"
                              placeholder="Nhập nội dung bài viết..."
                              editorContentClassName="min-h-[200px] p-4"
                              editable={canSubmit}
                            />
                          </div>
                          {!answer && (
                            <TooltipContent side="bottom">
                              <p>
                                Nhấp vào đây để bắt đầu nhập câu trả lời của bạn
                              </p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setShowCreateDialog(false)}
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={() => {
                          const payload = {
                            title: postTitle.trim(),
                            content: answer || '',
                            tagIds: [],
                          };
                          createForumPostMutation.mutate(payload, {
                            onSuccess: () => {
                              setShowCreateDialog(false);
                              setPostTitle('');
                              setAnswer('');
                            },
                          });
                        }}
                        disabled={
                          !postTitle.trim() ||
                          !(answer && answer.toString().trim()) ||
                          createForumPostMutation.isPending
                        }
                      >
                        Đăng
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {/* Posts list */}

            {forumPosts.length === 0 ? (
              <div className="p-6 bg-white border border-slate-200 rounded-lg">
                Chưa có bài viết nào.
              </div>
            ) : (
              forumPosts.map((p) => (
                <PostCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  author={{
                    name: p.userName,
                    href: `/users/${p.createdBy}`,
                    avatar:
                      'https://www.figma.com/api/mcp/asset/91674c6e-5dd9-4b53-b75a-2a5856946d5b',
                  }}
                  time={formatISODate(p.createdAt)}
                  excerpt={
                    <>
                      <div
                        className="whitespace-pre-line break-words"
                        // render either full content (when expanded) or the text excerpt
                        dangerouslySetInnerHTML={{
                          __html:
                            expandedId === p.id
                              ? cleanHtml(p.content)
                              : htmlExcerpt(p.content),
                        }}
                      />
                      {p.content && p.content.length > 400 && (
                        <div className="mt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(expandedId === p.id ? null : p.id)
                            }
                            className="text-secondary mt-1"
                          >
                            {expandedId === p.id ? 'Thu gọn' : 'xem thêm'}
                          </button>
                        </div>
                      )}
                    </>
                  }
                  image={undefined}
                  likes={p.upVoteCount}
                  comments={p.replyCount}
                  onLike={(postId, isUpvote) =>
                    createVoteMutation.mutate({ postId, isUpvote })
                  }
                />
              ))
            )}
            <div
              ref={loadMoreRef}
              className="py-6 flex justify-center text-slate-500"
            >
              {isFetchingNextPage ? 'Đang tải thêm...' : ''}
            </div>
          </div>
        </div>
      </main>
    </DefaultLayout>
  );
};

export default ForumPage;
