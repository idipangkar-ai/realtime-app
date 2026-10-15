export function formatMoney(value) {
  const amount = Number(value);
  return `\u20B9${(Number.isFinite(amount) ? amount : 0).toLocaleString(
    'en-IN',
    { maximumFractionDigits: 2 },
  )}`;
}

export function formatDate(value) {
  if (!value) return '';
  // Frappe datetime strings use the site's timezone; show them without guessing
  // a different device timezone for a timestamp that has no UTC offset.
  return String(value).slice(0, 16).replace('T', ' ');
}
