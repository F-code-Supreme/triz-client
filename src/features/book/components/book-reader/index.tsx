import { Loader, Highlighter, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ReactReader } from 'react-reader';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { STRING_EMPTY } from '@/constants';
import useAuth from '@/features/auth/hooks/use-auth';
import { useTrackBookProgressMutation } from '@/features/book/services/mutations';
import {
  useGetBookByIdQuery,
  useGetBookProgressQuery,
} from '@/features/book/services/queries';
import {
  useCreateHighlightMutation,
  useDeleteHighlightMutation,
} from '@/features/book-highlight/services/mutations';
import { useGetHighlightsByBookQuery } from '@/features/book-highlight/services/queries';

import type { BookHighlight } from '@/features/book-highlight/types';
import type { Contents, Rendition } from 'epubjs';
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
  const [highlightPosition, setHighlightPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [currentCFI, setCurrentCFI] = useState(STRING_EMPTY);
  const [clickedHighlightId, setClickedHighlightId] = useState<string | null>(
    null,
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [localHighlights, setLocalHighlights] = useState<BookHighlight[]>([]);
  const sectionsRef = useRef<ISection[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedLocationRef = useRef<string | number>(0);
  const renditionRef = useRef<Rendition | null>(null);

  const {
    data: book,
    isLoading: bookLoading,
    error: bookError,
  } = useGetBookByIdQuery(bookId);
  const { data: progress, isLoading: progressLoading } =
    useGetBookProgressQuery(bookId);
  const { mutate: trackProgress, isPending } = useTrackBookProgressMutation();
  const { isAuthenticated } = useAuth();
  const { data: highlights = [] } = useGetHighlightsByBookQuery(
    isAuthenticated ? bookId : null,
  );
  const { mutate: _createHighlight } = useCreateHighlightMutation();
  const { mutate: _deleteHighlight } = useDeleteHighlightMutation();

  // Load saved progress when available
  useEffect(() => {
    if (progress?.location) {
      setLocation(progress.location);
      lastSavedLocationRef.current = progress.location;
    }
  }, [progress?.location]);

  // Calculate initial percentage when progress or location changes
  useEffect(() => {
    if (progress?.percentage) {
      setPercentage(progress.percentage);
    }
  }, [progress?.percentage]);

  // Sync highlights from backend to local state on initial load
  useEffect(() => {
    if (highlights.length > 0) {
      setLocalHighlights(highlights);
    }
  }, [highlights]);

  useEffect(() => {
    if (highlightPosition || clickedHighlightId) {
      setIsPopoverOpen(true);
    }
  }, [highlightPosition, clickedHighlightId]);

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
        percentage,
      });
    }, 3000); // Wait 3 seconds after user stops reading

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [bookId, location, percentage, isPending, trackProgress, isAuthenticated]);

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

  // Calculate highlight popup position based on selection
  const calculateHighlightPosition = useCallback(
    (
      selection: Selection,
      iframeWindow: Window,
    ): { x: number; y: number } | null => {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const frameElement = iframeWindow.frameElement;
        if (!frameElement) return null;

        const iframeRect = frameElement.getBoundingClientRect();

        // Check if selection is visible within iframe
        if (rect.top >= 0 && rect.top <= iframeWindow.innerHeight) {
          return {
            x: iframeRect.left + rect.left,
            y: iframeRect.top + rect.top,
          };
        }

        // Selection is off-screen, position at iframe top center
        return {
          x: iframeRect.left + iframeRect.width / 2 - 50,
          y: iframeRect.top + 10,
        };
      } catch {
        return null;
      }
    },
    [],
  );

  // Create highlight from selected text with optimistic update
  const handleCreateHighlight = useCallback(() => {
    if (!currentCFI) return;

    // Create optimistic highlight with temporary ID
    const tempId = `temp-${Date.now()}`;
    const optimisticHighlight: BookHighlight = {
      id: tempId,
      range: currentCFI,
    };

    // Optimistic update to local state immediately
    setLocalHighlights((prev) => [...prev, optimisticHighlight]);

    if (!renditionRef.current) return;

    // Add highlight annotation to rendition
    renditionRef.current.annotations.add(
      'highlight',
      currentCFI,
      {},
      () => {
        // Show delete option when highlight is clicked
        setClickedHighlightId(tempId);
      },
      'epub-highlight',
      {
        fill: 'rgba(255, 255, 0, 0.3)', // Yellow highlight
        cursor: 'pointer',
        borderRadius: '2px',
      },
    );

    // Clear selection UI immediately
    setHighlightPosition(null);
    setCurrentCFI(STRING_EMPTY);

    // Send to backend asynchronously
    _createHighlight({
      bookId,
      range: currentCFI,
    });
  }, [currentCFI, bookId, _createHighlight]);

  // Delete highlight
  const handleDeleteHighlight = useCallback(() => {
    if (!clickedHighlightId || !renditionRef.current) return;

    // Find highlight in local state
    const highlight = localHighlights.find((h) => h.id === clickedHighlightId);
    if (!highlight) return;

    // Remove highlight annotation from rendition
    renditionRef.current.annotations.remove(highlight.range, 'highlight');
    // Optimistic update - remove from local state immediately
    setLocalHighlights((prev) =>
      prev.filter((h) => h.id !== clickedHighlightId),
    );

    // Send delete request to backend asynchronously
    _deleteHighlight({
      highlightId: clickedHighlightId,
    });

    // Clear clicked state
    setClickedHighlightId(null);
  }, [localHighlights, clickedHighlightId, _deleteHighlight]);

  // Apply existing highlights to the rendered content with delete functionality
  const applyHighlights = useCallback(
    (rendition: Rendition | null) => {
      if (!rendition) return;

      // Reapply all highlights from local state
      highlights.forEach((highlight) => {
        rendition?.annotations.add(
          'highlight',
          highlight.range,
          {},
          () => {
            // Show delete option when highlight is clicked
            setClickedHighlightId(highlight.id);
          },
          'epub-highlight',
          {
            fill: 'rgba(255, 255, 0, 0.3)', // Yellow highlight
            cursor: 'pointer',
            borderRadius: '2px',
          },
        );
      });
    },
    [highlights],
  );

  // Apply highlights whenever local state changes
  useEffect(() => {
    if (renditionRef.current) {
      applyHighlights(renditionRef.current);
    }
  }, [applyHighlights]);

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
            allowScriptedContent: true,
          }}
          getRendition={(rendition) => {
            renditionRef.current = rendition;
            // Extract sections with their content lengths
            rendition.on('rendered', async (_section: Section) => {
              // Apply highlights on new section load
              applyHighlights(renditionRef.current);
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

            // Handle text selection for highlighting
            rendition.on('selected', (cfiRange: string, contents: Contents) => {
              if (!isAuthenticated || !cfiRange) {
                setHighlightPosition(null);
                return;
              }

              const iframeWindow = contents.window;
              if (!iframeWindow) return;

              const selection = iframeWindow.getSelection();
              if (!selection || selection.toString().length === 0) return;

              // Calculate position accounting for iframe offset
              const pos = calculateHighlightPosition(selection, iframeWindow);
              if (pos) {
                setHighlightPosition(pos);
              }

              setCurrentCFI(cfiRange);
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
                  .epub-highlight {
                    background-color: rgba(255, 255, 0, 0.3);
                    cursor: pointer;
                    border-radius: 2px;
                  }
                  .epub-highlight:hover {
                    background-color: rgba(255, 255, 0, 0.5);
                  }
                `;
                contents.window?.document?.head?.appendChild(style);
              }
            });
          }}
        />

        {/* Combined Highlight/Delete Popover */}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <div
            style={{
              position: 'fixed',
              top: `${highlightPosition?.y ?? 100}px`,
              left: `${highlightPosition?.x ?? 100}px`,
              pointerEvents: 'none',
            }}
          >
            <PopoverTrigger asChild>
              <button
                style={{
                  width: '1px',
                  height: '1px',
                  padding: '0',
                  border: 'none',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                }}
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              />
            </PopoverTrigger>
          </div>
          <PopoverContent
            side="top"
            align="center"
            className="w-auto"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {highlightPosition ? (
              // Highlight Creation Mode
              <div className="flex gap-1">
                <Button
                  size="sm"
                  className="h-8 px-3 bg-yellow-200 hover:bg-yellow-300 text-black flex items-center gap-1"
                  onClick={() => {
                    handleCreateHighlight();
                    setIsPopoverOpen(false);
                  }}
                  title="Highlight"
                >
                  <Highlighter className="h-4 w-4" />
                  <span className="text-xs font-medium">Highlight</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    setHighlightPosition(null);
                    setIsPopoverOpen(false);
                  }}
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : clickedHighlightId ? (
              // Delete Mode
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium">Delete this highlight?</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      handleDeleteHighlight();
                      setIsPopoverOpen(false);
                    }}
                    title="Delete"
                  >
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setClickedHighlightId(null);
                      setIsPopoverOpen(false);
                    }}
                    title="Cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : null}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BookReader;
