import { Loader } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ReactReader } from 'react-reader';

import useAuth from '@/features/auth/hooks/use-auth';
import { useTrackBookProgressMutation } from '@/features/book/services/mutations';
import {
  useGetBookByIdQuery,
  useGetBookProgressQuery,
} from '@/features/book/services/queries';

import type { Contents } from 'epubjs';
import type { DisplayedLocation } from 'epubjs/types/rendition';
import type Section from 'epubjs/types/section';

interface BookReaderProps {
  bookId: string;
}

interface ISection extends Section {
  length: number;
}

const BookReader: React.FC<BookReaderProps> = ({ bookId }) => {
  const [location, setLocation] = useState<string | number>(0);
  const [percentage, setPercentage] = useState(0);
  const sectionsRef = useRef<ISection[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedLocationRef = useRef<string | number>(0);

  const {
    data: book,
    isLoading: bookLoading,
    error: bookError,
  } = useGetBookByIdQuery(bookId);
  const { data: progress, isLoading: progressLoading } =
    useGetBookProgressQuery(bookId);
  const { mutate: trackProgress, isPending } = useTrackBookProgressMutation();
  const { isAuthenticated } = useAuth();

  // Load saved progress when available
  useEffect(() => {
    if (progress?.location) {
      setLocation(progress.location);
      lastSavedLocationRef.current = progress.location;
    }
  }, [progress?.location]);

  // Debounced progress tracking (waits 3 seconds of inactivity)
  useEffect(() => {
    // Skip tracking for guest users
    if (!isAuthenticated || !bookId || isPending) return;

    // Only track if location actually changed
    if (location === lastSavedLocationRef.current) return;

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      lastSavedLocationRef.current = location;
      trackProgress({
        bookId,
        location: String(location),
      });
    }, 3000); // Wait 3 seconds after user stops reading

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [bookId, location, isPending, trackProgress, isAuthenticated]);

  // Save progress on page unload (only for authenticated users)
  useEffect(() => {
    // Skip for guest users
    if (!isAuthenticated) return;

    const handleBeforeUnload = () => {
      if (location !== lastSavedLocationRef.current) {
        // Use synchronous request for unload
        navigator.sendBeacon(
          `/api/books/${bookId}/progress`,
          JSON.stringify({ location: String(location) }),
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [bookId, location, isAuthenticated]);

  /**
   * Calculate reading progress percentage based on current location and sections
   * Similar to reference implementation that calculates:
   * 1. Percentage of previous sections
   * 2. Current section percentage based on displayed page
   */
  const calculatePercentage = useCallback(
    (currentLocation: { start?: DisplayedLocation }) => {
      const sections = sectionsRef.current;
      if (!sections.length || !currentLocation?.start) return 0;

      try {
        const currentHref = currentLocation.start.href;
        const sectionIndex = sections.findIndex((s) => s.href === currentHref);

        if (sectionIndex === -1) return 0;

        // Calculate total content length
        const totalLength = sections.reduce((acc, s) => acc + s.length, 0);
        if (totalLength === 0) return 0;

        // Calculate length of all previous sections
        const previousSectionsLength = sections
          .slice(0, sectionIndex)
          .reduce((acc, s) => acc + s.length, 0);
        const previousSectionsPercentage = previousSectionsLength / totalLength;

        // Calculate current section's contribution
        const currentSectionLength = sections[sectionIndex]!.length;
        const currentSectionPercentage = currentSectionLength / totalLength;

        // Get displayed page information
        const displayedPage = currentLocation.start.displayed?.page ?? 0;
        const totalPages = currentLocation.start.displayed?.total ?? 1;
        const pagePercentage = displayedPage / totalPages;

        // Total percentage
        const totalPercentage =
          (previousSectionsPercentage +
            currentSectionPercentage * pagePercentage) *
          100;

        return Math.min(100, Math.max(0, Math.round(totalPercentage)));
      } catch {
        return 0;
      }
    },
    [],
  );

  const handleLocationChange = useCallback((loc: string | number) => {
    setLocation(loc);
  }, []);

  if (bookLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="space-y-4 text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            {bookLoading ? 'Loading book...' : 'Loading your progress...'}
          </p>
        </div>
      </div>
    );
  }

  if (bookError) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-destructive">
            Failed to Load Book
          </h3>
          <p className="text-muted-foreground">
            An error occurred while loading the book. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Book Not Found
          </h3>
          <p className="text-muted-foreground">
            The requested book could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {book.title || 'Untitled Book'}
            </h1>
            {book.author && (
              <p className="text-sm text-muted-foreground">by {book.author}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-primary">{percentage}%</p>
            <p className="text-xs text-muted-foreground">Progress</p>
          </div>
        </div>
      </div>

      {/* Reader Container */}
      <div className="flex-1 overflow-hidden bg-background">
        <ReactReader
          url={book.bUrl}
          location={location}
          locationChanged={handleLocationChange}
          epubOptions={{
            allowPopups: true,
            allowScriptedContent: false,
          }}
          getRendition={(rendition) => {
            // Extract sections with their content lengths
            rendition.on('rendered', async () => {
              try {
                const spine =
                  (await // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  rendition.book?.loaded.spine) as any;
                const sections = spine.spineItems as ISection[];
                const promises = sections.map((s) =>
                  s.load(rendition.book.load.bind(rendition.book)),
                );
                Promise.all(promises).then(() => {
                  const extractedSections = sections.map((item) => ({
                    ...item,
                    length: item.document?.body?.textContent?.length ?? 0,
                  }));
                  sectionsRef.current = extractedSections as ISection[];
                });
              } catch {
                /* empty */
              }
            });

            // Update percentage when location changes
            rendition.on('relocated', () => {
              const newPercentage = calculatePercentage(rendition.location);
              setPercentage(newPercentage);
            });

            rendition.hooks.content.register((contents: Contents) => {
              // Enable smooth scrolling
              if (contents.window?.document?.body) {
                contents.window.document.body.style.scrollBehavior = 'smooth';
              }

              // Add custom styles for better readability
              const style = contents.window?.document?.createElement('style');
              if (style) {
                style.textContent = `
                  body {
                    font-family: 'Georgia', serif;
                    line-height: 1.6;
                    color: #1f2937;
                  }
                  p {
                    margin-bottom: 1em;
                  }
                `;
                contents.window?.document?.head?.appendChild(style);
              }
            });
          }}
        />
      </div>
    </div>
  );
};

export default BookReader;
