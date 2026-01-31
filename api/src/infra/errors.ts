type PostgresError = Error & {
  severity: string;
  code: string;
  position?: string;
  file?: string;
  line?: string;
  routine?: string;
}

export const isPostgresError = (error: unknown): error is PostgresError => {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof (error as any).code === 'string'
  );
};

export const isUniqueViolation = (error: unknown): boolean => {
  return isPostgresError(error) && error.code === '23505';
};