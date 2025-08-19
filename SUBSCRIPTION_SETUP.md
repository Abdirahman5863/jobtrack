# Subscription System Setup Guide

This guide will help you set up the subscription system with Paystack integration for your job tracker app.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URLs (for Prisma)
DATABASE_URL=postgresql://user:password@host:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://user:password@host:5432/postgres

# Paystack Payment Integration
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLISHABLE_KEY=your_paystack_publishable_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

1. Run the SQL scripts in your Supabase SQL editor:

```sql
-- Run scripts/002_create_clerk_users_and_jobs.sql first
-- Then run scripts/003_create_subscriptions_table.sql
```

2. Update Prisma schema and push to database:

```bash
npx prisma generate
npx prisma db push
```

## Paystack Setup

1. Create a Paystack account at https://paystack.com
2. Get your API keys from the Paystack dashboard
3. Add the keys to your environment variables
4. Configure webhook endpoints (optional for production)

## Subscription Plans

The system includes two plans:

- **Free Plan**: Up to 5 job applications
- **Pro Plan**: $5/month for unlimited job applications

## Features

- Automatic job limit enforcement
- Paystack payment processing
- Subscription status tracking
- Upgrade prompts when limit is reached
- Secure payment verification

## API Endpoints

- `POST /api/subscription/checkout` - Create Paystack checkout session
- `GET /api/subscription/success` - Handle successful payments

## Testing

1. Add 5 job applications to reach the free limit
2. Try to add a 6th job - you should see the upgrade banner
3. Click "Upgrade to Pro" to test the payment flow
4. Complete payment to unlock unlimited jobs

## Production Deployment

1. Update `NEXT_PUBLIC_APP_URL` to your production domain
2. Configure Paystack webhooks for payment notifications
3. Set up proper error handling and logging
4. Test the complete payment flow in production
