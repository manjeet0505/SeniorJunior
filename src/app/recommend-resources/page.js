import Link from 'next/link';

export const metadata = {
  title: 'Recommend Resources | SeniorJunior',
};

export default function RecommendResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Recommend Resources</h1>
      <p className="mt-4 text-gray-300 leading-relaxed">
        Share high-signal articles, repos, and videos that help juniors build real skills.
      </p>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h2 className="text-white font-semibold">Explore the current library</h2>
        <p className="mt-2 text-sm text-gray-300">See what’s already available before recommending new resources.</p>
        <div className="mt-4">
          <Link href="/resources" className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors">
            Go to Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
