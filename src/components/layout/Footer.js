'use client';

import Link from 'next/link';
import CurrentYear from '@/app/components/CurrentYear';
import { useAuthContext } from '@/components/auth/AuthContext';
import { FOOTER_LINKS } from '@/components/layout/footerLinks';

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="group inline-flex w-fit text-sm text-gray-400 transition-colors duration-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-md"
    >
      <span className="relative">
        {children}
        <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-white/40 transition-all duration-300 group-hover:w-full" />
      </span>
    </Link>
  );
}

export default function Footer() {
  const { role } = useAuthContext();

  const normalizedRole = role === 'junior' || role === 'senior' ? role : null;
  const roleSection = normalizedRole ? FOOTER_LINKS.roleSections[normalizedRole] : null;

  return (
    <footer className="relative isolate bg-black/30 backdrop-blur-md border-t border-white/10 pt-16 pb-10">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/10 via-white/20 to-white/10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-4">
              <div>
                <Link href="/" className="inline-flex items-center">
                  <span className="text-xl font-semibold tracking-tight text-white">SeniorJunior</span>
                </Link>
              </div>

              <p className="text-sm text-gray-400 max-w-md leading-relaxed">
                AI-guided learning with real mentorship.
                Practical, steady progress—one focused step at a time.
              </p>

              <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-white/60" aria-label="Platform capabilities">
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-white/30" />
                  AI-guided learning paths
                </li>
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-white/30" />
                  Mentor-recommended resources
                </li>
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-white/30" />
                  Cost-efficient AI summaries
                </li>
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-white/30" />
                  Scalable architecture
                </li>
              </ul>

              <Link
                href="/resources"
                aria-label="Explore AI-guided learning"
                className="mt-3 inline-flex w-fit items-center text-sm text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-md"
              >
                Explore AI-guided learning →
              </Link>
            </div>
          </div>

          {roleSection ? (
            <div>
              <h3 className="text-xs font-semibold text-white/80 tracking-wider uppercase">
                {roleSection.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {roleSection.links.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <h3 className="text-xs font-semibold text-white/80 tracking-wider uppercase">Explore</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <FooterLink href="/resources">Resources</FooterLink>
                </li>
                <li>
                  <FooterLink href="/community">Community</FooterLink>
                </li>
                <li>
                  <FooterLink href="/dashboard">Dashboard</FooterLink>
                </li>
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-white/80 tracking-wider uppercase">
              {FOOTER_LINKS.common.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.common.links.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            &copy; <CurrentYear /> SeniorJunior. All rights reserved.
          </p>

          <Link
            href="#top"
            aria-label="Back to top"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Back to top
          </Link>
        </div>
      </div>
    </footer>
  );
}
