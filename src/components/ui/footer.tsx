import { Link } from '@tanstack/react-router';

function Footer() {
  return (
    <div className="relative bg-slate-900 sm:20 md:mt-32">
      {/* CTA Section */}
      <div
        className="
        w-[90%] max-w-5xl mx-auto 
        bg-gradient-to-br from-blue-500 to-blue-800
        rounded-2xl shadow-xl
        px-4 py-8
        flex flex-col items-center
        md:absolute md:-top-32 md:left-1/2 md:-translate-x-1/2 md:px-10 md:py-8 md:flex-row md:justify-between md:items-center md:gap-8
        z-10
      "
      >
        <div className="text-center md:text-start md:px-10">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 md:mb-8 max-w-2xl mx-auto">
            Hãy cùng TRIZ biến ý tưởng thành giải pháp thực tế
          </h2>
          <div className="flex flex-col gap-4 md:flex-row md:gap-5 justify-center items-center">
            <button className="bg-white text-blue-600 px-6 py-4 rounded-xl font-medium text-lg hover:bg-gray-50 transition-colors w-full md:w-auto">
              Đăng ký tài khoản
            </button>
            <button className="border border-slate-200 text-slate-50 px-6 py-4 rounded-xl font-medium text-lg hover:bg-white/10 transition-colors flex items-center gap-2 w-full md:w-auto justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 8H8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M2 4H10.67"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M2 12H8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10.67 8L14 10L10.67 12V8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Bắt đầu học ngay
            </button>
          </div>
        </div>
        <div className="mt-6 md:mt-0">
          <img
            src="src/assets/images/Frame 1410086255.png"
            alt="Frame 1410086255"
            className="mx-auto rounded-2xl pb-3 w-full max-w-xs"
          />
        </div>
      </div>

      {/* Main Footer */}
      <div className="px-4 pb-8 pt-16 md:pt-72">
        <div className="max-w-7xl mx-auto">
          {/* Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            {/* Logo and Company Name */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gray-300 rounded"></div>
              <div>
                <h3 className="text-white font-semibold text-base uppercase leading-tight text-center md:text-left">
                  Trung tâm Sáng tạo
                  <br />
                  Khoa học–kỹ thuật (TSK)
                </h3>
              </div>
            </div>
            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
              <Link
                to="/"
                className="text-white font-medium text-lg hover:text-gray-300 transition-colors"
              >
                Trang chủ
              </Link>
              <a
                href="#"
                className="text-white font-medium text-lg hover:text-gray-300 transition-colors"
              >
                Học TRIZ
              </a>
              <a
                href="#"
                className="text-white font-medium text-lg hover:text-gray-300 transition-colors"
              >
                Quiz
              </a>
              <a
                href="#"
                className="text-white font-medium text-lg hover:text-gray-300 transition-colors"
              >
                Forum
              </a>
              <a
                href="#"
                className="text-white font-medium text-lg hover:text-gray-300 transition-colors"
              >
                Chat AI
              </a>
            </div>
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div className="w-6 h-6 bg-white rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div className="w-6 h-6 bg-white rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mb-8"></div>
          <div className="text-slate-300 text-base text-center">
            © 2025 TRIZ Learning Hub
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
