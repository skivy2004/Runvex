'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const faqs = [
  {
    question: 'Hoe werkt de AI scoring?',
    answer:
      'Onze AI analyseert elk inkomend lead op basis van gedrag, bedrijfsgrootte, sector en intentiesignalen. Elk lead krijgt een score van 0–100 en een prioriteitslabel: Hoog, Middel of Laag.',
  },
  {
    question: 'Welke CRM\'s integreren jullie?',
    answer:
      'We integreren met HubSpot, Salesforce, Pipedrive, ActiveCampaign en meer dan 50 andere tools via onze native integraties en Zapier/Make connectoren.',
  },
  {
    question: 'Hoe lang duurt de setup?',
    answer:
      'De gemiddelde setup duurt minder dan 10 minuten. Je koppelt je formulier, verbindt je CRM en de automatisering staat live. Geen technische kennis vereist.',
  },
  {
    question: 'Wat gebeurt er met mijn leaddata?',
    answer:
      'Jouw data blijft van jou. We slaan leads op in een beveiligde database (Supabase) binnen de EU, voldoen aan AVG/GDPR en verkopen nooit data aan derden.',
  },
  {
    question: 'Is er een gratis proefperiode?',
    answer:
      'Ja, de Gratis tier is permanent gratis tot 50 leads per maand. De betaalde plannen hebben een 14-daagse gratis proefperiode zonder creditcard.',
  },
  {
    question: 'Kan ik op elk moment opzeggen?',
    answer:
      'Ja, je kunt je abonnement op elk moment opzeggen zonder opzegtermijn. Je behoudt toegang tot het einde van de betaalperiode.',
  },
]

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="flex-shrink-0 transition-transform duration-200"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <path
        d="M4.5 6.75L9 11.25L13.5 6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FAQItem({ faq, index }: { faq: (typeof faqs)[number]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-white">{faq.question}</span>
        <span style={{ color: 'var(--text-2)' }}>
          <ChevronIcon open={open} />
        </span>
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
            {faq.answer}
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
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
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {faqs.map((faq, i) => (
            <FAQItem key={faq.question} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
