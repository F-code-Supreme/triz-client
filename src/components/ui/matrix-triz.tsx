import { useTranslation } from 'react-i18next';

import { fullMatrixData } from '@/pages/main/public/matrix-triz/components/triz-data';
import { TrizMatrix } from '@/pages/main/public/matrix-triz/components/triz-matrix';

const MatrixSection = () => {
  const { t } = useTranslation('pages.matrix_triz');

  return (
    <section className="h-[calc(100svh-4rem-1px)] relative sm:overflow-hidden flex flex-col justify-center items-center bg-gradient-to-t from-blue-200 via-white to-white dark:bg-gradient-to-t dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ">
      <div className="w-full max-w-8xl p-4 mx-auto h-full">
        <div className="text-center">
          <div className="space-y-6">
            <div className="relative inline-block">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                {t('title')}
                <br />
                <span className="relative ">
                  <svg
                    className="absolute -top-5 -left-2 w-8 h-8 animate-bounce"
                    viewBox="0 0 48 40"
                    fill="none"
                  >
                    <path
                      d="M3.68721 25.2799C6.56277 28.6841 10.0133 31.5572 13.8819 33.7688C14.4017 34.1222 15.0371 34.2632 15.6576 34.163C16.2781 34.0627 16.8367 33.7288 17.2187 33.2297C17.5806 32.7157 17.726 32.08 17.6237 31.4598C17.5213 30.8395 17.1793 30.2843 16.6715 29.9139C14.8529 28.8804 13.1259 27.6936 11.5093 26.3663C11.1263 26.0498 10.7578 25.7269 10.3893 25.404L9.7891 24.8711C10.2187 25.2538 9.59286 24.6629 9.53172 24.6032C8.76429 23.8493 8.05488 23.0698 7.36812 22.2629C7.17355 22.0106 6.93035 21.8 6.65289 21.6434C6.37543 21.4869 6.06938 21.3876 5.75286 21.3515C5.43633 21.3153 5.11574 21.3431 4.81015 21.4331C4.50455 21.5232 4.22015 21.6736 3.97376 21.8756C3.72737 22.0775 3.52401 22.3269 3.37575 22.6088C3.22748 22.8908 3.13734 23.1997 3.11061 23.5171C3.08389 23.8346 3.12115 24.1542 3.2202 24.457C3.31924 24.7598 3.47805 25.0396 3.68721 25.2799Z"
                      fill="#2563EB"
                    />
                    <path
                      d="M20.2822 11.0473L26.4985 25.0973C26.754 25.6747 27.2283 26.127 27.8173 26.3546C28.4062 26.5823 29.0615 26.5666 29.6389 26.3112C30.2163 26.0557 30.6686 25.5813 30.8962 24.9924C31.1239 24.4034 31.1083 23.7481 30.8528 23.1707L24.6366 9.12076C24.3811 8.54334 23.9067 8.09105 23.3177 7.8634C22.7288 7.63575 22.0736 7.65138 21.4961 7.90685C20.9187 8.16233 20.4664 8.63671 20.2388 9.22565C20.0111 9.8146 20.0268 10.4699 20.2822 11.0473Z"
                      fill="#2563EB"
                    />
                    <path
                      d="M40.0442 16.9172L39.8771 20.4623C39.8249 20.7696 39.8566 21.0854 39.9691 21.3761C40.023 21.694 40.1554 21.9933 40.3544 22.247C40.5416 22.4945 40.7893 22.6897 41.0738 22.8139C41.3278 22.9897 41.6254 23.0923 41.9338 23.1102C42.5731 23.172 43.2113 22.9829 43.7138 22.583C44.1903 22.1888 44.4946 21.6246 44.5625 21.01L44.7296 17.4649C44.7801 17.1522 44.7462 16.8317 44.6313 16.5365C44.5869 16.2214 44.4557 15.9249 44.2524 15.6801C44.0735 15.4246 43.8232 15.2274 43.533 15.1133C43.2813 14.9327 42.9824 14.8297 42.6729 14.8169C42.3588 14.7813 42.0407 14.8091 41.7374 14.8985C41.4342 14.988 41.1519 15.1373 40.9074 15.3377C40.6654 15.5301 40.4645 15.769 40.3162 16.0402C40.168 16.3115 40.0755 16.6097 40.0442 16.9172Z"
                      fill="#2563EB"
                    />
                  </svg>
                </span>
                <span className=" text-slate-900 dark:text-white">
                  {t('title_highlight')}
                </span>
              </h1>
              <div>
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mt-6">
                  {t('description')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-4">
            <TrizMatrix data={fullMatrixData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export { MatrixSection };
