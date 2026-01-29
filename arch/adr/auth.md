# Auth ADR

## Title

Traditional Username/Password Auth (Not ATProto)

## Context

### Use case

Learning backend fundamentals through a Bluesky-like app. Need authentication to protect routes and associate posts with users.

### Circumstances

Team: Solo frontend dev learning backend
Priority: Understanding > production readiness
Timeline: Learning project, no deadline pressure
Current state: Postgres + Hono setup complete, repository pattern established
Constraints: Must follow existing patterns (repo layer, TypeScript strict)

## Decided for: Traditional JWT-based auth

### Why

Industry-standard pattern, transferable knowledge to other projects
Simple request/response flow (no DID resolution, no PDS communication)
Can implement in 4-5 clear steps matching existing repo pattern
Hono has built-in JWT helpers (reduces custom crypto code)

## Rejected

### Magic link / passwordless

- hide password hashing concepts

### ATProto DID-based authentication

- no learning benefit at this stage
