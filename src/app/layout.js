import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-plus-jakarta-sans',
});

export const metadata = {
  title: "Senior Junior Connect",
  description: "Platform connecting senior and junior developers",
};

import AdvancedNavbar from "@/app/components/AdvancedNavbar";
import FloatingChat from "@/components/chat/FloatingChat";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased bg-space-navy text-gray-300`}>
        <AuthProvider>
          <SmoothScroll>
            <div id="top" />
            <AdvancedNavbar />
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <FloatingChat />
            </div>
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
