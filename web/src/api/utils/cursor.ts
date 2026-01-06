export const encodeCursor = (timestamp: string): string => {
  return btoa(timestamp);
};

export const decodeCursor = (cursor: string): string => {
  try {
    return atob(cursor);
  } catch {
    return '';
  }
};

export const createCursor = (date: Date): string => {
  return encodeCursor(date.toISOString());
};