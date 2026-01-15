import Link from 'next/link';

export const metadata = {
  title: 'Community | SeniorJunior',
};

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Community</h1>
      <p className="mt-4 text-gray-300 leading-relaxed">
        A high-signal space for developers to share wins, ask for feedback, and learn from real experience.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/resources" className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/10 transition-colors">
          <h2 className="text-white font-semibold">Resources</h2>
          <p className="mt-2 text-sm text-gray-300">Curated learning content and practical guides.</p>
        </Link>
        <Link href="/messages" className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/10 transition-colors">
          <h2 className="text-white font-semibold">Messages</h2>
          <p className="mt-2 text-sm text-gray-300">Connect 1:1 with mentors and peers.</p>
        </Link>
      </div>
    </div>
  );
}
