import { AnimatePresence, motion } from 'framer-motion'
import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Copy, ExternalLink, Mail, Menu, Phone, X } from 'lucide-react'

import mainScreen from './assets/main_screen.jpg'
import logo from './assets/logo.svg'

const heroImage = mainScreen
const nightSafetyImage =
  'https://images.unsplash.com/photo-1628541490178-08555c4b3a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMGNpdHklMjBydW5uaW5nJTIwYWxvbmUlMjBzYWZldHl8ZW58MXx8fHwxNzc0Njg5OTY1fDA&ixlib=rb-4.1.0&q=80&w=1080'
const elderlyImage =
  'https://images.unsplash.com/photo-1544187702-067d81860901?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcGVyc29uJTIwbWVkaWNhbCUyMGFsZXJ0JTIwY2FyZXxlbnwxfHx8fDE3NzQ2ODk5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080'
const campusImage =
  'https://images.unsplash.com/photo-1763925200688-812de3f83e97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzJTIwc3R1ZGVudHMlMjB3YWxraW5nJTIwbmlnaHR8ZW58MXx8fHwxNzc0Njg0OTkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
const hikerImage =
  'https://images.unsplash.com/photo-1765036715827-97f5f51c89a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtlciUyMHRyYWlsJTIwc29sbyUyMG1vdW50YWluJTIwc2FmZXR5fGVufDF8fHx8MTc3NDY4OTk3Mnww&ixlib=rb-4.1.0&q=80&w=1080'

const gmailPattern = /^[a-z0-9._%+-]+@gmail\.com$/i

const featureCards = [
  {
    icon: '🎙️',
    color: '#EFF6FF',
    accent: '#2563EB',
    title: 'Voice-Triggered Alerts',
    description:
      'Shout4Help listens passively for keywords like "help" or "emergency." The moment it detects a trigger phrase, the emergency flow begins automatically — no screen interaction needed.',
    tag: 'Core Feature',
  },
  {
    icon: '📡',
    color: '#F0FDF4',
    accent: '#16A34A',
    title: 'Fully Offline Capable',
    description:
      'No Wi-Fi or data? No problem. The app caches your contacts and location data locally, so alerts are queued and sent the second connectivity is restored — even mid-incident.',
    tag: 'Offline Ready',
  },
  {
    icon: '📍',
    color: '#FFF7ED',
    accent: '#EA580C',
    title: 'Live Location Sharing',
    description:
      'Your precise GPS coordinates are embedded directly into every SMS alert. Responders and trusted contacts see your exact position on a map without needing the app themselves.',
    tag: 'Real-time',
  },
  {
    icon: '📝',
    color: '#FDF4FF',
    accent: '#9333EA',
    title: 'Voice Transcription',
    description:
      'The 10-second countdown window captures and transcribes your speech. Every alert includes a text snippet of what was said — giving responders critical situational context.',
    tag: 'AI-Powered',
  },
  {
    icon: '⏱️',
    color: '#FFF1F2',
    accent: '#E11D48',
    title: '10-Second Cancel Window',
    description:
      'Accidental triggers happen. A visible countdown gives you a short window to cancel before any contacts are alerted — reducing false alarms without compromising speed.',
    tag: 'Smart Safety',
  },
  {
    icon: '👥',
    color: '#F0FDFA',
    accent: '#0D9488',
    title: 'Trusted Contact Escalation',
    description:
      'Add up to 5 trusted contacts who receive layered alerts: SMS with location first, then a 5-second missed-call prompt. The app auto-answers only if a trusted contact calls back.',
    tag: 'Multi-Contact',
  },
]

const steps = [
  {
    number: '01',
    title: 'Monitor in the Background',
    description:
      'Once set up, Shout4Help runs silently in the background — always listening, never intruding. Recording, calling, and location-sharing remain available even when the app is not actively open on screen.',
  },
  {
    number: '02',
    title: 'Detect the Trigger Phrase',
    description:
      'The response begins as soon as the user says any phrase containing "help" or "emergency." The AI model processes audio locally, so no audio ever leaves your device.',
  },
  {
    number: '03',
    title: 'Start a 10-Second Cancel Window',
    description:
      'A visible countdown starts immediately, giving the user a short chance to cancel if the trigger was accidental. During this window, the app is already preparing the alert payload.',
  },
  {
    number: '04',
    title: 'Capture Context for Responders',
    description:
      "During the countdown, the user's speech is recorded and transcribed so the outgoing alert contains more than just a panic signal — it tells the story of what's happening.",
  },
  {
    number: '05',
    title: 'Send SMS & Missed-Call Alerts',
    description:
      'After the countdown, all chosen contacts receive an SMS with location and transcription, then each contact is called for 5 seconds as an urgent missed-call prompt.',
  },
  {
    number: '06',
    title: 'Wait for Trusted Callbacks Only',
    description:
      'The app waits up to 5 minutes for a response and auto-answers only if one of the selected emergency contacts calls back — blocking unknown callers from hijacking the session.',
  },
]

const cases = [
  {
    id: 'personal',
    label: 'Personal Safety',
    emoji: '🌙',
    color: '#2563EB',
    lightColor: '#EFF6FF',
    title: 'Walking Alone at Night',
    subtitle: 'For individuals in urban or unfamiliar environments',
    description:
      "Whether it's a late commute home or a solo night out, Shout4Help acts as your silent guardian. If something goes wrong, one shout is all it takes — no fumbling for your phone in the dark.",
    image: nightSafetyImage,
    stats: [
      { value: '1 in 3', label: 'women feel unsafe walking alone' },
      { value: '< 3s', label: 'average alert dispatch time' },
    ],
    bullets: [
      'No phone interaction required',
      'Works on locked screen',
      'Location pinned automatically',
    ],
  },
  {
    id: 'elderly',
    label: 'Senior Care',
    emoji: '🏠',
    color: '#D97706',
    lightColor: '#FFFBEB',
    title: 'Senior & Elderly Care',
    subtitle: 'For aging adults living independently',
    description:
      'Falls, medical events, and emergencies do not wait. Shout4Help gives seniors a hands-free way to call for help without navigating complex interfaces — family members are alerted instantly with location.',
    image: elderlyImage,
    stats: [
      { value: '36M', label: 'falls reported annually in the US' },
      { value: 'Zero', label: 'taps needed to trigger an alert' },
    ],
    bullets: [
      'Designed for low-tech comfort',
      'Family notified with full context',
      'Works offline at home',
    ],
  },
  {
    id: 'campus',
    label: 'Campus Safety',
    emoji: '🎓',
    color: '#7C3AED',
    lightColor: '#F5F3FF',
    title: 'College Campus Security',
    subtitle: 'For students in large or unfamiliar campuses',
    description:
      'Students navigating large campuses after dark face real risks. Shout4Help integrates with existing campus emergency networks and provides instant personal alerts even without cellular data.',
    image: campusImage,
    stats: [
      { value: '55%', label: 'students feel unsafe on campus at night' },
      { value: '5 contacts', label: 'can be alerted simultaneously' },
    ],
    bullets: [
      'Works across campus Wi-Fi offline',
      'Integrates with campus security',
      'Peer-to-peer alert networks',
    ],
  },
  {
    id: 'outdoor',
    label: 'Outdoor Adventures',
    emoji: '🏔️',
    color: '#059669',
    lightColor: '#ECFDF5',
    title: 'Solo Hiking & Outdoor Sports',
    subtitle: 'For adventurers in remote areas with poor signal',
    description:
      'Deep in a trail with no signal? Shout4Help queues your SOS alert and fires it the moment satellite or cellular connectivity appears. GPS coordinates are cached locally even in airplane mode.',
    image: hikerImage,
    stats: [
      { value: '250K+', label: 'search & rescue incidents yearly' },
      { value: 'Offline', label: 'GPS caching built in' },
    ],
    bullets: [
      'Satellite location caching',
      'Queued alerts on reconnect',
      'Battery-optimised background mode',
    ],
  },
]

type FeedbackTone = 'success' | 'info' | 'error'

type FeedbackState = {
  tone: FeedbackTone
  message: string
}

type TesterCtaProps = {
  email: string
  feedback: FeedbackState | null
  isSubmitting: boolean
  showTestLink: boolean
  didCopyPlayLink: boolean
  isPlayLinkConfigured: boolean
  playTestUrl: string
  isValidGmail: boolean
  onEmailChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onCopyLink: () => Promise<void>
  onOpenLink: () => void
}

function BrandMark() {
  return (
    <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden">
      <img src={logo} alt="Shout4Help app icon" className="h-full w-full object-contain p-1" />
    </div>
  )
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    scrollToSection(id)
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button type="button" onClick={() => scrollTo('top')} className="flex items-center gap-2">
          <BrandMark />
          <span
            className={`text-xl font-bold tracking-tight transition-colors ${
              scrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            <span style={scrolled ? { color: '#2563EB' } : { color: '#BFDBFE' }}>Shout</span>
            <span style={{ color: '#FF3030' }}>
              4Help
            </span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {['features', 'how-it-works', 'use-cases'].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className={`text-sm font-medium transition-colors hover:text-[#2563EB] ${
                scrolled ? 'text-gray-600' : 'text-white/90'
              }`}
            >
              {id === 'features'
                ? 'Features'
                : id === 'how-it-works'
                  ? 'How It Works'
                  : 'Use Cases'}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollTo('download')}
            className="px-5 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-semibold shadow-lg hover:bg-[#1D4ED8] transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Download App
          </button>
        </div>

        <button
          type="button"
          className={`md:hidden transition-colors ${scrolled ? 'text-gray-800' : 'text-white'}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen ? (
        <div className="md:hidden bg-white shadow-xl border-t border-gray-100">
          <div className="px-6 py-4 flex flex-col gap-4">
            {['features', 'how-it-works', 'use-cases'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="text-left text-gray-700 text-sm font-medium py-2 border-b border-gray-100 last:border-0"
              >
                {id === 'features'
                  ? 'Features'
                  : id === 'how-it-works'
                    ? 'How It Works'
                    : 'Use Cases'}
              </button>
            ))}
            <button
              type="button"
              onClick={() => scrollTo('download')}
              className="mt-2 px-5 py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold text-center"
            >
              Download App
            </button>
          </div>
        </div>
      ) : null}
    </nav>
  )
}

function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 100)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)' }}
    >
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-300/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div
          className={`transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Works 100% Offline</span>
          </div>

          <h1
            className="text-white mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.15 }}
          >
            Your Voice Is{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #93C5FD, #BFDBFE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Your Emergency
            </span>{' '}
            Button.
          </h1>

          <p
            className="text-blue-100 mb-10 max-w-lg"
            style={{ fontSize: '1.125rem', lineHeight: 1.7 }}
          >
            Shout4Help listens for distress phrases in the background and instantly alerts your
            emergency contacts — with your live location and a voice transcript. No taps. No
            unlocking. Just shout.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <button
              type="button"
              onClick={() => scrollToSection('download')}
              className="px-8 py-4 rounded-2xl bg-white text-[#2563EB] font-bold text-base shadow-2xl hover:shadow-white/25 hover:-translate-y-1 transition-all duration-200"
            >
              Download Free
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold text-base backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
            >
              Know More
            </button>
          </div>
        </div>

        <div
          className={`flex justify-center transition-all duration-700 delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400/30 blur-3xl rounded-full scale-90" />

            <div
              className="relative w-64 md:w-72 rounded-[2.25rem] overflow-hidden shadow-2xl border-[3px] border-white/20 bg-white/10"
              style={{ aspectRatio: '9/19' }}
            >
              <img
                src={heroImage}
                alt="Shout4Help in action"
                className="w-full h-full object-contain bg-white"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900/80" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-white text-xs font-bold">ALERT TRIGGERED</span>
                  </div>
                  <p className="text-white/80 text-xs">"Help!" detected · 3 contacts notified</p>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="flex-1 h-1 rounded-full bg-white/20">
                      <div className="w-4/5 h-full rounded-full bg-green-400" />
                    </div>
                    <span className="text-white/70 text-xs">Location sent</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-lg">
                ✓
              </div>
              <div>
                <div className="text-gray-800 text-xs font-bold">SMS Sent</div>
                <div className="text-gray-400 text-xs">Sarah, Mom +2</div>
              </div>
            </div>

            <div className="absolute -right-8 top-2/3 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-lg">
                📍
              </div>
              <div>
                <div className="text-gray-800 text-xs font-bold">Live Location</div>
                <div className="text-gray-400 text-xs">Shared instantly</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection('features')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white/90 transition-colors animate-bounce"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  )
}

function Features() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <span className="text-[#2563EB] text-sm font-semibold">App Capabilities</span>
          </div>
          <h2
            className="text-gray-900 mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.2 }}
          >
            Everything You Need When <span style={{ color: '#2563EB' }}>Seconds Matter</span>
          </h2>
          <p
            className="text-gray-500 max-w-2xl mx-auto"
            style={{ fontSize: '1.125rem', lineHeight: 1.7 }}
          >
            Shout4Help is engineered around one principle: help should arrive before you can
            reach your phone.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feature, index) => (
            <div
              key={feature.title}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              className="group relative bg-white rounded-3xl p-7 shadow-sm border border-gray-100 cursor-default transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{
                boxShadow: hovered === index ? `0 20px 60px ${feature.accent}18` : undefined,
                borderColor: hovered === index ? `${feature.accent}30` : undefined,
              }}
            >
              <span
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5"
                style={{ backgroundColor: feature.color, color: feature.accent }}
              >
                {feature.tag}
              </span>

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: feature.color }}
              >
                {feature.icon}
              </div>

              <h3 className="text-gray-900 mb-3" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>

              <div
                className="absolute bottom-0 left-7 right-7 h-0.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: feature.accent }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2">
            <div className="sticky top-28">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
                style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}
              >
                <span className="text-[#2563EB] text-sm font-semibold">Emergency Flow</span>
              </div>

              <h2
                className="text-gray-900 mb-4"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}
              >
                A step-by-step response chain built for{' '}
                <span style={{ color: '#2563EB' }}>seconds, not menus.</span>
              </h2>

              <p className="text-gray-500 mb-8" style={{ lineHeight: 1.75 }}>
                Shout4Help does more than send a panic alert. It captures context, shares
                location, escalates contact outreach, and keeps waiting for a trusted person to
                respond — all without requiring the user to stay inside the app.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col">
            {steps.map((step, index) => (
              <div
                key={step.number}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
                className="relative flex gap-5 cursor-default group"
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 z-10"
                    style={{
                      backgroundColor: activeStep === index ? '#2563EB' : '#EFF6FF',
                      color: activeStep === index ? 'white' : '#2563EB',
                    }}
                  >
                    {step.number}
                  </div>
                  {index < steps.length - 1 ? (
                    <div
                      className="w-0.5 flex-1 my-1 transition-all duration-300"
                      style={{
                        backgroundColor: activeStep === index ? '#2563EB' : '#E2E8F0',
                        minHeight: '2rem',
                      }}
                    />
                  ) : null}
                </div>

                <div
                  className="flex-1 rounded-2xl p-5 border mb-3 transition-all duration-300"
                  style={{
                    backgroundColor: activeStep === index ? '#EFF6FF' : '#F8FAFC',
                    borderColor: activeStep === index ? '#BFDBFE' : '#E2E8F0',
                    boxShadow:
                      activeStep === index ? '0 8px 30px rgba(37,99,235,0.10)' : 'none',
                  }}
                >
                  <h3
                    className="text-gray-900 mb-1"
                    style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.35 }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-gray-500 text-sm leading-relaxed"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function UseCases() {
  const [active, setActive] = useState(0)
  const current = cases[active]

  return (
    <section id="use-cases" className="py-24" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <span className="text-[#2563EB] text-sm font-semibold">Use Cases</span>
          </div>
          <h2
            className="text-gray-900 mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.2 }}
          >
            Built for Real Life <span style={{ color: '#2563EB' }}>Scenarios</span>
          </h2>
          <p
            className="text-gray-500 max-w-xl mx-auto"
            style={{ fontSize: '1.1rem', lineHeight: 1.7 }}
          >
            Identify your scenario and see how Shout4Help fits your world.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {cases.map((useCase, index) => (
            <button
              key={useCase.id}
              type="button"
              onClick={() => setActive(index)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold border-2 transition-all duration-200"
              style={{
                backgroundColor: active === index ? current.color : 'white',
                borderColor: active === index ? current.color : '#E2E8F0',
                color: active === index ? 'white' : '#4B5563',
                boxShadow: active === index ? `0 4px 20px ${cases[index].color}40` : 'none',
              }}
            >
              <span>{useCase.emoji}</span>
              {useCase.label}
            </button>
          ))}
        </div>

        <div
          key={current.id}
          className="grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-xl transition-all"
          style={{ border: `1px solid ${current.color}20` }}
        >
          <div className="relative h-72 lg:h-auto overflow-hidden">
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${current.color}99, transparent)`,
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-3 w-fit"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
              >
                <span className="text-white text-xs font-bold">
                  {current.emoji} {current.label}
                </span>
              </div>
              <div className="flex gap-6">
                {current.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-white font-bold" style={{ fontSize: '1.5rem' }}>
                      {stat.value}
                    </div>
                    <div className="text-white/70 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 flex flex-col justify-center">
            <p className="text-sm font-semibold mb-2" style={{ color: current.color }}>
              {current.subtitle}
            </p>
            <h3
              className="text-gray-900 mb-4"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, lineHeight: 1.2 }}
            >
              {current.title}
            </h3>
            <p className="text-gray-500 mb-8 leading-relaxed">{current.description}</p>

            <div className="flex flex-col gap-3 mb-8">
              {current.bullets.map((bullet) => (
                <div key={bullet} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: current.lightColor }}
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke={current.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-600 text-sm">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TesterCta({
  email,
  feedback,
  isSubmitting,
  showTestLink,
  didCopyPlayLink,
  isPlayLinkConfigured,
  playTestUrl,
  isValidGmail,
  onEmailChange,
  onSubmit,
  onCopyLink,
  onOpenLink,
}: TesterCtaProps) {
  return (
    <section
      id="download"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 60%, #3B82F6 100%)' }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/90 text-sm font-medium">Internal testing access</span>
        </div>

        <h2
          className="text-white mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15 }}
        >
          Join the tester group,
          <span
            style={{
              background: 'linear-gradient(90deg, #93C5FD, #BFDBFE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {' '}
            then open the Play link.
          </span>
        </h2>
        <p
          className="text-blue-100 mb-12 max-w-xl mx-auto"
          style={{ fontSize: '1.125rem', lineHeight: 1.7 }}
        >
          Keep the same Gmail tester flow at the end of the page: submit a Gmail address,
          get it added to the Workspace tester group, and then copy or open the Play testing
          link after success.
        </p>

        <form
          onSubmit={onSubmit}
          className="mx-auto max-w-3xl rounded-3xl bg-white p-6 sm:p-8 text-left shadow-2xl"
        >
          <label htmlFor="gmail" className="block text-sm font-semibold text-gray-700 mb-3">
            Gmail ID
          </label>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <input
              id="gmail"
              name="gmail"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="yourname@gmail.com"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-900 outline-none focus:border-[#2563EB] focus:bg-white"
            />

            <button
              type="submit"
              disabled={!isValidGmail || isSubmitting}
              className={`rounded-2xl px-8 py-4 font-bold text-base transition-all duration-200 sm:min-w-60 ${
                !isValidGmail || isSubmitting
                  ? 'bg-blue-200 text-white cursor-not-allowed'
                  : 'bg-[#2563EB] text-white shadow-xl hover:-translate-y-1 hover:bg-[#1D4ED8]'
              }`}
            >
              {isSubmitting ? 'Adding to group...' : 'Join our community'}
            </button>
          </div>

          <div aria-live="polite" className="mt-5 min-h-7">
            <AnimatePresence mode="wait">
              {!isPlayLinkConfigured ? (
                <motion.p
                  key="missing-play-link"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                >
                  Fill <code>VITE_PLAY_TEST_URL</code> before publishing this tester flow.
                </motion.p>
              ) : feedback ? (
                <motion.p
                  key={`${feedback.tone}-${feedback.message}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    feedback.tone === 'error'
                      ? 'border border-rose-300 bg-rose-50 text-rose-700'
                      : feedback.tone === 'info'
                        ? 'border border-blue-200 bg-blue-50 text-blue-700'
                        : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {feedback.message}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>

          {showTestLink ? (
            <div className="mt-5 rounded-3xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-gray-700">Play internal test link</p>
              <div className="mt-3 rounded-2xl border border-blue-100 bg-white p-3 text-sm text-slate-700 break-all">
                {playTestUrl}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onCopyLink}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-blue-200 bg-white text-[#2563EB] font-semibold hover:bg-blue-50 transition-all hover:-translate-y-1 hover:shadow-xl min-w-52 justify-center"
                >
                  {didCopyPlayLink ? <Check size={18} /> : <Copy size={18} />}
                  <span>{didCopyPlayLink ? 'Copied' : 'Copy test link'}</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenLink}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-semibold hover:from-[#1D4ED8] hover:to-[#1E40AF] transition-all hover:-translate-y-1 hover:shadow-2xl min-w-52 justify-center"
                >
                  <ExternalLink size={18} />
                  <span>Open test link</span>
                </button>
              </div>
            </div>
          ) : null}
        </form>

      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BrandMark />
              <span className="text-xl font-bold">
                <span className="text-[#2563EB]">Shout</span>
                <span className="text-[#FF3030]">4Help</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              The voice-activated emergency alert app that works offline. Your safety, no taps
              required.
            </p>
          </div>

          <div>
            <div className="text-gray-300 font-semibold text-sm mb-4">Product</div>
            <div className="flex flex-col gap-2">
              {['Features', 'How It Works', 'Use Cases', 'Download'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(item.toLowerCase().replace(' ', '-').replace("'", ''))
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="text-gray-500 hover:text-white text-sm text-left transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-gray-300 font-semibold text-sm mb-4">Legal</div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-500 text-sm cursor-pointer hover:text-white transition-colors">
                Privacy Policy
              </span>
            </div>
          </div>

          <div>
            <div className="text-gray-300 font-semibold text-sm mb-4">Contact Us</div>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+919820226550"
                className="inline-flex items-center gap-3 text-gray-500 text-sm hover:text-white transition-colors"
              >
                <Phone size={16} className="shrink-0" />
                <span>+91 9820226550</span>
              </a>
              <a
                href="mailto:support@shout4help.com"
                className="inline-flex items-center gap-3 text-gray-500 text-sm hover:text-white transition-colors"
              >
                <Mail size={16} className="shrink-0" />
                <span>support@shout4help.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 Shout4Help. All rights reserved.</p>
          <p className="text-gray-600 text-sm">Developed by Ian Sequeira.</p>
          </div>
      </div>
    </footer>
  )
}

export default function ReferenceLanding() {
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTestLink, setShowTestLink] = useState(false)
  const [didCopyPlayLink, setDidCopyPlayLink] = useState(false)
  const copiedTimerRef = useRef<number | null>(null)
  const playTestUrl = (import.meta.env.VITE_PLAY_TEST_URL ?? '').trim()
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  const isPlayLinkConfigured = Boolean(playTestUrl)
  const normalizedEmail = email.trim()
  const isValidGmail = gmailPattern.test(normalizedEmail)

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current !== null) {
        window.clearTimeout(copiedTimerRef.current)
      }
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isValidGmail) {
      setFeedback({
        tone: 'error',
        message: 'Please enter a valid Gmail address ending in @gmail.com.',
      })
      setShowTestLink(false)
      return
    }

    setIsSubmitting(true)
    setFeedback(null)
    setDidCopyPlayLink(false)

    try {
      const response = await fetch(`${apiBaseUrl}/api/testers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      const data = await response.json().catch(() => null)
      const message =
        typeof data?.message === 'string'
          ? data.message
          : 'We could not add your Gmail right now. Please try again later.'

      if (!response.ok) {
        setFeedback({
          tone: 'error',
          message,
        })
        setShowTestLink(false)
        return
      }

      setFeedback({
        tone: data?.code === 'already_member' ? 'info' : 'success',
        message,
      })
      setShowTestLink(true)
      setEmail('')
    } catch {
      setFeedback({
        tone: 'error',
        message: 'We could not reach the signup service. Please try again later.',
      })
      setShowTestLink(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyPlayLink = async () => {
    if (!isPlayLinkConfigured) {
      setFeedback({
        tone: 'error',
        message: 'Add VITE_PLAY_TEST_URL before publishing this tester flow.',
      })
      return
    }

    try {
      await navigator.clipboard.writeText(playTestUrl)
      setDidCopyPlayLink(true)

      if (copiedTimerRef.current !== null) {
        window.clearTimeout(copiedTimerRef.current)
      }

      copiedTimerRef.current = window.setTimeout(() => {
        setDidCopyPlayLink(false)
      }, 2500)
    } catch {
      setFeedback({
        tone: 'error',
        message: 'Could not copy the testing link. You can still open it manually.',
      })
    }
  }

  const handleOpenPlayLink = () => {
    if (!isPlayLinkConfigured || !showTestLink) {
      return
    }

    window.open(playTestUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <TesterCta
        email={email}
        feedback={feedback}
        isSubmitting={isSubmitting}
        showTestLink={showTestLink}
        didCopyPlayLink={didCopyPlayLink}
        isPlayLinkConfigured={isPlayLinkConfigured}
        playTestUrl={playTestUrl}
        isValidGmail={isValidGmail}
        onEmailChange={(value) => {
          setEmail(value)
          if (feedback?.tone === 'error') {
            setFeedback(null)
          }
        }}
        onSubmit={handleSubmit}
        onCopyLink={handleCopyPlayLink}
        onOpenLink={handleOpenPlayLink}
      />
      <Footer />
    </div>
  )
}
