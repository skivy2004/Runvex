import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacybeleid — Runvex' }

export default function Privacybeleid() {
  return (
    <main className="min-h-screen bg-[#0A0B0F] py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-bricolage font-bold text-3xl text-white mb-2">Privacybeleid</h1>
        <p className="text-[#8A8FA8] text-sm mb-12">Laatst bijgewerkt: maart 2026</p>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Verwerkingsverantwoordelijke</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Runvex B.V. (in oprichting), gevestigd in Nederland. KvK-nummer: [PLACEHOLDER]. E-mail: privacy@runvex.nl
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Welke gegevens verzamelen wij</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Wij verzamelen de volgende persoonsgegevens wanneer u een formulier invult of een afspraak boekt: naam,
            e-mailadres, telefoonnummer (optioneel), bedrijfsnaam, uw vraag of bericht, en IP-adres.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Doel van de verwerking</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Uw gegevens worden uitsluitend gebruikt voor het verwerken van uw aanvraag, het opvolgen van uw lead en het
            inplannen van een kennismakingsgesprek. Wij gebruiken uw gegevens niet voor marketingdoeleinden zonder uw
            expliciete toestemming.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Bewaartermijn</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Wij bewaren uw persoonsgegevens maximaal 1 jaar na het laatste contact, tenzij wettelijke verplichtingen een
            langere bewaartermijn vereisen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Derde partijen (verwerkers)</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Wij maken gebruik van de volgende verwerkers, met wie een verwerkersovereenkomst is gesloten: Supabase Inc.
            (gegevensopslag, VS/EU), Resend Inc. (e-mailverzending, VS), n8n GmbH (automatisering, DE). Geen van deze
            partijen mag uw gegevens gebruiken voor eigen doeleinden.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Uw rechten</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            U heeft het recht op inzage, correctie, verwijdering en overdracht van uw gegevens. Neem hiervoor contact op
            via privacy@runvex.nl. Wij reageren binnen 30 dagen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Cookies</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Wij gebruiken alleen functionele cookies die noodzakelijk zijn voor de werking van de website. Analytische of
            marketingcookies worden alleen geplaatst na uw toestemming.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-3">Contact</h2>
          <p className="text-[#8A8FA8] leading-relaxed">
            Voor privacyvragen: privacy@runvex.nl
          </p>
        </section>
      </div>
    </main>
  )
}
