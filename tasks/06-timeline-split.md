# Timeline Split - Following & Discover Tasks

## Overview
Implement a dual-timeline system with "Following" feed showing posts from followed users and "Discover" feed showing algorithmic content recommendations. Match Bluesky's timeline navigation pattern.

## Technical Requirements
- Tab-based navigation
- Separate data feeds
- Persistent tab state
- Infinite scroll for both
- MSW for API mocking
- React Query for caching
- Smooth transitions

## Task Breakdown

### 1. Create Timeline Tabs Component
**File:** `src/features/timeline/components/TimelineTabs.tsx`

#### Steps:
1. Create tab navigation bar
2. Following tab (default)
3. Discover tab
4. Active tab indicator
5. Swipe gesture support (mobile)
6. Keyboard navigation
7. Save selected tab preference
8. Animated tab transitions

#### Component Structure:
```typescript
interface TimelineTabsProps {
  activeTab: 'following' | 'discover';
  onTabChange: (tab: 'following' | 'discover') => void;
}
```

### 2. Update Timeline Container
**File:** `src/features/timeline/components/TimelineContainer.tsx`

#### Steps:
1. Wrap existing timeline
2. Add tabs at top
3. Conditional feed rendering
4. Maintain scroll positions
5. Lazy load inactive tab
6. Prefetch other tab data
7. Handle tab switches
8. Update URL params

### 3. Create Following Feed Component
**File:** `src/features/timeline/components/FollowingFeed.tsx`

#### Steps:
1. Fetch posts from followed users
2. Chronological ordering
3. Show repost context
4. Include quoted posts
5. Real-time updates (mock)
6. Empty state (no follows)
7. Suggest users to follow
8. Pull to refresh

#### MSW Handler:
```typescript
http.get(`${baseUrl}/timeline/following`, ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const since = url.searchParams.get('since');
  
  return HttpResponse.json({
    posts: [
      {
        id: 'post-following-1',
        content: 'Post from someone you follow',
        author: {
          id: 'user-1',
          username: 'friend1',
          displayName: 'Friend One',
          isFollowing: true
        },
        createdAt: new Date().toISOString(),
        isRepost: false,
        repostedBy: null
      },
      // More posts...
    ],
    hasMore: true,
    nextPage: parseInt(page) + 1
  });
})
```

### 4. Create Discover Feed Component
**File:** `src/features/timeline/components/DiscoverFeed.tsx`

#### Steps:
1. Fetch algorithmic posts
2. Mix popular content
3. Include trending topics
4. Personalized recommendations
5. Diverse content sources
6. Hide muted/blocked content
7. Refresh recommendations
8. Track engagement for learning

#### MSW Handler:
```typescript
http.get(`${baseUrl}/timeline/discover`, ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  
  return HttpResponse.json({
    posts: [
      {
        id: 'post-discover-1',
        content: 'Trending post you might like',
        author: {
          id: 'user-trending',
          username: 'trendinguser',
          displayName: 'Trending User',
          isFollowing: false,
          verified: true
        },
        createdAt: new Date().toISOString(),
        likes: 1523,
        reposts: 234,
        trending: true,
        recommendationReason: 'Trending in Tech'
      },
      // More posts...
    ],
    hasMore: true,
    nextPage: parseInt(page) + 1
  });
})
```

### 5. Create Feed Algorithm Service
**File:** `src/features/timeline/services/feedAlgorithm.ts`

#### Steps:
1. Score posts by engagement
2. Factor in user interests
3. Time decay function
4. Diversity scoring
5. Avoid repetitive content
6. Boost verified accounts
7. Filter blocked/muted
8. Track impressions

### 6. Create Follow Suggestions Component
**File:** `src/features/timeline/components/FollowSuggestions.tsx`

#### Steps:
1. Show suggested users card
2. Display 3-5 suggestions
3. Include follow button
4. Show mutual connections
5. Refresh suggestions
6. Dismiss individual suggestions
7. Track follow actions
8. Hide when following enough

#### MSW Handler:
```typescript
http.get(`${baseUrl}/users/suggestions`, () => {
  return HttpResponse.json({
    suggestions: [
      {
        id: 'suggested-1',
        username: 'popular_user',
        displayName: 'Popular User',
        avatar: 'https://i.pravatar.cc/150?u=popular',
        bio: 'Interesting bio here',
        followers: 10234,
        verified: true,
        mutualFollows: ['friend1', 'friend2']
      },
      // More suggestions...
    ]
  });
})
```

### 7. Create Trending Topics Component
**File:** `src/features/timeline/components/TrendingTopics.tsx`

#### Steps:
1. Fetch trending hashtags
2. Display in sidebar/card
3. Show post count
4. Click to view topic feed
5. Refresh periodically
6. Geographic trends
7. Category filtering
8. Hide sensitive topics

### 8. Create Feed Filters
**File:** `src/features/timeline/components/FeedFilters.tsx`

#### Steps:
1. Filter dropdown/modal
2. Show reposts toggle
3. Show replies toggle
4. Show quotes toggle
5. Media only option
6. Language filter
7. Save filter preferences
8. Apply to both feeds

### 9. Create Scroll Position Manager
**File:** `src/features/timeline/hooks/useScrollPosition.ts`

#### Steps:
1. Save scroll position on tab switch
2. Restore position on return
3. Handle pull to refresh
4. Update on new posts
5. Smooth scroll to top
6. Track reading position
7. Clear old positions
8. Handle orientation changes

### 10. Create New Posts Indicator
**File:** `src/features/timeline/components/NewPostsIndicator.tsx`

#### Steps:
1. Show "New posts" button
2. Display count of new posts
3. Float at top of feed
4. Click to load new posts
5. Auto-hide after timeout
6. Animate entrance/exit
7. Different per feed
8. Smart batching

### 11. Create Feed Empty States
**Files:**
- `src/features/timeline/components/FollowingEmptyState.tsx`
- `src/features/timeline/components/DiscoverEmptyState.tsx`

#### Steps:
1. Design engaging empty states
2. Following: Suggest users
3. Discover: Show onboarding
4. Add action buttons
5. Include helpful tips
6. Link to explore page
7. Animate on first view

### 12. Create Feed Preferences
**File:** `src/features/timeline/components/FeedPreferences.tsx`

#### Steps:
1. Settings modal/page
2. Default tab selection
3. Auto-play videos toggle
4. Image preview size
5. Sensitive content filter
6. Repost frequency
7. Algorithm preferences
8. Reset to defaults

## Feed Performance Optimization

### 13. Create Virtual Scroll Implementation
**File:** `src/features/timeline/hooks/useVirtualScroll.ts`

#### Steps:
1. Implement windowing
2. Render visible items only
3. Maintain scroll position
4. Handle dynamic heights
5. Smooth scrolling
6. Preload buffer zones
7. Handle list updates

### 14. Create Feed Cache Strategy
**File:** `src/features/timeline/services/feedCache.ts`

#### Steps:
1. Cache both feeds separately
2. Prefetch next pages
3. Store for offline
4. Expire old data
5. Update optimistically
6. Handle conflicts
7. Sync across tabs

## Testing Checklist
- [ ] Switch between tabs
- [ ] Scroll position maintained
- [ ] Following feed loads
- [ ] Discover feed loads
- [ ] Infinite scroll works
- [ ] Pull to refresh
- [ ] New posts indicator
- [ ] Follow suggestions show
- [ ] Filters apply correctly
- [ ] Empty states display
- [ ] Tab preference saves
- [ ] Swipe gestures work (mobile)
- [ ] Keyboard navigation
- [ ] Performance is smooth
- [ ] Cache works offline

## Dependencies
```json
{
  "react-window": "^1.x",
  "react-intersection-observer": "^9.x",
  "@tanstack/react-virtual": "^3.x",
  "framer-motion": "^11.x"
}
```

## Notes for AI Implementation
- Optimize for performance first
- Keep feeds independent
- Cache aggressively
- Prefetch intelligently
- Handle race conditions
- Smooth animations
- Responsive design
- Consider data usage
- Add loading skeletons
- Handle errors gracefully
- Track user preferences
- A/B test algorithm changes
- Monitor feed quality
- Implement pull-to-refresh properly
- Consider offline experience