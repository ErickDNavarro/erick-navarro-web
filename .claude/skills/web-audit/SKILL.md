---
name: web-audit
description: "Audit a multi-page HTML website for design errors, broken links, inconsistencies, accessibility issues, and code quality problems. Use this skill whenever the user says their site has 'errors', 'bugs', 'issues', 'looks broken', 'inconsistent', needs 'QA', 'review', or 'audit'. Also trigger when a site was built by multiple agents or in parallel and needs quality control. Runs automated checks via Python script and provides a prioritized fix list."
---

# Web Design Audit Skill

You're performing a comprehensive quality audit of a multi-page HTML website. The goal is to find every issue — from broken links to visual inconsistencies — and produce an actionable fix list ordered by severity.

## Audit Process

### Phase 1: Automated Scan

Run the audit script against the site directory:

```bash
python /path/to/web-audit/scripts/audit.py /path/to/site/
```

This checks:
- **Broken internal links** — hrefs pointing to files that don't exist
- **Missing assets** — CSS/JS files referenced but not found
- **Inconsistent navigation** — pages with different nav structures
- **Missing meta tags** — title, description, viewport
- **Accessibility basics** — missing alt tags, form labels, aria attributes
- **Duplicate IDs** — same ID used multiple times in a page
- **Unclosed tags** — HTML structure issues
- **CSS class references** — classes used in HTML but not defined in CSS
- **Mobile responsiveness signals** — missing viewport meta, fixed widths
- **Performance flags** — inline styles that should be in CSS, large inline scripts

### Phase 2: Manual Visual Inspection

After the automated scan, manually read each page and check:

1. **Design Consistency**
   - Same nav structure on every page (same links, same order, same classes)
   - Same footer structure on every page
   - Same color variables and font families
   - Consistent spacing/padding between sections
   - Same button styles and hover behaviors
   - WhatsApp float button present and identical on all pages

2. **Content Quality**
   - Placeholder text left in (Lorem ipsum, "TUNUMERO", "TODO", etc.)
   - Inconsistent capitalization or formatting
   - Broken Spanish characters (encoding issues)
   - Empty sections or missing content

3. **Interaction Bugs**
   - Links that point to wrong pages
   - Active nav state not set on current page
   - FAQ accordions without JS handlers
   - Forms without proper action/method
   - Buttons that don't do anything

4. **CSS/JS Dependencies**
   - Pages using classes not in shared CSS
   - Pages with inline styles that override shared CSS inconsistently
   - Missing GSAP or font imports
   - JS features that depend on elements not present in the page

5. **Responsive Issues**
   - Grids that don't collapse on mobile
   - Text too small or too large at breakpoints
   - Overflow-x issues
   - Touch targets too small (<44px)

### Phase 3: Cross-Page Consistency Check

Compare ALL pages against each other:

- Extract nav HTML from each page — they should be identical (except active class)
- Extract footer HTML from each page — should be identical
- Extract head imports from each page — same fonts, CSS, JS
- Check that all pages have particle canvas, cursor divs, noise overlay, scroll progress
- Verify WhatsApp button has same phone number everywhere

### Phase 4: Report

Generate a structured report with findings organized by severity:

**CRITICAL** — Page won't render or function (broken links, missing CSS/JS, crashes)
**HIGH** — Visible design bugs (wrong colors, broken layouts, missing sections)  
**MEDIUM** — Inconsistencies between pages (different nav, different footer)
**LOW** — Minor polish (spacing, hover states, small visual tweaks)

For each finding, include:
- File and line number
- What's wrong (specific)
- How to fix it (specific)

### Phase 5: Fix

After presenting the report, fix all issues systematically — start with CRITICAL, then HIGH, then MEDIUM, then LOW. Use Edit tool for targeted fixes. After fixing, re-run the audit script to verify.

## Key Patterns to Watch For

### Multi-Agent Build Issues
When pages are built by different agents in parallel, the most common problems are:
- **Different nav HTML** — each agent writes its own version
- **Inconsistent class names** — one uses `s-card`, another uses `card`, another uses `feature-card`
- **Different inline styles** — one agent adds page-specific CSS that duplicates or conflicts with shared CSS
- **Missing shared elements** — one agent forgets the particle canvas or cursor divs
- **Different WhatsApp links** — one has the real number, another still has TUNUMERO
- **Footer links mismatch** — different pages link to different sets of pages

### The "It Looks Fine to Me" Trap
Many issues only show up when you navigate BETWEEN pages. A page in isolation might look great, but jumping from page A to page B reveals:
- Nav links jump or shift position
- Footer height changes
- Background color slightly different
- Font rendering changes (different font imports)
- Particle canvas behavior differs
