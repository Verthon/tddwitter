# Goal

- A Bluesky/Twitter-like full-stack app, built test-first. A frontend developer learning backend fundamentals: understanding beats production readiness (see `arch/adr/auth.md`).
- A repo that agents can work in cheaply: rules defended by `pnpm check`, features delivered spec-first against locked acceptance tests.

## MVP

The smallest product where a user achieves something meaningful: sign up, post, and read what others posted. Delivered in this order, each as a spec on the real API (no MSW in production paths):

1. Register (exists in api; web on the real API)
2. Login, logout, `/me` (JWT in httpOnly cookies)
3. Create post (logged-in only)
4. Chronological global timeline (everyone's posts)
5. Likes

Out until after the MVP: follow, profiles, post details, comments, reposts, quotes, notifications, Following/Discover split.
