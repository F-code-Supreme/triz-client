import { FlashcardDeckSection } from '@/components/ui/flashcard-deck-section';
import { DefaultLayout } from '@/layouts/default-layout';

const FlashcardDeckPage = () => {
  return (
    <DefaultLayout meta={{ title: 'Học Flashcard' }} className="">
      <FlashcardDeckSection />
    </DefaultLayout>
  );
};
export default FlashcardDeckPage;
