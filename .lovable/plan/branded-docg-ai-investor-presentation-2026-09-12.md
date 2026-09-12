# Branded DocG AI Investor Presentation

## Goal
Create a native 10-slide presentation from the uploaded Canadian healthcare market analysis, styled in DocG AI’s existing “Quiet Confidence” brand system. The presentation will open inside the app and support a clean PDF export.

## What will be built
- A new `/presentation` view with a 16:9 stage and ten branded slides.
- Previous/next controls, numbered slide navigation, keyboard arrows, fullscreen viewing, and print/PDF export.
- Responsive viewing on desktop, tablet, and mobile without altering the existing website.
- Source notes on slides containing market, policy, pricing, or outcome claims.

## Slide sequence
1. Investment thesis — Canada’s intelligence layer for coordinated healthcare.
2. The problem — primary-care capacity and fragmented workflows.
3. Why now — workforce, AI adoption, interoperability, and deployment readiness.
4. Market sizing — TAM, SAM, SOM, and Canadian launch sequence.
5. The solution — reason, route, and verify across existing clinical systems.
6. Architecture — workflow surfaces, orchestration, AI Cortex, and sovereign data plane.
7. Business value — latency, coordination, workflow leakage, and traceability.
8. Business model — clinic, network, and health-system tiers.
9. Competitive moat — differentiation from scribes, EMRs, and automation tools.
10. Go-to-market — prove, productize, scale, and platform expansion.

## Visual direction
- Deep aubergine and navy foundations with restrained violet, bio-electric cyan, and peach accents.
- Existing transparent DocG AI logo and branded clinical/neural imagery.
- Instrument-grade typography, disciplined information hierarchy, glass surfaces, and no generic pitch-deck styling.
- Varied layouts: title composition, evidence dashboard, timeline, market funnel, architecture map, metric field, commercial ladder, moat matrix, and roadmap.

## Technical details
- Add a focused slide data model and reusable presentation components.
- Add dedicated print styles so each slide exports as one landscape PDF page with navigation hidden.
- Use only facts and figures contained in the uploaded analysis; uncertain or future-dated claims remain explicitly sourced or qualified.
- Preserve all existing routes and landing-page behavior.

## Verification
- Check every slide at desktop and mobile widths.
- Verify keyboard, click navigation, fullscreen, and PDF print layout.
- Inspect all ten rendered slides for overflow, clipping, contrast, and overlap, then complete a fix-and-verify pass.
