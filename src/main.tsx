import { Devvit, useState } from '@devvit/public-api';
import { getDailyWord } from './game/logic';

Devvit.configure({
    redis: true,
    redditAPI: true,
});

function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
}

// --- Redis Keys ---
const KEY_DAILY_TARGET = (date: string) => `daily_target:${date}`;
const KEY_PROPOSALS = (date: string) => `proposals:${date}`;
const KEY_PROPOSAL_DATA = (id: string) => `proposal_data:${id}`;
const KEY_USER_VOTED = (date: string, userId: string) => `voted:${date}:${userId}`;
const KEY_USER_SUBMITTED = (date: string, userId: string) => `submitted:${date}:${userId}`;

// --- Types ---
type ProposalData = {
    id: string;
    word: string;
    hint: string;
    authorId: string;
    createdAt: number;
};

// --- Game Logic ---

async function getEffectiveTarget(context: Devvit.Context): Promise<string> {
    const today = getToday();
    const redis = context.redis;

    const storedTarget = await redis.get(KEY_DAILY_TARGET(today));
    if (storedTarget) return storedTarget;

    const yesterday = getYesterday();
    const topProposals = await redis.zRange(KEY_PROPOSALS(yesterday), 0, 0, { by: 'rank', reverse: true });

    let electedWord: string | null = null;

    if (topProposals && topProposals.length > 0) {
        const winnerId = topProposals[0].member;
        const winnerDataStr = await redis.get(KEY_PROPOSAL_DATA(winnerId));
        if (winnerDataStr) {
            const winnerData: ProposalData = JSON.parse(winnerDataStr);
            electedWord = winnerData.word;
        }
    }

    if (!electedWord) {
        electedWord = getDailyWord(today);
    }

    await redis.set(KEY_DAILY_TARGET(today), electedWord);

    return electedWord;
}

Devvit.addCustomPostType({
    name: 'SubThreadle',
    height: 'tall',
    render: (context) => {
        const [proposals, setProposals] = useState<any[]>([]);

        return (
            <vstack height="100%" width="100%" alignment="center middle">
                <webview
                    id="game-view"
                    url="index.html"
                    onMessage={(msg: any) => {
                        (async () => {
                            const redis = context.redis;
                            const userId = context.userId;
                            const today = getToday();


                            if (msg.type === 'initialData') {
                                const target = await getEffectiveTarget(context);

                                const proposalIds = await redis.zRange(KEY_PROPOSALS(today), 0, 49, { by: 'rank', reverse: true });
                                const loadedProposals: any[] = [];

                                for (const p of proposalIds) {
                                    const id = p.member;
                                    const score = p.score;
                                    const dataStr = await redis.get(KEY_PROPOSAL_DATA(id));
                                    if (dataStr) {
                                        const data = JSON.parse(dataStr);
                                        const hasVoted = userId ? await redis.get(KEY_USER_VOTED(today, userId)) : false;

                                        loadedProposals.push({
                                            id: data.id,
                                            word: data.word,
                                            hint: data.hint,
                                            votes: score,
                                            userResult: (hasVoted === 'true') ? 'voted' : null
                                        });
                                    }
                                }

                                context.ui.webView.postMessage('game-view', {
                                    type: 'initialData',
                                    data: {
                                        target,
                                        proposals: loadedProposals
                                    }
                                });
                            }

                            else if (msg.type === 'submitUGC') {
                                if (!userId) return;

                                const hasSubmitted = await redis.get(KEY_USER_SUBMITTED(today, userId));
                                if (hasSubmitted) return;

                                const { word, hint } = msg as any;
                                const id = Math.random().toString(36).substring(2, 15);

                                const newProposal: ProposalData = {
                                    id,
                                    word,
                                    hint,
                                    authorId: userId,
                                    createdAt: Date.now()
                                };

                                await redis.set(KEY_PROPOSAL_DATA(id), JSON.stringify(newProposal));
                                await redis.zAdd(KEY_PROPOSALS(today), { member: id, score: 0 });
                                await redis.set(KEY_USER_SUBMITTED(today, userId), 'true');
                            }

                            else if (msg.type === 'voteUGC') {
                                if (!userId) return;

                                const hasVoted = await redis.get(KEY_USER_VOTED(today, userId));
                                if (hasVoted) return;

                                const { id } = msg as any;

                                await redis.zIncrBy(KEY_PROPOSALS(today), id, 1);
                                await redis.set(KEY_USER_VOTED(today, userId), 'true');
                            }

                            else if (msg.type === 'share') {
                                if (!userId) return;

                                const { text } = msg as any;

                                if (!text) return;

                                await context.reddit.submitComment({
                                    id: context.postId!,
                                    text: text
                                });
                            }
                        })();
                    }}
                />
            </vstack>
        );
    },
});

export default Devvit;
