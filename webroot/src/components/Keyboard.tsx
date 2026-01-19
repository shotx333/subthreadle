import React from 'react';
import { LetterStatus } from '../game/logic';
import './Keyboard.css';

interface KeyboardProps {
    onChar: (char: string) => void;
    onEnter: () => void;
    onBackspace: () => void;
    keyStates: Record<string, LetterStatus>;
}

const KEYS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
];

export const Keyboard: React.FC<KeyboardProps> = ({ onChar, onEnter, onBackspace, keyStates }) => {
    const handleClick = (key: string) => {
        if (key === 'ENTER') onEnter();
        else if (key === 'BACK') onBackspace();
        else onChar(key);
    };

    return (
        <div className="keyboard">
            {KEYS.map((row, i) => (
                <div key={i} className="keyboard-row">
                    {row.map(key => (
                        <button
                            key={key}
                            className={`key ${key.length > 1 ? 'wide' : ''} ${keyStates[key] || ''}`}
                            onClick={() => handleClick(key)}
                        >
                            {key === 'BACK' ? '⌫' : key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};
