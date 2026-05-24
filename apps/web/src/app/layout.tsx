import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'OpsCore — Enterprise Operations Intelligence',
  description: 'Unify operations data, monitor KPIs, and resolve incidents with AI-assisted diagnostics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg-app font-sans text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
