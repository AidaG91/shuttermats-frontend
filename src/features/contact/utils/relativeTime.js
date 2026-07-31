const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Formato corto tipo "hace 2 min", "hace 1 h", "Ayer", "hace 3 días",
// para las vistas de inbox donde no cabe una fecha completa.
export function formatRelativeTime(dateInput) {
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();

  if (diffMs < MINUTE) return "Ahora mismo";
  if (diffMs < HOUR) return `hace ${Math.floor(diffMs / MINUTE)} min`;
  if (diffMs < DAY) return `hace ${Math.floor(diffMs / HOUR)} h`;

  const diffDays = Math.floor(diffMs / DAY);
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `hace ${diffDays} días`;

  return date.toLocaleDateString("es-ES");
}
