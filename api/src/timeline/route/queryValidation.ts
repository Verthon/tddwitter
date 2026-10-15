import { z } from "zod";

const errors = {
  queryEmpty: { en: "Query cannot be empty" },
  cursorInvalid: { en: "Cursor must be a string or null" },
  cursorInvalidFormat: { en: "Invalid cursor format" },
  limitMax: { en: "Limit exceeds the maximum" },
  limitMin: { en: "Limit is less than minimal value" },
  limitNotANumber: { en: "Limit is not an number" },
  unknown: { en: "Invalid query" },
} as const;

const timelineQuerySchema = z
  .object({
    cursor: z.optional(
      z
        .string({ error: errors.cursorInvalid.en })
        .regex(/^\d+_.+$/, { error: errors.cursorInvalidFormat.en }),
    ),
    limit: z
      .string()
      .optional()
      .transform((val) => (val === undefined ? undefined : Number.parseInt(val, 10)))
      .pipe(
        z
          .number({ error: errors.limitNotANumber.en })
          .min(1, errors.limitMin.en)
          .max(100, errors.limitMax.en)
          .optional(),
      ),
  })
  .strict();

export const parseTimelineQuery = (userQuery: unknown) => {
  if (userQuery === undefined) {
    return { valid: false as const, reason: errors.queryEmpty.en };
  }

  const result = timelineQuerySchema.safeParse(userQuery);

  if (!result.success) {
    return {
      valid: false as const,
      reason: result.error.issues[0]?.message ?? errors.unknown.en,
    };
  }

  return { valid: true as const, data: result.data };
};
