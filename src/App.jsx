import './App.css'

function App() {
  return (
    <div className="landing">
      <header className="header">
        <a href="#" className="logo">Your Brand</a>
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#cta" className="btn btn-primary">Get started</a>
        </nav>
      </header>

      <section className="hero">
        <h1 className="hero-title">
          Build something <span className="highlight">remarkable</span>
        </h1>
        <p className="hero-subtitle">
          A short, clear line that explains what you do and why it matters.
          Replace this with your own value proposition.
        </p>
        <div className="hero-actions">
          <a href="#cta" className="btn btn-primary btn-lg">Start free trial</a>
          <a href="#features" className="btn btn-ghost btn-lg">See how it works</a>
        </div>
      </section>

      <section id="features" className="features">
        <h2 className="section-title">Why choose us</h2>
        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast & reliable</h3>
            <p>Everything runs quickly and stays up so your users never wait.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure by default</h3>
            <p>Security built in from day one. No extra config required.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Simple to use</h3>
            <p>Clean interface and clear docs. You’ll be productive in minutes.</p>
          </article>
        </div>
      </section>

      <section id="cta" className="cta">
        <h2 className="cta-title">Ready to get started?</h2>
        <p className="cta-subtitle">Join thousands of others. No credit card required.</p>
        <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" aria-label="Email" />
          <button type="submit" className="btn btn-primary">Sign up free</button>
        </form>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <a href="#" className="logo">Your Brand</a>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Your Brand. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
