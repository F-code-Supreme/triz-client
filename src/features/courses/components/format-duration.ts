export function formatDuration(minutes?: number | null): string {
  if (minutes == null) return '0 phút';
  const mins = Math.max(0, Math.floor(Number(minutes) || 0));

  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const rem = mins % 60;
    if (rem === 0) return `${hours} giờ`;
    return `${hours} giờ ${rem} phút`;
  }

  return `${mins} phút`;
}

export default formatDuration;
