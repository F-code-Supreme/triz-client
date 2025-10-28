import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import type { FlashcardDeck } from '@/features/flashcard-decks/types';

interface FlashcardDecksProps {
  decks: FlashcardDeck[];
}

const FlashcardDecks = ({ decks }: FlashcardDecksProps) => {
  return (
    <section className="flex items-center justify-center mt-10">
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full max-w-3xl"
      >
        <CarouselContent>
          {decks.map((deck) => (
            <CarouselItem key={deck.id} className="md:basis-1/2 xl:basis-1/3">
              <div className="p-1">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="flex flex-col items-start justify-between p-6 min-h-[200px]">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        {deck.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                        {deck.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm bg-slate-400 text-white px-2 py-1 rounded-md">
                      <span className="font-medium">
                        {deck.numberOfFlashcards}
                      </span>
                      <span>flashcards</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default FlashcardDecks;
