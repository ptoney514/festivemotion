---
name: website-copy-review
description: Review microsite copy against festivemotion.com canonical content
user_invocable: true
---

# Website Copy Review

Compare the FestiveMotion microsite copy against the canonical content on festivemotion.com and flag discrepancies.

## Instructions

1. **Fetch canonical content** from festivemotion.com using WebFetch:
   - Homepage: https://festivemotion.com/
   - About/Company info from the homepage
   - Contact: https://festivemotion.com/contact/

2. **Scan the local microsite codebase** for all user-facing text:
   - `components/**/*.tsx` — UI components (especially footer, headers)
   - `app/**/*.tsx` — all pages
   - `lib/catalog-seed.ts` — product descriptions, notes, and copy
   - `lib/email.ts` — email templates

3. **Flag the following issues:**

   ### Brand Copy Mismatches
   - Company description doesn't match festivemotion.com
   - Warranty terms differ (canonical: "2-year warranty included")
   - Contact info differs (canonical: info@festivemotion.com, +1 402 253 1991, Omaha NE)
   - Mission statement doesn't match (canonical: "To create unforgettably haunting experiences through innovative animatronic technology that brings characters to life.")
   - Stats differ (canonical: "30+ Years Experience", "100% Unique Designs")

   ### Developer/Instruction Language
   Flag any occurrence of these terms in user-facing text:
   - "MVP"
   - "microsite"
   - "Apple-style"
   - "WooCommerce"
   - "Neon" (database reference)
   - "server-authoritative"
   - "rebuild"
   - "UX Reference"
   - "Current Site"

   ### Missing Content
   - Pages that exist on festivemotion.com but not on the microsite
   - Links that point to non-existent local pages

   ### Internal References
   - Links or text that shouldn't be customer-visible
   - Developer comments in JSX that render to the page

4. **Output a structured report** with:
   - File path and line number for each issue
   - Category (Brand Mismatch | Dev Language | Missing Content | Internal Reference)
   - Current text (snippet)
   - Suggested fix

**Note:** Products and prices are maintained separately in the microsite and should NOT be compared against festivemotion.com. Only compare brand copy, company info, and general content.
