interface ExponentialBackoffOptions {
  attemptIndex: number;
  baseDelay?: number;
  maxDelay?: number;
}

/**
 * Calculates exponential backoff delay for retry attempts
 * @param options - Configuration for backoff calculation
 * @param options.attemptIndex - The current retry attempt number (0-based)
 * @param options.baseDelay - Initial delay in milliseconds (default: 1000ms)
 * @param options.maxDelay - Maximum delay cap in milliseconds (default: 30000ms)
 * @returns Calculated delay in milliseconds
 */
export const calculateExponentialBackoff = ({
  attemptIndex,
  baseDelay = 1000,
  maxDelay = 30000
}: ExponentialBackoffOptions): number => {
  const exponentialDelay = baseDelay * (2 ** attemptIndex);
  return Math.min(exponentialDelay, maxDelay);
};