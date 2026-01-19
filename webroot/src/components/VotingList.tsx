import React from 'react';
import { sendMessage } from '../utils/bridge';
import './VotingList.css';

interface Proposal {
    id: string;
    word: string;
    hint: string;
    votes: number;
    userResult?: 'voted' | null;
}

interface VotingListProps {
    proposals: Proposal[];
    onBack: () => void;
}

export const VotingList: React.FC<VotingListProps> = ({ proposals: initialProposals, onBack }) => {
    const [list, setList] = React.useState(initialProposals);

    React.useEffect(() => {
        setList(initialProposals);
    }, [initialProposals]);

    const handleVote = (id: string) => {
        sendMessage({ type: 'voteUGC', id });

        setList(prev => prev.map(p => {
            if (p.id === id) {
                return { ...p, votes: p.votes + 1, userResult: 'voted' };
            }
            return p;
        }));
    };

    return (
        <div className="voting-list">
            <div className="voting-header">
                <h2>Vote for Tomorrow</h2>
                <button onClick={onBack} className="close-btn">×</button>
            </div>

            {list.length === 0 ? (
                <div className="empty-state">No submissions yet. Be the first!</div>
            ) : (
                <div className="proposals">
                    {list.map(p => (
                        <div key={p.id} className="proposal-card">
                            <div className="proposal-content">
                                <div className="proposal-word">{p.word}</div>
                                <div className="proposal-hint">{p.hint}</div>
                            </div>
                            <button
                                className={`vote-btn ${p.userResult === 'voted' ? 'voted' : ''}`}
                                onClick={() => handleVote(p.id)}
                                disabled={p.userResult === 'voted'}
                            >
                                ▲ {p.votes}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
