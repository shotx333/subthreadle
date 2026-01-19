export type DevvitMessage =
    | { type: 'initialData'; data: any }
    | { type: 'submitGuess'; guess: string }
    | { type: 'saveProgress'; guesses: string[] };

export function sendMessage(msg: any) {
    window.parent.postMessage(msg, '*');
}

export function onMessage(callback: (msg: DevvitMessage) => void) {
    const handler = (event: MessageEvent) => {
        if (event.data && event.data.type) {
            callback(event.data);
        }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
}
