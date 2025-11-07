import { useParams } from '@tanstack/react-router';

import FallbackLoading from '@/components/fallback-loading';
import Flashcard from '@/features/flashcard/components/flashcard';
import { useGetFlashcardsByDeckIdQuery } from '@/features/flashcard/services/queries';
import { DefaultLayout } from '@/layouts/default-layout';

const FlashcardPage = () => {
  const { deckId } = useParams({ from: '/flashcard/$deckId' });
  const {
    data: flashcards,
    isLoading,
    error,
  } = useGetFlashcardsByDeckIdQuery(deckId);

  if (isLoading) {
    return <FallbackLoading isFullscreen isCenter />;
  }

  if (error) {
    return (
      <DefaultLayout meta={{ title: 'Error' }}>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg text-red-600">Error loading flashcards</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout meta={{ title: 'Flashcards' }} className="">
      {flashcards && flashcards.length > 0 ? (
        <section className="relative sm:overflow-hidden flex flex-col justify-center items-center bg-gradient-to-t from-blue-200 via-white to-white dark:bg-gradient-to-t dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 h-[calc(100svh-4rem-1px)]">
          <div className="w-full max-w-8xl px-4 pt-8 mx-auto">
            <Flashcard flashcards={flashcards} />
          </div>
        </section>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg text-slate-600">
            No flashcards found in this deck
          </p>
        </div>
      )}
    </DefaultLayout>
  );
};

export default FlashcardPage;
