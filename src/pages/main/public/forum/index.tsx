import { useQueryClient } from '@tanstack/react-query';
import { Users, Sparkles } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

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
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useGetMeQuery } from '@/features/auth/services/queries';
import PostCard from '@/features/forum/components/post-card';
import {
  useCreateForumPostMutation,
  useCreateVoteMutation,
  useDeleteForumPostMutation,
} from '@/features/forum/services/mutations';
import {
  useGetMyForumPostAll,
  useGetForumPostsQuery,
} from '@/features/forum/services/queries';
import { ForumKeys } from '@/features/forum/services/queries/keys';
import { useUploadFileMutation } from '@/features/media/services/mutations';
import { DefaultLayout } from '@/layouts/default-layout';
import { cleanHtml, formatISODate, htmlExcerpt } from '@/utils/string/string';

const ForumPage: React.FC = () => {
  const tabs = [
    { id: 'latest', label: 'Mới nhất', icon: Sparkles },
    { id: 'me', label: 'Của tôi', icon: Users },
  ];
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState(tabs[0].id);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

  // query forum posts
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetForumPostsQuery({
      pageSize: 3,
      pageIndex: 0,
    });
  const {
    data: myPosts,
    fetchNextPage: fetchMyPostsNextPage,
    hasNextPage: hasMyPostsNextPage,
    isFetchingNextPage: isFetchingMyPostsNextPage,
    isLoading: isLoadingMyPosts,
    isError: isErrorMyPosts,
  } = useGetMyForumPostAll({
    pageSize: 3,
    pageIndex: 0,
  });
  const { data: meData } = useGetMeQuery();
  const uploadMutation = useUploadFileMutation();
  const createVoteMutation = useCreateVoteMutation();
  const deleteCommentMutation = useDeleteForumPostMutation();
  const createForumPostMutation = useCreateForumPostMutation();
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showDetailDialog, setShowDetailDialog] = React.useState(false);
  const [selectedPostId, setSelectedPostId] = React.useState<string | null>(
    null,
  );
  const [postTitle, setPostTitle] = React.useState('');
  const [postImage, setPostImage] = React.useState<string>('');
  const [answer, setAnswer] = React.useState<string>('');
  const canSubmit = true;
  const myPostsTab = React.useMemo(
    () => myPosts?.pages.flatMap((page) => page?.content || []) ?? [],
    [myPosts],
  );
  const forumPosts = React.useMemo(
    () => data?.pages.flatMap((page) => page?.content || []) || [],
    [data?.pages],
  );

  const selectedPost = React.useMemo(() => {
    if (!selectedPostId) return null;
    return (
      forumPosts.find((p) => p.id === selectedPostId) ||
      myPostsTab.find((p) => p.id === selectedPostId) ||
      null
    );
  }, [selectedPostId, forumPosts, myPostsTab]);

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

  React.useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMyPostsNextPage &&
          !isFetchingMyPostsNextPage
        ) {
          fetchMyPostsNextPage();
        }
      },
      { threshold: 1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMyPostsNextPage, isFetchingMyPostsNextPage, fetchMyPostsNextPage]);
  // Handle loading states
  if (isLoading) {
    return (
      <DefaultLayout
        meta={{ title: 'Cộng đồng TRIZ' }}
        className="bg-slate-100 h-screen"
      >
        <div className="container mx-auto px-4 py-6 h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-slate-600">Đang tải...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  // Handle error states

  if (!data?.pages)
    return (
      <DefaultLayout
        meta={{ title: 'Cộng đồng TRIZ' }}
        className="bg-slate-100 h-screen"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="p-6 bg-white border border-slate-200 rounded-lg">
            <p className="text-slate-600">Không có dữ liệu.</p>
          </div>
        </div>
      </DefaultLayout>
    );

  const postsToShow = activeTab === 'me' ? myPostsTab : forumPosts;

  // Get selected post details

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
    setShowDetailDialog(true);
  };

  return (
    <DefaultLayout meta={{ title: 'Cộng đồng TRIZ' }} className="bg-slate-100">
      {/* Figma-styled tabs bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-6 px-4 py-3">
          <nav className="flex items-center gap-6" aria-label="Forum tabs">
            {[
              { id: 'latest', label: 'Mới nhất', icon: Sparkles },
              ...(meData ? [{ id: 'me', label: 'Của tôi', icon: Users }] : []),
            ].map((t) => (
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
        </div>
      </div>

      {/* Page content: two-column layout (main feed + right sidebar) */}
      <main
        className={`container mx-auto px-4 py-6 ${postsToShow.length > 0 ? 'h-full' : 'h-screen'}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-3 flex flex-col gap-6">
            {/* Composer (from Figma node 3239:16193) */}
            {meData && (
              <div className=" flex items-center gap-4 p-4 border bg-white border-slate-200 rounded-lg">
                <div className="shrink-0">
                  <Avatar>
                    <AvatarImage src={meData?.avatarUrl} alt="avatar" />
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

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-slate-600">
                          Tiêu đề
                        </label>
                        <Input
                          value={postTitle}
                          onChange={(e) => setPostTitle(e.target.value)}
                          placeholder="Tiêu đề bài viết"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-slate-600">
                          Ảnh bài viết
                        </label>
                        {/* <FileUpload
                          value={postFile}
                          onValueChange={(files) => {
                            setPostFile(files);
                          }}
                          onUpload={async (
                            files,
                            { onProgress, onSuccess, onError },
                          ) => {
                            for (const file of files) {
                              try {
                                onProgress(file, 0);
                                const response =
                                  await uploadMutation.mutateAsync({
                                    file,
                                  });
                                if (response.data) {
                                  setPostImage(response.data);
                                  onProgress(file, 100);
                                  onSuccess(file);
                                }
                              } catch (error) {
                                onError(
                                  file,
                                  error instanceof Error
                                    ? error
                                    : new Error('Upload failed'),
                                );
                              }
                            }
                          }}
                          accept="image/*"
                          maxFiles={1}
                          maxSize={10 * 1024 * 1024} // 10MB
                        >
                          <FileUploadDropzone className="rounded-lg border-2 border-dashed p-6">
                            <div className="text-center">
                              <div className="text-sm font-medium text-muted-foreground">
                                Kéo và thả tệp vào đây để tải lên
                              </div>
                              <div className="text-xs text-muted-foreground mt-2">
                                hoặc
                              </div>
                              <FileUploadTrigger asChild>
                                <Button type="button" variant="link" size="sm">
                                  Click to browse
                                </Button>
                              </FileUploadTrigger>
                            </div>
                            {uploadMutation.progress > 0 &&
                              uploadMutation.isPending && (
                                <div className="text-sm text-muted-foreground">
                                  {uploadMutation.progress}%
                                </div>
                              )}

                            <FileUploadList className="mt-4 space-y-2">
                              {postImage && (
                                <div className="mt-2 w-full h-48  overflow-hidden rounded-md border bg-white">
                                  <img
                                    src={postImage}
                                    alt="thumbnail preview"
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '';
                                    }}
                                  />
                                </div>
                              )}
                            </FileUploadList>
                          </FileUploadDropzone>
                        </FileUpload> */}
                        <Input
                          id="picture"
                          type="file"
                          accept="image/*"
                          placeholder="Chọn ảnh cho khóa học"
                          onChange={(e) => {
                            const file = (e.target as HTMLInputElement)
                              .files?.[0];
                            if (!file) return;
                            uploadMutation.mutate(
                              { file },
                              {
                                onSuccess: (res: {
                                  flag: boolean;
                                  code: number;
                                  data: string;
                                }) => {
                                  if (res.code === 200) {
                                    setPostImage(res.data);
                                  }
                                  toast.success('Tải ảnh lên thành công');
                                },
                                onError: () => {
                                  toast.error(
                                    'Tải ảnh lên thất bại. Vui lòng thử lại.',
                                  );
                                },
                              },
                            );
                          }}
                          disabled={uploadMutation.isPending}
                        />
                        {uploadMutation.progress > 0 &&
                          uploadMutation.isPending && (
                            <Progress
                              value={uploadMutation.progress}
                              className="w-full h-[10px] mt-2 "
                            />
                          )}
                        {postImage && (
                          <div className="mt-2 w-full h-60  overflow-hidden rounded-md border bg-white">
                            <img
                              src={postImage}
                              alt="thumbnail preview"
                              className="object-cover w-full h-60"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '';
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm text-slate-600">
                          Nội dung
                        </label>

                        <TooltipProvider>
                          <Tooltip>
                            <div>
                              <MinimalTiptapEditor
                                value={answer}
                                onChange={(v) =>
                                  setAnswer(
                                    typeof v === 'string'
                                      ? v
                                      : JSON.stringify(v),
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
                                  Nhấp vào đây để bắt đầu nhập câu trả lời của
                                  bạn
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
                              imgUrl: postImage || '',
                              tagIds: [],
                            };
                            createForumPostMutation.mutate(payload, {
                              onSuccess: () => {
                                setShowCreateDialog(false);
                                setPostTitle('');
                                setPostImage('');
                                setAnswer('');
                                toast.success('Đã tạo bài viết thành công.');
                              },
                              onError: (error) => {
                                toast.error(
                                  error instanceof Error
                                    ? error.message
                                    : 'Không thể tạo bài viết. Vui lòng thử lại.',
                                );
                              },
                            });
                          }}
                          disabled={
                            !postTitle.trim() ||
                            !(answer && answer.toString().trim()) ||
                            createForumPostMutation.isPending
                          }
                        >
                          {createForumPostMutation.isPending
                            ? 'Đang đăng...'
                            : 'Đăng'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Post Detail Dialog */}
                <Dialog
                  open={showDetailDialog}
                  onOpenChange={(open) => {
                    if (!open) {
                      setShowDetailDialog(false);
                      setSelectedPostId(null);
                    }
                  }}
                >
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedPost ? (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">
                            {selectedPost.title}
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
                          {/* Author info */}
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={selectedPost.avtUrl || ''}
                                alt={selectedPost.userName || 'User'}
                              />
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {selectedPost.userName || 'Người dùng'}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatISODate(selectedPost.createdAt)}
                              </p>
                            </div>
                          </div>

                          {/* Post image */}
                          {selectedPost.imgUrl && (
                            <div className="w-full rounded-lg overflow-hidden border">
                              <img
                                src={selectedPost.imgUrl}
                                alt={selectedPost.title}
                                className="w-full object-cover max-h-96"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    'none';
                                }}
                              />
                            </div>
                          )}

                          {/* Post content */}
                          <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: cleanHtml(selectedPost.content || ''),
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="py-8 text-center text-slate-500">
                        Không tìm thấy bài viết
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            )}
            {/* Posts list */}

            {postsToShow.length === 0 ? (
              <div className="p-6 bg-white border border-slate-200 rounded-lg text-center">
                <p className="text-slate-600">
                  {activeTab === 'me'
                    ? 'Bạn chưa có bài viết nào.'
                    : 'Chưa có bài viết nào.'}
                </p>
              </div>
            ) : (
              postsToShow.map((p) => (
                <PostCard
                  userData={meData}
                  key={p.id}
                  id={p.id}
                  image={p.imgUrl}
                  isOwner={meData?.id === p.userId}
                  onDelete={(postId) => {
                    deleteCommentMutation.mutate(postId, {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: [ForumKeys.GetMyForumPostQuery],
                        });
                        queryClient.invalidateQueries({
                          queryKey: [ForumKeys.GetForumQuery],
                        });
                        toast.success('Đã xóa bài viết thành công.');
                      },
                      onError: (error) => {
                        toast.error(
                          error instanceof Error
                            ? error.message
                            : 'Không thể xóa bài viết. Vui lòng thử lại.',
                        );
                      },
                    });
                  }}
                  onReport={() => {
                    // simple report placeholder - replace with actual report flow
                    // eslint-disable-next-line no-restricted-globals
                  }}
                  title={p.title}
                  author={{
                    name: p.userName || 'Người dùng',
                    href: `/users/${p.createdBy}`,
                    avatar: p.avtUrl || '',
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
                              ? cleanHtml(p.content || '')
                              : htmlExcerpt(p.content || ''),
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
                  likes={p.upVoteCount || 0}
                  comments={p.replyCount || 0}
                  onLike={(postId, isUpvote) =>
                    createVoteMutation.mutate(
                      { postId, isUpvote },
                      {
                        onError: (error) => {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : 'Không thể thực hiện vote. Vui lòng thử lại.',
                          );
                        },
                      },
                    )
                  }
                  isAuthenticated={!!meData}
                />
              ))
            )}
            {/* only enable infinite loading for the global feed */}
            <div
              ref={activeTab === 'me' ? null : loadMoreRef}
              className="py-6 flex justify-center text-slate-500"
            >
              {activeTab !== 'me' &&
                (isFetchingNextPage ? 'Đang tải thêm...' : '')}
            </div>
          </div>
          <aside className="hidden lg:block">
            {meData &&
              !isLoadingMyPosts &&
              !isErrorMyPosts &&
              myPostsTab.length > 0 && (
                <div className="bg-white box-border w-full p-4 rounded-lg border border-slate-200 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium text-[16px] text-slate-900">
                      Bài viết của tôi
                    </p>
                    <img
                      src="https://www.figma.com/api/mcp/asset/15ca3c3d-b096-4c48-8bcc-4f2cac9b8998"
                      alt="chevron"
                      className="w-6 h-6"
                    />
                  </div>

                  <div className="space-y-4">
                    {myPostsTab.slice(0, 3).map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                        onClick={() => handlePostClick(r.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handlePostClick(r.id);
                          }
                        }}
                      >
                        <img
                          src={r.imgUrl || ''}
                          alt={r.title}
                          className="w-14 h-14 rounded-md object-cover bg-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500">
                            {formatISODate(r.createdAt)}
                          </p>
                          <p className="font-semibold text-[14px] line-clamp-2">
                            {r.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            <div className=" bg-white box-border p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-[16px] text-slate-900">
                  Bài viết mới nhất
                </p>
                <img
                  src="https://www.figma.com/api/mcp/asset/15ca3c3d-b096-4c48-8bcc-4f2cac9b8998"
                  alt="chevron"
                  className="w-6 h-6"
                />
              </div>

              <div className="space-y-4">
                {forumPosts.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                    onClick={() => handlePostClick(r.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handlePostClick(r.id);
                      }
                    }}
                  >
                    <img
                      src={r.imgUrl || ''}
                      alt={r.title}
                      className="w-14 h-14 rounded-md object-cover bg-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500">
                        {formatISODate(r.createdAt)}
                      </p>
                      <p className="font-semibold text-[14px] line-clamp-2">
                        {r.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </DefaultLayout>
  );
};

export default ForumPage;
