export function generateUniqueId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
