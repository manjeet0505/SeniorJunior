export const metadata = {
  title: 'Privacy Policy | SeniorJunior',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-gray-300 leading-relaxed">
        SeniorJunior respects your privacy. We only collect the data needed to operate the platform (authentication, profiles,
        and session-related activity).
      </p>

      <div className="mt-10 space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-white font-semibold">Data we store</h2>
          <p className="mt-2">
            Account identity, role (Junior/Senior), profile information you choose to provide, and platform usage required for
            messaging and sessions.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-white font-semibold">How we use it</h2>
          <p className="mt-2">
            To connect juniors with mentors, power personalized recommendations, and improve reliability and safety.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-white font-semibold">Contact</h2>
          <p className="mt-2">For privacy questions, contact us via the Contact page.</p>
        </section>
      </div>
    </div>
  );
}
