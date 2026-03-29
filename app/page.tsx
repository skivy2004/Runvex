'use client'

import Navbar from './components/layout/Navbar'
import HeroSection from './components/sections/HeroSection'
import StatsBar from './components/sections/StatsBar'
import WhyRunvex from './components/sections/WhyRunvex'
import HowItWorks from './components/sections/HowItWorks'
import ProductShowcase from './components/sections/ProductShowcase'
import Testimonials from './components/sections/Testimonials'
import CTASection from './components/sections/CTASection'
import Footer from './components/layout/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <WhyRunvex />
        <HowItWorks />
        <ProductShowcase />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
