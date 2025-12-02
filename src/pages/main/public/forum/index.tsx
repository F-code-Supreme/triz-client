import { Link } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import React from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import PostCard from '@/features/forum/components/post-card';
import { DefaultLayout } from '@/layouts/default-layout';

const tabs = [
  { id: 'popular', label: 'Hay nhất' },
  { id: 'latest', label: 'Mới nhất' },
  { id: 'top', label: 'Hàng đầu' },
  { id: 'rising', label: 'Đang nổi' },
];

// const communities = [
//   {
//     id: 'c1',
//     title: 'Altshuller Institute for TRIZ Studies',
//     members: '72.2k thành viên',
//     image:
//       'https://www.figma.com/api/mcp/asset/07ef6892-d172-4cb6-a2e0-e00bf4485f4b',
//     href: '/forum',
//   },
//   {
//     id: 'c2',
//     title: 'International TRIZ Association',
//     members: '193 thành viên',
//     image:
//       'https://www.figma.com/api/mcp/asset/45e91209-ec72-4659-9725-fb96eae13584',
//     href: '/forum',
//   },
//   {
//     id: 'c3',
//     title: 'TRIZ Developers Summit',
//     members: '130k thành viên',
//     image:
//       'https://www.figma.com/api/mcp/asset/be2b6509-cd0e-44b0-81ba-eea4b95e665e',
//     href: '/forum',
//   },
// ];

// const recentViews = [
//   {
//     id: 'r1',
//     title: 'Trong quá trình tối ưu hóa một công đoạn lắp ráp',
//     date: '1 ngày trước',
//     image:
//       'https://www.figma.com/api/mcp/asset/34d34500-f7ff-45be-bc1f-6e5024d62a59',
//     href: '#',
//   },
//   {
//     id: 'r2',
//     title: 'Mình đang nghiên cứu giảm tiếng ồn của quạt gió',
//     date: '20/12/2025',
//     image:
//       'https://www.figma.com/api/mcp/asset/412a8323-468c-4ef1-ba77-c4d5d4f328c7',
//     href: '#',
//   },
//   {
//     id: 'r3',
//     title: 'Trước đây mình rất hay “ép” ARIZ vào bất kỳ',
//     date: '19/12/2025',
//     image:
//       'https://www.figma.com/api/mcp/asset/39626a00-10d0-4894-b019-a917f6519a4f',
//     href: '#',
//   },
//   {
//     id: 'r4',
//     title: 'Nguyên tắc 35 thường bị nghĩ là chỉ áp dụng',
//     date: '18/12/2025',
//     image:
//       'https://www.figma.com/api/mcp/asset/0551a89f-bda5-4aca-a046-266b993ef62d',
//     href: '#',
//   },
//   {
//     id: 'r5',
//     title: 'Nhiều bạn mới học TRIZ thường gộp hai loại xung',
//     date: '17/12/2025',
//     image:
//       'https://www.figma.com/api/mcp/asset/a9cf56e6-257d-45c4-a5b4-8b175e9dd0c6',
//     href: '#',
//   },
// ];

const ForumPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(tabs[0].id);

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

          <div className="ml-auto flex items-center gap-3">
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
          </div>
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

              <div className="flex flex-1 items-center gap-4 rounded-lg bg-slate-100 border border-slate-200 px-4 py-4">
                <div className="flex-1">
                  <div className="text-[18px] font-medium text-slate-400">
                    Chia sẻ suy nghĩ hoặc bài viết của bạn
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src="https://www.figma.com/api/mcp/asset/b3309bca-23d8-48ea-bc40-0f78277ef90b"
                    alt="images"
                    className="h-7 w-7"
                  />
                  <img
                    src="https://www.figma.com/api/mcp/asset/a2188b43-1bb6-4b8d-ba3d-2cb0d03c694f"
                    alt="gif"
                    className="h-7 w-7"
                  />
                  <img
                    src="https://www.figma.com/api/mcp/asset/3a2bf552-86ef-40e4-97b5-0059406520a6"
                    alt="sentiment"
                    className="h-7 w-7"
                  />
                </div>
              </div>
            </div>
            {/* Posts list */}

            <PostCard
              id="post-1"
              title="Khám phá TRIZ"
              author={{
                name: 'Nguyen An',
                href: '#',
                avatar:
                  'https://www.figma.com/api/mcp/asset/91674c6e-5dd9-4b53-b75a-2a5856946d5b',
              }}
              time="1 ngày trước"
              excerpt={
                <p>
                  Chào mọi người em có thắc mắc cần giải đáp. Trong quá trình
                  phát triển sản phẩm tại công ty, mình gặp một vấn đề khá thú
                  vị và muốn đem lên forum để anh/chị em trong cộng đồng TRIZ{' '}
                  <Link to={'/forum'} className="text-blue-600">
                    ...xem thêm
                  </Link>
                </p>
              }
              image={
                'https://www.figma.com/api/mcp/asset/d1969f5d-746a-4b73-8ac1-bc7249a559b9'
              }
              likes={182}
              comments={21}
            />

            <PostCard
              id="post-2"
              title="Khám phá TRIZ"
              author={{
                name: 'Alex Harper',
                href: '#',
                avatar:
                  'https://www.figma.com/api/mcp/asset/91674c6e-5dd9-4b53-b75a-2a5856946d5b',
              }}
              time="3 ngày trước"
              excerpt={
                <p>
                  Chào mọi người em có thắc mắc cần giải đáp. Trong quá trình
                  phát triển sản phẩm tại công ty, mình gặp một vấn đề khá thú
                  vị và muốn đem lên forum để anh/chị em trong cộng đồng TRIZ{' '}
                  <Link to={'/forum'} className="text-blue-600">
                    ...xem thêm
                  </Link>
                </p>
              }
              image={
                'https://www.figma.com/api/mcp/asset/d1969f5d-746a-4b73-8ac1-bc7249a559b9'
              }
              likes={182}
              comments={21}
            />
          </div>

          {/* <aside className="hidden lg:block">
            <div className="bg-white box-border w-full p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-[16px] text-slate-900">
                  Cộng đồng của tôi
                </p>
                <img
                  src="https://www.figma.com/api/mcp/asset/15ca3c3d-b096-4c48-8bcc-4f2cac9b8998"
                  alt="chevron"
                  className="w-6 h-6"
                />
              </div>

              <div className="space-y-4">
                {communities.map((c) => (
                  <Link
                    key={c.id}
                    to={c.href}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-14 h-14 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[16px] text-slate-900 truncate ">
                        {c.title}
                      </p>
                      <p className="text-sm text-slate-500">{c.members}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-4 bg-white box-border p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-[16px] text-slate-900">
                  Đã xem gần đây
                </p>
                <img
                  src="https://www.figma.com/api/mcp/asset/15ca3c3d-b096-4c48-8bcc-4f2cac9b8998"
                  alt="chevron"
                  className="w-6 h-6"
                />
              </div>

              <div className="space-y-4">
                {recentViews.map((r) => (
                  <Link
                    key={r.id}
                    to={r.href}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-14 h-14 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500">{r.date}</p>
                      <p className="font-semibold text-[14px] ">{r.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside> */}
        </div>
      </main>
    </DefaultLayout>
  );
};

export default ForumPage;
