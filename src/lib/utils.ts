/**
 * Normalizes a social URL. If the user only entered a username,
 * it auto-prefixes the correct platform base URL.
 */
export function normalizeUrl(value: string, platform: 'github' | 'linkedin' | 'other'): string {
  if (!value) return ''
  
  // Already a full URL
  if (value.startsWith('http://') || value.startsWith('https://')) return value

  // Strip leading @ or / if the user accidentally added them
  const clean = value.replace(/^[@/]+/, '').trim()

  switch (platform) {
    case 'github':
      return `https://github.com/${clean}`
    case 'linkedin':
      return `https://linkedin.com/in/${clean}`
    default:
      return `https://${clean}`
  }
}
