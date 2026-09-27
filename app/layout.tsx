import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'FixMate | Reliable Home Services, Simplified',
  description: 'Connect with trusted, verified professionals for home repairs, plumbing, electrical, AC servicing, carpentry, painting, and appliance maintenance.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-mintCream text-prussianBlue min-h-screen">
        {children}
      </body>
    </html>
  );
}
