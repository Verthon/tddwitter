# Feedback Features Tasks

## Overview
Implement user engagement features including likes, comments, reposts, and quotes. All interactions will be mocked through MSW handlers with optimistic UI updates.

## Technical Requirements
- React components with TypeScript
- Optimistic UI updates
- MSW for API mocking
- React Query mutations
- Local state management
- Animation effects
- Accessibility support

## Task Breakdown

### 1. Create Like Button Component
**File:** `src/features/feedback/components/LikeButton.tsx`

#### Steps:
1. Create heart icon button
2. Toggle filled/unfilled state
3. Add like count display
4. Implement optimistic update
5. Add animation on click
6. Handle double-click to like
7. Disable while processing
8. Add haptic feedback (mobile)

#### Component Structure:
```typescript
interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  onLike?: (liked: boolean) => void;
}
```

#### MSW Handlers:
```typescript
// Like a post
http.post(`${baseUrl}/posts/:postId/like`, ({ params }) => {
  const { postId } = params;
  return HttpResponse.json({
    liked: true,
    count: Math.floor(Math.random() * 100) + 1
  });
})

// Unlike a post
http.delete(`${baseUrl}/posts/:postId/like`, ({ params }) => {
  const { postId } = params;
  return HttpResponse.json({
    liked: false,
    count: Math.floor(Math.random() * 100)
  });
})
```

### 2. Create Comment Component
**File:** `src/features/feedback/components/CommentButton.tsx`

#### Steps:
1. Create comment icon button
2. Show comment count
3. Open reply composer on click
4. Navigate to post detail
5. Show comment preview (optional)
6. Highlight on new comment
7. Add badge for unread

#### Reply List Component:
**File:** `src/features/feedback/components/ReplyList.tsx`

#### Steps:
1. Display replies under post
2. Implement pagination
3. Show nested replies
4. Add "Show more" button
5. Collapse/expand threads
6. Sort by newest/popular
7. Handle deleted replies

### 3. Create Repost Component
**File:** `src/features/feedback/components/RepostButton.tsx`

#### Steps:
1. Create repost icon button
2. Show repost count
3. Open repost menu on click
4. Option: Simple repost
5. Option: Quote repost
6. Show reposted indicator
7. Undo repost option
8. Animate repost action

#### MSW Handlers:
```typescript
// Repost
http.post(`${baseUrl}/posts/:postId/repost`, ({ params }) => {
  const { postId } = params;
  return HttpResponse.json({
    repostId: 'repost-' + Date.now(),
    reposted: true,
    count: Math.floor(Math.random() * 50) + 1
  });
})

// Quote post
http.post(`${baseUrl}/posts/:postId/quote`, async ({ params, request }) => {
  const { postId } = params;
  const body = await request.json();
  return HttpResponse.json({
    quoteId: 'quote-' + Date.now(),
    quotedPostId: postId,
    content: body.content,
    quoted: true
  });
})
```

### 4. Create Share Button Component
**File:** `src/features/feedback/components/ShareButton.tsx`

#### Steps:
1. Create share icon button
2. Open share menu on click
3. Copy link option
4. Share via native share API
5. Share to other platforms
6. Generate QR code
7. Track share analytics
8. Show success feedback

### 5. Create Engagement Bar Component
**File:** `src/features/feedback/components/EngagementBar.tsx`

#### Steps:
1. Combine all action buttons
2. Horizontal layout
3. Space evenly
4. Show counts for each
5. Handle loading states
6. Disable during mutations
7. Responsive design
8. Keyboard navigation

#### Component Structure:
```typescript
interface EngagementBarProps {
  postId: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  isLiked: boolean;
  isReposted: boolean;
  onReply?: () => void;
}
```

### 6. Create Optimistic Update Hook
**File:** `src/features/feedback/hooks/useOptimisticUpdate.ts`

#### Steps:
1. Create generic optimistic hook
2. Update UI immediately
3. Rollback on error
4. Sync with server state
5. Handle race conditions
6. Queue multiple updates
7. Persist pending changes

### 7. Create Engagement Animations
**File:** `src/features/feedback/animations/engagementAnimations.ts`

#### Steps:
1. Like heart animation
2. Number increment animation
3. Repost rotation effect
4. Share ripple effect
5. Comment slide-in
6. Success checkmark
7. Error shake effect

### 8. Create Like List Modal
**File:** `src/features/feedback/components/LikeListModal.tsx`

#### Steps:
1. Show users who liked
2. Display user avatars
3. Link to user profiles
4. Implement pagination
5. Add search/filter
6. Show mutual follows
7. Follow button in list

#### MSW Handler:
```typescript
http.get(`${baseUrl}/posts/:postId/likes`, ({ params, request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  
  return HttpResponse.json({
    users: [
      {
        id: 'user-1',
        username: 'alice',
        displayName: 'Alice',
        avatar: 'https://i.pravatar.cc/150?u=alice',
        isFollowing: false
      },
      // ... more users
    ],
    hasMore: true,
    total: 42
  });
})
```

### 9. Create Comment Thread Component
**File:** `src/features/feedback/components/CommentThread.tsx`

#### Steps:
1. Display comment hierarchy
2. Indent nested replies
3. Connect with lines
4. Collapse long threads
5. Show "View more replies"
6. Highlight new comments
7. Jump to parent/child
8. Handle deleted comments

### 10. Create Reaction Picker (Future)
**File:** `src/features/feedback/components/ReactionPicker.tsx`

#### Steps:
1. Long press like button
2. Show emoji reactions
3. Select reaction type
4. Display reaction counts
5. Group similar reactions
6. Animate selection
7. Show who reacted

### 11. Create Bookmark Feature
**File:** `src/features/feedback/components/BookmarkButton.tsx`

#### Steps:
1. Create bookmark icon
2. Toggle bookmark state
3. Save to user's bookmarks
4. Show in bookmarks page
5. Organize in collections
6. Search bookmarks
7. Export bookmarks

#### MSW Handler:
```typescript
http.post(`${baseUrl}/posts/:postId/bookmark`, ({ params }) => {
  const { postId } = params;
  return HttpResponse.json({
    bookmarked: true,
    bookmarkId: 'bookmark-' + Date.now()
  });
})
```

### 12. Create Engagement Analytics
**File:** `src/features/feedback/services/engagementAnalytics.ts`

#### Steps:
1. Track like events
2. Track repost events
3. Track share events
4. Track comment events
5. Calculate engagement rate
6. Store in localStorage
7. Display in insights

## Real-time Updates (Mock)
**File:** `src/features/feedback/hooks/useRealtimeEngagement.ts`

#### Steps:
1. Simulate real-time likes
2. Update counts dynamically
3. Show "X and Y liked"
4. New comment notifications
5. Trending indicator
6. Live engagement ticker

## Testing Checklist
- [ ] Like a post
- [ ] Unlike a post
- [ ] Comment on post
- [ ] Reply to comment
- [ ] Repost a post
- [ ] Quote a post
- [ ] Share post link
- [ ] View likes list
- [ ] View comment thread
- [ ] Bookmark post
- [ ] Optimistic updates work
- [ ] Error rollback works
- [ ] Animations play correctly
- [ ] Keyboard navigation
- [ ] Screen reader support

## Dependencies
```json
{
  "framer-motion": "^11.x",
  "react-use": "^17.x",
  "@floating-ui/react": "^0.26.x",
  "sonner": "^1.x"
}
```

## Notes for AI Implementation
- Always use optimistic updates
- Implement proper error handling
- Add loading states for all actions
- Use debouncing for rapid clicks
- Cache engagement data
- Implement undo functionality
- Add confirmation for destructive actions
- Consider rate limiting
- Add keyboard shortcuts
- Ensure mobile touch targets (44x44px min)
- Use ARIA labels for accessibility
- Implement proper focus management
- Add haptic feedback on mobile
- Consider offline functionality