export function getSiteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  if (!value) {
    return "http://localhost:3000"
  }

  return value.endsWith("/") ? value.slice(0, -1) : value
}
