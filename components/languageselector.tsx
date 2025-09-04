import { useState } from 'react';
import styles from './LanguageSelector.module.css';

const LanguageSelector = () => {
  const [selected, setSelected] = useState('');
  const languages = ['Python', 'C++', 'Java'];

  return (
    <div className={styles.languageRectangle}>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className={styles.languageSelect}
      >
        <option value="" disabled>
          Select Language
        </option>
        {languages.map((lang) => (
          <option key={lang} value={lang} className={styles.languageOption}>
            {lang}
          </option>
        ))}
      </select>
      <div className={styles.customArrow} />
    </div>
  );
};

export default LanguageSelector;
