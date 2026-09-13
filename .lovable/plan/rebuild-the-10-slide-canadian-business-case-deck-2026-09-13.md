# Rebuild the 10-slide Canadian Business Case deck

## Goal
Recreate all 10 slides as a clean, consistent 16:9 presentation using DocG AI’s existing website colors, alternating light and dark treatments. Preserve the current business-case content while eliminating every overlap and low-contrast text issue.

## What will change
- Rebuild the shared slide structure with fixed title, content, and footer zones so text cannot collide with charts or cards.
- Redesign each slide’s visual layout for its content: thesis, problem metrics, timing, market sizing, platform flow, architecture, value, pricing, moat, and go-to-market.
- Apply the website palette consistently: deep aubergine/navy dark slides, near-white light slides, violet/cyan accents, and restrained peach highlights.
- Increase contrast for subtitles, labels, notes, and supporting copy on both themes.
- Keep the existing DocG AI logos, wording, source notes, and 10-slide sequence.
- Update the in-app presentation and export a newly versioned combined PDF.

## Validation
- Render all 10 slides at 1920×1080 and inspect every page for clipping, overlap, legibility, and visual consistency.
- Check the live presentation at desktop and mobile viewport sizes.
- Verify slide navigation, overview, keyboard controls, fullscreen, and print/PDF layout.
- Re-export only after all visual checks pass.

## Technical details
- Refactor the presentation stylesheet around shared spacing, typography, theme, panel, and grid rules rather than isolated fixes.
- Preserve the existing React presentation route and controls; changes remain limited to presentation files and the exported document.
- Use semantic presentation tokens derived from the site’s current color system.
