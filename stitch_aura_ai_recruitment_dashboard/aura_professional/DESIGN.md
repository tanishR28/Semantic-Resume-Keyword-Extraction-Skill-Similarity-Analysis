```markdown
# Design System Specification: The Intelligent Workspace

## 1. Creative North Star: "The Editorial Curator"
This design system moves away from the cluttered, "dashboard-heavy" aesthetics of legacy recruitment tools. Our North Star is **The Editorial Curator**. We treat candidate data not as rows in a database, but as entries in a high-end professional journal. 

The system prioritizes **intentional negative space**, **asymmetric balance**, and **tonal layering**. By removing the "scaffolding" (borders and lines) typical of SaaS, we allow the AI-driven insights to breathe, creating an interface that feels authoritative, calm, and premium.

---

## 2. Color & Surface Philosophy

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for sectioning. Structural definition must be achieved through **Background Color Shifts** or **Tonal Transitions**. 
- To separate a sidebar from a main content area, use `surface` (#f7f9fb) against `surface-container-low` (#f2f4f6).
- Use `surface-container-lowest` (#ffffff) to make primary content "pop" against the `background`.

### Surface Hierarchy & Nesting
We utilize a physical layering model. Imagine sheets of high-grade paper stacked on top of each other.
*   **Base Layer:** `background` (#f7f9fb)
*   **Structural Layer:** `surface-container` (#eceef0) for large layout blocks.
*   **Content Layer:** `surface-container-lowest` (#ffffff) for the highest-priority cards or candidate profiles.
*   **Interactive Layer:** `primary_container` (#4f46e5) for high-impact CTAs.

### Glass & Gradient Accents
To provide "visual soul," use subtle gradients. 
- **The Signature CTA:** Use a linear gradient from `primary` (#3525cd) to `primary_container` (#4f46e5) at a 135-degree angle.
- **Glassmorphism:** For floating side-over drawers or hover-state tooltips, use `surface_container_lowest` at 80% opacity with a `24px` backdrop-blur.

---

## 3. Typography: The Hierarchical Voice
We pair **Manrope** (Display/Headlines) with **Inter** (Body/Labels) to create a sophisticated, editorial contrast.

*   **The Power Scale:** 
    *   `display-lg` (Manrope, 3.5rem): Reserved for high-level AI insights or welcoming empty states.
    *   `headline-md` (Manrope, 1.75rem): Used for candidate names or major section headers.
    *   `title-sm` (Inter, 1rem, Bold): Used for data labels within tables to ensure legibility.
    *   `label-md` (Inter, 0.75rem): Tracking increased to 5% for all-caps metadata.

**Intentional Weighting:** Never use "Regular" weight for headlines. Always opt for `Medium` or `Bold` to maintain the "Corporate Professional" authority.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create "pop"; we use them to simulate **Ambient Light**.

*   **The Layering Principle:** Depth is achieved by placing `surface-container-lowest` (#ffffff) cards on top of `surface-container-low` (#f2f4f6) sections. This creates a "soft lift."
*   **Ambient Shadows:** For modals or floating menus, use a multi-layered shadow:
    *   `0px 4px 20px rgba(25, 28, 30, 0.04)`
    *   `0px 12px 40px rgba(25, 28, 30, 0.08)`
*   **The Ghost Border:** If a boundary is required for accessibility, use `outline-variant` (#c7c4d8) at **15% opacity**. Never 100%.

---

## 5. Signature Components

### Data Tables (The "Fluid Table")
*   **Concept:** Forbid horizontal divider lines.
*   **Execution:** Use `body-md` for text. Alternate row backgrounds are not permitted. Instead, use a subtle `surface-container-low` hover state that spans the entire row.
*   **Spacing:** Vertical cell padding must be at least `1.5rem` (`24px`) to create an editorial feel.

### Circular Progress Rings (Match Scores)
*   **The "Aura" Glow:** Use `tertiary_fixed` (#6ffbbe) for high match scores (80%+). Apply a subtle outer glow using the same color at 20% opacity to simulate the "AI Pulse."
*   **Weight:** Use a thin stroke (4px) for the track and a thicker stroke (6px) for the progress to emphasize the data.

### Pill Tags (Candidate Status)
*   **Visuals:** Use `full` roundedness. 
*   **Styling:** Avoid heavy backgrounds. Use `secondary_container` (#d5e0f8) with `on_secondary_container` (#586377) text. For "Success" states, use `tertiary_fixed` with `on_tertiary_fixed_variant` text.

### Side-Over Drawers & Modals
*   **Drawers:** Must use the Glassmorphism rule (80% opacity + blur). They should slide from the right, anchored to the `surface-container-highest`.
*   **Full-Screen Modals:** Do not use pure black overlays. Use `on_surface` (#191c1e) at 40% opacity with a heavy blur to keep the recruiter focused on the candidate profile.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical margins. If a table is aligned left, leave a generous `4rem` "gutter" on the right for AI notes.
*   **Do** use `surface_bright` to highlight the "Active" candidate in a list.
*   **Do** prioritize vertical rhythm over cramming data "above the fold."

### Don’t
*   **Don't** use 1px solid borders to separate the sidebar. Use a color shift from `surface_dim` to `surface`.
*   **Don't** use standard blue (#0000FF) for links. Use the `accent` (Indigo #4F46E5) for all interactive intent.
*   **Don't** use "Drop Shadows" on buttons. Use a subtle `primary_fixed` glow or a flat tonal shift.

---

## 7. Spacing & Roundedness
*   **Radius:** Use `xl` (0.75rem) for main content cards to soften the "Corporate" edge. Use `lg` (0.5rem) for buttons.
*   **Negative Space:** All primary containers must have a minimum padding of `2rem` (32px). We are designing for clarity, not density.```