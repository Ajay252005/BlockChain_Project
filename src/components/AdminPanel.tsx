import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract';
import { Shield, Plus, Lock } from 'lucide-react';
import { hardhat } from 'wagmi/chains';

export const AdminPanel = () => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  
  const [contestName, setContestName] = useState('');
  const [contestId, setContestId] = useState('');
  const [judgeAddress, setJudgeAddress] = useState('');
  const [contestantAddress, setContestantAddress] = useState('');
  const [lockContestId, setLockContestId] = useState('');

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'owner',
  });

  const isOwner = owner && address && owner.toLowerCase() === address.toLowerCase();

  const handleCreateContest = async () => {
    if (!contestName.trim()) {
      toast.error('Please enter a contest name');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'createContest',
        args: [contestName],
        chain: hardhat,
        account: address!,
      });
      toast.success('Contest creation transaction submitted!');
      setContestName('');
    } catch (error) {
      toast.error('Failed to create contest');
      console.error(error);
    }
  };

  const handleAddJudge = async () => {
    if (!contestId || !judgeAddress) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'addJudge',
        args: [BigInt(contestId), judgeAddress as `0x${string}`],
        chain: hardhat,
        account: address!,
      });
      toast.success('Judge addition transaction submitted!');
      setJudgeAddress('');
    } catch (error) {
      toast.error('Failed to add judge');
      console.error(error);
    }
  };

  const handleAddContestant = async () => {
    if (!contestId || !contestantAddress) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'addContestant',
        args: [BigInt(contestId), contestantAddress as `0x${string}`],
        chain: hardhat,
        account: address!,
      });
      toast.success('Contestant addition transaction submitted!');
      setContestantAddress('');
    } catch (error) {
      toast.error('Failed to add contestant');
      console.error(error);
    }
  };

  const handleLockContest = async () => {
    if (!lockContestId) {
      toast.error('Please enter a contest ID');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'lockContest',
        args: [BigInt(lockContestId)],
        chain: hardhat,
        account: address!,
      });
      toast.success('Contest lock transaction submitted!');
      setLockContestId('');
    } catch (error) {
      toast.error('Failed to lock contest');
      console.error(error);
    }
  };

  if (!isOwner) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              You must be the contract owner to access the admin panel
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Contest
          </CardTitle>
          <CardDescription>Create a new contest for scoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contestName">Contest Name</Label>
            <Input
              id="contestName"
              placeholder="e.g., Summer Talent Show 2024"
              value={contestName}
              onChange={(e) => setContestName(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateContest} className="w-full">
            Create Contest
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Judge</CardTitle>
          <CardDescription>Add a judge to an existing contest</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label htmlFor="judgeAddress">Judge Address</Label>
            <Input
              id="judgeAddress"
              placeholder="0x..."
              value={judgeAddress}
              onChange={(e) => setJudgeAddress(e.target.value)}
            />
          </div>
          <Button onClick={handleAddJudge} variant="secondary" className="w-full">
            Add Judge
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Contestant</CardTitle>
          <CardDescription>Add a contestant to an existing contest</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contestantContestId">Contest ID</Label>
            <Input
              id="contestantContestId"
              type="number"
              placeholder="1"
              value={contestId}
              onChange={(e) => setContestId(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="contestantAddress">Contestant Address</Label>
            <Input
              id="contestantAddress"
              placeholder="0x..."
              value={contestantAddress}
              onChange={(e) => setContestantAddress(e.target.value)}
            />
          </div>
          <Button onClick={handleAddContestant} variant="secondary" className="w-full">
            Add Contestant
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Lock Contest
          </CardTitle>
          <CardDescription>
            Lock a contest to prevent further scoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="lockContestId">Contest ID</Label>
            <Input
              id="lockContestId"
              type="number"
              placeholder="1"
              value={lockContestId}
              onChange={(e) => setLockContestId(e.target.value)}
            />
          </div>
          <Button onClick={handleLockContest} variant="destructive" className="w-full">
            Lock Contest
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
