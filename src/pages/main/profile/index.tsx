import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { Activity, Award, Edit3, X, Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DefaultLayout } from '@/layouts/default-layout';
import { Route } from '@/routes/_auth.profile';

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
  const { t, i18n } = useTranslation('pages.profile');
  const { auth } = Route.useRouteContext();
  console.log('Auth user:', auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    company: '',
    location: '',
    website: '',
  });

  const getUserInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   const locale = i18n.language === 'vi' ? vi : enUS;
  //   return format(date, 'dd MMMM, yyyy', { locale });
  // };

  const userEmail = auth.user?.email || '';
  const userName = auth.user?.name || '';
  const userInitials = userName
    ? getUserInitials(userName)
    : getUserInitials(userEmail);
  const avatarColor = getAvatarColor(userName || userEmail);

  const profileData = {
    name: 'Chuối Tây',
    bio: '🚀 TRIZ methodology enthusiast | Building innovative learning platforms | AI-powered educational tools developer',
    company: 'F-code Supreme',
    location: 'Ho Chi Minh City, Vietnam',
    website: 'triz-system.com',
  };

  const handleEditClick = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      name: '',
      bio: '',
      company: '',
      location: '',
      website: '',
    });
  };

  const handleSaveEdit = () => {
    console.log('Saving profile data:', editData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
              <div className=" p-6 ">
                <div className=" md:text-start text-center mb-6">
                  <Avatar className="w-40 h-40 mx-auto mb-4 ring-4 ring-gray-100 dark:ring-gray-700">
                    <AvatarFallback
                      className="text-white text-5xl font-bold"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>

                  {!isEditing ? (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {/* {userName} */}
                        Chuối Tây
                      </h2>
                      <h2 className="text-gray-600 dark:text-gray-300 mb-4">
                        {userEmail}
                      </h2>
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
                        <Label htmlFor="name" className="text-sm font-medium">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) =>
                            handleInputChange('name', e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  {!isEditing ? (
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {profileData.bio}
                    </p>
                  ) : (
                    <div>
                      <Label htmlFor="bio" className="text-sm font-medium">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={editData.bio}
                        onChange={(e) =>
                          handleInputChange('bio', e.target.value)
                        }
                        className="mt-1 resize-y overflow-hidden"
                        rows={4}
                        placeholder="Hãy viết vài dòng về bản thân bạn..."
                      />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="company" className="text-sm font-medium">
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={editData.company}
                        onChange={(e) =>
                          handleInputChange('company', e.target.value)
                        }
                        className="mt-1"
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-sm font-medium">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={editData.location}
                        onChange={(e) =>
                          handleInputChange('location', e.target.value)
                        }
                        className="mt-1"
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="text-sm font-medium">
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={editData.website}
                        onChange={(e) =>
                          handleInputChange('website', e.target.value)
                        }
                        className="mt-1"
                        placeholder="www.example.com"
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
