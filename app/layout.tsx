import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Letter Blog",
  description: "Letter Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col items-center min-h-screen py-2`}
        >
          <header className=" fixed flex justify-between items-center p-6 h-20 w-10/12 shadow-xs z-50 rounded-2xl border-2">
            <a href="/" className="font-extrabold text-2xl">
              Letter Blog
            </a>
            <div className="flex justify-end items-center p-6 gap-4">
              <SignedOut>
                <Button asChild variant={"outline"}>
                  <SignInButton />
                </Button>
                <Button asChild variant={"outline"}>
                  <SignUpButton />
                </Button>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
