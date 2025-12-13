import { format } from 'date-fns';
import { Award, Edit3, X, Check } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import PostCard from '@/features/forum/components/post-card';
import {
  useCreateVoteMutation,
  useDeleteForumPostMutation,
} from '@/features/forum/services/mutations';
import { useGetForumPostsByUserIdQuery } from '@/features/forum/services/queries';
import { cleanHtml, formatISODate, htmlExcerpt } from '@/utils';

import type { UserAchievementResponse } from '@/features/achievement/types';
import type { User } from '@/features/auth/types';

const COLORS = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#607D8B',
];

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function getAvatarColor(identifier: string) {
  const hash = Math.abs(hashString(identifier));
  return COLORS[hash % COLORS.length];
}

interface ProfileViewProps {
  userData?: Omit<User, 'roles'> & { createdAt?: string };
  isLoadingUser: boolean;
  achievementsData?: UserAchievementResponse;
  isLoadingAchievements: boolean;
  isOwnProfile?: boolean;
  currentUser?: User;
  onSaveProfile?: (data: { fullName: string; email: string }) => void;
}

export const ProfileView = ({
  userData,
  isLoadingUser,
  achievementsData,
  isLoadingAchievements,
  isOwnProfile = false,
  currentUser,
  onSaveProfile,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: ProfileViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: '',
    email: '',
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Forum posts query
  const {
    data: forumPostsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPosts,
  } = useGetForumPostsByUserIdQuery(userData?.id, {
    pageIndex: 0,
    pageSize: 5,
  });

  const forumPosts = React.useMemo(
    () => forumPostsData?.pages.flatMap((page) => page?.content || []) || [],
    [forumPostsData?.pages],
  );

  const createVoteMutation = useCreateVoteMutation();
  const deletePostMutation = useDeleteForumPostMutation();

  // Infinite scroll for forum posts
  useEffect(() => {
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

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  const handleEditClick = () => {
    setEditData({
      fullName: userData?.fullName || '',
      email: userData?.email || '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      fullName: '',
      email: '',
    });
  };

  const handleSaveEdit = () => {
    if (onSaveProfile) {
      onSaveProfile(editData);
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const avatarNode = isLoadingUser ? (
    <div className="w-40 h-40 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-spin border-4 border-gray-300 border-t-blue-400" />
  ) : userData?.avatarUrl ? (
    <img
      src={userData.avatarUrl}
      alt={userData.fullName}
      className="w-40 h-40 rounded-full object-cover mx-auto mb-4 ring-4 ring-gray-100 dark:ring-gray-700"
    />
  ) : (
    <Avatar className="w-40 h-40 mx-auto mb-4 ring-4 ring-gray-100 dark:ring-gray-700">
      <AvatarFallback
        className="text-white text-5xl font-bold"
        style={{
          backgroundColor: getAvatarColor(
            userData?.fullName || userData?.email || '',
          ),
        }}
      >
        {userData?.fullName
          ? userData.fullName.charAt(0).toUpperCase()
          : userData?.email
            ? userData.email.charAt(0).toUpperCase()
            : '?'}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div className="container mx-auto md:p-8 sm:p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left sidebar - User Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="p-6">
              <div className="md:text-start text-center mb-6">
                {avatarNode}
                {!isEditing ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {userData?.fullName || 'Chưa có tên'}
                    </h2>
                    <h2 className="text-gray-600 dark:text-gray-300 mb-4">
                      {userData?.email || 'Chưa có email'}
                    </h2>
                    {/* Ngày tham gia */}
                    {userData?.createdAt && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Ngày tham gia: {formatJoinDate(userData.createdAt)}
                      </div>
                    )}
                    {isOwnProfile && (
                      <Button
                        onClick={handleEditClick}
                        variant="outline"
                        size="sm"
                        className="mb-4"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="space-y-4 w-full">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Name
                      </Label>
                      <Input
                        id="fullName"
                        value={editData.fullName}
                        onChange={(e) =>
                          handleInputChange('fullName', e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={editData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        className="mt-1"
                        disabled
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveEdit}
                        size="sm"
                        className="flex-1"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements ({achievementsData?.page.totalElements || 0})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {isLoadingAchievements ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton key={index} className="h-28 w-full" />
                    ))
                  ) : achievementsData &&
                    achievementsData.content.length > 0 ? (
                    achievementsData.content.map((achievement) => (
                      <TooltipProvider key={achievement.achievementId}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {achievement.achievementImageUrl ? (
                              <img
                                src={achievement.achievementImageUrl}
                                alt={achievement.achievementName}
                                className="w-20 h-20 mx-auto object-contain rounded-full hover:scale-105 transition-transform cursor-pointer"
                              />
                            ) : (
                              <div className="text-4xl">🏆</div>
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-semibold">
                                {achievement.achievementName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {achievement.achievementDescription}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))
                  ) : (
                    <div className="col-span-2 text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                      No achievements yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right content area */}
        <div className="lg:col-span-3 space-y-6 mt-6">
          {/* Forum Posts Section */}
          {isLoadingPosts ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-32 w-full" />
              ))}
            </div>
          ) : forumPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No forum posts yet
            </div>
          ) : (
            <div className="space-y-4">
              {forumPosts.map((post) => (
                <PostCard
                  key={post.id}
                  userData={currentUser}
                  id={post.id}
                  image={post.imgUrl}
                  isOwner={currentUser?.id === post.userId}
                  onDelete={(postId) => {
                    deletePostMutation.mutate(postId, {
                      onSuccess: () => {
                        toast.success('Post deleted successfully');
                      },
                      onError: (error) => {
                        toast.error(
                          error instanceof Error
                            ? error.message
                            : 'Failed to delete post',
                        );
                      },
                    });
                  }}
                  title={post.title}
                  author={{
                    name: post.userName || 'User',
                    href: `/users/${post.createdBy}`,
                    avatar: post.avtUrl || '',
                  }}
                  time={formatISODate(post.createdAt)}
                  excerpt={
                    <>
                      <div
                        className="whitespace-pre-line break-words"
                        dangerouslySetInnerHTML={{
                          __html:
                            expandedId === post.id
                              ? cleanHtml(post.content || '')
                              : htmlExcerpt(post.content || ''),
                        }}
                      />
                      {post.content && post.content.length > 400 && (
                        <button
                          onClick={() =>
                            setExpandedId(
                              expandedId === post.id ? null : post.id,
                            )
                          }
                          className="text-sm text-primary hover:underline mt-2"
                        >
                          {expandedId === post.id ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </>
                  }
                  likes={post.upVoteCount || 0}
                  comments={post.replyCount || 0}
                  onLike={(postId, isUpvote) => {
                    if (!currentUser) {
                      toast.error('Please login to interact with posts');
                      return;
                    }
                    createVoteMutation.mutate(
                      { postId, isUpvote },
                      {
                        onError: (error) => {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : 'Failed to vote',
                          );
                        },
                      },
                    );
                  }}
                  isAuthenticated={!!currentUser}
                />
              ))}
              <div
                ref={loadMoreRef}
                className="py-6 flex justify-center text-slate-500"
              >
                {isFetchingNextPage ? 'Loading more...' : ''}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
