'use client'

import { useState, useEffect } from 'react'
import Step1Form from './Step1Form'
import Step2Calendar from './Step2Calendar'
import Step3Confirmation from './Step3Confirmation'

export type FormData = {
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
  date: string
  time: string
}

const INITIAL_FORM_DATA: FormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  message: '',
  date: '',
  time: '',
}

interface BookingFlowProps {
  onStepChange?: (step: 1 | 2 | 3) => void
}

export type AvailabilityData = { dates: Record<string, string[]> }

export default function BookingFlow({ onStepChange }: BookingFlowProps = {}) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [visible, setVisible] = useState(true)
  const [availability, setAvailability] = useState<AvailabilityData | null>(null)
  const [loadingAvail, setLoadingAvail] = useState(true)
  const [availError, setAvailError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/booking/availability')
      .then((r) => r.json())
      .then((data: AvailabilityData) => { setAvailability(data); setLoadingAvail(false) })
      .catch(() => { setAvailError('Beschikbaarheid kon niet worden geladen.'); setLoadingAvail(false) })
  }, [])

  const handleChange = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const transitionToStep = (nextStep: 1 | 2 | 3) => {
    setVisible(false)
    setTimeout(() => {
      setStep(nextStep)
      onStepChange?.(nextStep)
      setVisible(true)
    }, 280)
  }

  const handleStep1Next = () => {
    transitionToStep(2)
  }

  const handleStep2Back = () => {
    transitionToStep(1)
  }

  const handleStep2Next = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setSubmitError(data.error || 'Er is iets misgegaan. Probeer het opnieuw.')
        setIsSubmitting(false)
        return
      }

      setIsSubmitting(false)
      transitionToStep(3)
    } catch {
      setSubmitError('Verbinding mislukt. Controleer je internetverbinding en probeer opnieuw.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      {/* Error banner */}
      {submitError && (
        <div
          className="mb-4 px-4 py-3 rounded-lg text-sm"
          style={{
            background: 'rgba(255,107,107,0.1)',
            border: '1px solid rgba(255,107,107,0.25)',
            color: '#FF6B6B',
          }}
        >
          {submitError}
        </div>
      )}

      {/* Step content with fade/slide transition */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 280ms ease, transform 280ms ease',
        }}
      >
        {step === 1 && (
          <Step1Form
            formData={formData}
            onChange={handleChange}
            onNext={handleStep1Next}
          />
        )}
        {step === 2 && (
          <Step2Calendar
            formData={formData}
            onChange={handleChange}
            onNext={handleStep2Next}
            onBack={handleStep2Back}
            isSubmitting={isSubmitting}
            availability={availability}
            loadingAvail={loadingAvail}
            availError={availError}
          />
        )}
        {step === 3 && (
          <Step3Confirmation formData={formData} />
        )}
      </div>
    </div>
  )
}
