import type { Metadata } from 'next'
import './globals.css'
import React from 'react'

export const metadata: Metadata = {
  title: 'Koli55 Vapi Integration',
  description: 'Frontend for Vapi-powered assistants',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <nav className="container mx-auto">
            <h1 className="text-xl font-bold">Koli55 Vapi Platform</h1>
          </nav>
        </header>

        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>

        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>&copy; {new Date().getFullYear()} Koli55. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
} 