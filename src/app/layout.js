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
import CurrentYear from "@/app/components/CurrentYear";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased bg-space-navy text-gray-300`}>
        <SmoothScroll>
          <AdvancedNavbar />
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-black/30 backdrop-blur-xl border-t border-white/10 pt-20 pb-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                  {/* Column 1: Brand & Socials */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <h2 className="text-2xl font-bold text-white">SeniorJunior</h2>
                    <p className="text-gray-400 mt-4 text-sm">Connecting ambition with experience.</p>
                    <div className="flex space-x-4 mt-6">
                      {/* Social Icons Here */}
                    </div>
                  </div>

                  {/* Column 2: Product */}
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h3>
                    <ul className="mt-4 space-y-3">
                      <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Features</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Pricing</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Updates</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Careers</a></li>
                    </ul>
                  </div>

                  {/* Column 3: Company */}
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
                    <ul className="mt-4 space-y-3">
                      <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">About</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Blog</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Careers</a></li>
                    </ul>
                  </div>

                  {/* Column 4: Stay Updated */}
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Stay Updated</h3>
                    <div className="mt-4 flex">
                      <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" suppressHydrationWarning />
                      <button className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-r-md hover:bg-white/20 transition-colors duration-300" suppressHydrationWarning>Subscribe</button>
                    </div>
                  </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
                  <p className="text-sm text-gray-500">&copy; <CurrentYear /> SeniorJunior. All rights reserved.</p>
                  <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  </a>
                </div>
              </div>
            </footer>
            <FloatingChat />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
