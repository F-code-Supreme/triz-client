import { Link } from '@tanstack/react-router';
import React from 'react';

import trizComprehensive3 from '@/assets/images/Frame 1410086247.png';
import trizComprehensive4 from '@/assets/images/Frame 1410086248.png';
import trizComprehensive2 from '@/assets/images/Frame 1410086249.png';
import trizComprehensive1 from '@/assets/images/Frame 1410086250.png';
import coreValueIcon1 from '@/assets/images/Frame 18.png';
import coreValueIcon2 from '@/assets/images/Frame 19.png';
import coreValueIcon3 from '@/assets/images/Frame 20.png';
import coreValueIcon4 from '@/assets/images/Frame 21.png';
import Impromptu from '@/assets/svg/Impromptu';
import IntroduceMethodology from '@/assets/svg/IntroduceMethodology';
import IntroduceTRIZsvg from '@/assets/svg/IntroduceTRIZ';
import MultiDisciplinary from '@/assets/svg/MultiDisciplinary';
import { BackToTop } from '@/components/back-to-top/back-to-top';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { DefaultLayout } from '@/layouts/default-layout';

interface TrizItem {
  imageUrl: string;
  title: string;
  des: string;
}

const CustomMobileCarousel = ({ items }: { items: TrizItem[] }) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const apiRef = React.useRef<CarouselApi | null>(null);

  const handleSetApi = (api: CarouselApi) => {
    apiRef.current = api;
    if (api) {
      setSelectedIndex(api.selectedScrollSnap());
      api.on('select', () => setSelectedIndex(api.selectedScrollSnap()));
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Carousel setApi={handleSetApi} opts={{ loop: false }}>
        <CarouselContent>
          {items.map((item: TrizItem, index: number) => (
            <CarouselItem key={index} className="flex justify-center">
              <div className="p-2 border rounded-xl shadow-2xl max-w-xs w-full bg-white dark:bg-slate-800">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="mx-auto rounded-md pb-3"
                />
                <h4 className="text-xl font-semibold text-slate-900 dark:text-white py-6">
                  {item.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 py-4">
                  {item.des}
                </p>
                <div className="text-blue-600 dark:text-blue-400 font-semibold py-3 flex flex-row justify-center items-center gap-2 hover:underline hover:underline-offset-4">
                  <Link to={`/`}>Tìm hiểu thêm</Link>
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.66669 10H16.3334"
                      stroke="#2563EB"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.5 4.1665L16.3333 9.99984L10.5 15.8332"
                      stroke="#2563EB"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* thêm route sau */}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, idx: number) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${selectedIndex === idx ? 'bg-blue-600 scale-125' : 'bg-slate-300 dark:bg-slate-600'}`}
            aria-label={`Chuyển đến slide ${idx + 1}`}
            onClick={() => {
              if (
                apiRef.current &&
                typeof apiRef.current.scrollTo === 'function'
              ) {
                apiRef.current.scrollTo(idx);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const coreValues = [
    {
      iconUrl: coreValueIcon1,
      tile: 'Nguyên tắc sáng tạo',
      description:
        'TRIZ tổng hợp 40 nguyên tắc giúp tìm ra các ý tưởng mới mẻ, sáng tạo và hiệu quả (Phân nhỏ – Đảo ngược – Thay đổi màu sắc – Kết hợp – Biến hại thành lợi – Thay thế cơ học bằng quang học…).',
    },
    {
      iconUrl: coreValueIcon2,
      tile: 'Các quy luật phát triển hệ thống kỹ thuật',
      description:
        'Hệ thống, sản phẩm hay giải pháp luôn phát triển theo những xu hướng nhất định (tăng tính linh hoạt, tăng mức độ lý tưởng, tự động hóa,giảm sự can thiệp của con người…).',
    },
    {
      iconUrl: coreValueIcon3,
      tile: 'Phân tích tài nguyên',
      description:
        'Học cách khai thác hiệu quả những tài nguyên sẵn có như: năng lượng,vật liệu, thông tin, không gian, thời gian… giúp tối ưu giải pháp mà không cần thêm chi phí hay nguồn lực mới.',
    },
    {
      iconUrl: coreValueIcon4,
      tile: 'Giải quyết mâu thuẫn',
      description:
        'Mấu chốt của sáng tạo là vượt qua các mâu thuẫn trong thiết kế hoặc giải pháp. TRIZ cung cấp công cụ mạnh mẽ như: ma trận mâu thuẫn, 40 nguyên tắc sáng tạo, ARIZ – thuật toán giải bài toán sáng chế.',
    },
  ];

  const trizComprehensive = [
    {
      imageUrl: trizComprehensive1,
      title: 'Học TRIZ',
      des: 'Khóa học lý thuyết, thực hành, bài tập và tình huống thực tế.',
    },
    {
      imageUrl: trizComprehensive2,
      title: 'Làm Quiz',
      des: 'Trắc nghiệm kiểm tra kiến thức, đánh giá tiến độ, ôn tập.',
    },
    {
      imageUrl: trizComprehensive3,
      title: 'Forum (Thảo luận)',
      des: 'Cộng đồng trao đổi, hỏi – đáp các vấn đề thực tiễn áp dụng TRIZ.',
    },
    {
      imageUrl: trizComprehensive4,
      title: 'Chat AI',
      des: 'Trợ lý thông minh hỗ trợ bạn học và áp dụng TRIZ theo thời gian thực.',
    },
  ];

  return (
    <DefaultLayout
      meta={{
        title: 'Khám Phá TRIZ - Phương Pháp Sáng Tạo Có Hệ Thống',
      }}
      showHeroAndFooter={true}
      showWithTRIZFooter={true}
    >
      <div className="py-14 ">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <div className="space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                  Giới thiệu
                  <br />
                  <span className="text-blue-600">tổng quan về TRIZ</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  TRIZ (Theory of Inventive Problem Solving) là phương pháp luận
                  sáng tạo có hệ thống do Genrich Altshuller phát triển từ năm
                  1946, dựa trên phân tích hàng trăm nghìn bằng sáng chế để rút
                  ra các quy luật giải quyết vấn đề.
                </p>
              </div>

              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Tại sao cần học TRIZ?
                </h3>
                <div className="space-y-6">
                  {[
                    'Biến sáng tạo từ "bẩm sinh" thành "kỹ năng có thể học được"',
                    'Cung cấp công cụ và quy trình khoa học để giải quyết vấn đề',
                    'Rút ngắn thời gian tìm giải pháp',
                    'Ứng dụng đa lĩnh vực: kỹ thuật, giáo dục, nghệ thuật…',
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-lg text-slate-600 dark:text-slate-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mt-14 knowledge-cloud-container transition-transform duration-200 hover:scale-105 hover:shadow-inherit">
              {/* <img
                src="./src/assets/images/Frame 1410086138.png"
                alt="TRIZ Overview"
              /> */}
              {/* chỉnh lại responsive */}
              <IntroduceTRIZsvg />
            </div>
          </div>
        </div>
      </div>

      <div className="py-14 ">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            {/* Hình ảnh */}
            <div className="relative framework-visualization order-2 md:order-1">
              <div className="relative mt-14 knowledge-cloud-container transition-transform duration-200 hover:scale-105 hover:shadow-inherit">
                {/* <img
                  src="./src/assets/images/Frame 1410086139.png"
                  alt="TRIZ Introduction"
                /> */}

                {/* chỉnh lại responsive */}
                <IntroduceMethodology />
              </div>
            </div>

            {/* Nội dung */}
            <div className="space-y-2 order-1 md:order-2">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                  Giới thiệu về
                  <br />
                  <span className="text-blue-600">phương pháp luận</span>
                  <br />
                  sáng tạo và đổi mới
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  PPLSTVĐM (Creativity and Innovation Methodologies) là hệ thống
                  phương pháp và kỹ năng giúp nâng cao năng suất tư duy, tiến
                  tới điều khiển quá trình suy nghĩ sáng tạo.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Ứng dụng tại Việt Nam:
                </h2>
              </div>

              <div className="space-y-4 text-lg text-slate-400 dark:text-slate-300 leading-relaxed">
                <p>
                  GS Phan Dũng là người đầu tiên hệ thống hóa, dịch và phổ biến
                  TRIZ tại Việt Nam từ thập niên 1980, thông qua các khóa đào
                  tạo và sách như: Phương pháp luận sáng tạo khoa học.
                </p>
                <p>
                  Tính đến nay, hàng chục nghìn học viên từ mọi ngành nghề và
                  vùng miền đã tham gia các khóa học PPLSTVĐM, với chương trình
                  đào tạo bài bản lên đến 120 tiết.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-14 ">
        <div className="item-center text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            Các nội dung <span className="text-blue-600">cốt lỗi</span> của TRIZ
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 py-14">
          {coreValues.map((value, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md text-start space-y-4 transition-transform duration-200 hover:scale-105 hover:shadow-xl"
              style={{ border: '1px solid #e0e7ef' }}
            >
              <img src={value.iconUrl} alt={value.tile} />
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mt-4">
                {value.tile}
              </h3>
              <p className="text-lg text-slate-500 dark:text-slate-300 mt-2">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="border rounded-md px-6 py-3 flex items-center gap-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
            <div className="flex justify-content-center items-center gap-4">
              <span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-slate-900 dark:text-slate-50"
                >
                  <path
                    d="M8 8H2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.6667 4H2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 12H2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.6667 8L14 10L10.6667 12V8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                Bắt đầu học ngay
              </h4>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl  py-14 ">
        <div className="md:row-start-1 md:col-span-2">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            <span className="text-blue-600">Tại sao TRIZ</span> quan trọng?
          </h2>
        </div>

        <div className="max-w-md mx-auto text-start border space-y-6 p-4 rounded-xl shadow-2xl bg-gradient-to-t from-blue-200 via-white to-white dark:bg-gradient-to-t dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 row-span-2 md:row-start-2">
          <h4 className=" py-2 text-2xl font-semibold text-slate-900 dark:text-white mt-4">
            Chuyển sáng tạo từ &quot;ngẫu hứng&quot; sang &quot;có hệ
            thống&quot;{' '}
          </h4>
          {/* <img
            src="./src/assets/images/Frame 1410086251.png"
            alt="Systematic Creativity"
          /> */}
          <Impromptu />

          <p className=" text-slate-600 dark:text-slate-300 leading-relaxed">
            Thay vì chờ cảm hứng hoặc dựa vào “tài năng bẩm sinh”, TRIZ cung cấp{' '}
            <span className="font-bold text-black">
              công cụ và quy trình rõ ràng
            </span>{' '}
            để phân tích vấn đề, tìm giải pháp. Điều này giúp ai cũng có thể học
            và rèn luyện khả năng sáng tạo.
          </p>
        </div>

        <div className="row-span-4 md:row-start-2 space-y-10">
          <div className="max-w-md mx-auto text-start space-y-6 p-6 border rounded-xl shadow-2xl dark:bg-slate-800">
            <h4 className=" pb-20 text-2xl font-semibold text-slate-900 dark:text-white ">
              Nâng cao năng lực tư duy sáng tạo
            </h4>
            <div>
              <p className="dark:text-slate-300">
                Khi luyện tập TRIZ, người học phát triển thói quen{' '}
                <span className="font-bold text-black dark:text-white">
                  tư duy hệ thống, nhìn nhận tài nguyên, tìm giải pháp lý tưởng,
                </span>{' '}
                giúp họ ngày càng sáng tạo hơn.
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto text-start space-y-6 p-6 border rounded-xl shadow-2xl dark:bg-slate-800">
            <h4 className=" pb-36 text-2xl font-semibold text-slate-900 dark:text-white ">
              Giải quyết mâu thuẫn – cốt lõi của sáng tạo
            </h4>
            <div>
              <p className="dark:text-slate-300">
                Hầu hết các vấn đề sáng tạo đều bắt nguồn từ{' '}
                <span className="font-bold text-black dark:text-white">
                  mâu thuẫn
                </span>{' '}
                (ví dụ: thiết kế điện thoại vừa mỏng nhẹ, vừa pin lâu). TRIZ
                giúp bạn vượt qua mâu thuẫn mà không cần đánh đổi, nhờ{' '}
                <span className="font-bold text-black dark:text-white">
                  40 bộ nguyên tắc sáng tạo và ma trận mâu thuẫn
                </span>
                .
              </p>
            </div>
          </div>
        </div>

        <div className=" md:row-start-1 row-span-4 space-y-6">
          <div className="max-w-md mx-auto text-start space-y-6 p-6 border rounded-xl shadow-2xl dark:bg-slate-800">
            <h4 className="pb-6 text-2xl font-semibold text-slate-900 dark:text-white">
              Tăng tốc độ giải quyết vấn đề
            </h4>
            <div>
              <p className="dark:text-slate-300">
                Khi luyện tập TRIZ, người học phát triển thói quen{' '}
                <span className="font-bold text-black dark:text-white">
                  tư duy hệ thống, nhìn nhận tài nguyên, tìm giải pháp lý tưởng,
                </span>{' '}
                giúp họ ngày càng sáng tạo hơn.
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto text-start border space-y-6 p-4 rounded-xl shadow-2xl bg-gradient-to-b from-blue-200 via-white to-white dark:bg-gradient-to-b dark:from-slate-800 dark:via-slate-900 dark:to-slate-900">
            <h4 className=" py-2 text-2xl font-semibold text-slate-900 dark:text-white mt-4">
              Ứng dụng đa lĩnh vực
            </h4>
            {/* <img
              src="./src/assets/images/Frame 1410086252.png"
              alt="Systematic Creativity"
            /> */}
            <MultiDisciplinary />
            <p className=" text-slate-600 dark:text-slate-300 leading-relaxed">
              Không chỉ giới hạn trong kỹ thuật, TRIZ còn ứng dụng mạnh mẽ trong
              <span className="font-bold text-black">
                kinh doanh, quản lý, giáo dục, nghệ thuật và đời sống
              </span>{' '}
              (ví dụ: tái thiết kế mô hình kinh doanh, cải tiến quy trình làm
              việc, giải quyết vấn đề cá nhân…).
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-14 text-center ">
        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
          Nền tảng học TRIZ <span className="text-blue-600">toàn diện</span>
        </h2>

        <p className=" text-slate-600 dark:text-slate-300 leading-relaxed mt-6 max-w-3xl">
          Khám phá hệ thống học tập tích hợp từ lý thuyết đến thực hành, kết nối
          cộng đồng, luyện tư duy qua quiz và nhận hỗ trợ từ trợ lý AI. Mọi công
          cụ bạn cần để học và áp dụng TRIZ đều có mặt tại đây.
        </p>

        {/* Grid for desktop */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 mt-10">
          {trizComprehensive.map((item, index) => (
            <div
              key={index}
              className="p-2 border rounded-xl shadow-2xl max-w-xs w-full bg-white dark:bg-slate-800"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="mx-auto rounded-md pb-3"
              />
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white py-6">
                {item.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 py-4">
                {item.des}
              </p>
              <div className="text-blue-600 dark:text-blue-400 font-semibold py-3 flex flex-row justify-center items-center gap-2 hover:underline hover:underline-offset-4">
                <Link to={`/`}>Tìm hiểu thêm</Link>
                <svg
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.66669 10H16.3334"
                    stroke="#2563EB"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.5 4.1665L16.3333 9.99984L10.5 15.8332"
                    stroke="#2563EB"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* thêm route sau */}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel for mobile */}
        <div className="md:hidden w-full mt-10">
          <CustomMobileCarousel items={trizComprehensive} />
        </div>
      </div>

      <BackToTop />
    </DefaultLayout>
  );
};

export default HomePage;
