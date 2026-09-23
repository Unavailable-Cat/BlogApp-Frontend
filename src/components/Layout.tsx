import { type ReactNode } from 'react';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-ink-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-ink-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-ink-400">
          <p>Inkwell — a place for words that matter.</p>
        </div>
      </footer>
    </div>
  );
}
