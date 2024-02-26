import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AppProvider from "@/components/AppContext.js";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({ subsets: ["latin"], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  title: "Biryani Mowa",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={roboto.className} style={{backgroundColor: '#f7e9da'}}>
        <main className="max-w-4xl mx-auto p-4">
          <AppProvider>
            <Toaster />
            <Header />
            {children}
            <footer className="border-t border-slate-400 p-8 text-center text-slate-500 mt-16">
              &copy; {new Date().getFullYear()}
            </footer>
          </AppProvider>
        </main>
      </body>
    </html>
  );
}