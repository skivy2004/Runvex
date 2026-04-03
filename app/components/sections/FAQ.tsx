'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/app/components/ui/interfaces-accordion'

const faqs = [
  {
    value: 'ai-scoring',
    question: 'Hoe werkt de AI scoring?',
    answer:
      'Onze AI analyseert elk inkomend lead op basis van gedrag, bedrijfsgrootte, sector en intentiesignalen. Elk lead krijgt een score van 0–10 en een prioriteitslabel: Hoog, Middel of Laag.',
  },
  {
    value: 'crm',
    question: "Welke CRM's integreren jullie?",
    answer:
      'We integreren met HubSpot, Salesforce, Pipedrive, ActiveCampaign en meer dan 50 andere tools via onze native integraties en Zapier/Make connectoren.',
  },
  {
    value: 'setup',
    question: 'Hoe lang duurt de setup?',
    answer:
      'De gemiddelde setup duurt minder dan 10 minuten. Je koppelt je formulier, verbindt je CRM en de automatisering staat live. Geen technische kennis vereist.',
  },
  {
    value: 'data',
    question: 'Wat gebeurt er met mijn leaddata?',
    answer:
      'Jouw data blijft van jou. We slaan leads op in een beveiligde database (Supabase) binnen de EU, voldoen aan AVG/GDPR en verkopen nooit data aan derden.',
  },
  {
    value: 'trial',
    question: 'Is er een gratis proefperiode?',
    answer:
      'Ja, de Gratis tier is permanent gratis tot 50 leads per maand. De betaalde plannen hebben een 14-daagse gratis proefperiode zonder creditcard.',
  },
  {
    value: 'cancel',
    question: 'Kan ik op elk moment opzeggen?',
    answer:
      'Ja, je kunt je abonnement op elk moment opzeggen zonder opzegtermijn. Je behoudt toegang tot het einde van de betaalperiode.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-14 md:py-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0.15, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{
              background: 'rgba(91,110,245,0.1)',
              border: '1px solid rgba(91,110,245,0.2)',
              color: '#5B6EF5',
            }}
          >
            Veelgestelde vragen
          </div>
          <h2
            className="font-bricolage font-extrabold text-3xl md:text-5xl text-white"
            style={{ letterSpacing: '-0.02em' }}
          >
            Alles wat je wil weten
          </h2>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0.15, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.value}
                value={faq.value}
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm leading-relaxed" style={{ color: '#8A8FA8' }}>
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
