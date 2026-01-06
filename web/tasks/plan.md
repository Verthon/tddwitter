# Feedback Features Implementation Plan

## 1. Likes
- Add like button component with heart icon (unfilled/filled states)
- Implement optimistic UI updates (toggle immediately, rollback on error)
- Add MSW handlers for POST `/posts/:postId/like` and DELETE `/posts/:postId/like`
- Display like count next to button
- Add heart animation on click
- Update TimelineItem to show like state and count

## 2. Comments
- Add comment button component with count display
- Clicking opens reply composer inline or navigates to post detail
- Add MSW handler for POST `/posts/:postId/comments`
- Display comment count
- Update PostDetailPage to show comment thread
- Create CommentList component with nested replies support

## 3. Reposts
- Add repost button component with count
- Click opens menu: "Repost" or "Quote"
- Simple repost: POST `/posts/:postId/repost` creates repost entry
- Quote repost: Opens composer with quoted post preview
- Show "Reposted by @user" context in timeline
- Add undo repost functionality

## 4. Share/Bookmark
- Add share button that opens share menu
- Share options: Copy link, native share API
- Add bookmark button (separate from share or combined)
- MSW handlers for POST `/posts/:postId/bookmark`
- Store bookmarks, add bookmarks page route (future)
- Show success toast on copy/bookmark

## Technical Notes
- Use optimistic updates for all actions (instant UI feedback)
- All MSW handlers return mock data with random counts
- Add engagement bar component combining all buttons
- Ensure accessibility (ARIA labels, keyboard navigation)
- Keep animations minimal and performant
