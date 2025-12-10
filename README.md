# Aurora Commerce · Next.js + Firebase Webshop Template

Aurora Commerce is a production-ready e-commerce starter built with Next.js 15 App Router, Firebase, shadcn/ui, next-intl, next-themes, and GSAP-powered hero animations. It delivers a public storefront with multilingual support, persistent cart/favourites, and a secure Firebase-authenticated admin dashboard for managing catalogue data.

## ✨ Features

- **Modern storefront** with GSAP hero animation, product dialogs, newsletter popup (30-day cooldown), and persistent cart/favourites stored in `localStorage`.
- **Internationalisation** powered by `next-intl` with URL-based `sv` and `en` locales, language switcher, and locale-aware middleware.
- **Theme switching** via `next-themes` (light/dark/system) persisted per user.
- **Firebase integration** using only environment variables for both client SDK and Admin SDK (no secrets in source).
- **Admin dashboard** secured by Firebase Auth custom admin claims, featuring CRUD flows for products, categories, newsletters, and store settings, plus CSV export and image uploads to Firebase Storage.
- **Reusable shadcn/ui component library** (buttons, cards, dialogs, tabs, inputs) styled with Tailwind CSS 4.
- **Utility scripts** for seeding sample catalogue data and managing admin claims.
- **Firestore & Storage security rules** aligned with the provided data model and public access requirements.

## 🛠️ Project structure

```
app/
  [locale]/...         # Locale-aware storefront routes
  admin/...            # Auth-protected admin dashboard
components/            # Reusable storefront + admin UI
lib/                   # Firebase, i18n, and data helpers
scripts/               # Node scripts (seed + set admin claim)
data/seed-data.ts      # Demo catalogue definitions
firestore.rules        # Firestore security configuration
storage.rules          # Firebase Storage security configuration
```

## 🔐 Environment configuration

Create an `.env.local` file by copying `.env.example` and filling in the Firebase project credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
FIREBASE_SERVICE_ACCOUNT_KEY=
```

- `NEXT_PUBLIC_FIREBASE_*` values come from the Firebase console (Project settings → General).
- `FIREBASE_SERVICE_ACCOUNT_KEY` must contain the **JSON string** of a service account with Admin permissions. When deploying to Vercel, store this as an encrypted project secret (e.g. `vercel env add FIREBASE_SERVICE_ACCOUNT_KEY`).

> ⚠️ Do **not** commit actual credentials. The template only reads configuration from environment variables.

## 🚀 Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` – you will be redirected to `/en` with the hero animation, language selector, and product modals.

### Firebase initialisation

1. Enable **Authentication (Email/Password)**, **Firestore**, **Storage**, and **Analytics** (optional) in Firebase console.
2. Import the Firestore & Storage rules:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```
3. Seed demo data (optional but recommended):
   ```bash
   # Requires FIREBASE_SERVICE_ACCOUNT_KEY in your environment
   npx tsx scripts/seed.ts
   ```
4. Create an admin user in Firebase Auth and set the custom claim:
   ```bash
   npx tsx scripts/setAdminClaim.ts <UID>
   ```
   Afterwards sign in at `/admin/login` with that user.

## 🧩 Admin dashboard

- Login: `/admin/login` (Email + Password auth). Only users with the `admin` custom claim or listed in `siteSettings.adminUids` can write data.
- Product management: create/edit products with GSAP-enhanced storefront previews, image uploads to Firebase Storage, and dialog-driven product cards.
- Categories: maintain catalogue groupings with sort orders.
- Newsletters: review submissions (footer + popup) and export to CSV.
- Settings: adjust store name/colours and manage admin user IDs.

## 🧰 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js development server |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint checks |
| `npx tsx scripts/seed.ts` | Seed Firestore with demo data |
| `npx tsx scripts/setAdminClaim.ts <UID>` | Grant Firebase admin claim to a user |

## 🌐 Deployment

### Vercel

1. Add all environment variables (including `FIREBASE_SERVICE_ACCOUNT_KEY`) in Vercel project settings.
2. Deploy the repository – Vercel will handle Next.js App Router, Middleware, and Edge rendering automatically.
3. Ensure Firebase rules are deployed separately via the Firebase CLI.

### Firebase Hosting or other platforms

1. Build the app with `npm run build`.
2. Serve the output using Firebase Hosting or any Node-compatible hosting solution.
3. Remember to configure rewrites for the App Router if using Firebase Hosting.

## 📐 Lighthouse & accessibility

The template ships with semantic markup, accessible components, motion preferences, and responsive layout. For best performance in production, enable caching/CDN via your hosting provider.

## 🤝 Contributing

The template is designed as a starting point. Fork, extend with your CMS/catalogue, and tailor the styles, animations, and data integrations to your needs.
