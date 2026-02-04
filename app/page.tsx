"use client";
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Learn to <span className={styles.highlight}>Code</span> from Scratch
        </h1>
        <p className={styles.subtitle}>
          Master programming fundamentals through hands-on practice
        </p>
        <div className={styles.buttons}>
          <a href="web/lessons" className={styles.primaryBtn}>Start Learning</a>
          <a href="web/lessons" className={styles.secondaryBtn}>Browse Lessons</a>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>50+</span>
          <span className={styles.statLabel}>Exercises</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>5</span>
          <span className={styles.statLabel}>Languages</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>24/7</span>
          <span className={styles.statLabel}>AI Feedback</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>Free</span>
          <span className={styles.statLabel}>Forever</span>
        </div>
      </section>

      <section className={styles.showcase}>
        <div className={styles.showcaseCard}>
          <div className={styles.cardHeader}>
            <span className={styles.dot} style={{ background: '#ff5f57' }}></span>
            <span className={styles.dot} style={{ background: '#ffbd2e' }}></span>
            <span className={styles.dot} style={{ background: '#28ca41' }}></span>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.emoji}>👩‍💻</p>
            <h3>Ready to Code?</h3>
            <p>Jump into your first lesson</p>
            <a href="web/lessons" className={styles.cardLink}>Get Started →</a>
          </div>
        </div>

        <div className={styles.showcaseCard}>
          <div className={styles.cardHeader}>
            <span className={styles.dot} style={{ background: '#ff5f57' }}></span>
            <span className={styles.dot} style={{ background: '#ffbd2e' }}></span>
            <span className={styles.dot} style={{ background: '#28ca41' }}></span>
          </div>
          <pre className={styles.codeBlock}>
            <code>
              <span className={styles.keyword}>function</span> <span className={styles.func}>Welcome</span>() {'{'}{'\n'}
              {'  '}<span className={styles.keyword}>return</span> <span className={styles.string}>"Hello, World!"</span>{'\n'}
              {'}'}
            </code>
          </pre>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Choose a Lesson</h3>
            <p>Pick from beginner to advanced topics across multiple languages</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Write Code</h3>
            <p>Practice in our browser-based code editor with syntax highlighting</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Get Feedback</h3>
            <p>Receive instant AI-powered suggestions to improve your code</p>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>{'< >'}</span>
          <h3>Interactive Coding</h3>
          <p>Write code directly in your browser with our powerful editor</p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>💡</span>
          <h3>AI Feedback</h3>
          <p>Get personalized suggestions to improve your solutions</p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>📊</span>
          <h3>Track Progress</h3>
          <p>See your improvements and achievements over time</p>
        </div>
      </section>

      <section className={styles.languages}>
        <h2 className={styles.sectionTitle}>Languages You'll Learn</h2>
        <div className={styles.langGrid}>
          <div className={styles.langCard}>
            <span className={styles.langIcon}>🐍</span>
            <span>Python</span>
          </div>
          <div className={styles.langCard}>
            <span className={styles.langIcon}>🟨</span>
            <span>JavaScript</span>
          </div>
          <div className={styles.langCard}>
            <span className={styles.langIcon}>☕</span>
            <span>Java</span>
          </div>
          <div className={styles.langCard}>
            <span className={styles.langIcon}>💎</span>
            <span>C++</span>
          </div>
          <div className={styles.langCard}>
            <span className={styles.langIcon}>🦀</span>
            <span>Rust</span>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Ready to Start Your Coding Journey?</h2>
        <p>Join thousands of learners mastering programming skills</p>
        <a href="/web/register" className={styles.primaryBtn}>Create Free Account</a>
      </section>

      <p className={styles.tagline}>
        Learn at your own pace • 50+ exercises • AI-powered feedback
      </p>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#">Contact</a>
          <span>|</span>
          <a href="#">Privacy</a>
          <span>|</span>
          <a href="#">Terms</a>
        </div>
        <p className={styles.copyright}>© 2024 SmartCode. All rights reserved.</p>
      </footer>
    </div>
  );
}
