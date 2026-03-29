Tech Derby — File Structure, Page Map & Component Architecture
1. OBJECTIVE

Create a clean, scalable Figma workspace architecture for the Tech Derby website.

The goal is to prevent:

messy files

duplicated components

inconsistent naming

poor developer handoff

The file should follow design system best practices used by modern product teams.

This file will be used by:

designers

developers

community admins

contributors

So clarity and consistency are critical.

2. CREATE FIGMA PAGE STRUCTURE

Generate the following Figma pages in this exact order.

Page 01 — Cover

Include:

Project name
Version number
Last updated date
Design owners

Short description:

Tech Derby Website 2.0 — community platform connecting tech professionals, students, founders, and employers in Derby.

Page 02 — Foundations

Define base design tokens.

Include:

Colour tokens
Typography scale
Spacing system
Grid system
Elevation/shadow system
Border radius tokens
Motion tokens

Structure as:

Foundations
  ├ Colors
  ├ Typography
  ├ Spacing
  ├ Grid
  ├ Shadows
  ├ Radius
  ├ Motion
Page 03 — Components (Atoms)

Smallest reusable elements.

Create components for:

Buttons
Inputs
Labels
Tags
Badges
Icons
Avatar
Divider
Links
Tooltip
Checkbox
Radio buttons

Naming format:

atom/button/primary
atom/button/secondary
atom/input/text
atom/tag/skill
atom/avatar/member

Each component must include variants:

default

hover

focus

disabled

loading (if applicable)

Page 04 — Components (Molecules)

Combine atoms into functional UI groups.

Examples:

Form fields
Search input
Filter chips
Event tag group
Member profile preview
Pagination
Toast notifications

Naming convention:

molecule/search-bar
molecule/form-field
molecule/member-preview
molecule/filter-chips
Page 05 — Components (Organisms)

Higher-level components.

Examples:

Navigation header
Mobile navigation
Footer
Event card
Speaker card
Member card
Partner card
Programme card
Stats section
Testimonials carousel
FAQ accordion
CTA banner

Naming convention:

organism/header/main
organism/card/event
organism/card/member
organism/card/partner
organism/section/faq
organism/section/stats
3. CREATE LAYOUT TEMPLATES

Create reusable page templates.

Add them to a page called:

Page 06 — Layout Templates

Templates required:

Marketing page template
Programme page template
Events listing template
Event detail template
Directory listing template
Profile page template
Dashboard template
Form page template
Legal content template

Naming:

template/page/marketing
template/page/event
template/page/dashboard
template/page/profile

These templates should include placeholder components only.

4. CREATE SITE PAGE MAP

Create a visual sitemap showing how pages connect.

Add a page:

Page 07 — Site Map

Structure should look like:

Home
 ├ Events
 │   ├ Event Detail
 │   └ Event Recap
 ├ About
 ├ Programmes
 │   ├ Meetups
 │   ├ Skills & Careers
 │   ├ Innovation Circles
 │   ├ Tech Star Women
 │   └ Express
 ├ Membership
 ├ Get Involved
 ├ Partners
 ├ Insights
 │   └ Article
 ├ Contact
 └ Trust Pages
     ├ Code of Conduct
     ├ Accessibility
     ├ Safeguarding
     └ Privacy

This structure must match the SEO content pack.

5. CREATE WIREFRAME PAGE GROUP

Add page:

Page 08 — Wireframes

Create low-fidelity layouts for:

Home
Events listing
Event detail
About
Membership
Get involved
Partners
Insights
Contact

Authenticated pages:

Login
Signup
Member dashboard
Member directory
Member profile

Admin pages:

Admin dashboard
Event management
Member approvals

Use grayscale boxes only.

6. CREATE HIGH FIDELITY PAGE GROUP

Add page:

Page 09 — High Fidelity Designs

Create polished designs for:

Home
Events
Event detail
About
Membership
Get involved
Partners
Insights
Contact

Member area:

Dashboard
Directory
Profile

Partner area:

Partner dashboard
Talent request form

Admin area:

Admin dashboard
Event management

7. CREATE RESPONSIVE VIEWS

Add page:

Page 10 — Responsive Views

Include breakpoints:

Desktop
1440px

Laptop
1280px

Tablet
768px

Mobile
375px

Show responsive versions for:

Home
Events
Event detail
Membership
Directory

8. CREATE DESIGN QA PAGE

Add page:

Page 11 — QA & Accessibility

Include checks for:

Colour contrast
Keyboard navigation
Focus states
Mobile tap targets
Form validation patterns
Accessible error messages

This ensures WCAG compliance.

9. COMPONENT NAMING RULES

Use this naming convention globally:

category/type/name

Examples:

atom/button/primary
molecule/search/events
organism/card/event
template/page/dashboard

This keeps Figma organised and developer-friendly.

10. AUTOLAYOUT RULES

All components must use:

Auto Layout

Constraints for responsive resizing

Consistent padding tokens

Avoid absolute positioning.

11. DEVELOPER HANDOFF

Add notes to components explaining:

States
Spacing
Usage rules

Prepare designs for export to:

React / Next.js frontend.

12. FINAL OUTPUT

The Figma file should include:

11 organised pages

A complete component library

Reusable templates

Site map

Wireframes

High fidelity designs

Responsive layouts

Accessibility QA

RESULT