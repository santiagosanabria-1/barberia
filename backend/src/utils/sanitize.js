export const cleanText = (value) => typeof value === 'string' ? value.trim().replace(/[<>]/g, '') : value;

export const sanitizeBody = (body) => Object.fromEntries(
  Object.entries(body || {}).map(([key, value]) => [key, cleanText(value)])
);
