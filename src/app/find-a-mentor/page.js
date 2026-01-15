import Link from 'next/link';

export const metadata = {
  title: 'Find a Mentor | SeniorJunior',
};

export default function FindAMentorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Find a Mentor</h1>
      <p className="mt-4 text-gray-300 leading-relaxed">
        Discover seniors who can help you unblock faster, plan your next steps, and prepare for high-impact interviews.
      </p>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h2 className="text-white font-semibold">Quick links</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/seniors" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 hover:bg-white/10 transition-colors">
            Browse Seniors
          </Link>
          <Link href="/schedule" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 hover:bg-white/10 transition-colors">
            Schedule a Session
          </Link>
        </div>
      </div>
    </div>
  );
}
