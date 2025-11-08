import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract';
import { Award, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { hardhat } from 'wagmi/chains';

export const JudgePanel = () => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const [contestId, setContestId] = useState('');
  const [contestantAddress, setContestantAddress] = useState('');
  const [score, setScore] = useState('');

  const { data: isJudge } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isJudge',
    args: contestId ? [BigInt(contestId), address as `0x${string}`] : undefined,
  });

  const { data: contestData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getContest',
    args: contestId ? [BigInt(contestId)] : undefined,
  });

  const isContestLocked = contestData ? contestData[1] : false;

  const handleSubmitScore = async () => {
    if (!contestId || !contestantAddress || !score) {
      toast.error('Please fill in all fields');
      return;
    }

    const scoreNum = parseInt(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      toast.error('Score must be between 0 and 100');
      return;
    }

    if (isContestLocked) {
      toast.error('This contest is locked');
      return;
    }

    if (!isJudge) {
      toast.error('You are not a judge for this contest');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'submitScore',
        args: [BigInt(contestId), contestantAddress as `0x${string}`, BigInt(scoreNum)],
        chain: hardhat,
        account: address!,
      });
      toast.success('Score submission transaction submitted!');
      setScore('');
    } catch (error) {
      toast.error('Failed to submit score');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Submit Score
        </CardTitle>
        <CardDescription>Judge panel for submitting contestant scores</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isContestLocked && contestId && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This contest is locked. No more scores can be submitted.
            </AlertDescription>
          </Alert>
        )}

        {contestId && !isJudge && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You are not registered as a judge for this contest.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="judgeContestId">Contest ID</Label>
          <Input
            id="judgeContestId"
            type="number"
            placeholder="1"
            value={contestId}
            onChange={(e) => setContestId(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="judgeContestantAddress">Contestant Address</Label>
          <Input
            id="judgeContestantAddress"
            placeholder="0x..."
            value={contestantAddress}
            onChange={(e) => setContestantAddress(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="score">Score (0-100)</Label>
          <Input
            id="score"
            type="number"
            min="0"
            max="100"
            placeholder="85"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSubmitScore}
          className="w-full"
          disabled={isContestLocked || !isJudge}
        >
          Submit Score
        </Button>
      </CardContent>
    </Card>
  );
};
