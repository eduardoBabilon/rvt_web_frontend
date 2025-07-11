import React from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import '../styles/globals.css';
// import '../service/socket';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'MCC',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className=" flex flex-col flex-1 h-full w-full min-h-screen max-w-screen overflow-x-hidden bg-white">
            <Header>{children}</Header>
            <ReactQueryDevtools initialIsOpen={false} />
          </div>
        </Providers>
      </body>
    </html>
  );
}
