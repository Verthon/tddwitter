# Twitter clone

The application should look similar and behave similarly to the regular twitter
To move fast we skip the API instead we will use mocks with msw

## Stack

- React 19
- TypeScript
- Tailwind
- Base UI

### Tailwind

For any Tailwind related task please refer to the https://github.com/rgfx/tailwind-llms/blob/main/tailwind-llms.txt as we use the latest v4 version that you may not be aware of

### Base UI

This is relatively new library so please use always the https://base-ui.com/llms.txt or directly latest docs https://base-ui.com/react/overview/quick-start

## Architecture

We aim for the `vertical slices` with as much anatomy as possible.

### UI

We will have the generic UI not connect with any domain concept in the `src/ui` each new element in there should have its own folder.

Basically we will wrap the `@base-ui-components/react` in our component wrappers with the tailwind classes to create pseudo design-system like library. Later on it can be extracted to the package depending on the team sizes etc

- each component should be encapsulated and independent
- limit the amount of the props to max 10 to keep API clean