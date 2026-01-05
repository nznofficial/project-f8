// utils/dates.mjs

export const TZ = "America/Los_Angeles";

// Convert "YYYY-MM-DD" → local midnight Date
export function localMidnight(dateLocal) {
  return new Date(`${dateLocal}T00:00:00-08:00`);
}

// Get Monday 00:00 local for a given date
export function mondayStartLocal(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // Sun=0, Mon=1...
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diffToMonday);
  return d;
}
