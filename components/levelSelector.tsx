import { useState } from 'react';
import './levelselector.module.css';

const LevelSelector = () => {
  const [selected, setSelected] = useState('');
  const levels = ['Beginner', 'Medium', 'Hard'];

  return (
    <div className="level-rectangle">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="level-select"
      >
        <option value="" disabled>
          Select Difficulty
        </option>
        {levels.map((level) => (
          <option key={level} value={level} className="level-option">
            {level}
          </option>
        ))}
      </select>
      <div className="custom-arrow" />
    </div>
  );
};

export default LevelSelector;
