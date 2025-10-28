import { FlashcardSection } from '@/components/ui/flashcard-section';
import { DefaultLayout } from '@/layouts/default-layout';

const FlashcardDeckPage = () => {
  return (
    <DefaultLayout meta={{ title: 'Học Flashcard' }} className="">
      <FlashcardSection />
    </DefaultLayout>
  );
};
export default FlashcardDeckPage;
