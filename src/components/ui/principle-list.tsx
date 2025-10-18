import gsap from 'gsap';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

interface CarouselTestProps {
  principles: Array<{
    id: number;
    image: { default: string };
  }>;
}

const PrincipleList: React.FC<CarouselTestProps> = ({ principles }) => {
  const cardsWrapperRef = useRef<HTMLDivElement | null>(null);
  const rots = useRef<number[]>([]);
  const nCards = Math.max(15, principles.length * 2); // Ensure at least 15 cards for smooth animation

  useEffect(() => {
    const cardsWrapper = cardsWrapperRef.current;
    if (!cardsWrapper) return;

    const _rots: number[] = [];

    // Create enough cards for smooth infinite scroll
    for (let i = 0; i < nCards; i++) {
      const card = document.createElement('div');
      const img = document.createElement('img');

      // Cycle through principles
      const principleIndex = i % principles.length;
      img.src = principles[principleIndex].image.default;
      img.alt = `TRIZ Principle ${principles[principleIndex].id}`;
      img.className = 'w-full h-full object-contain';

      card.appendChild(img);
      cardsWrapper.append(card);
      _rots.push(gsap.utils.clamp(-90, 90, i * 18 - 90));
      gsap.set(card, {
        attr: {
          class:
            'absolute w-[15vw] max-w-[300px] min-w-[120px] flex items-center justify-center select-none rounded-lg  ',
        },
        xPercent: -50,
        transformOrigin: '50% 340%',
        rotate: _rots[i],
      });
    }

    rots.current = _rots;

    return () => {
      while (cardsWrapper.firstChild) {
        cardsWrapper.removeChild(cardsWrapper.firstChild);
      }
    };
  }, [principles, nCards]);

  const move = (dir: number) => {
    const cardsWrapper = cardsWrapperRef.current;
    if (!cardsWrapper) return;

    // Move cards in DOM
    if (dir > 0) {
      cardsWrapper.append(cardsWrapper.firstElementChild as Node);
    } else {
      cardsWrapper.prepend(cardsWrapper.lastElementChild as Node);
    }

    // Animate cards to new positions
    for (let i = 0; i < nCards; i++) {
      const card = cardsWrapper.children[i] as HTMLElement;
      let dur = 0;
      let delay = 0;

      // Only animate cards at index 1-10 for smooth effect
      if (i > 0 && i < 11) {
        dur = 1.35;
        delay = gsap.utils.interpolate(0, 0.4, dir < 0 ? 1 - i / 10 : i / 10);
        delay = Math.round(delay * 1000) / 1000;
      }

      gsap.to(card, {
        duration: dur,
        delay: delay,
        rotate: rots.current[i],
        ease: 'elastic.out(0.5)',
      });
    }
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden  flex flex-col items-center justify-center">
      <div ref={cardsWrapperRef} className="absolute top-10"></div>

      <div className="absolute bottom-64 md:bottom-8 flex items-center justify-center gap-4">
        <button
          onClick={() => move(-1)}
          className="bg-white h-8 w-8 sm:h-12 sm:w-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft />
        </button>
        <button
          onClick={() => move(1)}
          className="bg-white  h-8 w-8 sm:h-12 sm:w-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export { PrincipleList };
