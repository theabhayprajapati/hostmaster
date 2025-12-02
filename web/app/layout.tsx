import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HostMaster - The Native /etc/hosts Manager for macOS & Linux",
    template: "%s | HostMaster"
  },
  description: "HostMaster is a modern, secure, and native application to manage your /etc/hosts file. Built with Tauri and Rust for performance. Features dark mode, syntax highlighting, and zero-latency.",
  keywords: ["hosts file", "etc/hosts", "macOS", "Linux", "Tauri", "Rust", "developer tools", "network manager", "dns", "localhost"],
  authors: [{ name: "Abhay Prajapati", url: "https://github.com/theabhayprajapati" }],
  creator: "Abhay Prajapati",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hostmaster.vercel.app",
    title: "HostMaster - Master your hosts file with confidence",
    description: "The modern, native /etc/hosts manager for macOS and Linux. Built with Tauri and Rust.",
    siteName: "HostMaster",
    images: [
      {
        url: "/dark-mode-app.png",
        width: 1200,
        height: 630,
        alt: "HostMaster Application Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HostMaster - The Native /etc/hosts Manager",
    description: "Stop editing text files with sudo. Use HostMaster for a secure, native experience.",
    images: ["/dark-mode-app.png"],
    creator: "@theabhayprajapati",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
