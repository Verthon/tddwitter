import { useEffect, useRef } from 'react';
import { useInfiniteTimeline } from '../hooks/useInfiniteTimeline';
import { TimelineItem } from './TimelineItem';
import { Button } from 'src/ui/Button/Button';
import { useTranslation } from 'src/i18n/useTranslation';

const LoadingState = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center py-8">
      <output className="text-sm text-gray-500">{t('timeline.loading')}</output>
    </div>
  );
};

const ErrorState = ({ message }: { message?: string }) => {
  const { t } = useTranslation();
  return (
    <div role="alert" className="flex flex-col items-center justify-center py-8 gap-3">
      <div className="text-sm text-red-600">
        {message || t('timeline.error')}
      </div>
      <Button
        onClick={() => globalThis.location.reload()}
        variant="outline"
        size="sm"
      >
        {t('timeline.tryAgain')}
      </Button>
    </div>
  );
};

const EmptyState = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-sm text-gray-500">{t('timeline.noPosts')}</div>
    </div>
  );
};

const LoadingMoreIndicator = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center py-4">
      <output aria-live="polite" className="text-sm text-gray-500">{t('timeline.loadingMore')}</output>
    </div>
  );
};

const LoadMoreButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center py-4">
      <Button
        onClick={onClick}
        variant="outline"
        size="sm"
      >
        {t('timeline.loadMore')}
      </Button>
    </div>
  );
};

const EndOfTimelineIndicator = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center py-8">
      <output className="text-sm text-gray-500">{t('timeline.endOfTimeline')}</output>
    </div>
  );
};

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
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message={error?.message} />;
  }

  const allItems = data?.pages?.flatMap(page => page.items) || [];

  if (allItems.length === 0) {
    return <EmptyState />;
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
        <ul>
          {allItems.map((item) => (
            <li key={item.id}>
              <TimelineItem
                id={item.id}
                avatar={item.avatar}
                username={item.username}
                content={item.content}
              />
            </li>
          ))}
        </ul>

        {isFetchingNextPage && <LoadingMoreIndicator />}

        {hasNextPage && !isFetchingNextPage && (
          <LoadMoreButton onClick={() => fetchNextPage()} />
        )}

        <div ref={observerRef} className="h-px" aria-hidden="true" />

        {!hasNextPage && allItems.length > 0 && <EndOfTimelineIndicator />}
      </div>
    </div>
  );
};