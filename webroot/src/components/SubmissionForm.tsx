import React, { useState } from 'react';
import { sendMessage } from '../utils/bridge';
import './SubmissionForm.css';

export const SubmissionForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [word, setWord] = useState("");
    const [hint, setHint] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const cleanWord = word.trim().toUpperCase();
        const cleanHint = hint.trim();

        if (!/^[A-Z]{4,10}$/.test(cleanWord)) {
            setError("Word must be 4-10 letters, A-Z only.");
            return;
        }

        if (cleanHint.length < 20 || cleanHint.length > 120) {
            setError("Hint must be 20-120 characters.");
            return;
        }

        if (cleanHint.toUpperCase().includes(cleanWord)) {
            setError("Hint must not contain the word itself.");
            return;
        }

        sendMessage({ type: 'submitUGC', word: cleanWord, hint: cleanHint });
        setSuccess(true);
    };

    if (success) {
        return (
            <div className="submission-form success">
                <h2>Submission Received!</h2>
                <p>Your puzzle has been submitted for moderation.</p>
                <button onClick={onBack} className="secondary">Back to Game</button>
            </div>
        );
    }

    return (
        <div className="submission-form">
            <h2>Suggest Tomorrow's Puzzle</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Word (4-10 letters)</label>
                    <input
                        type="text"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder="e.g. REDDIT"
                        maxLength={10}
                    />
                </div>

                <div className="form-group">
                    <label>Hint (No spoilers!)</label>
                    <textarea
                        value={hint}
                        onChange={(e) => setHint(e.target.value)}
                        placeholder="A very popular website..."
                        maxLength={120}
                    />
                    <small>{hint.length}/120</small>
                </div>

                {error && <div className="error">{error}</div>}

                <div className="actions">
                    <button type="button" onClick={onBack} className="secondary">Cancel</button>
                    <button type="submit" className="primary">Submit</button>
                </div>
            </form>
        </div>
    );
};
