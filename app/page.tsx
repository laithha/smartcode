import Navbar from './web/components/navbar/navbar'  
import styles from './page.module.css'
import {Lesson} from '../type'

export default function Page() {
    return (
        <div>
            <main className={styles.main}>
                <h1>learn To code from scratch</h1>
                <p>Master programming fundamentals through hands-on practice</p>
                <p className={styles.Start}>Start learning</p>
                <p className={styles.Browse}>Browse Lessons</p>
            </main>

            <div className={styles.leftbox}>
                <div className={styles.leftText}>
                <p>👩‍💻 Ready to Code?</p>
                <p>Jump into your first </p>
                <p>lesson</p>
                <a href="#">[Get Started →]</a>
                </div>
            </div>
            <div className={styles.rightbox}>
                <div className={styles.rightText}>
                <p>{'function Welcome() {'}</p>
                <p>{'  return "Hello, World!"'}</p>
                <p>{'}'}</p>
                </div>
            </div>
      <div className={styles.features}>
        <div className={styles.card}>
          <span className={styles.icon}>{"< >"}</span>
          <h3>Interactive coding</h3>
          <p>Write Code in your Browser</p>
        </div>

        <div className={styles.card}>
          <span className={styles.icon}>💡</span>
          <h3>AI Feedback</h3>
          <p>Get personalized suggestion on your solutions</p>
        </div>

        <div className={styles.card}>
          <span className={styles.icon}>📊</span>
          <h3>Track Progress</h3>
          <p>See your improvements over time</p>
        </div>
      </div>
        <p className={styles.text1}>Learn at your own pace  •  50+ exercises  •  AI-powered feedback</p><br></br>
        <div className={styles.line}></div>
        <br></br>
        <div className={styles.footer}>
        <div className={styles.contact}>Contact</div>
        <p>|</p>
        <div className={styles.privacy}>Privacy </div>
        <p>|</p>
        <div className={styles.terms}>Terms</div>
        </div>
        </div>

    )
}
