# SmartketPlace (La Place de Marché) — Project Tickets

This document lists the project's development tickets, organized by
epic. Each ticket follows the format: ID, type, status, description.

Statuses: ✅ Done · 🔲 To Do

---

## Epic 1 — Project Foundation

**TICKET-001** · Feature · ✅ Done
Scaffolded the Next.js (App Router) + Tailwind CSS + JavaScript project.

**TICKET-002** · Feature · ✅ Done
Kultura branding: real logo, brand color (#006B32), header redesign
(site name, login/signup buttons, alignment to the logo's baseline).

**TICKET-003** · Feature · ✅ Done
Translated all site content into French (UI, categories, demo data).

---

## Epic 2 — Navigation and Categories

**TICKET-004** · Feature · ✅ Done
Nested category mega-menu (main categories → subcategories on hover/
click), using the real taxonomy extracted from keepinuse.ch (22 main
categories).

**TICKET-005** · Feature · ✅ Done
Secondary navigation bar (Categories, Member Associations, Contact) with
brand-green background and vertical separators.

**TICKET-006** · Bug · ✅ Done
Fixed a display bug: `overflow-x-auto` on the nav bar was clipping the
category dropdown (a CSS overflow-x/overflow-y side effect).

---

## Epic 3 — Product Catalog (Public)

**TICKET-007** · Feature · ✅ Done
Homepage: product grid (image, title, price, category, location), with
12 initial demo products.

**TICKET-008** · Feature · ✅ Done
Text search + category filter (with parent → subcategory matching).

**TICKET-009** · Feature · ✅ Done
Advanced filters: min/max price, product type (physical/digital/
service), location, seller/association, shipping availability.

**TICKET-010** · Feature · ✅ Done
Product detail page (image, description, price, stock, shipping info,
"Add to cart" button).

**TICKET-011** · Feature · ✅ Done
Migrated product data from the static file to the real database
(idempotent seed script).

---

## Epic 4 — Member Associations

**TICKET-012** · Feature · ✅ Done
Imported Kultura's 74 real member associations (name + link to their
website) from kultura.ch/les-associations-membres/.

**TICKET-013** · Feature · ✅ Done
Imported real logos for 37 associations (files provided), initials
avatar for the rest.

**TICKET-014** · Feature · ✅ Done
Compact preview of associations on the homepage + dedicated
`/associations-membres` page with search and alphabetical grouping.

---

## Epic 5 — Accounts and Authentication

**TICKET-015** · Feature · ✅ Done
Registration (individual or association/company) with validation rules:
username (3-20 chars, letters/digits/./_), password (8+ chars, uppercase,
lowercase, digit), uniqueness check.

**TICKET-016** · Feature · ✅ Done
Login (username or e-mail) via Auth.js, hashed passwords (bcrypt), JWT
sessions.

**TICKET-017** · Feature · ✅ Done
An account can only log in after admin approval (pending/approved/
rejected status).

**TICKET-018** · Feature · ✅ Done
Forgot password: e-mail with a single-use reset link (expires after 1h),
via Resend.

**TICKET-019** · Feature · ✅ Done
Admin page to review pending registrations (approve/reject).

**TICKET-020** · Feature · ✅ Done
Admin page listing all members (search + filter by status).

**TICKET-021** · Bug · ✅ Done
Fixed: registering as "Individual" failed (the hidden company field sent
`null`, rejected by validation).

**TICKET-022** · Bug · ✅ Done
Fixed a React race condition (DOM error `insertBefore`) when approving a
member: state update on a row being unmounted.

---

## Epic 6 — Seller Dashboard

**TICKET-023** · Feature · ✅ Done
Manage the logged-in member's own products: list, create, edit, delete
(`/dashboard/produits`).

**TICKET-024** · Feature · ✅ Done
Real product photo upload via Vercel Blob (replaces the URL field).

**TICKET-025** · Feature · ✅ Done
Admin oversight: view/search all products from every member, edit or
delete any of them, or add one for a chosen member (`/admin/produits`).

---

## Epic 7 — Cart and Orders (No Real Payment)

**TICKET-026** · Feature · ✅ Done
Client-side cart (localStorage): add from the product card or detail
page, adjust quantities, remove items.

**TICKET-027** · Feature · ✅ Done
Checkout = request/reservation (no online payment): creates one `Order`
record per product, linked to the buyer and seller.

**TICKET-028** · Feature · ✅ Done
Buyer's purchase history (`/dashboard/achats`), with the ability to
cancel a pending request.

**TICKET-029** · Feature · ✅ Done
Seller's sales management (`/dashboard/ventes`): accept, decline, or
mark an order as completed.

---

## Epic 8 — Deployment

**TICKET-030** · Infra · ✅ Done
Deployed to Vercel (production): https://smartketplace.vercel.app

**TICKET-031** · Infra · ✅ Done
Configured production environment variables (Neon database, Resend,
Vercel Blob).

**TICKET-032** · Infra · ✅ Done
End-to-end verification in production (Playwright): registration, admin
approval, login, browsing — no errors.

---

## Backlog — To Do

**TICKET-033** · Infra · 🔲 To Do · High priority
Verify a domain (or subdomain, e.g. `mail.kultura.ch`) on Resend so
password-reset e-mails can be sent to real users (currently limited to
the Resend account owner's address).

**TICKET-034** · Infra · 🔲 To Do
Connect the GitHub repository to the Vercel account for automatic
deployment on every `git push` (currently deployed manually via
`vercel --prod`).

**TICKET-035** · Infra · 🔲 To Do
Set up a custom domain (e.g. `kultura.ch` or a subdomain) instead of
`smartketplace.vercel.app`.

**TICKET-036** · Task · 🔲 To Do
Confirm/correct the association logos matched with medium confidence
(DOMINO4D → ADES, boat → Tripulantes, RS → Rookie Slash, reading figure
→ Livre moi) and identify the images still unmatched.

**TICKET-037** · Feature · 🔲 Out of scope (future phase)
Real online payment (Stripe or equivalent) — deliberately excluded from
this phase; the current system is a request/reservation with no
financial transaction on the site.
