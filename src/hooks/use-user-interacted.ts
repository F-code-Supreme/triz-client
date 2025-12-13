import { useEffect, useRef, useState } from 'react';

/**
 * Hook that tracks whether the user has interacted with the document.
 * This is useful for browser autoplay policies that require user interaction
 * before playing audio/video.
 *
 * Uses the UserActivation API (navigator.userActivation.hasBeenActive) if available,
 * otherwise falls back to listening for interaction events.
 *
 * @returns boolean - true if user has interacted with the document
 */
export const useUserInteracted = (): boolean => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const listenerAddedRef = useRef(false);

  useEffect(() => {
    // Skip if not in browser
    if (typeof window === 'undefined') {
      return;
    }

    // Check if UserActivation API is available
    if (
      navigator.userActivation &&
      'hasBeenActive' in navigator.userActivation
    ) {
      // Use the modern UserActivation API
      const checkActivation = () => {
        if (navigator.userActivation.hasBeenActive) {
          setHasInteracted(true);
        } else {
          // Keep checking until user interacts
          requestAnimationFrame(checkActivation);
        }
      };

      checkActivation();
      return;
    }

    // Fallback: manual event listeners for older browsers
    if (hasInteracted || listenerAddedRef.current) {
      return;
    }

    const handleInteraction = () => {
      setHasInteracted(true);
    };

    // Add listeners for various interaction events
    document.addEventListener('mousedown', handleInteraction, {
      once: true,
      passive: true,
    });
    document.addEventListener('mousemove', handleInteraction, {
      once: true,
      passive: true,
    });
    document.addEventListener('touchstart', handleInteraction, {
      once: true,
      passive: true,
    });
    document.addEventListener('scroll', handleInteraction, {
      once: true,
      passive: true,
    });
    document.addEventListener('keydown', handleInteraction, {
      once: true,
      passive: true,
    });

    listenerAddedRef.current = true;

    return () => {
      // Cleanup if component unmounts before interaction
      if (!hasInteracted) {
        document.removeEventListener('mousedown', handleInteraction);
        document.removeEventListener('mousemove', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
        document.removeEventListener('scroll', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
      }
    };
  }, [hasInteracted]);

  return hasInteracted;
};
