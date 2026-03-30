import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Algemene Voorwaarden — Runvex' }

export default function AlgemeneVoorwaarden() {
  return (
    <main className="min-h-screen bg-[#0A0B0F] py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-bricolage font-bold text-3xl text-white mb-2">Algemene Voorwaarden</h1>
        <p className="text-[#8A8FA8] text-sm mb-12">Laatst bijgewerkt: maart 2026</p>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Identiteit</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Runvex B.V. (in oprichting), KvK: [PLACEHOLDER], BTW: [PLACEHOLDER], e-mail: info@runvex.nl
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Definities</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Dienst = het Runvex platform. Klant = de gebruiker. Overeenkomst = het abonnement.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Toepasselijkheid</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Deze voorwaarden zijn van toepassing op alle aanbiedingen, offertes en overeenkomsten tussen Runvex en de
            Klant.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Dienst</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Runvex biedt een SaaS-platform voor lead automatisering, AI-scoring en opvolging. Runvex spant zich in voor
            een beschikbaarheid van 99,5% per maand, maar geeft hierop geen garantie.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Prijzen en betaling</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Prijzen zijn in euro&apos;s exclusief BTW. Betaling geschiedt vooraf per maand of jaar. Bij niet-tijdige
            betaling wordt de toegang opgeschort.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Looptijd en opzegging</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Maandabonnementen kunnen maandelijks worden opgezegd met 1 dag opzegtermijn. Jaarabonnementen kunnen worden
            opgezegd voor het einde van de looptijd.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Aansprakelijkheid</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            De aansprakelijkheid van Runvex is beperkt tot het bedrag dat in de drie maanden voorafgaand aan het incident
            is betaald. Runvex is niet aansprakelijk voor indirecte schade of gevolgschade.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Toepasselijk recht</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter
            te Amsterdam.
          </p>
        </section>
      </div>
    </main>
  )
}
