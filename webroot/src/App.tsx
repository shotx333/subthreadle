import React, { useState, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { SubmissionForm } from './components/SubmissionForm';
import { VotingList } from './components/VotingList';
import confetti from 'canvas-confetti';
import { EndScreen } from './components/EndScreen';
import { HelpModal } from './components/HelpModal';
import { checkGuess, LetterStatus, MAX_ATTEMPTS, getDailyWord } from './game/logic';
import { sendMessage, onMessage } from './utils/bridge';

function App() {
    const [showHelp, setShowHelp] = useState(false);
    const [target, setTarget] = useState<string>("");
    const [guesses, setGuesses] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
    const [loading, setLoading] = useState(true);

    const [currentView, setCurrentView] = useState<'game' | 'submit' | 'vote'>('game');
    const [proposals, setProposals] = useState<any[]>([]);

    useEffect(() => {
        const cleanup = onMessage((msg) => {
            if (msg.type === 'initialData') {
                const { target, guesses: loadedGuesses, proposals: loadedProposals } = msg.data;
                if (target) setTarget(target);
                if (loadedGuesses) {
                    setGuesses(loadedGuesses);
                    if (loadedGuesses.includes(target)) setGameStatus('won');
                    else if (loadedGuesses.length >= MAX_ATTEMPTS) setGameStatus('lost');
                }
                if (loadedProposals) setProposals(loadedProposals);
                setLoading(false);
            }
        });

        sendMessage({ type: 'initialData' });

        setTimeout(() => {
            setLoading(prev => {
                if (prev) {
                    const today = new Date().toISOString().split('T')[0];
                    const dailyWord = getDailyWord(today);

                    const savedGuesses = JSON.parse(localStorage.getItem('subthreadle-guesses') || '[]');
                    const savedTarget = localStorage.getItem('subthreadle-target');


                    const finalTarget = (savedTarget && savedTarget !== 'DAILY') ? savedTarget : dailyWord;

                    setTarget(finalTarget);
                    setGuesses(savedGuesses);
                    if (savedGuesses.includes(finalTarget)) setGameStatus('won');
                    else if (savedGuesses.length >= MAX_ATTEMPTS) setGameStatus('lost');

                    if (import.meta.env.DEV) {
                        setProposals([
                            { id: '1', word: 'REDDIT', hint: 'Frontpage of the internet', votes: 42 },
                            { id: '2', word: 'GAMES', hint: 'We are playing one', votes: 12 }
                        ]);
                    }

                    return false;
                }
                return prev;
            });
        }, 500);

        return cleanup;
    }, []);

    useEffect(() => {
    }, [guesses, target]);

    const onChar = (char: string) => {
        if (gameStatus !== 'playing') return;
        if (currentGuess.length < 5) {
            setCurrentGuess(prev => prev + char);
        }
    };

    const onBackspace = () => {
        if (gameStatus !== 'playing') return;
        setCurrentGuess(prev => prev.slice(0, -1));
    };

    const onEnter = () => {
        if (gameStatus !== 'playing') return;
        if (currentGuess.length !== 5) return;

        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess("");

        if (currentGuess === target) {
            setGameStatus('won');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else if (newGuesses.length >= MAX_ATTEMPTS) {
            setGameStatus('lost');
        }

        sendMessage({ type: 'saveProgress', guesses: newGuesses });
        localStorage.setItem('subthreadle-guesses', JSON.stringify(newGuesses));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (currentView !== 'game') return;
            if (e.key === 'Enter') onEnter();
            else if (e.key === 'Backspace') onBackspace();
            else {
                const char = e.key.toUpperCase();
                if (/^[A-Z]$/.test(char)) onChar(char);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentGuess, gameStatus, currentView]);

    const results = guesses.map(g => checkGuess(target, g));
    const keyStates: Record<string, LetterStatus> = {};
    results.flat().forEach(({ char, status }) => {
        const current = keyStates[char];
        if (status === 'correct') keyStates[char] = 'correct';
        else if (status === 'present' && current !== 'correct') keyStates[char] = 'present';
        else if (status === 'absent' && !current) keyStates[char] = 'absent';
    });

    if (loading) return <div className="loading">Loading SubThreadle...</div>;

    return (
        <div className="app">
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

            {currentView === 'game' && (
                <>
                    <header style={{ position: 'relative' }}>
                        <h1>SubThreadle</h1>
                        <button
                            onClick={() => setShowHelp(true)}
                            style={{ position: 'absolute', right: 10, top: 10, fontSize: '1.2rem', color: 'var(--text-color)', background: 'none' }}
                        >
                            ?
                        </button>
                    </header>

                    <GameBoard
                        guesses={guesses}
                        currentGuess={currentGuess}
                        target={target}
                        gameStatus={gameStatus}
                        results={results}
                    />

                    <Keyboard
                        onChar={onChar}
                        onEnter={onEnter}
                        onBackspace={onBackspace}
                        keyStates={keyStates}
                    />

                    {gameStatus !== 'playing' && (
                        <EndScreen
                            gameStatus={gameStatus}
                            target={target}
                            onShare={() => {
                                const grid = guesses.map(g => {
                                    return checkGuess(target, g).map(r => {
                                        if (r.status === 'correct') return '🟩';
                                        if (r.status === 'present') return '🟨';
                                        return '⬛';
                                    }).join('');
                                }).join('\n');

                                sendMessage({
                                    type: 'share',
                                    text: `SubThreadle ${new Date().toISOString().split('T')[0]}\n${guesses.length}/${MAX_ATTEMPTS}\n\n${grid}`
                                });
                            }}
                            onSubmit={() => setCurrentView('submit')}
                            onVote={() => setCurrentView('vote')}
                        />
                    )}
                </>
            )}

            {currentView === 'submit' && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <SubmissionForm onBack={() => setCurrentView('game')} />
                </div>
            )}

            {currentView === 'vote' && (
                <VotingList proposals={proposals} onBack={() => setCurrentView('game')} />
            )}
        </div>
    );
}

export default App;
