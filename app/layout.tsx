import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pantry Tracker',
  description: 'Track your pantry items and recipes'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/asbestos.png" />
        <meta property="og:title" content="Amianthus Industries | Pantry Tracker" />
        <meta property="og:description" content="Track your pantry items and recipes" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pantry.amianth.us" />
        <meta property="og:image" content="https://pantry.amianth.us/asbestos.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Amianthus Industries | Pantry Tracker" />
        <meta name="twitter:description" content="Track your pantry items and recipes" />
        <meta name="twitter:image" content="https://pantry.amianth.us/asbestos.png" />
      </head>

      <body
        className={`${inter.className} overflow-hidden `}
        suppressHydrationWarning={true}
      >
        <SpeedInsights />
        <Analytics />
        <NextTopLoader showSpinner={false} />
        <Providers session={session}>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
