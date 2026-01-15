export const metadata = {
  title: 'Terms of Service | SeniorJunior',
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Terms of Service</h1>
      <p className="mt-4 text-gray-300 leading-relaxed">
        By using SeniorJunior you agree to follow our community and mentoring guidelines and to use the platform responsibly.
      </p>

      <div className="mt-10 space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-white font-semibold">Respect & safety</h2>
          <p className="mt-2">
            Harassment, abuse, and discrimination are not tolerated. We may suspend accounts that violate these expectations.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-white font-semibold">Mentoring sessions</h2>
          <p className="mt-2">
            Mentoring is guidance, not guaranteed outcomes. Users are responsible for decisions made based on advice.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-white font-semibold">Service availability</h2>
          <p className="mt-2">
            We work to keep the platform reliable, but outages can happen. We continuously improve performance and security.
          </p>
        </section>
      </div>
    </div>
  );
}
