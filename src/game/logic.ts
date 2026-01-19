export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export interface LetterState {
    char: string;
    status: LetterStatus;
}

export function checkGuess(target: string, guess: string): LetterState[] {
    const result: LetterState[] = [];
    const targetChars = target.toUpperCase().split('');
    const guessChars = guess.toUpperCase().split('');

    for (let i = 0; i < guessChars.length; i++) {
        result.push({ char: guessChars[i], status: 'absent' });
    }

    for (let i = 0; i < guessChars.length; i++) {
        if (guessChars[i] === targetChars[i]) {
            result[i].status = 'correct';
            targetChars[i] = '#';
        }
    }

    for (let i = 0; i < guessChars.length; i++) {
        if (result[i].status !== 'correct') {
            const index = targetChars.indexOf(guessChars[i]);
            if (index !== -1) {
                result[i].status = 'present';
                targetChars[index] = '#';
            }
        }
    }

    return result;
}

import { WORDS } from './words';

export const MAX_ATTEMPTS = 6;

function getSeedFromDate(date: string): number {
    let hash = 0;
    for (let i = 0; i < date.length; i++) {
        const char = date.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

export function getDailyWord(date: string): string {
    const seed = getSeedFromDate(date);
    const index = seed % WORDS.length;
    return WORDS[index];
}
