import './globals.css';
import { Inter, Outfit } from 'next/font/google';
import ReduxProvider from '../redux/Provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  title: 'mediQuip',
  description: 'Medical Equipment Platform',
};

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} font-sans`}>
      <body className="bg-bg text-text antialiased min-h-screen flex flex-col">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <ReduxProvider>
            <main className="flex-grow flex flex-col">{children}</main>
          </ReduxProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
