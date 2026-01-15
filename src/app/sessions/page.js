import Link from 'next/link';

export const metadata = {
  title: 'Sessions | SeniorJunior',
};

export default function SessionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Sessions</h1>
      <p className="mt-4 text-gray-300 leading-relaxed">
        View upcoming mentoring sessions, review notes, and keep your learning plan on track.
      </p>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h2 className="text-white font-semibold">Schedule</h2>
        <p className="mt-2 text-sm text-gray-300">Book a new session or check availability.</p>
        <div className="mt-4">
          <Link href="/schedule" className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors">
            Go to Schedule
          </Link>
        </div>
      </div>
    </div>
  );
}
