export const trimStrings = <T extends {}>(payload: T): T => {
  const trimmedPayload = { ...payload };

  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'string') {
      // @ts-ignore
      trimmedPayload[key] = value.trim();
    } else if (Array.isArray(value)) {
      // @ts-ignore
      trimmedPayload[key] = value.map((item) => {
        if (typeof item === 'string') return item.trim();
        if (typeof item === 'object') return trimStrings(item);
        return item;
      });
    } else if (typeof value === 'object') {
      // @ts-ignore
      trimmedPayload[key] = trimStrings(value);
    }
  }

  return trimmedPayload;
};
