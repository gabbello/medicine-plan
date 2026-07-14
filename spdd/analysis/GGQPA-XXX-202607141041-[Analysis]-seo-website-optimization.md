# SPDD Analysis: SEO Website Optimization

## Original Business Requirement

````markdown
# Story Decomposition: SEO Website Optimization

## Source Requirement

SEO Implementation Strategy

Scope
Research and develop comprehensive content that clearly describes the tool's purpose, then architect the website's technical infrastructure for SEO optimization with the following requirements:

Key SEO Considerations

1. SPA Optimization
- Implement static pre-rendering for the homepage to ensure search engine crawlability
- Generate static HTML snapshots for critical landing pages
- Implement proper structured data markup (Schema.org) for crawlability
- Consider that all traffic will land on index page, there is no backend so basically no shared plan will be indexed

2. Open Graph (OG) Meta Tags
- Ensure all OG tags are properly populated:
  - og:title - Page title
  - og:description - Compelling page description
  - og:image - High-quality preview image (1200x630px recommended)
  - og:url - Canonical URL
  - og:type - Content type (website, article, etc.)
  - og:site_name - Brand name

3. Meta Tags and HTML Head Optimization
- Fill all essential meta tags:
  - meta description - Under 160 characters for search results
  - meta robots - Crawl and index directives
  - meta viewport - Mobile responsiveness
  - meta charset - UTF-8 encoding
  - Canonical URLs to prevent duplicate content issues

4. Additional SEO Requirements
- Implement robots.txt with proper crawl directives
- Ensure fast page load times (Core Web Vitals optimization)
- Mobile-first responsive design
- Semantic HTML structure with proper heading hierarchy
- Alt text for all images
- JSON-LD structured data for rich snippets

## INVEST Analysis

### Abstract Task: SEO Website Optimization

Analysis Dimensions:
- Core Responsibility: Make the public website discoverable and understandable to search engines and social platforms while accurately representing a single-page tool whose primary entry point is the homepage.
- Primary Operations: Publish complete metadata, provide share previews, expose crawl directives, provide machine-readable structured data, and ensure crawlable and mobile-friendly page delivery.
- Key Constraints: No backend rendering, all meaningful traffic lands on the homepage, shared plan URLs are not intended for indexing, and SEO signals must remain consistent across search and social channels.
- Technical Complexity: Medium - requires coordination of metadata, crawlability strategy, and static delivery behavior for a SPA.
- Business Complexity: Medium - content must be clear for users and search engines, with measurable quality expectations for mobile and page speed.

### INVEST Evaluation
- Independent: Yes - SEO optimization can be delivered as user-visible discoverability and sharing improvements without requiring unrelated feature work.
- Negotiable: Yes - wording, page messaging, and which landing snapshots are prioritized can be adjusted with product stakeholders.
- Valuable: Yes - improves acquisition, share preview quality, and trust from users arriving through search and links.
- Estimable: Yes - scope is bounded to metadata, crawlability setup, and performance/mobile quality outcomes.
- Small: No - the full SEO requirement includes too many business outcomes for one 1-5 day story.
- Testable: Yes - outcomes can be validated with concrete metadata checks, crawl checks, and page quality checks.

Conclusion: Needs splitting.

### Split Strategy

Split by business capability:
- Story 1: Search and social discoverability signals for the primary page experience.
- Story 2: Crawlability, indexing control, and quality readiness for SPA delivery.

This split keeps each story within 1-5 days, with each delivering standalone value.

---

## [STORY-002-001] Search and Social Metadata Foundation API Development

### Background
The website needs to communicate its purpose clearly when shown in search results and when links are shared in social or messaging platforms. Today, incomplete or inconsistent metadata can lead to poor snippets, reduced click-through confidence, and unclear understanding of what the tool does.

This story establishes complete and consistent metadata for the public homepage experience so users see a clear title, description, and preview when discovering or sharing the site.

### Business Value
- Provide clear search snippets for prospective users evaluating whether the tool is relevant.
- Improve link sharing quality by showing consistent social preview cards.
- Ensure brand and product messaging are represented consistently across search and social surfaces.

### Dependencies and Assumptions
- Prerequisites: Public homepage content exists and the product value proposition text is approved.
- Data assumptions: Brand name, canonical public URL, and preview image asset are available.
- Integration points: Search engines and social platforms that parse page metadata and OG tags.
- Business constraints: Metadata must represent homepage intent only; individual shared plan states are not index targets.

### Scope In
- Complete essential head metadata for the homepage including description, robots directive, viewport, charset, and canonical URL.
- Complete Open Graph metadata including title, description, image, URL, type, and site name.
- Ensure semantic heading hierarchy and image alternative text are present on key visible homepage content.

### Scope Out
- Search ranking strategy, keyword campaigns, or off-site backlink activities.
- Multi-language metadata and localization variants.
- Indexing of user-generated or shared plan URLs.

### Acceptance Criteria

#### AC1: Homepage Search Snippet Shows Clear Product Purpose
Given the public homepage is available at https://med-plan.uk
When a search crawler reads homepage metadata
Then the page provides a title and a meta description that clearly explain the medicine planning purpose
And the description text length is 160 characters or fewer

#### AC2: Canonical and Robots Signals Are Present for Homepage
Given the homepage URL is https://med-plan.uk
When SEO metadata is inspected
Then the canonical signal identifies https://med-plan.uk as the primary URL
And robots instructions allow crawling and indexing of this homepage

#### AC3: Social Share Preview Is Fully Populated
Given a user shares the homepage link in a platform that supports Open Graph previews
When the platform reads OG metadata
Then the preview includes title, description, site name, page URL, type set as website, and an image sized for social preview expectations
And the preview image target uses a 1200 by 630 layout asset

#### AC4: Semantic Content Structure Is Understandable
Given the homepage content is rendered on mobile or desktop
When content structure is reviewed from a user and crawler perspective
Then the page has one clear primary heading describing the page purpose
And supporting sections follow a logical heading hierarchy

#### AC5: Informative Alternative Text Is Available for Meaningful Images
Given the homepage contains meaningful images such as product illustrations or share previews
When a user relies on assistive technologies or an image fails to load
Then each meaningful image provides alternative text that communicates the image intent in plain language

#### AC6: Shared Plan URLs Are Not Treated as Index Targets
Given the product supports share links that encode plan data in the URL
When SEO signals are defined for discoverability
Then only the public homepage is positioned as the index target
And shared plan URL states are not positioned as independently indexable landing pages

#### Non-Functional Expectations
- Metadata values must remain consistent with visible homepage messaging to avoid misleading snippets.
- Preview rendering quality must be stable across at least two major social or messaging link preview consumers.

### Quality Check

Structure and Completeness:
- Pass: Includes all required sections and business-focused ACs.
- Pass: ACs include happy path, validation/constraints, and index-target boundaries.

Business Clarity:
- Pass: Value is explicit for discovery and sharing audiences.
- Pass: Scope boundaries avoid overlap with crawl infrastructure work.

Sizing and Independence:
- Pass: Three core points only, independently shippable in 2-4 days.

---

## [STORY-002-002] SPA Crawlability and SEO Readiness API Development

### Background
Because the product is a single-page application without backend rendering, search engines need reliable crawlable output and explicit crawl directives. The business also needs the site to load quickly on mobile devices so discovery traffic does not drop due to slow first impressions.

This story defines crawlability, indexing control, structured data readiness, and page quality expectations for the homepage-first traffic model.

### Business Value
- Ensure search engines can crawl and interpret homepage content reliably in an SPA context.
- Provide explicit crawl control through robots directives to reduce indexing ambiguity.
- Improve user confidence and retention from search by meeting mobile and speed expectations.

### Dependencies and Assumptions
- Prerequisites: Homepage content and metadata baseline are available.
- Data assumptions: Public production URL and site sections intended as entry points are known.
- Integration points: Search engine crawlers, robots.txt processing, and structured data consumers.
- Business constraints: No backend; homepage is the primary acquisition page; SEO setup must not imply indexing of private/shared plan states.

### Scope In
- Provide static pre-rendered homepage output for crawler-friendly discovery.
- Provide static HTML snapshots for critical landing experiences that support homepage discovery context.
- Publish structured data markup aligned to homepage purpose.
- Publish robots.txt crawl directives aligned to index goals.
- Define and verify mobile-first responsiveness and practical Core Web Vitals readiness targets.

### Scope Out
- Backend-rendered SSR implementation.
- Index strategy for authenticated or user-private content.
- Advanced SEO experimentation such as A/B testing for snippets.

### Acceptance Criteria

#### AC1: Homepage Is Crawlable Without Client-Side Interaction
Given a search crawler requests the homepage URL
When the crawler reads the initial HTML response
Then the response contains meaningful homepage content describing the tool purpose without requiring user interaction to reveal core content

#### AC2: Critical Landing Snapshots Are Available
Given the business identifies up to 3 critical landing experiences for discovery messaging
When static HTML snapshot outputs are generated for those experiences
Then each snapshot contains meaningful, crawlable content aligned with its intended discovery message

#### AC3: Structured Data Represents the Homepage Experience
Given the homepage is intended to be the primary discoverable page
When structured data is validated
Then machine-readable fields describe the site as a website experience with consistent name, URL, and description values matching visible content

#### AC4: Robots Directives Match Crawl Intent
Given robots directives are published
When a crawler checks robots.txt
Then crawl rules clearly allow discovery of public homepage content
And rules do not encourage indexing of non-public or share-state URL patterns

#### AC5: Mobile-First Layout Is Usable at Common Viewports
Given a user visits from mobile viewports of 360 by 640 and 390 by 844
When key homepage sections load
Then primary actions and explanatory content are visible and usable without horizontal scrolling

#### AC6: Core Web Vitals Readiness Meets Business Targets
Given the homepage is loaded on a standard mid-range mobile connection profile
When page quality is assessed in a production-like environment
Then Largest Contentful Paint is at or below 2.5 seconds
And Cumulative Layout Shift is at or below 0.1
And Interaction to Next Paint is at or below 200 milliseconds

#### AC7: Crawlability Failure Is Communicated During Validation
Given a release candidate where prerender output or robots directives are missing
When SEO validation is performed before release
Then the release is flagged as not ready for discovery traffic until missing crawlability requirements are restored

#### Non-Functional Expectations
- SEO readiness checks should be repeatable before each release.
- Crawl and structured-data signals should remain stable across redeployments unless intentionally changed.

### Quality Check

Structure and Completeness:
- Pass: Includes all required sections and testable Given-When-Then ACs.
- Pass: Covers happy path, business constraints, and error readiness.

Business Clarity:
- Pass: Clear value for acquisition traffic and crawler reliability.
- Pass: Scope excludes broader ranking and growth experiments.

Sizing and Independence:
- Pass: Three core points only, independently deliverable in 3-5 days.

## Final INVEST Re-Validation

For STORY-002-001:
- Independent: Yes
- Complete: Yes
- Valuable: Yes
- Estimable: Yes
- Right-sized: Yes, 2-4 days
- Testable: Yes

For STORY-002-002:
- Independent: Yes
- Complete: Yes
- Valuable: Yes
- Estimable: Yes
- Right-sized: Yes, 3-5 days
- Testable: Yes
````

## Domain Concept Identification

### Existing Concepts (from codebase)
- Public Homepage: A single static entry page in `index.html` with clear product copy, one primary `h1`, and user-facing onboarding flow; it is already the natural discovery target.
- Static SPA Delivery: The product is a static, no-backend PWA served from one HTML entry point with client-side JavaScript and CSS, which constrains SEO strategy to static hosting patterns.
- PWA Metadata Baseline: Existing manifest linkage, theme metadata, charset, viewport, and Apple web-app metadata establish a basic head-configuration foundation.
- Share-State URL Pattern: The app uses a `plan` query parameter for shared snapshots, and this URL shape is already a business concern for index targeting boundaries.
- Service Worker Caching Layer: `sw.js` caches core assets and provides offline fallback behavior, affecting crawl diagnostics and performance consistency.
- Local-Only Data Model: Plan data stays in browser storage with no backend, reinforcing that homepage-level SEO (not user plan indexing) is the valid acquisition surface.

### New Concepts Required
- SEO Metadata Contract: A defined, consistent set of homepage title/description/canonical/robots and OG fields tied to the production domain `https://med-plan.uk`.
- Social Preview Asset Policy: A dedicated, stable Open Graph preview image and content rules so shared links render consistently.
- Indexing Boundary Policy: Explicit rule that homepage is indexable while share-state URLs are not treated as independent landing pages.
- Crawler-Readable Structured Data: Homepage-level JSON-LD describing the website in a way aligned with visible content.
- Crawl Directive Artifact: A `robots.txt` policy aligned with homepage-first indexing and non-public/share-state URL intent.
- SEO Readiness Gate: Repeatable pre-release checks for metadata completeness, crawlability, and mobile/Core Web Vitals readiness.

### Key Business Rules
- Homepage Primacy Rule: The primary discoverable and canonical entry point is `https://med-plan.uk`.
- No Shared-Plan Index Rule: URLs carrying encoded plan state are not business targets for search indexing.
- Consistency Rule: Search snippets, OG previews, and visible homepage messaging must represent the same product promise.
- Crawlability Rule: Search crawlers must be able to read meaningful homepage content from initial page delivery.
- Semantic Clarity Rule: Homepage structure must retain clear heading hierarchy and meaningful image alt text.
- Quality Threshold Rule: Mobile usability and practical Core Web Vitals targets are part of release readiness, not optional polish.

## Strategic Approach

### Solution Direction
- Use a static-first SEO strategy centered on `index.html` as the authoritative homepage document, because the current architecture is a single-page static PWA with no backend rendering.
- Consolidate all search and social metadata in the homepage head configuration and align canonical/OG URL signals to `https://med-plan.uk`.
- Introduce explicit crawl and indexing control artifacts (`robots.txt`) and homepage-level structured data so crawlers can interpret purpose without relying on runtime interactions.
- Treat SEO for this requirement as homepage acquisition optimization, while preserving share-link functionality as a user workflow that should not become a search landing strategy.
- Add an operational readiness layer (metadata validation + mobile/performance checks) to keep SEO behavior stable across deployments.

### Key Design Decisions
- Canonical Targeting Decision: Canonicalize to `https://med-plan.uk` as the single primary URL. Trade-off: strict canonical consistency reduces duplicate-surface ambiguity but requires disciplined environment handling for preview links. Recommendation: canonical production domain in release builds/content.
- Homepage-Only Indexing Decision: Focus indexing signals on homepage rather than share-state URLs. Trade-off: fewer indexable variants but stronger intent clarity and less risk of exposing encoded user-state pages. Recommendation: keep homepage as sole intentional index target.
- Static Crawlability Decision: Rely on meaningful initial HTML for key homepage messaging instead of client-only rendering for discovery content. Trade-off: requires content discipline in static markup but improves crawler reliability for SPA contexts. Recommendation: preserve and strengthen static content-first homepage.
- Structured Data Scope Decision: Apply website-level JSON-LD for homepage purpose, not per-share-link entities. Trade-off: less granular rich-result experimentation but aligns with actual public information architecture. Recommendation: homepage website schema aligned to visible copy.
- Quality-Gate Decision: Treat Core Web Vitals/mobile checks as release criteria. Trade-off: introduces deployment checks overhead but reduces SEO regressions and user drop-off risk. Recommendation: adopt repeatable pre-release SEO checks.

### Alternatives Considered
- Dynamic SSR/Backend Rendering: Rejected because current product constraints explicitly avoid backend infrastructure.
- Multi-page SEO Expansion Immediately: Rejected for now because the product’s business flow is homepage-first and currently lacks meaningful public route taxonomy.
- Indexing Share URLs as Landing Pages: Rejected due to privacy/intent concerns and the explicit business statement that shared plans are not intended for indexing.
- Social-Only Optimization Without Search Metadata: Rejected because requirement scope includes both search and OG discoverability.

## Risk & Gap Analysis

### Requirement Ambiguities
- Critical Landing Pages Ambiguity: Requirement asks for static snapshots for critical landing pages, but current product is single-entry SPA; unclear whether new public routes are expected or snapshot references are conceptual only.
- Robots Policy Granularity Ambiguity: Requirement requests proper crawl directives but does not specify exact treatment for query-parameter URLs versus path-based exclusions.
- Structured Data Type Ambiguity: Requirement asks for JSON-LD rich snippets but does not explicitly prioritize schema types beyond website-level intent.
- OG Image Ownership Ambiguity: Requirement mandates high-quality preview image sizing but does not define source-of-truth asset lifecycle, branding approvals, or fallback handling.
- Performance Measurement Context Ambiguity: Core Web Vitals targets are listed in story ACs, but environment/profile definition for pass/fail remains high-level.

### Edge Cases
- Share Parameter Crawling: Search bots may still discover `?plan=` URLs through referrals; canonical and robots policy must avoid accidental indexing expectations.
- Preview Environment Canonical Drift: Staging/preview deployments can accidentally emit non-production canonical or OG URLs.
- Social Cache Staleness: Platforms cache OG metadata aggressively, causing temporary mismatch after updates.
- Missing Preview Asset Variant: OG image may exist but fail dimension/content expectations for some consumers.
- Service Worker Cache Inertia: Cached HTML/head values can delay visible metadata updates for returning users and diagnostics.
- Mobile Layout Regression Risk: Copy or hero changes can introduce overflow/hierarchy regressions at common viewport sizes.

### Technical Risks
- SEO Signal Fragmentation Risk: Inconsistent canonical, OG URL, and visible domain references reduce trust and ranking clarity. Mitigation direction: enforce single-domain metadata contract around `https://med-plan.uk`.
- Crawl Directive Misconfiguration Risk: Incorrect robots rules can block homepage discovery or permit unintended URL-state indexing. Mitigation direction: explicit, reviewable robots policy with release checks.
- Structured Data Drift Risk: JSON-LD content can diverge from visible page messaging over time. Mitigation direction: keep schema fields aligned with homepage copy governance.
- Performance Regression Risk: Additional metadata/media assets can hurt mobile load quality if unmanaged. Mitigation direction: include CWV-oriented validation in release readiness.
- Operational Consistency Risk: Without repeatable SEO checks, updates may silently remove tags or break heading semantics. Mitigation direction: lightweight SEO validation checklist per deployment.

### Acceptance Criteria Coverage
| AC# | Description | Addressable? | Gaps/Notes |
|-----|-------------|--------------|------------|
| STORY-002-001 AC1 | Homepage search snippet shows clear product purpose | Yes | Current homepage already has purpose text; requires formal meta description/title governance tied to production domain. |
| STORY-002-001 AC2 | Canonical and robots signals are present for homepage | Yes | Canonical and robots signals are not fully established yet; requires explicit head policy and crawl directive artifact alignment. |
| STORY-002-001 AC3 | Social share preview is fully populated | Yes | OG fields and a production-grade preview image policy are required to close current baseline gaps. |
| STORY-002-001 AC4 | Semantic content structure is understandable | Yes | Existing single `h1` baseline is present; must preserve hierarchy as content evolves. |
| STORY-002-001 AC5 | Informative alternative text is available for meaningful images | Partial | Current homepage uses emoji and no content images in hero; requirement is addressable but depends on what meaningful images are introduced. |
| STORY-002-001 AC6 | Shared plan URLs are not treated as index targets | Yes | Existing `?plan=` share-state pattern is known; needs explicit indexing boundary policy and implementation checks. |
| STORY-002-002 AC1 | Homepage is crawlable without client-side interaction | Yes | Static HTML homepage is already suitable in principle; must retain meaningful initial content in release state. |
| STORY-002-002 AC2 | Critical landing snapshots are available | Partial | Product currently has single entry page; needs clarification on whether additional public landing snapshots/routes are required. |
| STORY-002-002 AC3 | Structured data represents the homepage experience | Yes | No current JSON-LD baseline detected; straightforward to add at homepage level once schema scope is confirmed. |
| STORY-002-002 AC4 | Robots directives match crawl intent | Yes | No `robots.txt` found in workspace; requirement is clear but policy details need explicit definition. |
| STORY-002-002 AC5 | Mobile-first layout is usable at common viewports | Yes | Existing mobile-oriented UI supports this direction; requires validation against specified viewport examples. |
| STORY-002-002 AC6 | Core Web Vitals readiness meets targets | Partial | Achievable, but pass/fail depends on measurement conditions and deployment assets not fully specified in requirement. |
| STORY-002-002 AC7 | Crawlability failure is communicated during validation | Partial | Requires agreed operational validation workflow/checkpoint; not currently documented as a release gate. |
