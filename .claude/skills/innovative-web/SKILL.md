---
name: innovative-web
description: "Create visually stunning, truly innovative single-file HTML websites that feel like experiences, not pages. Use this skill whenever the user asks for an impressive, creative, innovative, impactful, or cutting-edge website, landing page, portfolio, or web experience. Also trigger when the user says a website looks 'flat', 'boring', 'generic', or 'not innovative enough'. This skill bundles advanced techniques: WebGL shaders, particle systems, GSAP-level animations, 3D CSS transforms, canvas effects, kinetic typography, and interactive micro-interactions — all in a single HTML file with no external dependencies beyond CDN libraries."
---

# Innovative Web Skill

You're building websites that make people stop scrolling and say "how did they do that?" This isn't about adding more CSS transitions — it's about creating genuine visual experiences that demonstrate technical mastery.

## Core Philosophy

The difference between a "nice website" and an "innovative website" is **interactivity and depth**. A flat site shows information. An innovative site makes you *feel* the information. Every section should have at least one element that surprises the visitor.

### What Makes a Website Feel Flat (Avoid These)
- Scroll reveal animations (fadeIn, slideUp) as the only motion — every template site does this
- Static gradient backgrounds — they look like a Figma mockup, not a live experience  
- Cards with hover shadows as the only interaction
- Linear layouts with no visual tension or asymmetry
- Stock-looking hero sections with centered text and a button

### What Makes a Website Feel Innovative (Do These)
- **Canvas/WebGL backgrounds** that respond to mouse movement or scroll position
- **Particle systems** that flow, connect, or react to user input
- **3D transforms** with real perspective and parallax depth layers
- **Text effects** — scramble, glitch, morphing, character-by-character reveals with stagger
- **Magnetic elements** that attract toward the cursor on hover
- **Scroll-driven transformations** — elements that morph, scale, rotate, or recolor based on scroll progress
- **Fluid/organic shapes** — animated blobs, aurora effects, mesh gradients that breathe
- **Interactive data visualizations** — flowing connections, animated metrics, live-feeling dashboards
- **Sound-responsive or physics-based** interactions
- **Custom cursor effects** — not just a glow circle, but context-aware cursor transformations

## Technical Stack (Single-File HTML)

Everything goes in one `.html` file. Use inline `<style>` and `<script>` blocks. For heavy libraries, use CDN imports:

```html
<!-- GSAP for professional animations -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- Three.js for 3D/WebGL -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- For lightweight particle effects without Three.js -->
<!-- Use vanilla Canvas API — it's more than enough -->
```

### When to Use What

| Effect | Technology | Performance Cost |
|--------|-----------|-----------------|
| Particle backgrounds | Canvas 2D API | Low |
| 3D scenes, shaders | Three.js | Medium-High |
| Scroll animations | GSAP + ScrollTrigger | Low |
| Text effects | GSAP + SplitText (or manual char splitting) | Low |
| Magnetic buttons | Vanilla JS mousemove | Negligible |
| Blob/aurora shapes | CSS animations + filters | Low-Medium |
| Noise textures | SVG feTurbulence | Negligible |

## Section-by-Section Innovation Playbook

### Hero Section — The First 3 Seconds Matter

The hero must create an immediate "wow" moment. Combine at least 2 of these:

1. **Animated canvas/particle background** — Not random dots. Connected nodes (neural network feel), flowing particles (data stream feel), or geometric patterns that respond to mouse position.

2. **Kinetic typography** — The headline should animate in with character-level stagger, scramble effect (cycling through random characters before landing on the real ones), or a split-reveal where each word slides in from different directions.

3. **Parallax depth** — At minimum 3 visual layers that move at different speeds on mousemove or scroll. Creates a sense of physical space.

4. **Interactive element** — Something the user can play with. A 3D object that rotates with mouse, particles that repel from cursor, text that distorts near the mouse.

Example hero pattern:
```
[Canvas particle network background — responds to mouse]
[Layered parallax elements at different z-depths]
[Headline with scramble-in text animation]
[Subtitle fades in with slight delay]
[CTA button with magnetic hover + glow pulse]
[Scroll indicator with custom animation]
```

### Services/Features Section

Don't use a flat grid of cards. Instead:

- **Bento grid with 3D tilt** — Cards that physically tilt toward the cursor using CSS `perspective` and `transform: rotateX/rotateY`. Add a light reflection that moves with the tilt.
- **Reveal on interaction** — Content that reveals progressively as you hover or scroll into each card. Not just fadeIn — actual morphing, expanding, or unfolding animations.
- **Animated icons** — SVG icons that animate (draw themselves, pulse, transform) when their card enters view.
- **Glowing borders** — Animated gradient borders that rotate or flow around the card perimeter.

### Process/Timeline Section

Never use a static numbered list. Options:

- **Horizontal scroll section** — Pin the section and scroll horizontally through steps, with each step having its own mini-animation.
- **Connected nodes** — Animated SVG path that draws itself between steps as you scroll, with each node lighting up.
- **Stacked cards** — Cards that physically stack/unstack as you scroll, creating a depth effect.

### Metrics/Results Section

Numbers should never just appear. They should:

- **Count up with easing** — Use GSAP or requestAnimationFrame with easeOutExpo for satisfying number counting.
- **Have context animation** — The number itself is accompanied by a micro-visualization (a bar filling, a circle completing, a graph drawing).
- **Trigger on scroll** — IntersectionObserver triggers the animation only when visible.

### Contact/CTA Section

The final section should feel like a crescendo:

- **Background shift** — Color or atmosphere change to create urgency/warmth.
- **Animated CTA** — Button with magnetic pull, particle trail, or glow pulse.
- **Interactive element** — A mini-form, a 3D element, or an animation that rewards scrolling this far.

## Animation Principles

### Easing is Everything
Never use `linear` or basic `ease`. Use:
- `cubic-bezier(0.16, 1, 0.3, 1)` — Smooth deceleration (great for reveals)
- `cubic-bezier(0.87, 0, 0.13, 1)` — Dramatic in-out (great for transitions)
- GSAP easings: `power4.out`, `elastic.out(1, 0.3)`, `back.out(1.7)`

### Stagger Creates Rhythm
When animating multiple elements, always stagger them. Even 50-80ms between items creates a satisfying wave effect. GSAP's `stagger` property handles this elegantly.

### Performance Rules
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Never animate `width`, `height`, `top`, `left` (causes layout reflow)
- Use `will-change` sparingly and only on elements about to animate
- Canvas animations: use `requestAnimationFrame`, never `setInterval`
- Throttle mousemove handlers to 60fps with requestAnimationFrame
- Particle systems: keep count under 200 for smooth performance
- Add `prefers-reduced-motion` media query for accessibility

### Responsive Innovation
- Canvas backgrounds should resize with window
- Reduce particle counts on mobile (check `window.innerWidth`)
- Replace mousemove effects with device orientation on mobile (`DeviceOrientationEvent`)
- Simplify 3D transforms to 2D on screens < 768px
- Test touch interactions — magnetic effects need different handling

## Color & Visual System for Dark Themes

Dark themes need **luminosity contrast** to feel alive, not just "dark background with white text":

- **Primary background**: `#0a0a0a` to `#111111` — True dark, not gray
- **Accent color**: Use one vibrant color at high saturation as the energy source
- **Glow effects**: The accent color at 5-15% opacity creates depth (radial gradients, box shadows)
- **Noise texture**: Subtle SVG noise overlay at 3-5% opacity adds tactile quality
- **Gradient mesh**: Multiple overlapping radial gradients that slowly animate create living backgrounds

## Code Patterns

### Particle Network (Canvas 2D)
The skill references file `references/particle-network.md` for a complete implementation pattern. Key concept: particles with position, velocity, and connections drawn between nearby particles. Mouse interaction creates a gravitational effect.

### Text Scramble Effect
Split text into individual characters, then cycle each through random characters before landing on the target character with a staggered delay. Creates a "decoding" feel perfect for tech brands.

### 3D Tilt Cards
Track mouse position relative to card center, calculate rotation angles (typically ±15°), apply with CSS transform and perspective. Add a "light" div that moves opposite to tilt for a reflection effect.

### Magnetic Buttons
On mousemove near the button, calculate distance and apply a transform that pulls the button toward the cursor. On mouseleave, spring back with an elastic ease.

### Scroll Progress Animations
Use IntersectionObserver for triggers and scroll event (throttled) for continuous progress. Map scroll position to animation progress (0-1) and use it to drive transforms, opacity, color shifts.

## Quality Checklist

Before delivering, verify:

- [ ] Hero creates immediate visual impact (canvas/particles/3D)
- [ ] At least 3 sections have unique interactive elements (not just fade-in)
- [ ] Text animations exist (scramble, stagger, or kinetic)
- [ ] Mouse/cursor interactions are present (magnetic, parallax, or particle repulsion)
- [ ] Scroll-driven animations go beyond basic reveal (transform, morph, or progress-based)
- [ ] Color system uses glow/luminosity, not just flat colors
- [ ] Performance is smooth (60fps on modern hardware)
- [ ] Mobile responsive with appropriate fallbacks
- [ ] `prefers-reduced-motion` respected
- [ ] No external dependencies beyond CDN libraries
- [ ] Everything in a single .html file
