import React from 'react';
import { sendMessage } from '../utils/bridge';
import './EndScreen.css';

interface EndScreenProps {
    gameStatus: 'won' | 'lost';
    target: string;
    onShare: () => void;
    onSubmit: () => void;
    onVote: () => void;
}

export const EndScreen: React.FC<EndScreenProps> = ({ gameStatus, target, onShare, onSubmit, onVote }) => {
    return (
        <div className="end-overlay">
            <div className={`end-card ${gameStatus}`}>
                <h2 className="animate-pop">{gameStatus === 'won' ? 'Victory!' : 'Game Over'}</h2>

                <div className="word-reveal">
                    The word was <strong>{target}</strong>
                </div>

                {gameStatus === 'won' && (
                    <div className="streak-badge animate-shine">
                        🔥 Daily Streak: 1
                    </div>
                )}

                <div className="actions">
                    <button className="primary" onClick={onShare}>Share Result</button>
                    <div className="secondary-actions">
                        <button className="secondary" onClick={onSubmit}>Suggest Tomorrow</button>
                        <button className="secondary" onClick={onVote}>Vote Candidates</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
