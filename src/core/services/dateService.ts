export const createDateService = () => {
  const now = () => new Date();

  const toISOString = (date?: Date) => (date ?? now()).toISOString();

  const toDisplayFormat = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const toRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    return toDisplayFormat(timestamp);
  };

  const parse = (timestamp: string) => new Date(timestamp);

  return {
    now,
    toISOString,
    toDisplayFormat,
    toRelativeTime,
    parse,
  };
};

export const dateService = createDateService();
