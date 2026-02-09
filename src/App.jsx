import { useState, useEffect, useRef } from 'react'
import './App.css'
import OrbitPlannerAnimation from './components/OrbitPlannerAnimation'

function App() {
  const [activeStep, setActiveStep] = useState(0)
  const stepsContainerRef = useRef(null)
  const stepRefs = useRef([])

  useEffect(() => {
    const handleScroll = () => {
      if (!stepsContainerRef.current || stepRefs.current.length === 0) return
      
      const steps = stepRefs.current.filter(Boolean)
      if (steps.length === 0) return
      
      const viewportCenter = window.innerHeight / 2
      
      // Find which step is closest to viewport center
      let closestStep = 0
      let closestDistance = Infinity
      
      for (let i = 0; i < steps.length; i++) {
        const stepRect = steps[i].getBoundingClientRect()
        const stepCenter = stepRect.top + stepRect.height / 2
        const distance = Math.abs(stepCenter - viewportCenter)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestStep = i
        }
      }
      
      setActiveStep(closestStep)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="landing">
      <header className="header">
        <div className="header-inner">
          <a href="#" className="logo">luna.ai</a>
          <nav className="nav">
            <a href="#how-it-works">How it works</a>
            <a href="#why-luna">Why Luna</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <h1 className="hero-headline">
          Get luna.ai in your orbit.
        </h1>
        <div className="hero-columns">
          <div className="hero-content">
            <p className="hero-tagline">An AI-powered to-do and goal app built for you.</p>
            <p className="hero-subtitle">
              Share your thoughts and goals. Luna turns them into a focused plan built around your day, your way.
            </p>
          </div>
          <div className="hero-animation-wrapper">
            <OrbitPlannerAnimation />
          </div>
        </div>
      </section>

      <section id="cta" className="cta">
        <h2 className="cta-title">Become a Beta Tester</h2>
        <p className="cta-subtitle">
          We're looking for early users to help shape Luna. 
          Get exclusive access, provide feedback, and be part of building something that actually works for you.
        </p>
        <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Email address" aria-label="Email" />
          <button type="submit" className="btn btn-primary btn-lg">Request beta access</button>
        </form>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2 className="section-title">How Luna Works</h2>
        <div className="steps-container" ref={stepsContainerRef}>
          <div className="steps-timeline-line" />
          
          <div className="step-row" ref={el => stepRefs.current[0] = el}>
            <div className="step-card-content">
              <h3>Brain-dump, without pressure</h3>
              <p>Start your day by dumping everything in your head. No formatting. No organizing. Just thoughts.</p>
            </div>
            <div className={`steps-timeline-marker ${activeStep === 0 ? 'active' : ''}`}>
              <span className="step-num">1</span>
            </div>
            <div className="step-image-placeholder" aria-hidden="true">
              <span>Image</span>
            </div>
          </div>
          
          <div className="step-row" ref={el => stepRefs.current[1] = el}>
            <div className="step-card-content">
              <h3>AI prioritizes for you</h3>
              <p>Luna turns your brain-dump into a realistic, ordered task list—so starting feels simple again.</p>
            </div>
            <div className={`steps-timeline-marker ${activeStep === 1 ? 'active' : ''}`}>
              <span className="step-num">2</span>
            </div>
            <div className="step-image-placeholder" aria-hidden="true">
              <span>Image</span>
            </div>
          </div>
          
          <div className="step-row" ref={el => stepRefs.current[2] = el}>
            <div className="step-card-content">
              <h3>Your day, mapped clearly</h3>
              <p>Switch between a minimalist task list and agenda view. Luna automatically plans your day around your priorities—according to your rules.</p>
            </div>
            <div className={`steps-timeline-marker ${activeStep === 2 ? 'active' : ''}`}>
              <span className="step-num">3</span>
            </div>
            <div className="step-image-placeholder" aria-hidden="true">
              <span>Image</span>
            </div>
          </div>
          
          <div className="step-row" ref={el => stepRefs.current[3] = el}>
            <div className="step-card-content">
              <h3>Goals → doable steps</h3>
              <p>Set short- or long-term goals. Luna breaks them into achievable tasks, tracks your progress, and keeps you moving forward.</p>
            </div>
            <div className={`steps-timeline-marker ${activeStep === 3 ? 'active' : ''}`}>
              <span className="step-num">4</span>
            </div>
            <div className="step-image-placeholder" aria-hidden="true">
              <span>Image</span>
            </div>
          </div>
          
          <div className="step-row" ref={el => stepRefs.current[4] = el}>
            <div className="step-card-content">
              <h3>Your orbit, your rules.</h3>
              <p className="step-lead">Everyone works differently. Luna adapts with custom rules as simple—or as specific—as you want.</p>
              <ul className="step-rules">
                <li>"From “Never show me more than 10 tasks"</li>
                <li>to “Only add chore tasks if it’s a full moon and my last meeting ends before 3pm."</li>
              </ul>
              <p className="step-close">Your AI runs on your logic—not templates.</p>
            </div>
            <div className={`steps-timeline-marker ${activeStep === 4 ? 'active' : ''}`}>
              <span className="step-num">5</span>
            </div>
            <div className="step-image-placeholder" aria-hidden="true">
              <span>Image</span>
            </div>
          </div>
        </div>
      </section>

      <section id="why-luna" className="why-different">
        <div className="why-different-inner">
          <h2 className="section-title">Why Luna is different</h2>
          <div className="why-different-grid">
            <div className="why-different-card">
              <h3>No rigid task systems</h3>
              <p>Flexible workflows that adapt to how you actually work, not the other way around.</p>
            </div>
            <div className="why-different-card">
              <h3>Smart nudges you control</h3>
              <p>Customize when and how Luna supports you, so reminders fit your rhythm—not disrupt it.</p>
            </div>
            <div className="why-different-card">
              <h3>Designed for ADHD</h3>
              <p>Luna is intentionally minimal. Each interaction reduces cognitive overhead and decision fatigue—built for everyone who wants clarity without complexity.</p>
            </div>
          </div>
          <p className="why-different-close">
            Just a calm, intelligent system that helps you move forward—one day at a time.
          </p>
        </div>
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
