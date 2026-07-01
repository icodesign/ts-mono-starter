/** Cloudflare geolocation data attached to incoming requests (`request.cf`). */
export interface CloudflareGeolocation {
  timezone?: string | null;
  city?: string | null;
  country?: string | null;
  region?: string | null;
  regionCode?: string | null;
  colo?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}
