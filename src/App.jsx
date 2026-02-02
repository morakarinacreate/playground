import { useState, useEffect, useRef } from 'react'
import './App.css'

const HEADLINE_PHRASES = ['Designed for', 'Built around', 'Done by']
const DISPLAY_DURATION_MS = 2500
const TYPE_SPEED_MS = 70

function App() {
  const [displayText, setDisplayText] = useState(HEADLINE_PHRASES[0])
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [heroSubmitted, setHeroSubmitted] = useState(false)
  const phaseRef = useRef('idle')
  const displayEndRef = useRef(Date.now() + DISPLAY_DURATION_MS)
  const nextPhraseRef = useRef(0)

  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      if (phaseRef.current === 'idle') {
        if (now >= displayEndRef.current) {
          phaseRef.current = 'typingOut'
        }
        return
      }
      if (phaseRef.current === 'typingOut') {
        setDisplayText((prev) => {
          if (prev.length <= 1) {
            nextPhraseRef.current = (phraseIndex + 1) % HEADLINE_PHRASES.length
            setPhraseIndex(nextPhraseRef.current)
            phaseRef.current = 'typingIn'
            return ''
          }
          return prev.slice(0, -1)
        })
        return
      }
      if (phaseRef.current === 'typingIn') {
        const target = HEADLINE_PHRASES[nextPhraseRef.current]
        setDisplayText((prev) => {
          if (prev.length >= target.length) {
            phaseRef.current = 'idle'
            displayEndRef.current = Date.now() + DISPLAY_DURATION_MS
            return target
          }
          return target.slice(0, prev.length + 1)
        })
      }
    }
    const id = setInterval(tick, TYPE_SPEED_MS)
    return () => clearInterval(id)
  }, [phraseIndex])

  return (
    <div className="landing">
      <header className="header">
        <div className="header-inner">
          <a href="#" className="logo">luna.ai</a>
          <nav className="nav">
            <a href="#how-it-works">How it works</a>
            <a href="#why-luna">Why Luna</a>
            <a href="#cta" className="btn btn-primary">Join the waitlist</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-headline">
            <span className="hero-headline-rotating">
              {displayText}
              <span className="hero-headline-cursor" aria-hidden="true" />
            </span>
            <span className="hero-headline-static"> <span className="hero-headline-you">you</span>.</span>
          </h1>
          <p className="hero-tagline">An AI-powered to-do and goal app built around you.</p>
          <p className="hero-subtitle">
            Luna works in your orbit as a planning partner.
            Share your thoughts and goals. Luna turns them into a focused plan built around your day.
          </p>
          <div className="hero-waitlist-wrap">
            <form
              className="hero-waitlist-form"
              onSubmit={(e) => {
                e.preventDefault()
                const email = e.currentTarget.querySelector('input[type="email"]').value
                if (email?.trim()) setHeroSubmitted(true)
              }}
            >
              <input type="email" placeholder="Email address" aria-label="Email" disabled={heroSubmitted} />
              <button
                type="submit"
                className={`btn btn-primary btn-lg ${heroSubmitted ? 'btn-submitted' : ''}`}
                disabled={heroSubmitted}
              >
                {heroSubmitted ? (
                  <>
                    <span className="btn-check" aria-hidden="true">✓</span>
                    <span className="btn-text-struck">Join the waitlist</span>
                  </>
                ) : (
                  'Join the waitlist'
                )}
              </button>
            </form>
            {heroSubmitted && (
              <p className="hero-waitlist-confirm">Your email has been successfully submitted.</p>
            )}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2 className="section-title">How Luna Works</h2>
        <ol className="steps-list">
          <li className="step-card">
            <span className="step-num">1</span>
            <h3>Brain-dump, without pressure</h3>
            <p>Start your day by dumping everything in your head. No formatting. No organizing. Just thoughts.</p>
          </li>
          <li className="step-card">
            <span className="step-num">2</span>
            <h3>AI prioritizes for you</h3>
            <p>Luna turns your brain-dump into a realistic, ordered task list—so you don't have to decide what matters most.</p>
          </li>
          <li className="step-card">
            <span className="step-num">3</span>
            <h3>Goals → doable steps</h3>
            <p>Add short- or long-term goals. Luna breaks them into achievable tasks and schedules progress over time.</p>
          </li>
          <li className="step-card">
            <span className="step-num">4</span>
            <h3>Your day, mapped clearly</h3>
            <p>See tasks in an agenda view alongside your calendar. Luna plans tasks around meetings—errands during lunch, focus work when you're free.</p>
          </li>
        </ol>
      </section>

      <section id="why-luna" className="designed-for">
        <h2 className="section-title">Designed for ADHD. Built for everyone.</h2>
        <p className="designed-for-text">
          Luna is intentionally minimal.
          Each interaction is designed to reduce cognitive overhead and decision fatigue. While it's especially effective for people with ADHD, the system benefits anyone who wants clarity without unnecessary complexity.
        </p>
      </section>

      <section className="custom-ai">
        <h2 className="section-title">Custom AI, tuned to you</h2>
        <p className="custom-ai-lead">Everyone works differently. Luna adapts.</p>
        <p className="custom-ai-sub">Set your own rules, like:</p>
        <ul className="custom-ai-rules">
          <li>"Never show me more than 10 tasks."</li>
          <li>"Move overflow tasks to tomorrow or my backlog."</li>
          <li>"Group errands together."</li>
          <li>"Protect my mornings for deep work."</li>
        </ul>
        <p className="custom-ai-close">Your AI follows your logic—not a generic productivity system.</p>
      </section>

      <section className="why-different">
        <h2 className="section-title">Why Luna is different</h2>
        <ul className="why-different-list">
          <li>No rigid task systems</li>
          <li>No endless lists</li>
          <li>No guilt for unfinished tasks</li>
        </ul>
        <p className="why-different-close">
          Just a calm, intelligent system that helps you move forward—one day at a time.
        </p>
      </section>

      <section id="cta" className="cta">
        <h2 className="cta-title">Be the first to try Luna AI</h2>
        <p className="cta-subtitle">
          We're building Luna thoughtfully and releasing it in stages.
          Join the waitlist to get early access and help shape the product.
        </p>
        <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Email address" aria-label="Email" />
          <button type="submit" className="btn btn-primary btn-lg">Join the waitlist</button>
        </form>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <a href="#" className="logo">luna.ai</a>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} luna.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
