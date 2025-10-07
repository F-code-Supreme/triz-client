import { PlayCircle } from 'lucide-react';

import { Button } from './button';

const HeroSection = () => {
  return (
    <section className="relative sm:overflow-hidden flex flex-col justify-center items-center bg-gradient-to-t from-blue-200 via-white to-white dark:bg-gradient-to-t dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-5xl px-4 pt-8 mx-auto">
        <div className="text-center space-y-12">
          <div className="space-y-6">
            <div className="relative inline-block">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                Khám Phá TRIZ
                <span className="relative ml-3">
                  <svg
                    className="absolute -top-5 left-0 w-8 h-8 animate-bounce"
                    viewBox="0 0 48 40"
                    fill="none"
                  >
                    <path
                      d="M7.27934 7.59027C6.24464 11.9246 5.97848 16.4069 6.49299 20.8332C6.51681 21.4613 6.78013 22.0564 7.22892 22.4965C7.67772 22.9366 8.27792 23.1882 8.90637 23.1996C9.53485 23.1861 10.1329 22.9261 10.5715 22.4757C11.0101 22.0254 11.2542 21.4208 11.2512 20.7921C11.0043 18.7151 10.9353 16.6207 11.0449 14.5319C11.0724 14.0358 11.1138 13.5476 11.1552 13.0594L11.2281 12.2601C11.1749 12.833 11.2793 11.9786 11.2911 11.8939C11.4428 10.8289 11.6495 9.7954 11.8917 8.76385C11.9794 8.45757 12.0047 8.13682 11.9662 7.82058C11.9276 7.50434 11.826 7.19906 11.6673 6.92282C11.5086 6.64657 11.2961 6.40496 11.0423 6.21235C10.7886 6.01973 10.4987 5.88002 10.19 5.80147C9.88126 5.72291 9.55989 5.70711 9.24493 5.75502C8.92997 5.80292 8.62786 5.91357 8.35643 6.08038C8.08501 6.24718 7.84982 6.46677 7.66481 6.72612C7.4798 6.98548 7.34871 7.27933 7.27934 7.59027Z"
                      fill="#2563EB"
                    />
                    <path
                      d="M28.5815 12.5073L20.9581 25.8462C20.6448 26.3944 20.5621 27.0446 20.7282 27.6538C20.8943 28.263 21.2956 28.7812 21.8438 29.0945C22.392 29.4078 23.0421 29.4905 23.6513 29.3244C24.2605 29.1583 24.7788 28.757 25.0921 28.2088L32.7155 14.8699C33.0288 14.3217 33.1115 13.6715 32.9454 13.0623C32.7793 12.4531 32.378 11.9349 31.8298 11.6216C31.2816 11.3083 30.6314 11.2256 30.0222 11.3917C29.413 11.5578 28.8948 11.9591 28.5815 12.5073Z"
                      fill="#2563EB"
                    />
                    <path
                      d="M35.5788 31.8988L32.6257 33.8673C32.3473 34.0075 32.1119 34.2204 31.9445 34.4834C31.7206 34.7154 31.5582 34.9996 31.472 35.3102C31.3838 35.6078 31.3736 35.923 31.4424 36.2256C31.4515 36.5345 31.5455 36.8349 31.714 37.0938C32.0435 37.6451 32.5743 38.0468 33.1944 38.2141C33.7944 38.3638 34.4291 38.2741 34.9642 37.9641L37.9172 35.9957C38.1989 35.8509 38.4369 35.6334 38.6063 35.3658C38.8337 35.1432 38.9946 34.8617 39.071 34.5528C39.1706 34.2572 39.1809 33.9388 39.1006 33.6374C39.0967 33.3277 39.0023 33.0259 38.829 32.7692C38.6713 32.4952 38.4602 32.2555 38.2083 32.0645C37.9564 31.8734 37.6688 31.7348 37.3624 31.6568C37.064 31.5761 36.7524 31.556 36.4461 31.5976C36.1398 31.6391 35.8449 31.7416 35.5788 31.8988Z"
                      fill="#2563EB"
                    />
                  </svg>
                </span>
                <br />
                <span className="text-slate-900 dark:text-white">
                  Phương Pháp Sáng Tạo Có Hệ Thống
                </span>
              </h1>

              <div>
                <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed mt-6">
                  TRIZ là bộ công cụ giúp bạn giải quyết vấn đề một cách khoa
                  học,
                  <br />
                  hiệu quả và sáng tạo – không cần cảm hứng hay năng khiếu thiên
                  bẩm.
                </p>
                <div className="absolute right-1 top-80 sm:right-6 sm:top-40 md:right-20 md:top-60 animate-bounce w-24 h-32">
                  <svg
                    className="w-full h-full"
                    width="136"
                    height="179"
                    viewBox="0 0 136 179"
                    fill="none"
                  >
                    <path
                      d="M102.596 20.8869C110.274 32.065 114.441 45.2805 114.564 58.8411C114.687 72.4017 110.76 85.6905 103.286 97.0059C95.6422 108.184 83.6474 117.192 70.0165 119.126C66.7599 119.604 63.4507 119.599 60.1955 119.111C57.5243 118.72 51.5583 117.762 50.4092 114.678C49.6902 112.703 51.188 111.844 52.929 111.831C53.7359 111.802 54.5307 112.033 55.1957 112.491C55.8607 112.949 56.3605 113.609 56.6214 114.373C58.0668 117.845 56.0708 122.294 54.3631 125.311C50.4818 132.022 44.5886 137.343 37.5171 140.52C30.4457 143.697 22.5542 144.569 14.9593 143.015C12.5095 142.472 12.1895 146.214 14.5248 146.71C22.6378 148.329 31.0517 147.436 38.6437 144.149C46.2356 140.861 52.6444 135.337 57.0147 128.313C60.1176 123.112 64.0773 112.652 56.6154 109.003C51.0087 106.243 43.3581 111.463 47.8393 117.451C52.3204 123.439 63.1002 123.657 69.6549 122.905C77.9172 121.745 85.7466 118.495 92.4011 113.462C105.744 103.35 114.663 88.474 117.297 71.941C118.965 62.7108 118.793 53.2421 116.791 44.0785C114.789 34.915 110.997 26.2371 105.632 18.5432C104.26 16.5969 101.307 18.8675 102.711 20.8003L102.596 20.8869Z"
                      fill="#2563EB"
                    />
                    <path
                      d="M22.4047 136.723L3.28978 143.343C1.63736 143.926 2.01556 146.082 3.3116 146.77L20.0276 155.57C20.4834 155.755 20.9942 155.752 21.4475 155.561C21.9009 155.37 22.2597 155.006 22.4451 154.55C22.6304 154.095 22.6271 153.584 22.4359 153.13C22.2447 152.677 21.8811 152.318 21.4253 152.133L4.70934 143.332L4.73097 146.759L23.8459 140.139C26.115 139.353 24.6509 135.927 22.4047 136.723Z"
                      fill="#2563EB"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-lg font-medium rounded-lg"
              >
                Đăng ký tài khoản
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-slate-200 dark:border-slate-700 dark:text-slate-300 text-slate-900 px-8 py-4 text-lg font-medium rounded-lg hover:bg-slate-50 flex items-center gap-3"
              >
                <PlayCircle className="w-6 h-6" />
                Bắt đầu học ngay
              </Button>
            </div>
          </div>

          <div className="relative mx-auto mt-8 max-w-4xl">
            {/* Decorative elements */}

            {/* <div className="absolute -top-8 -right-16 w-32 h-32 opacity-30 pointer-events-none select-none">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-blue-400"
              >
                <path
                  d="M20 80 Q50 20 80 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M75 75 L80 80 L85 75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div> */}

            <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-24 h-24 opacity-25 pointer-events-none select-none">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-blue-300"
              >
                <circle cx="50" cy="50" r="3" fill="currentColor" />
                {Array.from({ length: 8 }, (_, i) => {
                  const angle = (i * 45 * Math.PI) / 180;
                  const x = 50 + Math.cos(angle) * 30;
                  const y = 50 + Math.sin(angle) * 30;
                  return (
                    <g key={i}>
                      <line
                        x1="50"
                        y1="50"
                        x2={x}
                        y2={y}
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle cx={x} cy={y} r="2" fill="currentColor" />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* <div className="absolute -right-8 top-1/3 w-20 h-20 opacity-20 pointer-events-none select-none">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-blue-500"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                />
                <circle cx="50" cy="50" r="3" fill="currentColor" />
              </svg>
            </div> */}

            {/* Main illustration */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/src/assets/images/Frame 1410086253.png"
                alt="TRIZ Team Illustration - Four people collaborating"
                className="w-full h-auto object-contain max-h-96 lg:max-h-[450px]"
              />
            </div>

            {/* Small decorative arrows */}
            <div className="absolute top-4 left-4 w-6 h-6 opacity-40 pointer-events-none select-none">
              <svg viewBox="0 0 24 24" className="w-full h-full text-blue-400">
                <path d="M7 14l5-5 5 5z" fill="currentColor" />
              </svg>
            </div>

            <div className="absolute bottom-4 right-4 w-6 h-6 opacity-40 pointer-events-none select-none">
              <svg viewBox="0 0 24 24" className="w-full h-full text-blue-400">
                <path d="M17 10l-5 5-5-5z" fill="currentColor" />
              </svg>
            </div>

            <div className="absolute top-1/2 -left-3 w-6 h-6 opacity-40 pointer-events-none select-none">
              <svg viewBox="0 0 24 24" className="w-full h-full text-blue-400">
                <path d="M14 7l-5 5 5 5z" fill="currentColor" />
              </svg>
            </div>

            <div className="absolute top-1/2 -right-3 w-6 h-6 opacity-40 pointer-events-none select-none">
              <svg viewBox="0 0 24 24" className="w-full h-full text-blue-400">
                <path d="M10 17l5-5-5-5z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
