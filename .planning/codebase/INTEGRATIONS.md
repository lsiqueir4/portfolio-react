# External Integrations

**Analysis Date:** 2026-07-06

## APIs & External Services

**Google Fonts:**
- Service: Google Fonts API for web font delivery
- What it's used for: Load Inter and custom fonts
- Integration point: `app/root.tsx` (lines 14-25)
- Resources:
  - `https://fonts.googleapis.com` (font definitions)
  - `https://fonts.gstatic.com` (font files)
  - Font: Inter (multiple weights and styles)

**Social & Communication Links:**
- WhatsApp - Redirect link only, no API integration
  - URL: `https://wa.me/5511956663035`
  - Used in: `app/features/Contacts/index.tsx`
  - Source: `app/constants/index.tsx`

- LinkedIn - Redirect link only, no API integration
  - URL: `https://www.linkedin.com/in/l-siqueiraa/`
  - Used in: `app/features/Contacts/index.tsx`
  - Source: `app/constants/index.tsx`

- GitHub - Link reference only (no integration)
  - URL: `https://github.com/lsiqueir4/`
  - Source: `app/constants/index.tsx`

## Data Storage

**Databases:**
- None - Static portfolio site with no backend database

**File Storage:**
- Google Drive (external, for CV download)
  - CV download link: `https://drive.google.com/uc?export=download&id=1e--yv8KrbVbT4D1aFwRdLmg4lYGYtm7i`
  - Used in: Contact section (`app/features/Contacts/`)
  - Source: `app/constants/index.tsx` (line 8-9)

**Static Assets:**
- Public directory: `public/` - Contains only `favicon.ico`
- No CDN integration detected

**Caching:**
- None configured

## Authentication & Identity

**Auth Provider:**
- None - No authentication system
- Type: Static portfolio (unauthenticated)

## Monitoring & Observability

**Error Tracking:**
- None configured

**Logs:**
- None configured
- Browser console only (standard React dev logging)

## CI/CD & Deployment

**Hosting:**
- Not specified in codebase
- Docker image provided for deployment
- Target: Container environments (Docker-ready multi-stage build in `Dockerfile`)

**CI Pipeline:**
- None detected
- No GitHub Actions, GitLab CI, or other CI files present

**Build Process:**
- Build: `npm run build` (React Router build)
- Serve: `npm run start` (react-router-serve)
- Docker build stages: 3-stage multi-stage build
  - Stage 1: Development dependencies installation
  - Stage 2: Production dependencies installation
  - Stage 3: Build stage
  - Final: Runtime with production dependencies and built artifacts

## Environment Configuration

**Required env vars:**
- None configured or used in the application

**Secrets location:**
- Not used
- `.env` file listed in `.gitignore` for future use but not currently implemented

**Development:**
- Local development uses defaults only
- No `.env.example` or environment template provided

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Third-Party Libraries Without External Integrations

**Icon Libraries:**
- `lucide-react` 1.17.0 - Phone, Mail, ExternalLink icons (bundled)
- `react-icons` 5.6.0 - Additional icon sets (bundled)

**Fonts:**
- `@fontsource/outfit` 5.2.8 - Self-hosted font files (bundled, not external API)

**Utilities:**
- `isbot` 5.1.36 - Bot detection (bundled, no external calls)

## Integration Points Summary

**What IS integrated:**
- Google Fonts API (for web font loading)
- Google Drive (for CV download link)
- Social media redirects (WhatsApp, LinkedIn) - redirect links only, no API calls

**What IS NOT integrated:**
- Email service (only `mailto:` link)
- Contact form or backend
- Analytics or monitoring
- Authentication
- Database
- Payment processing
- CMS or headless CMS
- Search
- Chat or messaging (WhatsApp link only)
- Third-party logging
- Feature flags or A/B testing

---

*Integration audit: 2026-07-06*
