---
name: ux-conversion
description: "UX/UI principles for conversion-focused landing pages. Use when auditing or building marketing sites, service landing pages, or any page whose primary goal is to convert visitors into leads/customers. Triggers include: 'conversion', 'UX review', 'landing page', 'my site doesn't convert', 'users leave without contacting', 'looks pretty but doesn't work', 'too long', 'too many effects', 'button hierarchy', 'CTA placement'. Codifies feedback from senior UI/UX designers and applies scanning-first, decision-first design."
---

# UX Conversion Skill

Codifies principles for landing pages that CONVERT, not just impress. Based on feedback from senior UI/UX designers about a real site that was "beautiful but didn't convert."

## The Fundamental Truth

**Users don't read — they scan.**

If a user doesn't find what they need within 5 seconds of landing, they leave. Pretty animations, 3D effects, and clever copy are worthless if the user can't find:
1. What you do
2. How it helps them
3. How to contact you

Beauty is table stakes. Conversion is the game.

## Principle 1: Button Hierarchy

**Primary CTA goes RIGHT, secondary LEFT.**

This is counterintuitive to reading direction, but correct because:
- Users scan left-to-right and DECIDE at the end of the scan
- Mobile thumbs rest on the right (for right-handed users, 85% of population)
- The right position is the "commitment point" of the layout
- Secondary on the left acts as "escape hatch" without competing

```html
<!-- WRONG: primary left -->
<div class="actions">
    <a class="btn btn-primary">Agenda consulta</a>
    <a class="btn btn-secondary">Ver servicios</a>
</div>

<!-- RIGHT: primary right -->
<div class="actions">
    <a class="btn btn-secondary">Ver servicios</a>
    <a class="btn btn-primary">Agenda consulta →</a>
</div>
```

**Secondary button contrast requirements:**
- Must be legible WITHOUT hover
- Border: at least rgba(255,255,255,0.25) on dark bg
- Text: pure white or very close (#eaeaea minimum)
- Background: slight fill (rgba(255,255,255,0.04)) to separate from bg
- NEVER a ghost button with 0.05 opacity border on dark — it's invisible

## Principle 2: Information Hierarchy on Home

The home page answers 3 questions in order:

1. **"What do you do?"** (Hero — first viewport)
2. **"Can you help me specifically?"** (Services + social proof — second viewport)
3. **"How do I contact you?"** (Contact — third viewport)

Everything else is secondary and belongs on internal pages. A home with 15 sections is a home with 0 focus.

**Target home length: 4-6 sections maximum.**

Recommended order:
1. Hero (who + what + primary CTA)
2. Services (scannable grid — not cards with effects)
3. Social proof (logos of clients + 1-2 key testimonials)
4. Differentiation / Why me (brief, bullet-style)
5. Final CTA with prominent contact info

Sections to CUT from home (move to internal pages):
- Long case studies → casos.html
- FAQ → contacto.html or dedicated page
- Long about me → sobre-mi.html
- Process steps → servicios.html
- Manifesto / philosophy → sobre-mi.html

## Principle 3: Effects Budget

**Every effect must justify its cognitive cost.**

Effects that DISTRACT from content should be removed from:
- Service/feature cards (users need to read them)
- Testimonial cards
- Pricing tables
- Contact forms

Effects that SUPPORT content can stay on:
- Hero section (it's decorative by nature)
- Dividers / section transitions
- CTA buttons (they INVITE interaction)
- Global ambient effects (particles, noise) — background only

**Rule**: if an effect competes with text for attention, it's hurting you. Text > Effect.

```css
/* WRONG: heavy effects on cards that need to be read */
.service-card {
    perspective: 800px;
    transform: rotateX(...) rotateY(...);
    background: conic-gradient(from var(--angle)...);
    /* light reflection, magnetic attraction, etc. */
}

/* RIGHT: subtle feedback only */
.service-card {
    transition: border-color 0.3s, transform 0.3s;
}
.service-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
}
```

## Principle 4: CTA Distribution

**One CTA per long section. Never force users to scroll back up.**

Minimum CTAs on a landing page:
- Hero (above the fold)
- After services section
- After social proof
- Final section (the "banner" CTA)

Plus always-visible:
- Sticky nav CTA button (top right)
- WhatsApp float (bottom right)
- Contact info in footer

**Rule of thumb**: if a user decides to contact you at ANY scroll position, they should see a CTA within 1 screen-height.

## Principle 5: Contact Prominence

Contact info is NOT decoration. It's the goal.

**Places contact must be visible:**
1. Nav (phone or "Contact" link, top-right)
2. Hero (email/whatsapp under CTAs, clearly visible)
3. Final CTA section (large, obvious — NOT muted gray)
4. Footer (complete contact block)
5. WhatsApp float (sticky, always accessible)

**Anti-pattern**: showing the email in tiny muted gray text. If the USER GOAL is to get in touch, the CONTACT has to scream, not whisper.

```html
<!-- WRONG: muted email under buttons -->
<p style="color: #444; font-size: 0.7rem; margin-top: 2rem;">
    ✉ erick@example.com
</p>

<!-- RIGHT: prominent, colored, clickable -->
<a href="mailto:erick@example.com" class="contact-prominent">
    <svg>...</svg>
    <span>erick@example.com</span>
</a>
```

Where `.contact-prominent` uses:
- Accent color or white (not muted)
- Same size as button text (0.9rem minimum)
- Clear clickable affordance (underline or button-like)
- Visible on first glance, not after zoom

## Principle 6: Scanning Patterns

Users scan in F-pattern or Z-pattern:
- **Hero/top sections**: Z-pattern (left→right, diagonal down, left→right)
- **Content sections**: F-pattern (top-heavy, then quick scroll)

Place what matters:
- **Top-left**: Logo/identity
- **Top-right**: Primary nav CTA (biggest conversion leverage on any page)
- **Center-first-fold**: Main value proposition + primary CTA
- **Bottom-right of fold**: Secondary commitment point

Don't put critical info:
- Below the fold without a signal to scroll
- In the exact center of empty space (users skip it)
- Only on hover (mobile users can't hover)

## Principle 7: Copy Density

If a user must read more than 2 sentences to understand a service, rewrite.

**Service card anatomy:**
- Title: 2-4 words
- Description: 1 sentence, max 15 words
- Tags: 3-5 keywords
- CTA: "Ver más" or similar

NOT:
- Title: "La revolución de la inteligencia artificial aplicada"
- 3 paragraphs explaining methodology
- Bullet list of 10 features

The card is an INDEX ENTRY. The full content lives on the service's dedicated page.

## Principle 8: Mobile-First Reality Check

Before shipping, view EVERY page on:
- iPhone SE (375px) — most restrictive
- iPhone 14 (390px) — most common
- iPad (768px) — tablet transition

Common mobile killers:
- Buttons that don't stack vertically
- Two-column grids that stay two-column
- Text too small (<0.85rem body)
- Touch targets <44px
- Horizontal scroll (overflow-x leaks)
- Custom cursor still active (disable on mobile)

## Audit Checklist

When reviewing a landing page, check:

- [ ] Primary CTA is on the RIGHT in every button pair
- [ ] Secondary button has readable contrast without hover
- [ ] Home has 6 or fewer sections
- [ ] Service cards don't have competing animations
- [ ] Email/phone visible in hero area (not just footer)
- [ ] CTA appears every 2-3 sections minimum
- [ ] Nav has a visible "Contact" CTA button
- [ ] Can you understand all services by scanning titles alone?
- [ ] Is there a clear visual hierarchy (size/weight/color)?
- [ ] Does the page work on iPhone SE without horizontal scroll?
- [ ] Is the total page height under 5 screen-heights?

If any answer is "no", fix it before launching.

## Common Anti-Patterns

1. **The "impressive but empty" hero**: Massive typography, complex animation, but no clear value prop.
2. **The card carnival**: 6 service cards, each with different effects, all screaming for attention.
3. **The buried CTA**: One CTA in the hero and one in the final section — nothing in between for a 10-screen page.
4. **The hidden contact**: Email in 0.7rem gray text below the fold.
5. **The button twins**: Two buttons of identical visual weight, so the user doesn't know which to click.
6. **The invisible secondary**: Ghost button with 5% opacity border on dark bg that disappears entirely.
7. **The animation tax**: Every section has a unique scroll animation, making the page feel slow and the content inaccessible until JS loads.

## Why This Matters

A beautiful site that doesn't convert is expensive decoration.
A plain site that converts is a revenue engine.

The goal is beautiful AND converting. That requires discipline in where you spend your visual budget, what information you prioritize, and how you guide the user to the goal.

**Never confuse showing off with helping the user decide.**
