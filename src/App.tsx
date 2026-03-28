import { AnimatePresence, motion } from 'framer-motion'
import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  BellRing,
  MapPinned,
  Mic,
  PhoneCall,
  Users,
} from 'lucide-react'

import contactSelection from './assets/contact_selection.jpg'
import logo from './assets/logo.svg'
import mainScreen from './assets/main_screen.jpg'
import mainScreenAwaitingResponse from './assets/main_screen_awaiting_response.jpg'
import mainScreenCallingContact from './assets/main_screen_calling_contact.jpg'
import mainScreenEmergencyDetected from './assets/main_screen_emergency_detected.jpg'
import mainScreenResponderOnline from './assets/main_screen_responder_online.jpg'
import voiceVerification from './assets/voice_verification.jpg'

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
}

const heroHighlights = [
  {
    title: '10-second cancel window',
    copy: 'Users can stop an accidental trigger before alerts are sent.',
  },
  {
    title: 'Context-rich SMS',
    copy: 'Messages include live location plus transcription from the captured audio.',
  },
  {
    title: '5-minute callback watch',
    copy: 'Only saved contacts are auto-answered when they call back.',
  },
]

const features = [
  {
    icon: Mic,
    title: 'Built around real emergency phrases',
    description:
      'Any spoken phrase containing "help" or "emergency" can trigger the flow, and the voice verification screen helps users rehearse what they want the app to hear.',
  },
  {
    icon: Users,
    title: 'Trusted contacts stay prioritized',
    description:
      'Users can select up to three emergency contacts and order them by priority, so missed-call alerts and callback handling follow a clear plan.',
  },
  {
    icon: MapPinned,
    title: 'Location and speech context travel together',
    description:
      'Once the countdown ends, Shout4Help sends the user location together with the transcription of what was said after the trigger phrase.',
  },
  {
    icon: PhoneCall,
    title: 'Background-ready callback handling',
    description:
      'The app keeps working in the background, waits five minutes for a response, auto-answers trusted callbacks, and ignores calls from everyone else.',
  },
]

const setupScreens = [
  {
    image: mainScreen,
    title: 'Main monitoring screen',
    subtitle:
      'The home screen keeps the experience simple while the app continues listening in the background for any phrase containing help or emergency.',
  },
  {
    image: contactSelection,
    title: 'Contact selection and priority',
    subtitle:
      'Users can save up to three trusted contacts, reorder who should be reached first, and keep the emergency chain focused on the right people.',
  },
  {
    image: voiceVerification,
    title: 'Voice verification',
    subtitle:
      'Phrase verification records how the user naturally says their alert phrase, helping the experience feel specific instead of one-size-fits-all.',
  },
]

const responseFlow = [
  {
    title: 'Monitor in the background',
    description:
      'Shout4Help keeps recording, calling, and location sharing available even when the app is not actively open on screen.',
  },
  {
    title: 'Detect the trigger phrase',
    description:
      'The response begins as soon as the user says any phrase that contains "help" or "emergency."',
  },
  {
    title: 'Start a 10-second cancel window',
    description:
      'A visible countdown starts immediately, giving the user a short chance to cancel if the trigger was accidental.',
  },
  {
    title: 'Capture context for responders',
    description:
      'During the countdown, the user speech is recorded and transcribed so the outgoing alert contains more than just a panic signal.',
  },
  {
    title: 'Send SMS and missed-call alerts',
    description:
      'After the countdown, all chosen contacts receive an SMS with location and transcription, then each contact is called for 5 seconds as an urgent missed-call prompt.',
  },
  {
    title: 'Wait for trusted callbacks only',
    description:
      'The app waits up to 5 minutes for a response and auto-answers only if one of the selected emergency contacts calls back.',
  },
]

const responseStates = [
  {
    image: mainScreenEmergencyDetected,
    title: 'Emergency detected',
    subtitle:
      'The user sees the 10-second countdown and can still cancel before the emergency is escalated.',
  },
  {
    image: mainScreenCallingContact,
    title: 'Calling trusted contacts',
    subtitle:
      'Once the countdown expires, Shout4Help begins the short missed-call alert sequence in contact priority order.',
  },
  {
    image: mainScreenAwaitingResponse,
    title: 'Awaiting a callback',
    subtitle:
      'After outreach is sent, the app waits for a contact to call back during the response window.',
  },
  {
    image: mainScreenResponderOnline,
    title: 'Responder connected',
    subtitle:
      'If a trusted contact responds, the callback is auto-answered so the user is connected without another action.',
  },
]

const gmailPattern = /^[a-z0-9._%+-]+@gmail\.com$/i

type FeedbackTone = 'success' | 'info' | 'error'

type FeedbackState = {
  tone: FeedbackTone
  message: string
}

function App() {
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

    // #region agent log
    fetch('http://127.0.0.1:7316/ingest/70f095ac-22c5-4dce-af96-a83c9dce107e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'76fb6e'},body:JSON.stringify({sessionId:'76fb6e',runId:'initial',hypothesisId:'H5',location:'src/App.tsx:184',message:'Submit started',data:{isValidGmail,hasApiBaseUrl:Boolean(apiBaseUrl),hasPlayTestUrl:isPlayLinkConfigured,emailDomain:normalizedEmail.split('@')[1] ?? null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

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

      // #region agent log
      fetch('http://127.0.0.1:7316/ingest/70f095ac-22c5-4dce-af96-a83c9dce107e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'76fb6e'},body:JSON.stringify({sessionId:'76fb6e',runId:'initial',hypothesisId:'H5',location:'src/App.tsx:214',message:'API response received',data:{status:response.status,ok:response.ok,code:data?.code ?? null,message:data?.message ?? null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion

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
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-orb ambient-orb-left" />
        <div className="ambient-orb ambient-orb-right" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-12">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="hero-panel relative mt-4 overflow-hidden rounded-[2.25rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
            <div className="relative z-10 max-w-2xl lg:pr-4">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.45 }}
                className="flex flex-wrap items-center gap-4"
              >
                <div className="logo-backdrop inline-flex items-center rounded-[1.5rem] bg-white px-5 py-3">
                  <img src={logo} alt="Shout4Help" className="brand-logo" />
                </div>
                <p className="max-w-sm text-sm font-medium tracking-[0.18em] text-blue-50/90 sm:text-base">
                  Voice-triggered emergency support that starts with the words you already
                  say in danger.
                </p>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.65 }}
                className="display-font mt-8 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
              >
                Say help or emergency.
                <br />
                Shout4Help takes care of what happens next.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.65 }}
                className="mt-6 max-w-xl text-base leading-8 text-blue-50/92 sm:text-lg"
              >
                Shout4Help is an Android safety app built for the moments when unlocking
                a phone is too slow. When a user says any phrase containing help or
                emergency, the app starts a 10-second countdown, records speech for
                context, sends location and transcription by SMS, places missed-call
                alerts to chosen contacts, and waits for a trusted callback to
                auto-answer.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.65 }}
                className="mt-4 max-w-xl text-sm leading-7 text-blue-100/80 sm:text-base"
              >
                Calls from anyone outside the saved emergency list are ignored, and once
                the response cycle is finished the app returns to listening again.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.65 }}
                className="mt-8 flex flex-col gap-4 sm:flex-row"
              >
                <a
                  href="#waitlist"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1247d6] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Join the Gmail waitlist
                </a>
                <a
                  href="#screenshots"
                  className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/12 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/18"
                >
                  See the real app screens
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.65 }}
                className="mt-10 grid gap-4 sm:grid-cols-3"
              >
                {heroHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-white/22 bg-white/12 p-4 backdrop-blur-sm"
                  >
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-blue-50/82">{item.copy}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.75 }}
              className="relative z-10 flex justify-center lg:justify-end"
            >
              <div className="phone-float relative w-full max-w-[390px]">
                <div className="absolute inset-3 rounded-full bg-white/25 blur-3xl" />
                <div className="phone-shell relative rounded-[2.5rem] p-3">
                  <div className="screen-frame hero-screen-frame">
                    <img
                      src={mainScreen}
                      alt="Shout4Help main monitoring screen"
                      className="screen-image hero-screen"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          {...reveal}
          className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.article
              key={title}
              whileHover={{ y: -6, scale: 1.01 }}
              className="glass-card rounded-[1.75rem] p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f1ff] text-[#1d4ed8]">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="display-font mt-5 text-2xl text-slate-900">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </motion.article>
          ))}
        </motion.section>

        <motion.section
          id="screenshots"
          {...reveal}
          className="soft-section mt-8 rounded-[2rem] px-6 py-8 sm:px-8 lg:px-10"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#2563eb]">
                Product walkthrough
              </p>
              <h2 className="display-font mt-3 text-3xl text-slate-900 sm:text-4xl">
                Real screens from setup through live protection.
              </h2>
            </div>
            <div className="rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-4 py-2 text-sm text-[#1d4ed8]">
              Actual UI
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {setupScreens.map((screen) => (
              <motion.article
                key={screen.title}
                whileHover={{ y: -6 }}
                className="glass-card rounded-[1.75rem] p-4"
              >
                <div className="screen-frame">
                  <img
                    src={screen.image}
                    alt={screen.title}
                    className="screen-image"
                  />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.3em] text-slate-400">
                  Screen preview
                </p>
                <h3 className="display-font mt-2 text-2xl text-slate-900">{screen.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{screen.subtitle}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          {...reveal}
          className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"
        >
          <div className="blue-panel rounded-[2rem] p-6 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#1d4ed8]">
              Emergency flow
            </p>
            <h2 className="display-font mt-3 text-3xl text-slate-900 sm:text-4xl">
              A step-by-step response chain built for seconds, not menus.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Shout4Help does more than send a panic alert. It captures context, shares
              location, escalates contact outreach, and keeps waiting for a trusted person
              to respond, all without requiring the user to stay inside the app.
            </p>

            <div className="mt-8 space-y-3">
              {[
                'Keyword trigger: any phrase containing help or emergency.',
                '10-second cancel option before escalation continues.',
                'SMS includes both live location and speech transcription.',
              ].map((item) => (
                <div
                  key={item}
                  className="inline-flex w-full items-start gap-3 rounded-2xl border border-[#bfdbfe] bg-white/85 px-4 py-3 text-sm text-slate-700"
                >
                  <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-[#2563eb]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {responseFlow.map((step, index) => (
              <motion.div
                key={step.title}
                whileHover={{ x: 6 }}
                className="glass-card rounded-[1.6rem] p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f1ff] text-sm font-semibold text-[#1d4ed8]">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="display-font text-2xl text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          {...reveal}
          className="soft-section mt-8 rounded-[2rem] px-6 py-8 sm:px-8 lg:px-10"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#2563eb]">
                Response states
              </p>
              <h2 className="display-font mt-3 text-3xl text-slate-900 sm:text-4xl">
                The Emergency Flow
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {responseStates.map((screen) => (
              <motion.article
                key={screen.title}
                whileHover={{ y: -6 }}
                className="glass-card rounded-[1.75rem] p-4"
              >
                <div className="screen-frame">
                  <img
                    src={screen.image}
                    alt={screen.title}
                    className="screen-image"
                  />
                </div>
                <h3 className="display-font mt-5 text-2xl text-slate-900">{screen.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{screen.subtitle}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="waitlist"
          {...reveal}
          className="cta-panel mb-6 mt-8 rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#1d4ed8]">
                Internal testing
              </p>
              <h2 className="display-font mt-3 text-3xl text-slate-900 sm:text-5xl">
                Enter your Gmail and get added to the tester group automatically.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-700">
                Submit the Gmail address you want to test with and Shout4Help will add it
                directly to the Workspace tester group
                {' '}
                <strong>internal-testers@shout4help.com</strong>
                . As soon as Google accepts the add, the Play internal testing link is
                unlocked below.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#bfdbfe] bg-white/90 px-4 py-3 text-sm text-slate-700">
                  Step 1: Enter a valid Gmail address that you use on your Android device.
                </div>
                <div className="rounded-2xl border border-[#bfdbfe] bg-white/90 px-4 py-3 text-sm text-slate-700">
                  Step 2: Once the add succeeds, copy or open the Play test link instantly.
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="glass-card rounded-[1.75rem] p-5 sm:p-6"
            >
              <p className="text-sm font-medium text-slate-700">Tester onboarding</p>

              <label
                htmlFor="gmail"
                className="mt-4 block text-sm font-medium text-slate-700"
              >
                Gmail ID
              </label>
              <input
                id="gmail"
                name="gmail"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (feedback?.tone === 'error') {
                    setFeedback(null)
                  }
                }}
                className="mt-3 w-full rounded-2xl border border-[#bfdbfe] bg-white px-4 py-4 text-base text-slate-900 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb33]"
              />

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={!isValidGmail || isSubmitting}
                  className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 ${
                    !isValidGmail || isSubmitting
                      ? 'cursor-not-allowed bg-[#93c5fd]'
                      : 'bg-[#1d4ed8] hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? 'Adding to group...' : 'Join our community'}
                </button>
                <p className="text-sm text-slate-500">
                  Only Gmail addresses can be added to the tester group.
                </p>
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
                      Fill
                      {' '}
                      <code>VITE_PLAY_TEST_URL</code>
                      {' '}
                      before publishing this tester flow.
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
                <div className="mt-5 rounded-[1.5rem] border border-[#bfdbfe] bg-[#eff6ff] p-4">
                  <p className="text-sm font-medium text-slate-700">Play internal test link</p>
                  <div className="mt-3 rounded-2xl border border-[#bfdbfe] bg-white p-3 text-sm text-slate-700 break-all">
                    {playTestUrl}
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleCopyPlayLink}
                      className="inline-flex items-center justify-center rounded-full border border-[#1d4ed8] bg-white px-5 py-3 text-sm font-semibold text-[#1d4ed8] transition-colors duration-300 hover:bg-[#eff6ff]"
                    >
                      {didCopyPlayLink ? 'Copied' : 'Copy test link'}
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenPlayLink}
                      className="inline-flex items-center justify-center rounded-full bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      Open test link
                    </button>
                  </div>
                </div>
              ) : null}
            </form>
          </div>
        </motion.section>
      </div>
    </main>
  )
}

export default App
