# TuniDrive

A static, multilingual car-rental demonstration for a proposed WordPress implementation. Built directly in this project folder with React, TypeScript, Vite, Tailwind CSS, React Router, Lucide icons, and Recharts.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173). No environment variables, database, backend, WordPress installation, or external API are required. Start Vite from this directory; opening index.html directly or serving the unbuilt source with PHP/Apache will not run the app.

```bash
npm run build
npm run preview
```

The production build is written to `dist/`.

## Demo access

- Customer: `customer@tunidrive.demo` / `Customer@123`
- Administrator: `admin@tunidrive.demo` / `Admin@123`
- `/demo-access` presents both portals. Login forms are prefilled and offer direct demo login.

Authentication is simulated React state, not a security boundary. Never use real passwords, identity documents, card numbers, personal details, or API credentials in this demonstration. Registration creates a fictional customer record for the current in-memory session.

## Customer experience

- English-default homepage with three original photographic-style hero banners, automatic transitions, controls, search form, featured vehicles, categories, locations, offers, testimonials, FAQs, and simulated newsletter/contact actions.
- Fleet catalogue with 20 vehicles, category/price/transmission/fuel/passenger/location/availability filters, sorting, result counts, favourites, and grid/list layouts.
- Vehicle details with illustrative gallery, specifications, deposit, mileage, insurance, locations, availability calendar, and related vehicles.
- Booking steps: rental dates/locations/times, extras, fictional customer details, simulated payment, confirmation. Search parameters carry through into booking.
- Rounded-up 24-hour rental duration, date validation, daily extras, one-time airport delivery, and clearly illustrative 7% fees. No claim is made that the fee represents Tunisian tax law.
- Confirmation adds linked booking, invoice, and payment records to temporary shared state. Printable summaries, invoice previews, simulated email and WhatsApp feedback.
- Customer dashboard with booking status filters, invoice/payment history, profile edits, saved cars, and support requests.
- Nine locations and implemented informational/policy pages.

## Administration

A WordPress-inspired shell at `/wp-admin` with a separate demo login. It is not WordPress.

- Dashboard statistics and six chart views derived from shared sample records.
- Fleet, categories, status, add/edit/detail screens, and safe simulated deletion.
- Availability calendar with day/week/month controls and linked booking/maintenance popups.
- Booking listing/search/status filters, creation, details, confirm/cancel/collect/return actions, linked customers and invoices.
- Standard fleet rates, seasonal/weekly/monthly rules, and promotional codes.
- Customer/location/payment/invoice/maintenance listing, detail, and editing views.
- Report filters, summary charts, CSV downloads, and browser printing.
- CMS sections for pages, banners, media, reviews, FAQs, blog content, offers, menus, footer, contact information, and SEO. Banner/menu/footer edits update shared website state in the same session.
- Demo configuration for company, booking rules, currency, languages, protection, extras, payment methods, notifications, users, roles, and security. These settings are illustrative and do not enable external services or real access controls.

List screens include search, status filtering where relevant, pagination, and record links. Referenced records are retained when deletion would break sample relationships. Administration edits are demonstrations; a refresh restores the JSON fixtures.

## Main routes

- `/`, `/fleet`, `/fleet/:id`
- `/booking/:id`, `/confirmation/:id`
- `/locations`, `/locations/:id`, `/offers`
- `/about`, `/airport`, `/long-term`, `/requirements`, `/insurance`, `/faq`, `/contact`
- `/terms`, `/privacy`, `/cancellation`
- `/login`, `/register`, `/demo-access`
- `/account`, `/account/bookings`, `/account/bookings/:id`
- `/account/invoices`, `/account/invoices/:id`, `/account/payments`, `/account/profile`, `/account/saved`, `/account/support`
- `/wp-admin/login`, `/wp-admin`
- `/wp-admin/vehicles`, `/wp-admin/categories`, `/wp-admin/calendar`, `/wp-admin/bookings`
- `/wp-admin/pricing`, `/wp-admin/customers`, `/wp-admin/locations`
- `/wp-admin/payments`, `/wp-admin/invoices`, `/wp-admin/maintenance`
- `/wp-admin/reports`, `/wp-admin/content`, `/wp-admin/settings`
- Management entity pages support `/:id` and `/new` where applicable. For example `/wp-admin/vehicles/v3` and `/wp-admin/customers/new`.

## Data and source structure

- `src/data/`: JSON fixtures, including 20 vehicles, 9 locations, 15 customers, 25 bookings, 25 payments, 25 invoices, 10 maintenance records, 8 categories, 7 extras, 7 pricing rules, 6 offers, 3 banners, 6 testimonials, 12 FAQs, insurance, content and CMS data.
- `src/store.tsx`: shared React context, translation getter, temporary data updates, price calculation, and safe CSV generation.
- `src/components/UI.tsx`: shared layout and UI components.
- `src/pages.tsx`: public website and catalogue.
- `src/booking.tsx`: booking, authentication, customer portal, and invoices.
- `src/admin.tsx`: management shell, forms, calendar, analytics, CMS, and settings.
- `src/locales/{fr,en,ar}.json`: static translations. English is the default; French remains available and Arabic sets document `dir="rtl"` and uses responsive logical layouts. Vehicle brands, sample customer names, technical configuration values, and user-entered content retain their original text.
- `src/style.css`: responsive design system and print styles, layered over Tailwind CSS.
- `public/assets/`: local SVG branding/illustrations and generated WebP imagery.

Bookings reference vehicle/customer/location IDs; payments and invoices reference booking/customer IDs; maintenance references vehicle IDs. Sample reporting uses the 2026 demonstration timeline. Booking defaults use the browser's current date. A page refresh intentionally resets login, favourites, newly created records, CMS edits, and configuration changes. There is no localStorage or remote persistence.

## Assets and branding

Original local horizontal, white, mobile, and compact SVG logos plus favicon. Photographic-style WebP assets were generated with the built-in image-generation tool and optimized locally. See `ASSETS.md` for provenance and prompts.

The fleet contains original category SVG illustrations and three model-specific generated renders. All are explicitly illustrative, not photographs of an actual rental fleet. Generated destinations and airport scenes are also illustrative. Do not use these assets as evidence of actual vehicle condition or agency premises. No runtime image host, web font, or external image URL is required.

## Tests

```bash
npm test
npx playwright install chromium
npm run test:e2e
```

The browser suite starts Vite automatically if needed and uses a locally available Chromium or Playwright's installed browser. It covers slider controls, catalogue filtering, all 20 detail pages, booking totals and invoice consistency, demo logins, admin actions/calendar/reports/settings, CMS banner changes, registration/support, date validation, language switching, RTL/mobile overflow, public routes, and image loading. Data tests verify fixture sizes, unique IDs, foreign keys, booking totals/dates, local asset existence, and translation key parity. Screenshots are saved under ignored `test-results/`.

## Vercel

Import this folder/repository into Vercel, choose **Vite**, use `npm run build`, and set the output directory to `dist`. No environment variables are needed. `vercel.json` rewrites client routes to `/index.html`, allowing direct links and refreshes on nested routes.

This project has not been published automatically. To deploy using the Vercel CLI after signing into your own account:

```bash
npx vercel
```

For another static host, serve `dist` and configure the equivalent SPA fallback to index.html. Deployment at the domain root is assumed; subfolder deployment requires configuring Vite's base and the router basename.

## Demonstration boundaries

This is production-build-ready **demo software**, not a production rental/payment/authentication system. It has no real booking inventory locking, account security, notifications, payment processing, document storage, persistent database, or external integration. Pricing rules and configuration screens provide editable demonstrations; they are not a commercial pricing engine. Policy text and sample tax/insurance terms need business and legal approval before commercial publication.

The eventual production solution is intended to be implemented with WordPress and an appropriate rental-management plugin/backend. Real authentication, server-side validation, availability locking, payment providers, invoicing rules, consent, translations of business content, and security controls belong to that separate production scope.

Admin bookings use a shared update path that synchronizes invoices, payments, and vehicle status. Invoice previews support printing and downloadable PDFs, including Arabic. TuniPay Demo simulates approved and declined payments alongside Pay on Pickup; it does not collect card information.
