import { useEffect, useRef } from 'react';
import { useInfiniteTimeline } from '../hooks/useInfiniteTimeline';
import { TimelineItem } from './TimelineItem';
import { Button } from 'src/ui/Button/Button';
import { useTranslation } from 'src/i18n/useTranslation';

export const TimelineList = () => {
  const { t } = useTranslation();
  const {
    data,
    error,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteTimeline({ pageSize: 10 });

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div role="status" className="flex items-center justify-center py-8">
        <div className="text-sm text-gray-500">Loading timeline...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-center justify-center py-8 gap-3">
        <div className="text-sm text-red-600">
          {error?.message || 'Failed to load timeline'}
        </div>
        <Button
          onClick={() => globalThis.location.reload()}
          variant="outline"
          size="sm"
        >
          Try again
        </Button>
      </div>
    );
  }

  const allItems = data?.pages?.flatMap(page => page.items) || [];

  if (allItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-gray-500">No posts yet</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto pb-16 md:pb-0">
      <div
        className="bg-white border-l border-r border-gray-300 min-h-screen"
        role="feed"
        aria-label="Timeline feed"
        aria-busy={isFetchingNextPage}
      >
        <h1 className="text-xl font-bold p-4 border-b border-gray-300 sticky top-0 bg-white z-10">
          {t('timeline.heading')}
        </h1>
        {allItems.map((item) => (
          <TimelineItem
            key={item.id}
            avatar={item.avatar}
            username={item.username}
            content={item.content}
          />
        ))}

        {/* Loading more indicator */}
        {isFetchingNextPage && (
          <div role="status" aria-live="polite" className="flex items-center justify-center py-4">
            <div className="text-sm text-gray-500">Loading more...</div>
          </div>
        )}

        {/* Manual load more button (fallback) */}
        {hasNextPage && !isFetchingNextPage && (
          <div className="flex items-center justify-center py-4">
            <Button
              onClick={() => fetchNextPage()}
              variant="outline"
              size="sm"
            >
              Load more
            </Button>
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={observerRef} className="h-px" aria-hidden="true" />

        {/* End of timeline indicator */}
        {!hasNextPage && allItems.length > 0 && (
          <div role="status" className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">You've reached the end</div>
          </div>
        )}
      </div>
    </div>
  );
};