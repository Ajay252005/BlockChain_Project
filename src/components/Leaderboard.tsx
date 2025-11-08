import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract';
import { Trophy, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Leaderboard = () => {
  const [contestId, setContestId] = useState('');

  const { data: leaderboardData, refetch, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getLeaderboard',
    args: contestId ? [BigInt(contestId)] : undefined,
  });

  const { data: contestData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getContest',
    args: contestId ? [BigInt(contestId)] : undefined,
  });

  const contestName = contestData ? contestData[0] : '';
  const isLocked = contestData ? contestData[1] : false;

  const leaderboard = leaderboardData
    ? (leaderboardData[0] as string[]).map((address, index) => ({
        rank: index + 1,
        address,
        totalScore: Number((leaderboardData[1] as bigint[])[index]),
        judgeCount: Number((leaderboardData[2] as bigint[])[index]),
        avgScore:
          Number((leaderboardData[2] as bigint[])[index]) > 0
            ? (Number((leaderboardData[1] as bigint[])[index]) /
                Number((leaderboardData[2] as bigint[])[index])).toFixed(2)
            : '0.00',
      }))
    : [];

  // Sort by total score descending
  leaderboard.sort((a, b) => b.totalScore - a.totalScore);

  // Update ranks after sorting
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
        <CardDescription>View real-time contest rankings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="leaderboardContestId">Contest ID</Label>
            <Input
              id="leaderboardContestId"
              type="number"
              placeholder="1"
              value={contestId}
              onChange={(e) => setContestId(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={() => refetch()} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {contestName && (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{contestName}</h3>
            </div>
            {isLocked && (
              <Badge variant="secondary">Contest Locked</Badge>
            )}
          </div>
        )}

        {isLoading && <p className="text-center text-muted-foreground">Loading...</p>}

        {leaderboard.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Contestant</TableHead>
                  <TableHead className="text-right">Total Score</TableHead>
                  <TableHead className="text-right">Judges</TableHead>
                  <TableHead className="text-right">Avg Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry) => (
                  <TableRow key={entry.address}>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        {getMedalEmoji(entry.rank)}
                        {entry.rank}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {entry.totalScore}
                    </TableCell>
                    <TableCell className="text-right">{entry.judgeCount}</TableCell>
                    <TableCell className="text-right">{entry.avgScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          contestId && !isLoading && (
            <p className="text-center text-muted-foreground py-8">
              No contestants found for this contest
            </p>
          )
        )}
      </CardContent>
    </Card>
  );
};
