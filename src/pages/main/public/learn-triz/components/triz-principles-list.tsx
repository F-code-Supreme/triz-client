import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AsyncSelect } from '@/components/ui/async-select';

import { principlesData } from './principles-data';

interface Principle {
  number: number;
  title: string;
  image?: string;
  content: Array<{
    text: string;
    examples: string[];
  }>;
  description?: string;
}

export const TRIZPrinciplesList = () => {
  const { t } = useTranslation('pages.learn_triz');
  const [selectedPrinciple, setSelectedPrinciple] = useState('');

  // Fetcher function for AsyncSelect
  const fetchPrinciples = async (query?: string): Promise<Principle[]> => {
    // Simulate async behavior (immediate return since data is local)
    await new Promise((resolve) => setTimeout(resolve, 0));

    if (!query) return principlesData;

    const searchQuery = query.toLowerCase();
    return principlesData.filter((principle) => {
      // Search by number
      if (principle.number.toString().includes(searchQuery)) return true;

      // Search by title
      if (principle.title.toLowerCase().includes(searchQuery)) return true;

      // Search by content text and examples
      return principle.content.some(
        (block) =>
          block.text.toLowerCase().includes(searchQuery) ||
          block.examples.some((example) =>
            example.toLowerCase().includes(searchQuery),
          ),
      );
    });
  };

  // Filter function for local filtering when using preload
  const filterPrinciple = (principle: Principle, query: string): boolean => {
    const searchQuery = query.toLowerCase();

    // Search by number
    if (principle.number.toString().includes(searchQuery)) return true;

    // Search by title
    if (principle.title.toLowerCase().includes(searchQuery)) return true;

    // Search by content text and examples
    return principle.content.some(
      (block) =>
        block.text.toLowerCase().includes(searchQuery) ||
        block.examples.some((example) =>
          example.toLowerCase().includes(searchQuery),
        ),
    );
  };

  // Scroll to principle when selected
  const handlePrincipleSelect = (value: string) => {
    setSelectedPrinciple(value);
    if (value) {
      // Use setTimeout to ensure the DOM has updated and selection is complete
      setTimeout(() => {
        const element = document.getElementById(`principle-${value}`);
        if (element) {
          // Calculate offset to account for sticky header
          const headerOffset = 80; // Adjust this value based on your header height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  };
  return (
    <section className="py-8 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 my-4">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center">
            <AsyncSelect<Principle>
              fetcher={fetchPrinciples}
              preload={true}
              filterFn={filterPrinciple}
              value={selectedPrinciple}
              onChange={handlePrincipleSelect}
              label={t('search_label')}
              placeholder={t('search_placeholder')}
              getOptionValue={(principle) => principle.number.toString()}
              getDisplayValue={(principle) => (
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex-shrink-0">
                    {principle.number}
                  </span>
                  <span className="truncate">{principle.title}</span>
                </div>
              )}
              renderOption={(principle) => (
                <div className="flex items-start gap-3 w-full">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex-shrink-0">
                    {principle.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-1">
                      {principle.title}
                    </div>
                    {principle.content[0] && (
                      <div className="text-xs text-muted-foreground truncate">
                        {principle.content[0].text}
                      </div>
                    )}
                  </div>
                </div>
              )}
              width="600px"
              className="flex-1"
              triggerClassName="h-12 text-base"
              noResultsMessage={t('search_no_results')}
              clearable={false}
            />
          </div>
        </div>

        {/* Principles List */}
        <div className="flex flex-col gap-6">
          {principlesData.map((principle) => (
            <div
              id={`principle-${principle.number}`}
              key={principle.number}
              className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 scroll-mt-20"
            >
              {/* The Green Vertical Bar on the Left */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600 dark:bg-blue-500" />

              <div className="p-6 pl-8 flex flex-col md:flex-row gap-6">
                {/* Content Column */}
                <div className="flex-1">
                  {/* Header: Number and Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-bold text-xl md:text-xl shadow-sm">
                      {principle.number}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {principle.title}
                    </h3>
                  </div>

                  {/* Descriptions and Bullets */}
                  <div className="space-y-6">
                    {principle.content.map((block, idx) => (
                      <div key={idx}>
                        <p className="text-slate-800 dark:text-slate-200 text-md md:text-xl font-medium mb-2 leading-relaxed">
                          {block.text}
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          {block.examples.map((example, exIdx) => (
                            <li
                              key={exIdx}
                              className="text-slate-600 dark:text-slate-400 text-md md:text-lg leading-relaxed"
                            >
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Column (Right Side) */}
                <div className="w-full md:w-1/4 flex items-start justify-center md:justify-end pt-4">
                  {/* 
                     If you don't have real images yet, this placeholder 
                     mimics the shape in the screenshot.
                  */}
                  <div className=" md:w-[80%]  ">
                    {principle.image &&
                    !principle.image.includes('placehold') ? (
                      <img
                        src={principle.image}
                        alt={principle.title}
                        className="w-full h-full object-cover rounded-lg border border-slate-200 dark:border-slate-600"
                      />
                    ) : (
                      /* Fallback visual if no image exists */
                      <span className="text-4xl text-slate-300 dark:text-slate-600 font-bold">
                        {principle.number}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
