// Formattazione in italiano di numeri e date mostrati nella dashboard
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('it-IT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: 'always',
  })
}

// "2025-10-15" -> "15 ott"
export function formatShortDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}
