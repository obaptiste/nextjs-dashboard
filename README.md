# Next.js Dashboard Application

This project is a comprehensive Next.js dashboard application for managing customers and invoices with real-time analytics.

The application provides a robust platform for businesses to track their financial data, manage customer relationships, and visualize revenue trends. It leverages Next.js 15 for server-side rendering and routing, React 18 for building interactive user interfaces, and Tailwind CSS for responsive and customizable styling.

Key features include:
- Customer management with detailed profiles and invoice history
- Invoice creation, editing, and tracking
- Real-time revenue analytics and visualizations
- Secure authentication system
- Responsive design for desktop and mobile devices

The dashboard is built with performance and scalability in mind, utilizing Vercel's analytics and speed insights to ensure optimal user experience. It also integrates with Vercel Postgres for efficient data storage and retrieval.

## Repository Structure

```
.
├── app/
│   ├── dashboard/
│   │   ├── (overview)/
│   │   ├── customers/
│   │   ├── invoices/
│   │   └── layout.tsx
│   ├── lib/
│   ├── login/
│   ├── seed/
│   ├── ui/
│   ├── layout.tsx
│   └── page.tsx
├── auth.config.ts
├── auth.ts
├── middleware.ts
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

### Key Files:
- `app/dashboard/`: Contains the main dashboard components and pages
- `app/lib/`: Utility functions and data fetching logic
- `app/ui/`: Reusable UI components
- `app/login/`: Authentication-related components
- `auth.ts`: Authentication configuration
- `middleware.ts`: Next.js middleware for route protection
- `tailwind.config.ts`: Tailwind CSS configuration

### Important Integration Points:
- `app/lib/data.ts`: Database queries and data fetching functions
- `auth.ts`: NextAuth.js integration for authentication
- `app/seed/route.ts`: Database seeding functionality

## Usage Instructions

### Installation

Prerequisites:
- Node.js version 20.12.0 or higher
- pnpm package manager

To install the application, follow these steps:

1. Clone the repository
2. Navigate to the project directory
3. Run `pnpm install` to install dependencies

### Getting Started

To start the development server:

```bash
pnpm run dev
```

This will start the application on `http://localhost:3000`.

### Configuration

The application uses environment variables for configuration. Create a `.env.local` file in the root directory with the following variables:

```
DATABASE_URL=your_postgres_database_url
NEXTAUTH_SECRET=your_nextauth_secret
```

### Common Use Cases

1. Viewing Dashboard Overview:
   Navigate to `/dashboard` to see an overview of revenue, latest invoices, and key metrics.

2. Managing Customers:
   Go to `/dashboard/customers` to view, add, or edit customer information.

3. Managing Invoices:
   Access `/dashboard/invoices` to create, view, or edit invoices.

### Testing & Quality

To run linting:

```bash
pnpm run lint
```

### Troubleshooting

Common Issue: Database Connection Errors
- Problem: Unable to connect to the database
- Solution: 
  1. Check if the `DATABASE_URL` in `.env.local` is correct
  2. Ensure the Postgres server is running
  3. Verify network connectivity to the database server

Debugging:
- Enable verbose logging by setting `DEBUG=true` in `.env.local`
- Check the console output for detailed error messages
- Inspect network requests in the browser's developer tools

## Data Flow

The application follows a server-side rendering approach with Next.js. Here's an overview of the data flow:

1. User requests a page (e.g., dashboard)
2. Next.js server receives the request
3. Server-side components fetch data from the Postgres database
4. Page is rendered on the server with the fetched data
5. Rendered page is sent to the client
6. Client-side React hydrates the page, making it interactive

```
[User] -> [Next.js Server] -> [Database]
                           <- [Fetched Data]
           [Rendered Page] <- 
[User] <- [Hydrated Page]
```

Important technical considerations:
- Server-side rendering improves initial load time and SEO
- Client-side React enables dynamic updates without full page reloads
- Database queries are optimized and cached for performance

## Deployment

### Prerequisites
- Vercel account
- Vercel Postgres database set up

### Deployment Steps
1. Push your code to a GitHub repository
2. Log in to your Vercel account
3. Create a new project and link it to your GitHub repository
4. Configure environment variables in Vercel dashboard
5. Deploy the application

### Monitoring Setup
- Enable Vercel Analytics and Speed Insights in your Vercel project settings
- Monitor application performance and user behavior through the Vercel dashboard

## Infrastructure

The application uses Vercel Postgres for data storage. Key infrastructure components include:

- Database Tables:
  - `users`: Stores user authentication information
  - `customers`: Contains customer data
  - `invoices`: Stores invoice information
  - `revenue`: Tracks monthly revenue data

- Serverless Functions:
  - `app/seed/route.ts`: Handles database seeding

The database schema and seeding logic are defined in `app/seed/route.ts`, which creates the necessary tables and populates them with initial data.