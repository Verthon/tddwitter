# Post Composer Tasks

## Overview
Implement post creation functionality matching Bluesky's composer interface for logged-in users. All API calls will be mocked using MSW.

## Technical Requirements
- React components with TypeScript
- Rich text editor capabilities
- Character counter (300 char limit)
- Image/media upload (mocked)
- MSW for API mocking
- React Query mutations
- Draft auto-save functionality

## Task Breakdown

### 1. Create Composer Component
**File:** `src/core/composer/components/Composer.tsx`

#### Steps:
1. Create floating action button (FAB) for new post
2. Open composer modal/drawer on click
3. Check authentication before showing
4. Add keyboard shortcut (Cmd/Ctrl + N)
5. Position FAB in bottom-right corner
6. Add tooltip on hover
7. Hide on scroll down, show on scroll up
8. Animate entrance/exit

#### Component Structure:
```typescript
interface ComposerProps {
  onPost?: (post: Post) => void;
  replyTo?: string;
  quote?: Post;
}
```

### 2. Create Text Editor Component
**File:** `src/core/composer/components/TextEditor.tsx`

#### Steps:
1. Create rich text input area
2. Auto-resize based on content
3. Add character counter (300 limit)
4. Show warning at 280 characters
5. Disable submit when over limit
6. Support line breaks (Shift+Enter)
7. Add placeholder text
8. Focus on mount

#### Features:
- Mention autocomplete (@username)
- Hashtag support (#topic)
- Link detection and preview
- Emoji picker integration

### 3. Media Upload Component
**File:** `src/core/composer/components/MediaUpload.tsx`

#### Steps:
1. Create image upload button
2. Support drag and drop
3. Preview uploaded images
4. Allow multiple images (max 4)
5. Add remove image option
6. Show upload progress (mocked)
7. Validate file types (jpg, png, gif)
8. Compress images client-side

#### MSW Handler:
```typescript
http.post(`${baseUrl}/media/upload`, async ({ request }) => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return HttpResponse.json({
    id: 'media-' + Date.now(),
    url: 'https://picsum.photos/400/300',
    thumbnail: 'https://picsum.photos/100/100'
  });
})
```

### 4. Post Preview Component
**File:** `src/core/composer/components/PostPreview.tsx`

#### Steps:
1. Show real-time preview of post
2. Display formatted text
3. Show attached images
4. Display character count
5. Show reply context if replying
6. Show quoted post if quoting
7. Update as user types

### 5. Composer Actions Bar
**File:** `src/core/composer/components/ComposerActions.tsx`

#### Steps:
1. Create action buttons row
2. Add image upload button
3. Add GIF picker button (mocked)
4. Add emoji picker button
5. Add poll creation button (future)
6. Add location tag (future)
7. Show/hide based on context
8. Disable when over character limit

### 6. Draft Management Service
**File:** `src/core/composer/services/draftService.ts`

#### Steps:
1. Auto-save draft to localStorage
2. Save every 5 seconds while typing
3. Restore draft on component mount
4. Clear draft after successful post
5. Store multiple drafts (replies separate)
6. Add draft indicator UI
7. Prompt to restore on page reload

### 7. Create Post Mutation
**File:** `src/core/composer/mutations/postMutations.ts`

#### Steps:
1. Create React Query mutation
2. Optimistic updates for timeline
3. Handle post submission
4. Upload media first, then post
5. Handle errors gracefully
6. Show success toast
7. Clear composer on success
8. Retry failed posts

#### MSW Handler:
```typescript
http.post(`${baseUrl}/posts`, async ({ request }) => {
  const body = await request.json();
  return HttpResponse.json({
    id: 'post-' + Date.now(),
    content: body.content,
    author: {
      id: 'current-user',
      username: 'currentuser',
      displayName: 'Current User'
    },
    createdAt: new Date().toISOString(),
    likes: 0,
    reposts: 0,
    replies: 0,
    media: body.media || []
  });
})
```

### 8. Reply Composer
**File:** `src/core/composer/components/ReplyComposer.tsx`

#### Steps:
1. Create inline reply component
2. Show below posts in timeline
3. Smaller than main composer
4. Show replying to @username
5. Maintain reply thread context
6. Quick reply without modal
7. Expand to full composer option

### 9. Quote Post Component
**File:** `src/core/composer/components/QuotePost.tsx`

#### Steps:
1. Show quoted post preview
2. Add comment above quote
3. Cannot quote a quote
4. Show original post metadata
5. Link to original post
6. Handle deleted quoted posts
7. Compact display format

### 10. Composer Modal/Drawer
**File:** `src/core/composer/components/ComposerModal.tsx`

#### Steps:
1. Create modal wrapper for composer
2. Full-screen on mobile
3. Modal on desktop
4. Add close confirmation if draft exists
5. Animate open/close
6. Trap focus while open
7. Close on escape key
8. Prevent body scroll when open

## Thread Composer
**File:** `src/core/composer/components/ThreadComposer.tsx`

#### Steps:
1. Allow creating multi-post threads
2. Add "Add another post" button
3. Number posts in thread (1/n)
4. Post all at once
5. Show thread preview
6. Connect posts visually
7. Character limit per post
8. Delete individual thread posts

## Testing Checklist
- [ ] Create simple text post
- [ ] Create post with images
- [ ] Character limit enforcement
- [ ] Reply to existing post
- [ ] Quote existing post
- [ ] Create thread
- [ ] Draft auto-save
- [ ] Draft restoration
- [ ] Media upload progress
- [ ] Error handling
- [ ] Optimistic updates
- [ ] Keyboard shortcuts
- [ ] Mobile responsiveness

## Dependencies
```json
{
  "react-textarea-autosize": "^8.x",
  "emoji-mart": "^5.x",
  "react-dropzone": "^14.x",
  "browser-image-compression": "^2.x"
}
```

## Notes for AI Implementation
- Keep composer lightweight and fast
- Optimize for mobile-first experience
- Ensure accessibility (ARIA labels, keyboard nav)
- Use debouncing for auto-save
- Implement proper focus management
- Add loading states for all async operations
- Cache uploaded media URLs
- Handle network failures gracefully
- Support markdown shortcuts (optional)