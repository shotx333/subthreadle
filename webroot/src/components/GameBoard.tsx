import React from 'react';
import { LetterState, WORD_LENGTH, MAX_ATTEMPTS } from '../game/logic';
import './GameBoard.css';

interface GameBoardProps {
    guesses: string[];
    currentGuess: string;
    target: string;
    gameStatus: 'playing' | 'won' | 'lost';
    results: LetterState[][];
}

export const GameBoard: React.FC<GameBoardProps> = ({ guesses, currentGuess, gameStatus, results }) => {
    const empties = Array.from({ length: MAX_ATTEMPTS - 1 - guesses.length }, () => "");

    return (
        <div className="game-board">
            {guesses.map((guess, i) => (
                <Row key={i} guess={guess} result={results[i]} />
            ))}
            {gameStatus === 'playing' && guesses.length < MAX_ATTEMPTS && (
                <Row key="current" guess={currentGuess} current />
            )}
            {guesses.length + (gameStatus === 'playing' ? 1 : 0) < MAX_ATTEMPTS &&
                Array.from({ length: MAX_ATTEMPTS - guesses.length - (gameStatus === 'playing' ? 1 : 0) }).map((_, i) => (
                    <Row key={`empty-${i}`} guess="" />
                ))
            }
        </div>
    );
};

interface RowProps {
    guess: string;
    result?: LetterState[];
    current?: boolean;
}

const Row: React.FC<RowProps> = ({ guess, result, current }) => {
    const chars = guess.padEnd(5, ' ').split('').slice(0, 5);

    return (
        <div className="row">
            {chars.map((char, i) => (
                <div
                    key={i}
                    className={`tile ${result ? result[i].status : ''} ${current ? 'current' : ''}`}
                    data-val={char.trim() ? 'char' : undefined}
                >
                    {char.trim()}
                </div>
            ))}
        </div>
    );
};
