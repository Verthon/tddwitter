# Post Details & User Profile Tasks

## Overview
Implement post detail views and user profile pages with proper routing. Each post and user should have a unique URL that can be shared and bookmarked.

## Technical Requirements
- React Router for navigation
- Dynamic routing with parameters
- SEO-friendly URLs
- MSW for API mocking
- React Query for data fetching
- Lazy loading for performance

## Task Breakdown

### 1. Update Routing Configuration
**File:** `src/routing/routesConfig.ts`

#### Steps:
1. Add post detail route (/post/:postId)
2. Add user profile route (/:username)
3. Add user posts tab (/:username/posts)
4. Add user replies tab (/:username/replies)
5. Add user media tab (/:username/media)
6. Add user likes tab (/:username/likes)
7. Create route constants
8. Add TypeScript route params types

#### Route Structure:
```typescript
export const routesConfig = {
  home: '/',
  post: '/post/:postId',
  profile: '/:username',
  profilePosts: '/:username/posts',
  profileReplies: '/:username/replies',
  profileMedia: '/:username/media',
  profileLikes: '/:username/likes',
  login: '/login',
  register: '/register',
} as const;
```

### 2. Create Post Detail Page
**File:** `src/features/post/pages/PostDetailPage.tsx`

#### Steps:
1. Extract postId from URL params
2. Fetch post data with React Query
3. Show loading skeleton
4. Display post with full content
5. Show reply thread hierarchy
6. Load parent posts if reply
7. Add reply composer at bottom
8. Handle post not found (404)

#### MSW Handler:
```typescript
http.get(`${baseUrl}/posts/:postId`, ({ params }) => {
  const { postId } = params;
  // Return mock post data
  return HttpResponse.json({
    id: postId,
    content: 'This is a detailed post view',
    author: {
      id: 'user-1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?u=johndoe'
    },
    createdAt: new Date().toISOString(),
    likes: 42,
    reposts: 12,
    replies: 8,
    thread: {
      parent: null, // or parent post ID
      children: ['reply-1', 'reply-2']
    }
  });
})
```

### 3. Create Reply Thread Component
**File:** `src/features/post/components/ReplyThread.tsx`

#### Steps:
1. Display parent-child relationship
2. Visual thread line connection
3. Indent nested replies
4. Collapse long threads (show more)
5. Load more replies pagination
6. Highlight OP (original poster)
7. Sort by relevance/time
8. Handle deleted posts in thread

### 4. Create User Profile Page
**File:** `src/features/profile/pages/UserProfilePage.tsx`

#### Steps:
1. Extract username from URL
2. Fetch user profile data
3. Display user header (avatar, bio)
4. Show follower/following counts
5. Add follow/unfollow button
6. Create tab navigation
7. Show user's posts by default
8. Handle user not found

#### MSW Handler:
```typescript
http.get(`${baseUrl}/users/:username`, ({ params }) => {
  const { username } = params;
  return HttpResponse.json({
    id: 'user-id',
    username: username,
    displayName: 'Display Name',
    bio: 'User bio goes here',
    avatar: 'https://i.pravatar.cc/150?u=' + username,
    banner: 'https://picsum.photos/600/200',
    joinedAt: '2024-01-01T00:00:00Z',
    following: 234,
    followers: 567,
    posts: 89,
    verified: false
  });
})
```

### 5. Create Profile Header Component
**File:** `src/features/profile/components/ProfileHeader.tsx`

#### Steps:
1. Display banner image
2. Show avatar overlay on banner
3. Display name and @username
4. Show bio with links clickable
5. Display join date
6. Show location (if provided)
7. Add Edit Profile button (own profile)
8. Add Follow/Following button

### 6. Create Profile Tabs Component
**File:** `src/features/profile/components/ProfileTabs.tsx`

#### Steps:
1. Create tab navigation
2. Posts tab (default)
3. Posts & Replies tab
4. Media tab (images/videos)
5. Likes tab
6. Maintain tab state in URL
7. Lazy load tab content
8. Show counts in tab labels

### 7. User Posts Feed
**File:** `src/features/profile/components/UserPostsFeed.tsx`

#### Steps:
1. Fetch user's posts
2. Implement infinite scroll
3. Show loading skeleton
4. Filter by post type (posts/replies)
5. Handle empty state
6. Reuse timeline post components
7. Add pull-to-refresh

#### MSW Handler:
```typescript
http.get(`${baseUrl}/users/:username/posts`, ({ params, request }) => {
  const { username } = params;
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  
  return HttpResponse.json({
    posts: [/* mock posts array */],
    hasMore: true,
    nextPage: parseInt(page) + 1
  });
})
```

### 8. Create Post Share Component
**File:** `src/features/post/components/PostShare.tsx`

#### Steps:
1. Generate shareable URL
2. Copy link button
3. Share to social media options
4. Show toast on copy
5. Track share analytics (mocked)
6. Create QR code option
7. Email share option

### 9. Create Breadcrumb Navigation
**File:** `src/core/navigation/components/Breadcrumbs.tsx`

#### Steps:
1. Show navigation path
2. Link to parent pages
3. Show current page
4. Mobile-responsive design
5. Truncate long usernames
6. Add home link always

### 10. SEO Meta Tags Component
**File:** `src/core/seo/components/MetaTags.tsx`

#### Steps:
1. Dynamic page titles
2. Open Graph tags for sharing
3. Twitter Card meta tags
4. Description meta tags
5. Canonical URLs
6. User profile meta data
7. Post preview in meta

### 11. Create Not Found Pages
**Files:** 
- `src/features/post/pages/PostNotFound.tsx`
- `src/features/profile/pages/UserNotFound.tsx`

#### Steps:
1. Create 404 page designs
2. Suggest similar content
3. Search functionality
4. Return home button
5. Report broken link option
6. Friendly error messaging

### 12. Navigation Guards
**File:** `src/routing/guards/RouteGuard.tsx`

#### Steps:
1. Check route permissions
2. Validate URL parameters
3. Redirect invalid routes
4. Handle private profiles
5. Check blocked users
6. Rate limit checking

## Deep Linking Support
**File:** `src/features/deeplink/DeeplinkHandler.tsx`

#### Steps:
1. Handle app deep links
2. Parse URL parameters
3. Navigate to correct view
4. Handle external links
5. Validate link format
6. Open in app or browser

## Testing Checklist
- [ ] Navigate to post detail
- [ ] Navigate to user profile
- [ ] Switch between profile tabs
- [ ] Share post link
- [ ] Copy profile link
- [ ] Handle invalid post ID
- [ ] Handle invalid username
- [ ] Back navigation works
- [ ] Browser history updates
- [ ] Direct URL access works
- [ ] Meta tags update
- [ ] Infinite scroll in profile
- [ ] Thread navigation

## Dependencies
```json
{
  "react-router-dom": "^6.x",
  "react-helmet-async": "^2.x",
  "react-intersection-observer": "^9.x"
}
```

## Notes for AI Implementation
- Use React Router v6 features
- Implement proper loading states
- Cache previously visited profiles
- Preload on hover (optional)
- Use suspense for code splitting
- Implement proper error boundaries
- Add analytics tracking
- Consider URL slugs for SEO
- Handle special characters in usernames
- Implement canonical URLs