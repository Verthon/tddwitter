# 0001. Commit directly to main (trunk-based development)

- Date: 2026-10-17
- Status: Proposed

## 1. Circumstances

### Problem

Work stayed on branches and local commits for days, so CI did not run on it.

On 2026-10-17:

- A 2-day-old feature branch held 22 commits, including the full login feature.
- Local `main` held 11 more commits that were not pushed to `origin/main`.
- CI ran on none of these 33 commits.
- Integration bugs appeared only in manual QA: a non-executable `api/docker-entrypoint.sh`, bcrypt seed hashes after the move to Argon2id, and timeline response drift between api and web.

### Constraints

- Team knowledge: one developer. AI agents write most of the code, some of it in git worktrees.
- Current architecture: `.github/workflows/check.yml` runs `pnpm check` and a build on push to `main` and on pull requests. The tests stop at boundaries: api tests use in-memory repositories, web tests use MSW, and no end-to-end suite exists (`docs/tasks/test-architecture.md`).

## 2. Intention

### Quality attributes

- Integration frequency: every change reaches `origin/main` and CI quickly.
- Trunk health: `main` stays green, so it is always a safe base for the next change.

### Measure

- No commit stays off `origin/main` for more than 24 hours. This includes branch age and unpushed commits on local `main`.
- `main` is red less than 5% of the time. A red `main` is fixed before new work starts.

## 3. Decision

### Chosen

Commit directly to `main` and push at least once a day. CI runs on every push.

Agent worktree branches are the only exception:

- They start from `main`.
- They merge back into `main` on the same day.
- They are deleted after the merge.

No other feature, `wip` or integration branches.

**Why:** Direct commits give the shortest path from a change to a CI result. With one developer, no second person reviews a pull request, so a branch adds delay and no review. The MinimumCD sources accept direct commits to trunk when automated tests are strong. `docs/tasks/test-architecture.md` (F1–F3) is the plan to make the tests strong enough.

### Rejected alternatives

#### Short-lived branches with pull requests (MinimumCD Path 1)

**Why rejected:** With one developer, the pull request review is a self-review. It adds a delay to each change and gives no second reviewer. This lowers integration frequency and does not improve trunk health.

#### Long-lived feature branches (status quo)

**Why rejected:** CI did not run on 33 commits, and integration bugs appeared only in manual QA. This fails the integration frequency measure.

## 4. Consequences

### Positive

- Integration frequency: CI checks every change within one day.
- Trunk health: a red build is visible at once and blocks new work.

### Trade-offs

- Until F1–F3 in `docs/tasks/test-architecture.md` are done, a green `main` does not prove that the wired app works. Integration bugs can still reach `main`.
- No pull request record exists for changes. The commit message must explain why the change was made.
