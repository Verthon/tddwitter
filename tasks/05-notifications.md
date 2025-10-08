# Notifications System Tasks

## Overview
Implement a comprehensive notifications system to keep users informed about interactions with their content and relevant activities. All notifications will be mocked through MSW.

## Technical Requirements
- Real-time notification updates (mocked)
- Persistent notification storage
- Badge/counter system
- Push notifications setup (future)
- MSW for API mocking
- React Query for data fetching
- Local storage for read status

## Task Breakdown

### 1. Create Notification Types
**File:** `src/features/notifications/types.ts`

#### Steps:
1. Define notification types enum
2. Create notification interfaces
3. Type for like notifications
4. Type for comment notifications
5. Type for follow notifications
6. Type for repost notifications
7. Type for mention notifications
8. Type for system notifications

#### Type Structure:
```typescript
enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  FOLLOW = 'follow',
  REPOST = 'repost',
  MENTION = 'mention',
  QUOTE = 'quote',
  SYSTEM = 'system'
}

interface Notification {
  id: string;
  type: NotificationType;
  actor: User;
  target?: Post | Comment;
  message?: string;
  read: boolean;
  createdAt: string;
}
```

### 2. Create Notification Bell Component
**File:** `src/features/notifications/components/NotificationBell.tsx`

#### Steps:
1. Create bell icon in header
2. Show unread count badge
3. Animate on new notification
4. Open dropdown on click
5. Show recent notifications
6. Mark as read on view
7. Link to notifications page
8. Add sound effect (optional)

#### MSW Handler:
```typescript
http.get(`${baseUrl}/notifications/count`, () => {
  return HttpResponse.json({
    unread: Math.floor(Math.random() * 10),
    total: 25
  });
})
```

### 3. Create Notifications Page
**File:** `src/features/notifications/pages/NotificationsPage.tsx`

#### Steps:
1. Display all notifications
2. Filter by type tabs
3. Mark all as read button
4. Infinite scroll pagination
5. Group by date
6. Show loading skeleton
7. Empty state design
8. Pull to refresh

### 4. Create Notification Item Component
**File:** `src/features/notifications/components/NotificationItem.tsx`

#### Steps:
1. Display based on type
2. Show actor avatar
3. Format notification text
4. Show timestamp
5. Link to relevant content
6. Unread indicator dot
7. Swipe actions (mobile)
8. Delete notification option

#### Notification Templates:
- **Like**: "@username liked your post"
- **Comment**: "@username replied to your post"
- **Follow**: "@username started following you"
- **Repost**: "@username reposted your post"
- **Mention**: "@username mentioned you"
- **Quote**: "@username quoted your post"

### 5. Create Notification Dropdown
**File:** `src/features/notifications/components/NotificationDropdown.tsx`

#### Steps:
1. Show recent 5 notifications
2. Compact view design
3. Quick mark as read
4. See all link
5. Close on outside click
6. Keyboard navigation
7. Auto-refresh interval
8. Loading state

### 6. Create Notification Service
**File:** `src/features/notifications/services/notificationService.ts`

#### Steps:
1. Fetch notifications API
2. Mark as read API
3. Delete notification API
4. Subscribe to updates (mock)
5. Cache notifications
6. Sync read status
7. Handle offline queue

#### MSW Handlers:
```typescript
// Get notifications
http.get(`${baseUrl}/notifications`, ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const filter = url.searchParams.get('filter') || 'all';
  
  return HttpResponse.json({
    notifications: generateMockNotifications(filter),
    hasMore: true,
    nextPage: parseInt(page) + 1
  });
})

// Mark as read
http.put(`${baseUrl}/notifications/:id/read`, ({ params }) => {
  return HttpResponse.json({ success: true });
})

// Mark all as read
http.put(`${baseUrl}/notifications/read-all`, () => {
  return HttpResponse.json({ success: true });
})
```

### 7. Create Push Notification Handler
**File:** `src/features/notifications/services/pushNotificationService.ts`

#### Steps:
1. Request permission
2. Register service worker
3. Subscribe to push service
4. Handle incoming push
5. Show browser notification
6. Click to navigate
7. Handle permission denied
8. Store preferences

### 8. Create Notification Preferences
**File:** `src/features/notifications/components/NotificationPreferences.tsx`

#### Steps:
1. Toggle for each type
2. Email notifications
3. Push notifications
4. Sound effects
5. Do not disturb mode
6. Quiet hours setting
7. Save preferences
8. Apply immediately

### 9. Create Real-time Updates Hook
**File:** `src/features/notifications/hooks/useRealtimeNotifications.ts`

#### Steps:
1. Simulate WebSocket connection
2. Receive new notifications
3. Update bell counter
4. Show toast notification
5. Play notification sound
6. Update notifications list
7. Handle reconnection
8. Clean up on unmount

#### Mock Real-time:
```typescript
// Simulate new notification every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    const newNotification = generateRandomNotification();
    addNotification(newNotification);
  }, 30000);
  
  return () => clearInterval(interval);
}, []);
```

### 10. Create Notification Toast
**File:** `src/features/notifications/components/NotificationToast.tsx`

#### Steps:
1. Show brief notification
2. Auto-dismiss after 5 seconds
3. Click to view details
4. Swipe to dismiss
5. Stack multiple toasts
6. Different styles per type
7. Include action buttons
8. Accessibility announcements

### 11. Create Notification Filters
**File:** `src/features/notifications/components/NotificationFilters.tsx`

#### Steps:
1. Filter tabs UI
2. All notifications
3. Mentions only
4. Likes only
5. Comments only
6. Follows only
7. Custom date range
8. Search notifications

### 12. Create Notification Badge
**File:** `src/features/notifications/components/NotificationBadge.tsx`

#### Steps:
1. Reusable badge component
2. Show count up to 99+
3. Different colors per type
4. Pulse animation for new
5. Hide when zero
6. Accessibility label
7. Scale on hover

## Notification Groups
**File:** `src/features/notifications/components/NotificationGroup.tsx`

#### Steps:
1. Group similar notifications
2. "X and Y liked your post"
3. Expand to see all
4. Collapse groups
5. Smart grouping logic
6. Time-based grouping
7. Action-based grouping

## Testing Checklist
- [ ] Receive new notification
- [ ] View notifications list
- [ ] Mark as read
- [ ] Mark all as read
- [ ] Filter by type
- [ ] Delete notification
- [ ] Click notification to navigate
- [ ] Badge count updates
- [ ] Toast notifications show
- [ ] Sound plays (if enabled)
- [ ] Preferences save
- [ ] Offline queue works
- [ ] Real-time updates work
- [ ] Pagination works
- [ ] Groups display correctly

## Dependencies
```json
{
  "sonner": "^1.x",
  "react-use-websocket": "^4.x",
  "date-fns": "^3.x",
  "howler": "^2.x"
}
```

## Notes for AI Implementation
- Keep notifications performant
- Batch notification updates
- Use virtual scrolling for long lists
- Cache notification data
- Implement proper cleanup
- Handle duplicate notifications
- Add retry logic for failed marks
- Consider notification priorities
- Implement notification queue
- Add analytics tracking
- Support notification actions
- Handle deep linking from notifications
- Consider battery optimization
- Add notification scheduling