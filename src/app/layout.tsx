
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Inter } from 'next/font/google';
import { PWAProvider } from '@/hooks/PWAProvider';
import { FirebaseClientProvider } from '@/firebase';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Unio Premium Video Platform',
  description: 'High-end video call platform built with Next.js and Jitsi',
  manifest: '/manifest.json',
  icons: {
    icon: '/image/favicon.ico',
    apple: '/image/apple-touch-icon.png',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  }
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://iglesia.unio.my/external_api.js" async />
      </head>
      <body className={`${inter.variable} font-body bg-background text-foreground antialiased`}>
        <FirebaseClientProvider>
          <PWAProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </PWAProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
