type CursorParts = {
  createdAt: number | undefined;
  publicId: string | undefined;
};

export const decodeCursorParts = (cursor: string | undefined): CursorParts => {
  if (cursor === undefined) {
    return { createdAt: undefined, publicId: undefined };
  }

  const separatorIndex = cursor.indexOf("_");
  if (separatorIndex === -1) {
    return { createdAt: undefined, publicId: undefined };
  }

  const createdAtRaw = cursor.slice(0, separatorIndex);
  const publicId = cursor.slice(separatorIndex + 1);

  const createdAt = Number.parseInt(createdAtRaw, 10);

  if (Number.isNaN(createdAt)) {
    return { createdAt: undefined, publicId: undefined };
  }

  return { createdAt, publicId };
};