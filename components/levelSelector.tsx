import { useState } from 'react';
import styles from './LevelSelector.module.css';

const LevelSelector = () => {
  const [selected, setSelected] = useState('');
  const levels = ['Beginner', 'Medium', 'Hard'];

  return (
    <div className={styles.levelRectangle}>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className={styles.levelSelect}
      >
        <option value="" disabled>
          Select Difficulty
        </option>
        {levels.map((level) => (
          <option key={level} value={level} className={styles.levelOption}>
            {level}
          </option>
        ))}
      </select>
      <div className={styles.customArrow} />
    </div>
  );
};

export default LevelSelector;
