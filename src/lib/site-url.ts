/**
 * The public address of the site, used for canonical/OG links, JSON-LD, robots and sitemap.
 * Set NEXT_PUBLIC_SITE_URL once a custom domain exists; on Vercel the production
 * *.vercel.app address is picked up automatically at build time.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

// a production build pointing its OG/canonical links at localhost would ship broken previews
if (process.env.VERCEL_ENV === "production" && siteUrl.includes("localhost")) {
  throw new Error("siteUrl resolved to localhost in a production build: set NEXT_PUBLIC_SITE_URL");
}
