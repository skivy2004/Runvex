// app/components/sections/HowItWorksSection.tsx
import { SectionContainer, SectionTitle } from "@/components/sections/layout";
import { FeatureStep } from "./FeatureStep"; // Aanname: dit component bestaat of moet worden aangepast

export default function HowItWorksSection() {
  return (
    <SectionContainer id="hoe-het-werkt" className="py-24 md:py-32">
      <SectionTitle 
        title="Hoe Werkt Runvex?" 
        subtitle="Van lead-intake tot follow-up, alles geautomatiseerd en getracked."
      />
      <div className="mt-16 space-y-20">
        <FeatureStep 
          title="1. Lead Inname & Scoring" 
          description="Een lead komt binnen via uw website of andere kanalen. Onze systemen vangen de data direct op en laten Claude AI de lead score, sector en prioriteit bepalen."
          icon="/icons/ai-score.svg" // Dit icoon moet bestaan
          color="from-[#5B6EF5] to-[#7B8FF8]"
        />
        <FeatureStep 
          title="2. Automatische Actie & Planning" 
          description="Afhankelijk van de score en de ingevulde data, plant Runvex automatisch de juiste volgende stap: een follow-up e-mail, een agenda-call, of een taak voor uw team."
          icon="/icons/calendar-flow.svg" // Dit icoon moet bestaan
          color="from-[#7B8FF8] to-[#5B6EF5]"
        />
        <FeatureStep 
          title="3. Centralisatie & Uitsluiting" 
          description="Alle interacties, scores en geschiedenis worden direct in Supabase vastgelegd. U ziet één 360 graden overzicht, waardoor u geen enkele lead meer mist."
          icon="/icons/database.svg" // Dit icoon moet bestaan
          color="from-[#5B6EF5] to-[#5B6EF5]"
        />
      </div>
    </SectionContainer>
  );
}