import Link from 'next/link';

export const metadata = {
  title: 'Mentor Dashboard | SeniorJunior',
};

export default function MentorDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Mentor Dashboard</h1>
      <p className="mt-4 text-gray-300 leading-relaxed">
        Manage your mentoring activity: upcoming sessions, requests, and the resources you recommend.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/sessions" className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/10 transition-colors">
          <h2 className="text-white font-semibold">Sessions</h2>
          <p className="mt-2 text-sm text-gray-300">View and manage upcoming sessions.</p>
        </Link>
        <Link href="/recommend-resources" className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/10 transition-colors">
          <h2 className="text-white font-semibold">Recommend Resources</h2>
          <p className="mt-2 text-sm text-gray-300">Share high-quality learning materials with juniors.</p>
        </Link>
      </div>
    </div>
  );
}
