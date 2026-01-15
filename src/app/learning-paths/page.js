import Link from 'next/link';

export const metadata = {
  title: 'Learning Paths | SeniorJunior',
};

export default function LearningPathsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Learning Paths</h1>
      <p className="mt-4 text-gray-300 leading-relaxed">
        Structured growth tracks to help you build fundamentals, ship projects, and prepare for real interviews.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-white font-semibold">Backend Foundations</h2>
          <p className="mt-2 text-sm text-gray-300">APIs, databases, auth, testing, and deployment.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-white font-semibold">Frontend Foundations</h2>
          <p className="mt-2 text-sm text-gray-300">UI systems, accessibility, performance, and product thinking.</p>
        </div>
      </div>

      <div className="mt-10">
        <Link href="/find-a-mentor" className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors">
          Find a Mentor
        </Link>
      </div>
    </div>
  );
}
