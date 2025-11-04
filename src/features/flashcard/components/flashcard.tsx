import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import type { Flashcard } from '@/features/flashcard/types';

const Flashcard: React.FC<{ flashcards: Flashcard[] }> = ({ flashcards }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [cardTransition, setCardTransition] = useState<boolean>(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleFlipCard = (): void => {
    setShowAnswer(!showAnswer);
  };

  useEffect(() => {
    if (cardRef.current) {
      gsap.set(cardRef.current, { x: 0, opacity: 1, scale: 1 });
    }
  }, []);

  const animateCardTransition = (direction: 'next' | 'prev'): void => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const exitX = direction === 'next' ? -150 : 150;
    const exitRotation = direction === 'next' ? -15 : 15;
    const enterX = direction === 'next' ? 150 : -150;
    const enterRotation = direction === 'next' ? 15 : -15;

    // Exit animation - fade out with rotation and scale
    gsap.to(card, {
      x: exitX,
      y: -50,
      rotation: exitRotation,
      opacity: 0,
      scale: 0.7,
      duration: 0.5,
      ease: 'back.in(1.7)',
      onComplete: () => {
        // Change card index
        if (direction === 'next') {
          setCurrentCardIndex((prev) => prev + 1);
        } else {
          setCurrentCardIndex((prev) => prev - 1);
        }

        // Set up enter animation
        gsap.set(card, {
          x: enterX,
          y: 50,
          rotation: enterRotation,
          opacity: 0,
          scale: 0.7,
        });

        // Enter animation - bounce in with rotation
        gsap.to(card, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          onComplete: () => {
            setCardTransition(false);
          },
        });
      },
    });
  };

  const goToNextCard = (): void => {
    if (currentCardIndex < flashcards.length - 1 && !cardTransition) {
      setShowAnswer(false);
      setCardTransition(true);
      animateCardTransition('next');
    }
  };

  const goToPrevCard = (): void => {
    if (currentCardIndex > 0 && !cardTransition) {
      setShowAnswer(false);
      setCardTransition(true);
      animateCardTransition('prev');
    }
  };

  const currentFlashcard = flashcards[currentCardIndex];

  if (!currentFlashcard) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No flashcards available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Flashcard with 3D Flip */}
        <button
          ref={cardRef}
          key={currentCardIndex}
          aria-pressed={showAnswer}
          className={`flashcard-container mb-6 ${showAnswer ? 'flipped' : ''}`}
          onClick={handleFlipCard}
        >
          <div className="flashcard-inner">
            {/* Front Side - Term */}
            <div className="flashcard-front">
              <div className="text-center space-y-6">
                <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-4 py-1 rounded-full text-sm font-semibold">
                  Term
                </div>

                {currentFlashcard.termImgUrl && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={currentFlashcard.termImgUrl}
                      alt={currentFlashcard.term}
                      className="max-h-20 h-20 rounded-lg object-contain"
                    />
                  </div>
                )}

                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 break-words">
                  {currentFlashcard.term}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Click to reveal definition
                </p>
              </div>
            </div>

            {/* Back Side - Definition */}
            <div className="flashcard-back">
              <div className="text-center space-y-4">
                <div className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-1 rounded-full text-sm font-semibold">
                  Definition
                </div>

                <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
                  {currentFlashcard.term}
                </h3>

                {currentFlashcard.defImgUrl && (
                  <div className="flex justify-center my-4">
                    <img
                      src={currentFlashcard.defImgUrl}
                      alt="Definition"
                      className="max-h-20 h-20 rounded-lg object-contain"
                    />
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mt-4">
                  <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {currentFlashcard.definition}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </button>
        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <Button
            onClick={goToPrevCard}
            disabled={currentCardIndex === 0}
            variant="outline"
            className="bg-white/90 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex justify-center gap-4  text-lg flex-wrap">
            <div className=" backdrop-blur-sm px-6 py-3 rounded-lg">
              <span className="font-semibold">
                {currentCardIndex + 1}/{flashcards.length}
              </span>
            </div>
          </div>

          <Button
            onClick={goToNextCard}
            disabled={currentCardIndex === flashcards.length - 1}
            variant="outline"
            className="bg-white/90 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
