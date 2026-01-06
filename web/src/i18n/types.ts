import type { JSX, ReactElement } from 'react';

// Extract variable names from a message string
type ExtractVariables<T extends string> =
  T extends `${string}{${infer Var}}${infer Rest}`
    ? Var extends `${infer VarName}, ${string}`
      ? VarName | ExtractVariables<Rest>
      : Var | ExtractVariables<Rest>
    : never;

// Extract tag names from a message string (e.g., <strong>)
type ExtractTags<T extends string> =
  T extends `${string}<${infer Tag}>${infer Rest}`
    ? Tag extends `/${string}`
      ? ExtractTags<Rest>
      : Tag | ExtractTags<Rest>
    : never;

// Convert tag names to React component props
type TagToComponent<T extends string> = T extends keyof JSX.IntrinsicElements
  ? (chunks: ReactElement | string) => ReactElement
  : never;

// Build values object type based on message content
export type MessageValues<T extends string> = (ExtractVariables<T> extends never
  ? {}
  : Record<ExtractVariables<T>, string | number>) &
  (ExtractTags<T> extends never
    ? {}
    : Record<ExtractTags<T>, TagToComponent<ExtractTags<T>>>);

// Type for messages that might contain rich text
export type MessageDescriptor<T extends string = string> = {
  id: T;
  defaultMessage?: string;
  description?: string;
};
