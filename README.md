# StudyGenius AI — Production Application

This is a full-stack Next.js application, not a static visual prototype.

## Included

### Core product
- AI Flashcard Studio
- AI Effective Summary Studio
- AI Explain Simply Studio

### Production foundations
- Email/password authentication
- Secure httpOnly sessions
- PostgreSQL persistence with Prisma
- User study history
- Daily character usage limit
- Server-side OpenAI API calls
- Input validation with Zod
- Retry UI
- Offline/slow-network messaging
- PWA manifest + service worker
- Mobile-first responsive UI
- Accessible form labels and touch-friendly controls
- Health endpoint

## Environment

Copy `.env.example` to `.env` and set:

DATABASE_URL
OPENAI_API_KEY
OPENAI_MODEL
SESSION_SECRET

Do not put the OpenAI key in client components.

## Database

For local schema setup:
npm install
npx prisma generate
npx prisma db push

For production, use PostgreSQL and run:
npx prisma migrate deploy

## Run

npm run dev

Then open http://localhost:3000

## Production deployment

Deploy the Next.js app to a Node/Next-compatible host and add all environment variables in the host dashboard.
Use a managed PostgreSQL database.
Run `prisma migrate deploy` during the deployment/build process as appropriate for your host.

## Important product note

This build is intentionally focused on the three features you requested. It does not pretend to include PDF/PPT/Word importing, payments, social features or other features that have not been implemented.

Before selling the hosted app, perform a production deployment test:
1. Create account
2. Sign in
3. Generate flashcards
4. Flip / next / previous / rate cards
5. Generate all summary lengths
6. Generate simple explanations
7. Refresh and verify saved history
8. Sign out / sign in again
9. Test on slow/offline network
10. Test API errors and retry
