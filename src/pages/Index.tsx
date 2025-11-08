import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Award, Trophy, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [demoMode] = useState(true);
  const [contests, setContests] = useState([
    { id: 1, name: 'Summer Talent Show 2024', isLocked: false }
  ]);
  const [contestants] = useState([
    { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', totalScore: 285, judgeCount: 3, avgScore: 95.00 },
    { address: '0x5c4832B36a5b7D7c23e3c3b9c4e5c6d7e8f9a0b', totalScore: 270, judgeCount: 3, avgScore: 90.00 },
    { address: '0x8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', totalScore: 255, judgeCount: 3, avgScore: 85.00 },
  ]);

  const [contestName, setContestName] = useState('');
  const [selectedContest, setSelectedContest] = useState('1');
  const [score, setScore] = useState('');

  const handleCreateContest = () => {
    if (!contestName.trim()) {
      toast.error('Please enter a contest name');
      return;
    }
    const newId = contests.length + 1;
    setContests([...contests, { id: newId, name: contestName, isLocked: false }]);
    toast.success(`Contest "${contestName}" created successfully!`);
    setContestName('');
  };

  const handleSubmitScore = () => {
    if (!score) {
      toast.error('Please enter a score');
      return;
    }
    const scoreNum = parseInt(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      toast.error('Score must be between 0 and 100');
      return;
    }
    toast.success(`Score ${scoreNum} submitted successfully!`);
    setScore('');
  };

  const handleLockContest = () => {
    const id = parseInt(selectedContest);
    setContests(contests.map(c => c.id === id ? { ...c, isLocked: true } : c));
    toast.success('Contest locked successfully!');
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const selectedContestData = contests.find(c => c.id === parseInt(selectedContest));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary">
            Blockchain Contest Scoring System
          </h1>
          <p className="text-muted-foreground mt-1">
            Decentralized, transparent, and tamper-proof contest scoring
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {demoMode && (
            <Card className="p-4 border-accent bg-accent/5">
              <div className="flex items-start gap-3">
                <Wallet className="h-5 w-5 text-accent mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Demo Mode Active</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This is a demo version. To use with real blockchain:
                  </p>
                  <ol className="text-sm text-muted-foreground mt-2 ml-4 list-decimal space-y-1">
                    <li>Install Hardhat: <code className="text-xs bg-muted px-1 py-0.5 rounded">npm install --save-dev hardhat</code></li>
                    <li>Start local node: <code className="text-xs bg-muted px-1 py-0.5 rounded">npx hardhat node</code></li>
                    <li>Deploy contract: <code className="text-xs bg-muted px-1 py-0.5 rounded">npx hardhat run scripts/deploy.js --network localhost</code></li>
                    <li>Add contract address to .env file</li>
                    <li>Configure MetaMask for local network (Chain ID: 31337)</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-2">
                    See <strong>BLOCKCHAIN_SETUP.md</strong> for complete instructions.
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Demo Wallet</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    0x742d...0bEb
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Connected (Demo)</Badge>
            </div>
          </Card>

          <Tabs defaultValue="leaderboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="judge" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Judge Panel
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Panel
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard" className="mt-6">
              <Card>
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Trophy className="h-6 w-6 text-primary" />
                      Leaderboard
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      View real-time contest rankings
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="leaderboardContest">Select Contest</Label>
                    <Input
                      id="leaderboardContest"
                      type="number"
                      placeholder="1"
                      value={selectedContest}
                      onChange={(e) => setSelectedContest(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>

                  {selectedContestData && (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedContestData.name}</h3>
                      </div>
                      {selectedContestData.isLocked && (
                        <Badge variant="secondary">Contest Locked</Badge>
                      )}
                    </div>
                  )}

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
                        {contestants.map((entry, index) => (
                          <TableRow key={entry.address}>
                            <TableCell className="font-medium">
                              <span className="flex items-center gap-2">
                                {getMedalEmoji(index + 1)}
                                {index + 1}
                              </span>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {entry.totalScore}
                            </TableCell>
                            <TableCell className="text-right">{entry.judgeCount}</TableCell>
                            <TableCell className="text-right">{entry.avgScore.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="judge" className="mt-6">
              <Card>
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Award className="h-6 w-6 text-primary" />
                      Submit Score
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Judge panel for submitting contestant scores
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="judgeContestId">Contest ID</Label>
                    <Input
                      id="judgeContestId"
                      type="number"
                      placeholder="1"
                      value={selectedContest}
                      onChange={(e) => setSelectedContest(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contestantAddress">Contestant Address</Label>
                    <Input
                      id="contestantAddress"
                      placeholder="0x..."
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

                  <Button onClick={handleSubmitScore} className="w-full">
                    Submit Score
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <div className="p-6 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        Create Contest
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Create a new contest for scoring
                      </p>
                    </div>

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
                  </div>
                </Card>

                <Card>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">Add Judge</h3>
                      <p className="text-sm text-muted-foreground">
                        Add a judge to an existing contest
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="judgeContestId">Contest ID</Label>
                      <Input
                        id="judgeContestId"
                        type="number"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="judgeAddress">Judge Address</Label>
                      <Input
                        id="judgeAddress"
                        placeholder="0x..."
                      />
                    </div>

                    <Button variant="secondary" className="w-full">
                      Add Judge
                    </Button>
                  </div>
                </Card>

                <Card>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">Lock Contest</h3>
                      <p className="text-sm text-muted-foreground">
                        Lock a contest to prevent further scoring
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="lockContestId">Contest ID</Label>
                      <Input
                        id="lockContestId"
                        type="number"
                        placeholder="1"
                        value={selectedContest}
                        onChange={(e) => setSelectedContest(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleLockContest} variant="destructive" className="w-full">
                      Lock Contest
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
