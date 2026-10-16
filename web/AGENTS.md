# Twitter clone

The application should look similar and behave similarly to the regular twitter.
Services call the API on relative same-origin paths under `apiBase` (`/api`, `src/api/apiBase.ts`); rsbuild dev proxies `/api` to the api, nginx does it in docker compose. MSW mocks back the tests and `pnpm dev:mock`.

## Stack

- React 19
- TypeScript
- Tailwind
- Base UI

### General rules

- never create the index.ts aka barrel files
- use arrow functions for everything
- use the named exports for everything that doesn't need to be lazy loaded
- don't use the React.FC for components
- don't add comments
- for now we support just English language add translations to the `src/FEATURE_NAME/i18n/en.json`
- add any text as translation to corresponding module, e.g if you adding the translation to core add it to core module translations only

### Testing

- for integration tests use always pattern `**/*.browser.spec.ts|tsx`
- for unit test use always the pattern `**/*.unit.spec.ts`
- other names are not picked up by vitest
- `pnpm lint:fix` applies biome formatting and safe fixes
- Writing or fixing `*.browser.spec.tsx`: use the `web-browser-tests` skill.

### Tailwind

Styling with Tailwind v4 (`className`, `App.css` `@theme`): use the `tailwind-v4` skill.

### Base UI

Using `@base-ui/react` or building a `src/ui` wrapper: use the `base-ui` skill.

## Architecture

We aim for the `vertical slices` with as much anatomy as possible.

### UI

We will have the generic UI not connect with any domain concept in the `src/ui` each new element in there should have its own folder.

Basically we will wrap the `@base-ui/react` in our component wrappers with the tailwind classes to create pseudo design-system like library. Later on it can be extracted to the package depending on the team sizes etc

- each component should be encapsulated and independent
- limit the amount of the props to max 10 to keep API clean (use compound components or simply composition instead)
- for any icons always use the heroicons https://heroicons.com/ we have already their package installed `@heroicons/react`
- **CRUCIAL** do not add className prop to any component
