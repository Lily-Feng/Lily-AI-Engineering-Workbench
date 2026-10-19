/**
 * Base-aware URL construction.
 *
 * The site is served from a subpath (`/Lily-AI-Engineering-Workbench/`) and
 * Astro does NOT rewrite root-absolute links. A hardcoded `/library/...` looks
 * correct in review and 404s in production. Links built in components go
 * through here; links in Markdown include the base and are checked by
 * starlight-links-validator.
 */

const BASE = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  return `${BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

/** Library page for a module or lesson (or the overview, when omitted), in the given locale. */
export function libraryUrl(page = '', locale?: string): string {
  return withBase(`${locale === 'zh' ? 'zh/' : ''}library/${page ? `${page}/` : ''}`);
}

const REPO = 'https://github.com/Lily-Feng/Lily-AI-Engineering-Workbench';

/** Link to a source file on GitHub, for "View source" affordances. */
export function sourceUrl(path: string): string {
  return `${REPO}/blob/main/${path.replace(/^\//, '')}`;
}

export const contactUrl = 'https://lily-feng.github.io/about';
export const blogUrl = 'https://lily-feng.github.io/blogs';
