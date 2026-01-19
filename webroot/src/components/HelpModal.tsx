import React from 'react';
import './HelpModal.css';

export const HelpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="help-overlay">
            <div className="help-card">
                <div className="help-header">
                    <h2>How to Play</h2>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>
                <div className="help-content">
                    <p>Guess the word in 6 tries.</p>
                    <ul>
                        <li>Each guess must be a valid word.</li>
                        <li>The color of the tiles will change to show how close your guess was.</li>
                    </ul>
                    <div className="examples">
                        <div className="example-row">
                            <div className="tile correct">A</div>
                            <span><strong>A</strong> is in the word and in the correct spot.</span>
                        </div>
                        <div className="example-row">
                            <div className="tile present">B</div>
                            <span><strong>B</strong> is in the word but in the wrong spot.</span>
                        </div>
                        <div className="example-row">
                            <div className="tile absent">C</div>
                            <span><strong>C</strong> is not in the word in any spot.</span>
                        </div>
                    </div>
                    <p><strong>SubThreadle Twist:</strong> The word is related to today's subreddit content! Solve it to suggest tomorrow's puzzle.</p>
                </div>
            </div>
        </div>
    );
};
