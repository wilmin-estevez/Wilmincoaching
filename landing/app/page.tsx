import { Nav } from '@/components/sections/Nav'
import { Hero } from '@/components/sections/Hero'
import { CuposBanner } from '@/components/sections/CuposBanner'
import { About } from '@/components/sections/About'
import { Process } from '@/components/sections/Process'
import { Pricing } from '@/components/sections/Pricing'
import { Guarantee } from '@/components/sections/Guarantee'
import { Testimonials } from '@/components/sections/Testimonials'
import { Faq } from '@/components/sections/Faq'
import { ApplyForm } from '@/components/sections/ApplyForm'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CuposBanner />
        <About />
        <Process />
        <Pricing />
        <Guarantee />
        <Testimonials />
        <Faq />
        <ApplyForm />
      </main>
      <Footer />
    </>
  )
}
