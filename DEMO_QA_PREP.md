# Demo Q&A Prep — Technical Questions You Might Get

## 1. Tech stack & architecture

**Q: What's the tech stack?**
Next.js (React framework, App Router) for the frontend and backend
together, PostgreSQL hosted on Neon for the database, Prisma as the
database toolkit (ORM), Auth.js for login/sessions, Resend for
transactional e-mail, Vercel Blob for image storage, and the whole app
is deployed on Vercel.

**Q: Why Next.js instead of something else?**
It lets one project handle both the website (pages) and the backend
(API routes) instead of running two separate services. That's simpler
to build and deploy for a small team, and it has first-class support on
Vercel, so deployment is a few commands rather than a whole DevOps
setup.

**Q: Why Postgres/Neon instead of Firebase or MongoDB?**
Our data is relational — members, products, and orders all reference
each other (a product belongs to a member, an order links a buyer, a
seller, and a product). A relational database with real foreign keys is
the natural fit. Neon specifically gives us serverless Postgres with a
generous free tier and connection pooling that works well with
serverless functions, which is what Vercel runs.

**Q: Why not use an off-the-shelf platform like Shopify or WooCommerce?**
Those are built around a "buy now, pay now" retail model. We needed
things they don't support out of the box: admin approval of new
members before they can sell, a directory of Kultura's real member
associations, a request/reservation flow instead of instant checkout,
and categories matching a specific existing site (keepinuse.ch). A
custom build gave us control over exactly those pieces.

**Q: Is the code in a repository? Can it be reviewed?**
Yes, it's on GitHub. Every feature was committed in its own logical
commit with a clear message, so the history itself is a record of how
the project was built.

---

## 2. Security

**Q: How are passwords stored?**
They're never stored as plain text. We hash them with bcrypt before
saving anything to the database, so even if the database were exposed,
raw passwords wouldn't be.

**Q: How do you prevent SQL injection?**
We use Prisma as the database layer, which builds parameterized queries
under the hood — we never concatenate raw user input into SQL strings.
That's the standard, safe pattern.

**Q: How does login/session security work?**
Auth.js handles sessions with signed JWTs, using a secret key that only
the server knows. Sessions are validated server-side on every protected
page and API call.

**Q: Can a user edit or delete someone else's product?**
No — every product edit/delete request checks on the server that the
logged-in user actually owns that product (or is an admin). This isn't
just hidden in the UI; it's enforced in the API itself, so someone can't
bypass it by calling the API directly.

**Q: What stops just anyone from registering and immediately selling
things?**
New accounts start in a "pending" state and can't log in at all until
an admin approves them. That's a deliberate gate before anyone gets
dashboard access.

**Q: Is there protection against bots spamming the registration form?**
Not yet — there's no CAPTCHA or rate-limiting on registration today.
That's a known hardening item before a fully public launch, and it's a
quick addition (e.g. a CAPTCHA service or basic rate-limiting on the
API route).

---

## 3. Data & privacy

**Q: What personal data do you collect?**
Username, e-mail, optional phone number, and for associations/
companies, a company name. That's it — we deliberately kept it minimal.

**Q: Is this GDPR-compliant?**
The basics are in place — we collect the minimum needed, and passwords
are hashed. What's not built yet: a privacy policy page, an explicit
consent checkbox at signup, and self-service account
export/deletion. Those are real gaps I'd flag honestly, not something
I'd claim is done — they're straightforward to add before a public
launch that handles data from people in Switzerland/EU.

**Q: Where does the data actually live?**
In a managed Postgres database hosted by Neon, on their cloud
infrastructure. Images uploaded by users go to Vercel Blob storage. Both
are reputable managed providers, not something we're self-hosting.

---

## 4. Reliability & scale

**Q: Can this handle real traffic?**
Vercel's serverless functions scale automatically with demand — we're
not running a single fixed server that falls over under load. Neon's
connection pooling is built specifically for this serverless pattern.
That said, we haven't load-tested it against, say, thousands of
concurrent users — for an early-stage nonprofit marketplace, current
traffic expectations are well within what this setup handles
comfortably.

**Q: What happens if Neon or Vercel has an outage?**
Like most modern apps built on managed cloud services, we'd be affected
if a provider had downtime — that's a shared trade-off of not
self-hosting. Neon does automatic daily backups by default. We haven't
set up our own additional monitoring/alerting yet; that's a reasonable
next step.

**Q: Is there a staging environment, or does everything go straight to
production?**
Right now local development is effectively the staging environment —
every feature was built and tested locally, and often verified with
automated browser tests (Playwright) before being deployed to
production. A separate hosted staging environment is something to add
as the team grows.

**Q: What's the hosting cost?**
Every service used (Vercel, Neon, Resend, Vercel Blob) has a free tier
that comfortably covers an early-stage MVP. Costs would need
re-evaluating if usage grows significantly, but there's no infrastructure
spend today.

---

## 5. How it was built

**Q: How did you build all of this so quickly as one junior developer?**
I used Claude Code, an AI coding assistant, throughout the build. I
directed the architecture and feature decisions, reviewed every change,
and tested each feature myself — often with real end-to-end browser
tests — before moving to the next one. It's the same principle as using
any modern tool that removes repetitive work: it let me focus on
decisions and verification instead of typing out boilerplate.

**Q: So how much of this do you actually understand / can you maintain
it?**
I reviewed and tested every feature as it was built, not just at the
end — registration, the approval workflow, the cart and order flow, the
admin tools, all of it. I can walk through how any part of it works. I
used AI as a tool to move faster, the same way I'd use a library or a
framework — the decisions and the responsibility for the result are
mine.

**Q: What testing was done?**
Automated end-to-end tests (using Playwright, which drives a real
browser) were run for every major flow: registration, admin approval,
login, adding a product with a real image upload, adding items to cart,
checkout, and a seller accepting an order — both locally and against
the live production site after deployment. ESLint is also run on every
change to catch code issues early.

---

## 6. Product / business decisions

**Q: Why is there no real payment on the site?**
That was a deliberate scoping decision for this phase. Instead of
"buy now" with real money, a buyer sends a request/reservation for a
product, and the seller accepts or declines it — the actual payment and
handoff happens directly between the two people, outside the site. This
avoids the complexity and liability of handling real transactions before
the core marketplace experience is validated, while still delivering
the main value: connecting buyers and sellers. Real payment is a
planned future phase, not something we're avoiding indefinitely.

**Q: Why does a new member need admin approval before they can sell?**
Kultura wanted to keep quality and trust high — sellers are meant to be
real people/associations connected to Kultura's community, so having an
admin gate new accounts before they get a dashboard is a simple, direct
way to enforce that.

**Q: Why does the site look like keepinuse.ch?**
That was the explicit reference design given at the start of the
project — mirroring its layout and navigation structure (categories,
search, listing cards) while adapting it for a marketplace with prices
instead of a free-giveaway model.

**Q: Why is everything in French?**
Kultura is a Geneva-based nonprofit, and French is the working language
for their members and associations.

---

## 7. Known gaps (be upfront about these if asked)

It's better to name these yourself than to get caught off guard:

- **Password reset e-mails** only reach one test address right now
  because the sending domain hasn't been verified with our e-mail
  provider yet — that's a same-day fix once we complete domain
  verification.
- **No real payment processing** — by design, for this phase (see above).
- **No rate-limiting/CAPTCHA** on registration yet.
- **No self-service account deletion/export** for privacy requests yet.
- **Automatic deployment on `git push` isn't wired up yet** — deploys
  are currently triggered manually, which is fine at this stage but
  worth automating soon.
- **No custom domain yet** — the live site is on a Vercel-provided
  address, not `kultura.ch` directly.

Framing tip: presenting these as "here's what's next" rather than
hiding them shows you understand the whole system, not just the parts
that work.
