# ADR-002: HTTP-Only Cookies for Token Storage

## Title

Store Access Tokens in HTTP-Only Cookies (Not localStorage)

## Context

### Use case

Secure token delivery from backend to browser without client-side JavaScript access. Tokens authenticate API requests.

### Circumstances

- Team: Solo dev learning production auth patterns
- Priority: Security best practices > convenience
- Current state: JWT token generation implemented, need delivery mechanism
- Constraints: Same-origin frontend/backend (no cross-domain complexity)

## Decided for: HTTP-Only Cookies

### Why

- XSS cannot read httpOnly flag, stolen scripts can't exfiltrate tokens
- Browser auto-attaches to requests, no manual header management in fetch()
- Hono JWT middleware supports `cookie` option natively
- SameSite=Strict prevents CSRF without additional tokens
- Matches refresh token pattern (already using httpOnly cookie)

**Reference**: OWASP recommends httpOnly cookies for session tokens to prevent XSS theft.

## Rejected

### localStorage + Authorization header

- Any XSS reads it trivially (`localStorage.getItem('token')`)
- Frontend must manually attach to every request
- Common pattern but weaker security

### sessionStorage

- Same XSS vulnerability as localStorage
- Lost on tab close (poor UX for long sessions)

## Consequences

### Positive

- Token theft requires server compromise, not client XSS
- Simpler frontend (no token management code)
- Consistent pattern (access + refresh both in cookies)

### Negative

- Mobile app support requires separate flow (Authorization header)
- Must validate SameSite support (all modern browsers)

## Future Considerations

When adding mobile: Support both cookie and Authorization header. Check `cookie` first, fallback to header. New ADR at that point.
