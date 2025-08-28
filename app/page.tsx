import Navbar from '../components/navbar'  
import styles from './page.module.css'

export default function Page() {
    return (
        <div>
        <main className={styles.main}>
            <h1>learn To code from scratch</h1>
            <p>Master programming fundamentals through hands-on practice</p>
            <p className={styles.Start}>Start learning</p>
            <p className={styles.Browse}>Browse Lessons</p>
        </main>
        </div>
    )
}
