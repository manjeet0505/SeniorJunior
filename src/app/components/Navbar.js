"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full z-50 fixed top-0 left-0 flex items-center justify-between px-8 py-4 bg-white/50 backdrop-blur-xl shadow-xl rounded-b-2xl border-b border-white/40"
      style={{ minHeight: 72 }}>
      <Link href="/" className="flex items-center gap-2">
        <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent font-black text-2xl drop-shadow-sm tracking-tight rounded px-2 py-1">SeniorJunior</span>
      </Link>
      <div className="flex gap-2 md:gap-6 text-base font-semibold">
        <Link href="/dashboard" className="px-4 py-2 rounded-lg transition hover:bg-indigo-100/70 hover:text-indigo-700 active:bg-indigo-200 focus:outline-none">Dashboard</Link>
        <Link href="/resources" className="px-4 py-2 rounded-lg transition hover:bg-pink-100/70 hover:text-pink-700 active:bg-pink-200 focus:outline-none">Resources</Link>
        <Link href="/schedule" className="px-4 py-2 rounded-lg transition hover:bg-purple-100/70 hover:text-purple-700 active:bg-purple-200 focus:outline-none">Schedule</Link>
      </div>
    </nav>
  );
}

