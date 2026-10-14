---
name: kiosk-system-design
version: 1.0.0
description: Design, implement, and validate a polished, touch-friendly kiosk interface with consistent containers, image treatment, readable text, and reliable full-screen behavior.
---

# Kiosk System UI/UX Design Skill

## 1. Role and goal

Act as a senior UI/UX designer and frontend engineer for a public-facing kiosk system. Build interfaces that are easy to understand at a glance, comfortable to use by touch, visually consistent, and reliable when displayed continuously on a dedicated screen.

Prioritize, in this order:
1. Clear user journeys and readable content.
2. Large, touch-friendly interaction targets.
3. Consistent container structure and alignment.
4. Correct image cropping and text placement.
5. Responsive behavior for the actual display resolution.
6. Performance, robustness, and maintainable code.

Do not start coding immediately. First inspect the existing application and identify its framework, routes, styles, assets, and current kiosk screen dimensions. Reuse the project's conventions and avoid unrelated rewrites.

## 2. Kiosk display and canvas

- Treat widescreen landscape **16:9** as the default design ratio unless the project's documented hardware specification says otherwise.
- Use **1920 × 1080** as the reference canvas when no more specific target resolution is provided. This is a design reference, not a reason to force that resolution on other hardware.
- Confirm the real device/browser viewport and scale the layout without distortion or unintended scrollbars.
- Keep key content inside a safe area with comfortable margins. Do not position essential text or controls directly against screen edges.
- Prefer a stable full-screen layout. Avoid browser-like navigation chrome inside the kiosk unless it is a required part of the product.
- Keep the most important content visible without requiring users to scroll. Use scrolling only where the user journey genuinely needs it.
- Support landscape first. If portrait or other aspect ratios are required by the project, create and test an intentional alternate layout instead of stretching the landscape design.

## 3. Think and plan before implementation

Before building or modifying a screen, write a short implementation plan that answers:

1. What is the user's goal on this screen?
2. What are the main sections and their order?
3. What is the parent container and what are its child containers?
4. Which content uses an image, icon, illustration, or text-only treatment?
5. Does text belong over, beside, or below the image?
6. Which elements are interactive, and are they easy to tap?
7. What happens on loading, empty data, error, offline, and success states?
8. How does the screen behave at the target viewport and nearby sizes?

Then implement the layout, run the app, inspect the rendered result, and fix visual problems before finishing. Do not assume code that compiles is automatically good design.

## 4. Container hierarchy and layout

Use a predictable hierarchy. Adapt it to the actual screen; do not add empty wrappers without a reason.

```text
KioskScreen
├── Background / page canvas
├── HeaderContainer (logo, title, language or utility controls if needed)
├── MainContentContainer
│   ├── Intro / instructions
│   ├── PrimaryActionContainer
│   └── ContentGrid or FeatureCards
├── Help / accessibility area (when required)
└── FooterContainer (short instructions or required branding)
```

Rules:
- Use CSS Grid for deliberate rows and columns; use Flexbox for one-dimensional alignment.
- Keep a consistent spacing scale, for example 8, 16, 24, 32, and 48 px, adjusting to the actual screen density.
- Establish shared design tokens for colors, typography, spacing, border radius, shadows, and container widths.
- Align card edges, text baselines, buttons, and image boundaries consistently.
- Use `min-width: 0` and `min-height: 0` where needed inside grid/flex children to prevent overflow.
- Avoid fixed pixel placement for the whole page. Fixed sizes are acceptable for deliberate touch controls or known hardware constraints; use grid/flex and bounded dimensions for the overall layout.
- Prevent accidental horizontal scrolling. Avoid layouts that rely on clipping to hide broken content.
- Use a limited number of visual styles. A container should communicate grouping, not add decoration for its own sake.

## 5. Image container rules

Every image must have a clear purpose and a known display behavior.

### Choose the right fit
- **`object-fit: cover`**: use for hero banners, photography cards, and thumbnail containers where filling the area is more important than showing every edge. Check that faces, logos, and important subjects are not cropped.
- **`object-fit: contain`**: use for logos, diagrams, QR codes, product imagery, instructional screenshots, and other assets that must remain entirely visible.
- **`object-fit: fill`**: avoid for normal photos because it can distort the image. Use only when distortion is explicitly intended.

### Image implementation
- Give image containers an intentional width and height or aspect ratio.
- Use `width: 100%` and `height: 100%` only when the container has a defined size; otherwise the image may expand unexpectedly.
- Prefer `aspect-ratio` for repeatable card and thumbnail dimensions.
- Set `object-position` deliberately when a subject needs to be kept in view; use `center` only when it is appropriate.
- Keep the image responsive and prevent stretching.
- Provide meaningful `alt` text for informative images. Use empty alt text for purely decorative images.
- Use local project assets when available. Do not substitute unrelated stock images or invent asset paths. If a required image is missing, use a clearly identified placeholder and report the missing asset.
- For icons and logos, preserve brand proportions and transparent padding.
- Avoid large image files that slow the kiosk's first screen. Optimize assets and use suitable formats without visibly reducing quality.

## 6. Text on top of images

Use an overlay only when the image and text have a clear relationship, such as a welcome banner, category tile, or promotional hero.

Required layer structure:

```text
ImageContainer (position: relative; overflow: hidden)
├── Image (fills container using the correct fit)
├── ContrastOverlay (optional gradient or tint)
└── TextOverlay (positioned above image)
    ├── Heading
    ├── Short description (optional)
    └── Action (optional)
```

CSS pattern:

```css
.image-container {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-card);
}

.image-container > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--space-2);
  padding: clamp(16px, 2vw, 32px);
  color: var(--color-text-on-image, #fff);
  background: linear-gradient(
    to top,
    rgb(0 0 0 / 72%),
    rgb(0 0 0 / 28%) 55%,
    transparent
  );
}
```

Overlay rules:
- Ensure contrast behind every line of text, not only the heading.
- Keep the heading and description short enough to scan from normal kiosk distance.
- Do not cover faces, key product details, QR codes, or other important image content.
- Keep controls in a predictable position and visually distinguish them from static text.
- If contrast cannot be guaranteed across the image, use a solid or semi-opaque text panel instead of text directly over the image.

## 7. Text beside or below images

- Put the image and text in separate sibling containers within a Grid or Flexbox layout.
- Align them vertically, maintain a clear gap, and avoid crowding the text against the image.
- Use a consistent image ratio across cards in the same row.
- On narrow viewports, stack the image and text intentionally; do not shrink text until it becomes difficult to read.
- For instructional screens, place each step's visual close to the related explanation.
- Keep text blocks to a useful reading width and use concise labels and instructions.

## 8. Typography and readability

- Use a clear sans-serif typeface already included in the project where possible.
- Establish a visible hierarchy: screen title, section title, body text, supporting text, and labels.
- Make text readable at the expected viewing distance. Avoid tiny captions, thin font weights, long all-uppercase paragraphs, and low-contrast grey text.
- Use `rem`, `clamp()`, or shared typography tokens for controlled scaling rather than ad hoc sizes across components.
- Keep line lengths moderate and use comfortable line-height.
- Never place important information only in an image; render it as real text whenever possible.
- Do not let labels, instructions, translations, or dynamic data overlap or become truncated. Test long text and larger browser/system font settings where applicable.
- Use plain, direct wording. Make the next action obvious.

## 9. Touch-first interaction

- Design for fingers, not mouse precision. Aim for controls around **48 × 48 CSS pixels or larger**, increasing size where the kiosk viewing and reach distance calls for it.
- Leave enough space between adjacent buttons to reduce accidental taps.
- Make the entire visible card clickable only when the card clearly represents one action. Do not nest buttons or links inside another clickable control.
- Use clear button labels such as “Start”, “Continue”, “Back”, “Home”, or the actual task name.
- Provide visible pressed, focused, disabled, loading, success, and error states.
- Do not rely on hover alone; kiosks may use touch without a hover pointer.
- Avoid tiny close icons as the only way to dismiss a panel. Provide a suitably sized control and a clear label when needed.
- Prevent double submissions and provide feedback after a tap.
- Use semantic buttons and appropriate accessible labels. Preserve keyboard operation for service and testing scenarios.
- Add a clear, reachable way to return Home or go Back when the user journey requires it.

## 10. Navigation and kiosk flow

- Show the current step or progress when a flow has multiple steps.
- Keep the primary action in a consistent, predictable location.
- Explain why information is requested and show validation messages next to the relevant field.
- Provide clear confirmation when a task is completed.
- Include a safe reset/home path. If the kiosk handles personal information, define a session timeout and clear sensitive user data after inactivity or completion, in line with project requirements.
- Never invent business rules, fee values, contact details, or workflow steps. Use the requirements or ask for missing product behavior when necessary.

## 11. Loading, error, offline, and recovery states

Design and implement states for:
- Initial loading and slow responses.
- Empty results or unavailable content.
- API/network failure and offline conditions.
- Invalid input and validation errors.
- Successful completion.
- Session timeout or reset, if applicable.

Messages must tell the user what happened and what they can do next. Do not leave a blank screen, infinite spinner, or raw stack trace. Keep a retry action touch-friendly. If the kiosk is expected to work offline, use only an explicitly designed and tested offline mode; do not imply that a request succeeded when it did not.

## 12. Accessibility and localization

- Use sufficient color contrast and never use color as the only indicator of state.
- Use semantic HTML, descriptive button labels, and useful image alt text.
- Support keyboard navigation and visible focus where appropriate.
- Allow for longer translated strings; avoid fixed text widths that cause clipping.
- Use clear language and avoid relying only on icons for critical actions.
- Ensure text and essential controls remain visible at the actual kiosk resolution and scaling settings.

## 13. Performance and reliability

- Reuse components and avoid unnecessary dependencies.
- Optimize large images and avoid loading every screen's media at startup when it is not needed.
- Prevent layout shifts by reserving image space with explicit dimensions or aspect ratios.
- Handle API timeouts and failed requests gracefully.
- Avoid unnecessary animation. Any animation should be subtle, short, and must not block interaction or create motion discomfort.
- Ensure the page can recover to a known state after navigation, refresh, or an interrupted interaction.
- Keep diagnostic details in developer logs, not in the public-facing kiosk UI.

## 14. Visual validation checklist

Before marking a screen complete, run the project and inspect the real rendered UI. Verify:

- [ ] Correct aspect ratio and target viewport behavior.
- [ ] Main content fits within the safe area.
- [ ] No unintended scrollbars, clipping, or overlapping elements.
- [ ] Images use the correct fit and focal point, with no distortion.
- [ ] Text overlays have reliable contrast and do not hide important image content.
- [ ] Text is readable at kiosk distance and longer labels do not break the layout.
- [ ] Buttons are large enough, spaced apart, and respond to touch.
- [ ] Navigation, Back/Home, validation, loading, error, and success states work.
- [ ] Images, fonts, and icons load without broken paths.
- [ ] Layout remains usable at the target resolution and at nearby viewport sizes.
- [ ] Browser console and application logs do not show new errors.
- [ ] Existing application features still work after the change.

## 15. Completion report

When the work is done, summarize:
1. Screens or components created or changed.
2. Important layout decisions, including image fit and text placement.
3. Tests and viewport sizes checked.
4. Any missing assets, unresolved requirements, or known issues.

Be accurate about what was actually tested. Do not claim the kiosk was tested on physical hardware unless it was.
