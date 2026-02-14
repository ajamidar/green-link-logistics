// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Green Link Logistics",
  description: "Smart Route Optimization Dashboard",
};

// Inside src/app/layout.tsx

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <Sidebar />
        
        {/* UPDATED WRAPPER: 
            - 'pt-16': Push content down on mobile (for the Top Bar).
            - 'md:pt-0': Remove top padding on desktop.
            - 'md:pl-64': Add left padding ONLY on desktop (for the Sidebar).
        */}
        <div className="min-h-screen pt-16 md:pl-64 md:pt-0">
          <main className="p-4 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}