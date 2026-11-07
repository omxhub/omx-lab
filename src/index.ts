import { page, type Locale } from "./page";

export const SITE = "https://lab.omxhub.com";

const HEADERS: Record<string, string> = {
  "cache-control": "public, max-age=300",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "permissions-policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "content-security-policy":
    "default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
};

function response(
  body: string | null,
  type: string,
  method: string,
  status = 200,
  extra: Record<string, string> = {},
): Response {
  return new Response(method === "HEAD" ? null : body, {
    status,
    headers: { ...HEADERS, "content-type": type, ...extra },
  });
}

const ALTERNATES = `<xhtml:link rel="alternate" hreflang="en" href="${SITE}/?lang=en"/><xhtml:link rel="alternate" hreflang="ar" href="${SITE}/?lang=ar"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`;
const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"><url><loc>${SITE}/</loc>${ALTERNATES}</url></urlset>`;

const LLMS_TXT = `# OMX Lab (lab.omxhub.com)
> Ideas Into Reality — Autonomous 3D, WebGL & Interactive Graphics Lab by OMX.

## Active Experiment
- EXP-001 (Day 01): Morphogenic Cobalt Singularity — Interactive real-time WebGL GLSL raymarched SDF shader featuring 4 harmonic modes (Cobalt Fold, Solar Pulse, Quantum Lattice, Singularity Vortex), real-time uniform controls, and Cinema Demo choreography.

## Ecosystem
- Parent Studio: https://omxhub.com
- OMX Lab: https://lab.omxhub.com
`;

function parseCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function prefersArabic(request: Request): boolean {
  const cookiePref = parseCookie(request.headers.get("cookie"), "omx_lang");
  if (cookiePref === "ar") return true;
  if (cookiePref === "en") return false;

  const acceptLang = request.headers.get("accept-language");
  if (!acceptLang) return false;

  const languages = acceptLang.split(",").map((entry) => {
    const [code, qPart] = entry.trim().split(";");
    let q = 1.0;
    if (qPart && qPart.trim().startsWith("q=")) {
      const parsed = parseFloat(qPart.trim().slice(2));
      if (!isNaN(parsed)) q = parsed;
    }
    return { code: code.trim().toLowerCase(), q };
  });

  let arQ = 0;
  let enQ = 0;
  for (const lang of languages) {
    if (lang.code === "ar" || lang.code.startsWith("ar-")) {
      if (lang.q > arQ) arQ = lang.q;
    } else if (lang.code === "en" || lang.code.startsWith("en-")) {
      if (lang.q > enQ) enQ = lang.q;
    }
  }

  return arQ > 0 && arQ >= enQ;
}

export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);
    const method = request.method;
    if (!["GET", "HEAD"].includes(method)) {
      return response(
        "Method not allowed",
        "text/plain; charset=utf-8",
        method,
        405,
        { allow: "GET, HEAD" },
      );
    }

    if (url.pathname === "/") {
      const langParam = url.searchParams.get("lang");
      const explicitEn = langParam === "en" || url.searchParams.has("en");
      const explicitAr = langParam === "ar" || url.searchParams.has("ar");
      const cookieLang = parseCookie(request.headers.get("cookie"), "omx_lang");

      let isArabic = false;
      if (explicitAr) {
        isArabic = true;
      } else if (explicitEn) {
        isArabic = false;
      } else if (cookieLang === "ar") {
        isArabic = true;
      } else if (cookieLang === "en") {
        isArabic = false;
      } else {
        isArabic = prefersArabic(request);
      }

      const locale: Locale = isArabic ? "ar" : "en";
      const extraHeaders: Record<string, string> = {
        vary: "Accept-Language, Cookie",
        "set-cookie": `omx_lang=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`,
      };

      return response(
        page(locale),
        "text/html; charset=utf-8",
        method,
        200,
        extraHeaders,
      );
    }

    if (url.pathname === "/ar" || url.pathname === "/ar/") {
      return response(null, "text/plain; charset=utf-8", method, 301, {
        location: SITE + "/",
        "set-cookie": "omx_lang=ar; Path=/; Max-Age=31536000; SameSite=Lax",
      });
    }

    if (url.pathname === "/robots.txt") {
      return response(
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
        "text/plain; charset=utf-8",
        method,
      );
    }

    if (url.pathname === "/sitemap.xml") {
      return response(SITEMAP, "application/xml; charset=utf-8", method);
    }

    if (url.pathname === "/llms.txt") {
      return response(LLMS_TXT, "text/plain; charset=utf-8", method);
    }

    return response(
      "Not found",
      "text/plain; charset=utf-8",
      method,
      404,
    );
  },
};
