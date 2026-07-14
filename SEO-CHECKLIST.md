# SEO Readiness Checklist

Use this checklist before each deployment.

## Production Domain Rule
- Canonical and Open Graph URL values must target https://med-plan.uk/
- Do not ship preview or staging hostnames in metadata.

## Metadata Contract
- `title` is present and reflects homepage value proposition.
- `meta name="description"` is present and <= 160 characters.
- `meta name="robots"` is present for crawl/index behavior.
- `link rel="canonical"` is present and points to https://med-plan.uk/

## Open Graph Contract
- `og:title` is present.
- `og:description` is present.
- `og:image` is present and publicly reachable.
- `og:url` is present and equals https://med-plan.uk/
- `og:type` is set to `website`.
- `og:site_name` is present.
- Social preview image target is 1200x630.

## Structured Data Contract
- One `application/ld+json` block exists in homepage head.
- Uses `@context` = `https://schema.org`.
- Uses `@type` = `WebSite`.
- Includes `name`, `url`, `description`, and `inLanguage`.
- Structured data values match visible homepage messaging.

## Crawl Policy Contract
- `robots.txt` exists at site root.
- Homepage crawling is allowed.
- Share-state query URLs are not promoted as index targets.

## Semantic and Mobile Checks
- Homepage has one clear primary `h1`.
- Heading structure remains logical.
- Informative images include meaningful alt text.
- Layout remains usable at 360x640 and 390x844 without horizontal scrolling.

## Core Web Vitals Readiness Targets
- LCP <= 2.5s
- CLS <= 0.1
- INP <= 200ms

## Regression Guard
- Re-run checks after copy edits, metadata edits, service worker updates, and asset path changes.
- If any contract item fails, treat release as SEO-not-ready until corrected.
