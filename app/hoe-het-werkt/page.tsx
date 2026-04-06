// app/hoe-het-werkt/page.tsx
import { SectionTitle, FeatureStep } from "@/components/sections/HowItWorks";

export default function HowItWorksPage() {
  return (
    <section id="hoe-het-werkt" className="py-24 md:py-32 bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Belangrijk: Dit moet de globale styling volgen */}
        <SectionTitle 
          title="Hoe Werkt Runvex?" 
          subtitle="Van lead-intake tot follow-up, alles geautomatiseerd en getracked."
        />

        <div className="mt-16 space-y-20">
          {/* Stap 1 */}
          <FeatureStep 
            title="1. Lead Inname & Scoring" 
            description="Een lead komt binnen via uw website of andere kanalen. Onze systemen vangen de data direct op en laten Claude AI de lead score, sector en prioriteit bepalen."
            icon="/icons/ai-score.svg"
            color="from-[#5B6EF5] to-[#7B8FF8]"
          />
          
          {/* Stap 2 */}
          <FeatureStep 
            title="2. Automatische Actie & Planning" 
            description="Afhankelijk van de score en de ingevulde data, plant Runvex automatisch de juiste volgende stap: een follow-up e-mail, een agenda-call, of een taak voor uw team."
            icon="/icons/calendar-flow.svg"
            color="from-[#7B8FF8] to-[#5B6EF5]"
          />

          {/* Stap 3 */}
          <FeatureStep 
            title="3. Centralisatie & Uitsluiting" 
            description="Alle interacties, scores en geschiedenis worden direct in Supabase vastgelegd. U ziet één 360 graden overzicht, waardoor u geen enkele lead meer mist."
            icon="/icons/database.svg"
            color="from-[#5B6EF5] to-[#5B6EF5]"
          />
        </div>
      </div>
    </section>
  );
}