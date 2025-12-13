import { useMemo } from 'react';

import type { GameLeaderboard } from '@/features/game/services/queries/types';

// Add mock data to ensure at least minCount entries
const mockData: GameLeaderboard[] = [
  {
    id: 'm1',
    userName: 'Alex Morgan',
    userAvatarUrl: null,
    score: 10,
  } as GameLeaderboard,
  {
    id: 'm2',
    userName: 'Jamie Fox',
    userAvatarUrl: null,
    score: 20,
  } as GameLeaderboard,
  {
    id: 'm3',
    userName: 'Samir K',
    userAvatarUrl: null,
    score: 30,
  } as GameLeaderboard,
  {
    id: 'm4',
    userName: 'Lina Park',
    userAvatarUrl: null,
    score: 40,
  } as GameLeaderboard,
  {
    id: 'm5',
    userName: 'Noah Reed',
    userAvatarUrl: null,
    score: 50,
  } as GameLeaderboard,
  {
    id: 'm6',
    userName: 'Maya Lin',
    userAvatarUrl: null,
    score: 10,
  } as GameLeaderboard,
  {
    id: 'm7',
    userName: 'Ethan Blake',
    userAvatarUrl: null,
    score: 20,
  } as GameLeaderboard,
  {
    id: 'm8',
    userName: 'Olivia Hart',
    userAvatarUrl: null,
    score: 30,
  } as GameLeaderboard,
  {
    id: 'm9',
    userName: 'Victor Chen',
    userAvatarUrl: null,
    score: 40,
  } as GameLeaderboard,
  {
    id: 'm10',
    userName: 'Zoe Quinn',
    userAvatarUrl: null,
    score: 50,
  } as GameLeaderboard,
];

// Normalize, dedupe, sort by score desc, and ensure at least minCount entries.
// Incoming entries may lack rank/id; produce consistent ids and ranks.
const prepareEntries = (
  raw?: GameLeaderboard[],
  minCount = 8,
): GameLeaderboard[] => {
  const normalized: GameLeaderboard[] = (Array.isArray(raw) ? raw : []).map(
    (e, i) => {
      const anyE = e as any;
      // support backend field names: userId, totalScore, userAvatarUrl, userName, rank
      const id =
        anyE?.id ??
        anyE?.userId ??
        `${anyE?.userName ?? anyE?.name ?? 'user'}-${i}`;
      const userName = anyE?.userName ?? anyE?.name ?? 'Unknown';
      const score =
        typeof anyE?.score === 'number'
          ? anyE.score
          : typeof anyE?.totalScore === 'number'
            ? anyE.totalScore
            : 0;
      const userAvatarUrl = anyE?.userAvatarUrl ?? anyE?.avatar ?? null;
      const rank = typeof anyE?.rank === 'number' ? anyE.rank : undefined;
      return { id, userName, score, userAvatarUrl, rank } as GameLeaderboard;
    },
  );

  // Dedupe by id (fallback to userName if id missing)
  const map = new Map<string, GameLeaderboard>();
  for (const e of normalized) {
    const key = e.id ?? (e as any).userId ?? e.userName;
    if (!map.has(key)) map.set(key, e);
  }

  // Convert to array and sort by score desc
  let combined = Array.from(map.values()).sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0),
  );

  // Append mockData entries that aren't already present until minCount
  const existingKeys = new Set(combined.map((c) => c.id ?? c.userName));
  for (const m of mockData) {
    if (combined.length >= minCount) break;
    const key = m.id ?? m.userName;
    if (!existingKeys.has(key)) {
      combined.push(m);
      existingKeys.add(key);
    }
  }

  // If still not enough, duplicate mockData with synthetic ids
  let idx = 0;
  while (combined.length < minCount) {
    const m = mockData[idx % mockData.length];
    const dup: GameLeaderboard = {
      ...m,
      id: `${m.id}-dup-${idx}`,
    } as GameLeaderboard;
    combined.push(dup);
    idx++;
  }

  // Final sort (in case mock entries appended have different scores) and assign ranks
  combined = combined
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .map(
      (e, i) =>
        ({
          ...e,
          rank: i + 1,
        }) as GameLeaderboard,
    );

  return combined;
};

const Avatar = ({ name, src }: { name: string; src?: string | null }) => {
  if (src)
    return (
      <img
        src={src}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  const initials = name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
      {initials}
    </div>
  );
};

const Leaderboard = ({ entries }: { entries?: GameLeaderboard[] }) => {
  // Recompute prepared entries whenever `entries` changes (levels update)
  console.log('Leaderboard entries:', entries);
  const entriesToUse = useMemo(() => prepareEntries(entries, 8), [entries]);
  console.log('entriesToUse', entriesToUse);
  const top = entriesToUse.slice(0, 3);
  const rest = entriesToUse.slice(3);

  return (
    <aside className="w-full max-w-sm mx-auto">
      <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-100 p-4 shadow-lg h-full">
        {/* Podium */}
        <div className="flex items-end justify-center gap-4 mb-4">
          {/* 2 */}
          <div className="flex flex-col items-center">
            <img
              src={
                top[1]?.userAvatarUrl ||
                'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg'
              }
              alt={top[1]?.userName || ''}
              className="absolute -top-8 w-16 h-16 text-sm rounded-full object-cover"
            />
            <div className="w-24 h-24 bg-blue-100 rounded-md flex items-center justify-center relative">
              <div className="absolute -top-6 text-sm font-bold text-white bg-blue-500 px-2 py-1 rounded-full shadow">
                {top[1]?.score?.toLocaleString()}
              </div>
              <div className="text-2xl font-bold text-blue-700">2</div>
            </div>
            <div className="mt-2 text-sm font-medium text-gray-700">
              {top[1]?.userName}
            </div>
          </div>

          {/* 1 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-36 bg-gradient-to-b from-blue-400 to-blue-200 rounded-xl flex items-center justify-center relative shadow-xl">
              <div className="absolute -top-32">
                <div className="flex flex-col items-center gap-2">
                  <div className=" rounded-full text-3xl">👑</div>
                  <img
                    src={
                      top[0]?.userAvatarUrl ||
                      'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg'
                    }
                    alt={top[0]?.userName || ''}
                    className="w-16 h-16 text-sm rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -top-4 text-white bg-blue-600 px-3 py-1 rounded-full font-bold">
                {top[0]?.score?.toLocaleString()}
              </div>
              <div className="text-4xl font-extrabold text-white">1</div>
            </div>
            <div className="mt-2 text-sm font-medium text-gray-700">
              {top[0]?.userName}
            </div>
          </div>

          {/* 3 */}
          <div className="flex flex-col items-center">
            <img
              src={
                top[2]?.userAvatarUrl ||
                'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg'
              }
              alt={top[2]?.userName || ''}
              className="absolute -top-2 w-14 h-14 text-sm rounded-full object-cover"
            />
            <div className="w-24 h-20 bg-blue-100 rounded-md flex items-center justify-center relative">
              <div className="absolute -top-6 text-sm font-bold text-white bg-blue-500 px-2 py-1 rounded-full shadow">
                {top[2]?.score?.toLocaleString()}
              </div>
              <div className="text-2xl font-bold text-blue-700">3</div>
            </div>
            <div className="mt-2 text-sm font-medium text-gray-700">
              {top[2]?.userName}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="mt-2 space-y-2">
          {rest.map((e, i) => (
            <div
              key={e.id}
              className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3">
                {/* show assigned rank if present, otherwise compute from position (top 3 removed) */}
                <div className="text-xs text-gray-400 w-6">
                  {(e as any).rank ?? i + 4}
                </div>
                <Avatar name={e.userName} src={e.userAvatarUrl} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{e.userName}</div>
                <div className="text-xs text-gray-400">
                  {e.score.toLocaleString()} điểm
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
export default Leaderboard;
