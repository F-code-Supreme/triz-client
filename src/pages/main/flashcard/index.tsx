import { PrincipleSection } from '@/components/ui/principle-hero-section';
import { DefaultLayout } from '@/layouts/default-layout';

const FlashcardPage = () => {
  return (
    <DefaultLayout meta={{ title: 'Học Flashcard' }} className="">
      <PrincipleSection />
    </DefaultLayout>
  );
};
export default FlashcardPage;
