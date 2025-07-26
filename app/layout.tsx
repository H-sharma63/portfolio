'use client';

// This file defines the root layout for the Next.js application.
// It wraps all pages and provides a consistent structure, including
// global styles, font loading, and session provisioning.

import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from '@vercel/speed-insights/next';
// import type { Metadata } from 'next'; 

// Configure and load the custom 'Satoshi' font.
// This font is loaded locally from the 'public/fonts' directory
// and includes various weights to be used throughout the application.
const satoshi = localFont({
  src: [
    { path: './fonts/Satoshi-Light.woff2', weight: '300', style: 'normal' },
    { path: './fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/Satoshi-Bold.woff2', weight: '700', style: 'normal' },
    { path: './fonts/Satoshi-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-satoshi', // CSS variable for easy access to the font
  display: 'swap', // Ensures text remains visible during font loading
});

// Metadata is typically defined in `layout.tsx` for server components
// to provide SEO information. Although this is a client component,
// the commented-out metadata shows where it would typically be placed.
// export const metadata: Metadata = {
//    title: "Harshit Sharma",
//    description: "Portfolio of Harshit Sharma",
// };

/**
 * RootLayout component that defines the main structure of the application.
 * It wraps all child pages and components, providing shared elements like
 * the HTML structure, body classes for font application, and session context.
 *
 * @param {React.ReactNode} children - The content of the current page or nested layout.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
         <title>Harshit Sharma Portfolio</title>
        {/* Head content can include meta tags, title, links to favicons, etc. */}
        {/* Currently empty, but can be extended as needed. */}
      </head>
      {/* Apply the custom font and hide horizontal overflow for a cleaner layout. */}
      <body className={`${satoshi.variable} font-satoshi overflow-x-hidden`}>
        {/* SessionProvider from next-auth/react makes the authentication session
            available to all client components within the application. */}
        <SessionProvider>
          {children}
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
        {/* Vercel Analytics and Speed Insights components for performance monitoring. */}
      </body>
    </html>
  );
}
