import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Portfolia | Create Your Student Portfolio in Minutes",
  description: "The easiest way for students to build, manage, and share professional portfolios. Choose from premium templates and land your dream job.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-inter antialiased`}>
        <Navbar />
        <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
          {children}
        </main>
        <Footer />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1f1f1f',
              color: '#fff',
              border: '1px solid #262626',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}
