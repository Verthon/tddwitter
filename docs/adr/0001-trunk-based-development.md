# 0001. Merge to main through short-lived branches with pull requests (trunk-based development)

- Date: 2026-11-03
- Status: Proposed

## 1. Circumstances

### Problem

Work stayed on branches and local commits for days, so CI did not run on it.

On 2026-10-17:

- A 2-day-old feature branch held 22 commits, including the full login feature.
- Local `main` held 11 more commits that were not pushed to `origin/main`.
- CI ran on none of these 33 commits.
- Integration bugs appeared only in manual QA: a non-executable `api/docker-entrypoint.sh`, bcrypt seed hashes after the move to Argon2id, and timeline response drift between api and web.

Direct commits to `main` fixed the integration frequency, but two problems stayed:

- CI runs after the push, so a broken change reaches `main` before CI fails.
- AI agents write most of the code, and no independent check reviews it.

### Constraints

- Team knowledge: one developer. AI agents write most of the code, some of it in git worktrees.
- Budget and infrastructure: the automated PR reviewer must work on a free tier. The team has not chosen the tool yet.
- Current architecture: `.github/workflows/check.yml` runs `pnpm check` and a build on push to `main` and on pull requests. The tests stop at boundaries: api tests use in-memory repositories, web tests use MSW, and no end-to-end suite exists (`docs/tasks/test-architecture.md`).

## 2. Intention

### Quality attributes

- Integration frequency: every change reaches `origin/main` and CI quickly.
- Trunk health: `main` stays green, so it is always a safe base for the next change.

### Measure

- No commit stays off `origin/main` for more than 24 hours. This includes branch age and unpushed commits.
- `main` is red less than 5% of the time. A red `main` is fixed before new work starts.

## 3. Decision

### Chosen

Every change goes to `main` through a short-lived branch and a pull request:

- A branch starts from `main` and holds one slice of work that merges on the same day.
- A spec or task that takes more than one day is split into several branches.
- The `protect-main` ruleset requires the `check` and `install_build (web)` jobs to pass before merge. No direct pushes to `main`.
- An automated PR reviewer comments on each pull request. Its findings are advisory and do not block the merge.
- The branch is deleted after the merge.

Agent worktree branches follow the same rules.

**Why:** A required `Check` run stops a broken change before it reaches `main`, so trunk health improves. The automated reviewer gives an independent check of agent-written code. The 24-hour limit keeps integration frequency at the same level as direct commits. The MinimumCD sources accept short-lived branches with pull requests as a trunk-based path.

### Rejected alternatives

#### Direct commits to main

**Why rejected:** CI runs only after the push, so a broken change makes `main` red. No independent check reviews agent-written code. This fails the trunk health intention.

#### Automated reviewer as a required check

**Why rejected:** A false positive or a free-tier limit blocks the merge. This lowers integration frequency.

#### Long-lived feature branches

**Why rejected:** CI did not run on 33 commits, and integration bugs appeared only in manual QA. This fails the integration frequency measure.

## 4. Consequences

### Positive

- Trunk health: a change merges only after `Check` passes on it.
- Integration frequency: every change still reaches `main` within one day.

### Trade-offs

- Each change waits for a CI run before merge.
- Advisory findings can be ignored. The developer or agent decides what to fix.
- Until F1–F3 in `docs/tasks/test-architecture.md` are done, a green `Check` does not prove that the wired app works. Integration bugs can still reach `main`.
