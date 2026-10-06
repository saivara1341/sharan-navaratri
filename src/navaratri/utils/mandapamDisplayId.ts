/**
 * Returns the short public-facing Mandapam ID while the UUID remains the
 * internal identifier used by the database and all relationships.
 */
export const getMandapamDisplayId = (id: string): string => {
  const value = id.trim();
  if (/^mnp-\d{6}$/i.test(value)) return value.toLowerCase();

  // A stable FNV-1a hash keeps the same public code on every screen and visit.
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  const sixDigits = 100000 + ((hash >>> 0) % 900000);
  return `mnp-${sixDigits}`;
};
