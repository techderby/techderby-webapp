Tech Derby — Full Design System Generator
1. OBJECTIVE

Generate a complete scalable design system for the Tech Derby website and community platform.

The system must support:

marketing pages

event pages

membership flows

member directory

partner portal

admin interface

The design system must prioritise:

accessibility (WCAG 2.2 AA)

responsive layouts

component reusability

developer handoff compatibility

consistent UI patterns

The system will be used in React / Next.js development, so components should be logical and structured.

2. CREATE DESIGN TOKENS

Generate tokens using the following structure.

tokens/
 ├ colors
 ├ typography
 ├ spacing
 ├ grid
 ├ radius
 ├ shadows
 ├ motion
3. COLOR SYSTEM

Create a professional palette reflecting a modern tech community.

Primary colour:

Deep Tech Blue

Purpose:
brand identity, primary buttons, key navigation.

Secondary accent:

Electric Teal / Cyan

Purpose:
innovation, highlights, links.

Warm accent:

Soft Orange

Purpose:
community warmth, calls to action.

Neutral colours:

Charcoal
Slate grey
Mid grey
Light grey
Off-white

Create tokens for:

color.primary
color.primary-hover
color.primary-active

color.secondary
color.secondary-hover

color.accent

color.background
color.surface
color.border

color.text.primary
color.text.secondary
color.text.muted

Accessibility rules:

Body text contrast minimum 4.5:1

Large text minimum 3:1

Provide focus outline color token.

4. TYPOGRAPHY SYSTEM

Create a modern sans-serif scale suitable for tech communities.

Font style suggestion:

Inter
Space Grotesk
or similar geometric sans.

Define typography tokens.

type.display
type.h1
type.h2
type.h3
type.h4
type.body-large
type.body
type.caption
type.button

Typography rules:

Base size: 16px

Line height: 1.5–1.7

Heading scale should follow a modular scale.

Ensure headings are clearly differentiated for accessibility.

5. SPACING SYSTEM

Use an 8px spacing grid.

Create tokens:

space.4
space.8
space.12
space.16
space.24
space.32
space.48
space.64
space.80
space.120

Spacing usage examples:

Cards padding: 24px
Sections padding: 80–120px
Mobile padding: 32–48px

6. GRID SYSTEM

Define responsive grid tokens.

Desktop:

12 column grid
Max width: 1200–1280px

Tablet:

8 column grid

Mobile:

4 column grid

Gutter:

24px desktop
16px mobile

7. BORDER RADIUS TOKENS

Create rounded UI style.

radius.small = 4px
radius.medium = 8px
radius.large = 12px
radius.card = 16px
radius.pill = 999px
8. SHADOW TOKENS

Define elevation levels.

shadow.sm
shadow.md
shadow.lg
shadow.xl

Used for:

cards
dropdowns
modals

Avoid heavy shadows.

9. MOTION TOKENS

Define animation rules.

motion.fast = 120ms
motion.medium = 200ms
motion.slow = 300ms

Easing:

ease-out
ease-in-out

Use for:

hover states
card transitions
accordion expansion

Avoid excessive animation.

10. CORE COMPONENT LIBRARY

Generate component variants using Auto Layout.

Buttons

Variants:

Primary
Secondary
Ghost

States:

Default
Hover
Focus
Disabled
Loading

Size options:

Small
Medium
Large

Inputs

Text input
Email input
Textarea
Dropdown
Search input

States:

Default
Focus
Error
Success
Disabled

Form Components

Checkbox
Radio button
Toggle switch
Form field wrapper (label + helper + error)

Tags & Badges

Skill tag
Interest tag
Partner badge
Speaker badge

Cards

Create variants.

Event card
Member card
Partner card
Programme card
Blog card

Each card must include:

image area
title
description
tags
CTA

11. NAVIGATION COMPONENTS

Create:

Header navigation
Mobile navigation
Dropdown menu
Breadcrumb component

Include:

sticky header behaviour.

12. CONTENT COMPONENTS

Create reusable blocks for marketing pages.

Hero section
Stats block
Feature grid
Testimonial card
Logo strip
CTA banner
FAQ accordion

13. DATA DISPLAY COMPONENTS

For directory and dashboards.

Member list
Profile summary
Table component
Filter chips
Search results layout

14. FEEDBACK COMPONENTS

Toast notifications
Alert banners
Modal dialog
Loading spinner

15. DASHBOARD COMPONENTS

Sidebar navigation
Dashboard cards
Activity feed

Used for:

member dashboard
partner dashboard
admin area

16. ICON SYSTEM

Create icon set categories:

Navigation
Events
Community
Career
Partnership
UI controls

Use consistent stroke weight.

17. RESPONSIVE RULES

All components must adapt to:

Desktop
Tablet
Mobile

Ensure:

touch targets ≥ 44px
cards stack vertically on mobile
navigation collapses to hamburger.

18. ACCESSIBILITY RULES

Ensure design system supports:

WCAG 2.2 AA compliance

Include:

focus rings
accessible contrast
clear error states
keyboard navigable UI patterns.

19. COMPONENT NAMING CONVENTION

Use structured naming:

atom/button/primary
molecule/search-bar
organism/card/event
organism/navigation/header

This ensures developer clarity.

20. FINAL OUTPUT

Generate:

Full design tokens
Component library
Variants and states
Responsive behaviour
Developer annotations

This design system must be ready for direct implementation in React / Next.js.