// import { format } from 'date-fns';
// import { vi, enUS } from 'date-fns/locale';
import { Activity, Award, Edit3, X, Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DefaultLayout } from '@/layouts/default-layout';
import { useGetMeQuery } from '@/features/auth/services/queries';
import { format } from 'date-fns';

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

const achievements = [
  { icon: '🏆', name: 'Arctic Code Vault Contributor', count: 3 },
  { icon: '🌟', name: 'Pull Shark', count: 1 },
  { icon: '🔥', name: 'Quickdraw', count: 1 },
];

const ProfilePage = () => {
  const { t } = useTranslation('pages.profile');
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading } = useGetMeQuery();
  const [editData, setEditData] = useState({
    fullName: '',
    email: '',
  });

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  const handleEditClick = () => {
    setEditData({
      fullName: data?.fullName || '',
      email: data?.email || '',
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
    // TODO: Gọi API cập nhật thông tin user
    console.log('Saving profile data:', editData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const avatarNode = isLoading ? (
    <div className="w-40 h-40 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-spin border-4 border-gray-300 border-t-blue-400" />
  ) : data?.avatarUrl ? (
    <img
      src={data.avatarUrl}
      alt={data.fullName}
      className="w-40 h-40 rounded-full object-cover mx-auto mb-4 ring-4 ring-gray-100 dark:ring-gray-700"
    />
  ) : (
    <Avatar className="w-40 h-40 mx-auto mb-4 ring-4 ring-gray-100 dark:ring-gray-700">
      <AvatarFallback
        className="text-white text-5xl font-bold"
        style={{
          backgroundColor: getAvatarColor(data?.fullName || data?.email || ''),
        }}
      >
        {data?.fullName
          ? data.fullName.charAt(0).toUpperCase()
          : data?.email
            ? data.email.charAt(0).toUpperCase()
            : '?'}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <DefaultLayout
      meta={{
        title: t('page_meta_title'),
      }}
      showFooter={true}
      showFooterCTA={false}
    >
      <div className="container mx-auto md:p-8 sm:p-4 ">
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
                        {data?.fullName || 'Chưa có tên'}
                      </h2>
                      <h2 className="text-gray-600 dark:text-gray-300 mb-4">
                        {data?.email || 'Chưa có email'}
                      </h2>
                      {/* Ngày tham gia */}
                      {data?.createdAt && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Ngày tham gia: {formatJoinDate(data.createdAt)}
                        </div>
                      )}
                      <Button
                        onClick={handleEditClick}
                        variant="outline"
                        size="sm"
                        className="mb-4"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-4 w-full">
                      <div>
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium"
                        >
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
                      {/* <div>
                        <Label
                          htmlFor="avatarUrl"
                          className="text-sm font-medium"
                        >
                          Avatar URL
                        </Label>
                        <Input
                          id="avatarUrl"
                          value={editData.avatarUrl}
                          onChange={(e) =>
                            handleInputChange('avatarUrl', e.target.value)
                          }
                          className="mt-1"
                        />
                      </div> */}
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

                {/* <div className="mb-6">
                  {!isEditing ? (
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {data?.bio || 'Chưa có mô tả cá nhân.'}
                    </p>
                  ) : null}
                </div> */}

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Achievements
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                        title={achievement.name}
                      >
                        <div className="text-lg mb-1">{achievement.icon}</div>
                        <div className="text-xs font-medium text-gray-900 dark:text-white">
                          x{achievement.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right content area */}
          <div className="lg:col-span-3 space-y-6 mt-10">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pinned</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Customize your pins
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  Phát triển sau
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Contribution activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 ml-2">
                    <div className="space-y-3">Phát triển sau</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProfilePage;
