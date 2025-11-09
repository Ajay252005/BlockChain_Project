import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Award, Trophy, Wallet, Trash2, Copy, Check, Lock, Unlock } from 'lucide-react';
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
    { id: 1, name: 'Summer Talent Show 2025', isLocked: false }
  ]);
  const [contestants, setContestants] = useState([
    { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', totalScore: 0, judgeCount: 0, avgScore: 0, contestId: 1 },
    { address: '0x5c4832B36a5b7D7c23e3c3b9c4e5c6d7e8f9a0b', totalScore: 0, judgeCount: 0, avgScore: 0, contestId: 1 },
    { address: '0x8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', totalScore: 0, judgeCount: 0, avgScore: 0, contestId: 1 },
  ]);

  const [contestName, setContestName] = useState('');
  const [selectedContest, setSelectedContest] = useState('1');
  const [score, setScore] = useState('');
  const [contestantAddress, setContestantAddress] = useState('');
  const [removeContestId, setRemoveContestId] = useState('');
  const [removeContestantAddress, setRemoveContestantAddress] = useState('');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

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
    if (!score || !contestantAddress) {
      toast.error('Please enter both contestant address and score');
      return;
    }
    const scoreNum = parseInt(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      toast.error('Score must be between 0 and 100');
      return;
    }

    const currentContestId = parseInt(selectedContest);
    
    // Check if contest is locked
    const currentContest = contests.find(c => c.id === currentContestId);
    if (currentContest && currentContest.isLocked) {
      toast.error('This contest is locked. No more scores can be submitted.');
      return;
    }

    // Find the contestant
    const contestantIndex = contestants.findIndex(
      c => c.address.toLowerCase() === contestantAddress.toLowerCase()
    );
    
    if (contestantIndex === -1) {
      // Add new contestant if not found
      const newContestant = {
        address: contestantAddress,
        totalScore: scoreNum,
        judgeCount: 1,
        avgScore: scoreNum,
        contestId: currentContestId,
      };
      setContestants([...contestants, newContestant]);
      toast.success(`Score ${scoreNum} submitted for new contestant!`);
    } else {
      // Update existing contestant
      const updatedContestants = [...contestants];
      const contestant = updatedContestants[contestantIndex];
      const newTotalScore = contestant.totalScore + scoreNum;
      const newJudgeCount = contestant.judgeCount + 1;
      const newAvgScore = newTotalScore / newJudgeCount;

      updatedContestants[contestantIndex] = {
        ...contestant,
        totalScore: newTotalScore,
        judgeCount: newJudgeCount,
        avgScore: newAvgScore,
        contestId: currentContestId, // Update contest ID if changed
      };
      setContestants(updatedContestants);
      toast.success(`Score ${scoreNum} submitted! Total: ${newTotalScore}, Avg: ${newAvgScore.toFixed(2)}`);
    }

    setScore('');
    setContestantAddress('');
  };

  const handleLockContest = () => {
    const id = parseInt(selectedContest);
    if (!id || id < 1) {
      toast.error('Please enter a valid contest ID (must be 1 or greater)');
      return;
    }
    setContests(contests.map(c => c.id === id ? { ...c, isLocked: true } : c));
    toast.success('Contest locked successfully!');
  };

  const handleUnlockContest = () => {
    const id = parseInt(selectedContest);
    if (!id || id < 1) {
      toast.error('Please enter a valid contest ID (must be 1 or greater)');
      return;
    }
    const contest = contests.find(c => c.id === id);
    if (!contest) {
      toast.error('Contest not found');
      return;
    }
    if (!contest.isLocked) {
      toast.error('This contest is already unlocked');
      return;
    }
    setContests(contests.map(c => c.id === id ? { ...c, isLocked: false } : c));
    toast.success('Contest unlocked successfully!');
  };

  const handleRemoveContest = () => {
    const id = parseInt(removeContestId);
    if (!id || id < 1) {
      toast.error('Please enter a valid contest ID (must be 1 or greater)');
      return;
    }
    const contest = contests.find(c => c.id === id);
    if (!contest) {
      toast.error('Contest not found');
      return;
    }
    if (contests.length === 1) {
      toast.error('Cannot remove the last contest');
      return;
    }
    setContests(contests.filter(c => c.id !== id));
    toast.success(`Contest "${contest.name}" removed successfully!`);
    setRemoveContestId('');
    // Reset selected contest if it was removed
    if (parseInt(selectedContest) === id) {
      const remainingContests = contests.filter(c => c.id !== id);
      if (remainingContests.length > 0) {
        setSelectedContest(remainingContests[0].id.toString());
      }
    }
  };

  const handleRemoveContestant = () => {
    if (!removeContestantAddress.trim()) {
      toast.error('Please enter a contestant address');
      return;
    }
    const contestant = contestants.find(c => c.address.toLowerCase() === removeContestantAddress.toLowerCase());
    if (!contestant) {
      toast.error('Contestant not found');
      return;
    }
    setContestants(contestants.filter(c => c.address.toLowerCase() !== removeContestantAddress.toLowerCase()));
    toast.success('Contestant removed successfully!');
    setRemoveContestantAddress('');
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  const selectedContestData = contests.find(c => c.id === parseInt(selectedContest));
  const removeContestData = contests.find(c => c.id === parseInt(removeContestId));

  const handleAdminLogin = () => {
    // Simple password authentication - in production, this would be more secure
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      setAdminPassword('');
      toast.success('Admin access granted!');
    } else {
      toast.error('Invalid admin password');
      setAdminPassword('');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    toast.success('Admin session ended');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary">
            BLOCKCHAIN CONTEST SCORING SYSTEM
          </h1>
          <p className="text-muted-foreground mt-1">
            Decentralized, transparent and tamper-proof contest scoring
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {demoMode && (
            <Card className="p-4 border-accent bg-white/70 backdrop-blur-sm shadow-lg">
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
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
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
                      min="1"
                      placeholder="1"
                      value={selectedContest}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || parseInt(val) >= 1) {
                          setSelectedContest(val);
                        }
                      }}
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
                          <TableHead className="w-20">Address</TableHead>
                          <TableHead className="text-right">Total Score</TableHead>
                          <TableHead className="text-right">Judges</TableHead>
                          <TableHead className="text-right">Avg Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...contestants]
                          .sort((a, b) => b.totalScore - a.totalScore)
                          .map((entry, index) => (
                            <TableRow key={entry.address}>
                              <TableCell className="font-medium">
                                <span className="flex items-center gap-2">
                                  {getMedalEmoji(index + 1)}
                                  {index + 1}
                                </span>
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">
                                    {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 hover:bg-muted"
                                    onClick={() => handleCopyAddress(entry.address)}
                                    title={`Copy full address: ${entry.address}`}
                                  >
                                    {copiedAddress === entry.address ? (
                                      <Check className="h-3.5 w-3.5 text-green-500" />
                                    ) : (
                                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                    )}
                                  </Button>
                                </div>
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
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
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
                      min="1"
                      placeholder="1"
                      value={selectedContest}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || parseInt(val) >= 1) {
                          setSelectedContest(val);
                        }
                      }}
                    />
                    {selectedContestData && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Contest: <span className="font-semibold">{selectedContestData.name}</span> (ID: {selectedContest})
                      </p>
                    )}
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

                  <div>
                    <Label htmlFor="score">Score (0-100)</Label>
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                    />
                  </div>

                  {selectedContestData && selectedContestData.isLocked && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-sm text-destructive font-medium">
                        ⚠ This contest is locked. No more scores can be submitted.
                      </p>
                    </div>
                  )}
                  <Button 
                    onClick={handleSubmitScore} 
                    className="w-full"
                    disabled={selectedContestData?.isLocked || false}
                  >
                    Submit Score
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="mt-6">
              {!isAdminAuthenticated ? (
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                  <div className="p-8 space-y-6">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="rounded-full bg-destructive/10 p-4">
                          <Lock className="h-12 w-12 text-destructive" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                          <Shield className="h-6 w-6 text-primary" />
                          Admin Panel Locked
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2">
                          Enter admin password to access the admin panel
                        </p>
                      </div>
                    </div>

                    <div className="max-w-md mx-auto space-y-4">
                      <div>
                        <Label htmlFor="adminPassword">Admin Password</Label>
                        <Input
                          id="adminPassword"
                          type="password"
                          placeholder="Enter admin password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAdminLogin();
                            }
                          }}
                        />
                      </div>

                      <Button onClick={handleAdminLogin} className="w-full">
                        Unlock Admin Panel
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        Demo password: <code className="bg-muted px-1 py-0.5 rounded">admin123</code>
                      </p>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card className="border-primary/20 bg-white/90 backdrop-blur-sm shadow-md">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Admin Mode Active</p>
                          <p className="text-xs text-muted-foreground">You have full access to admin functions</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleAdminLogout}>
                        <Lock className="h-4 w-4 mr-2" />
                        Lock Panel
                      </Button>
                    </div>
                  </Card>
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
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
                        placeholder="e.g., Summer Talent Show 2025"
                        value={contestName}
                        onChange={(e) => setContestName(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleCreateContest} className="w-full">
                      Create Contest
                    </Button>
                  </div>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
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
                        min="1"
                        placeholder="1"
                        value={selectedContest}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || parseInt(val) >= 1) {
                            setSelectedContest(val);
                          }
                        }}
                      />
                      {selectedContestData && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Contest: <span className="font-semibold">{selectedContestData.name}</span> (ID: {selectedContest})
                        </p>
                      )}
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

                <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
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
                        min="1"
                        placeholder="1"
                        value={selectedContest}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || parseInt(val) >= 1) {
                            setSelectedContest(val);
                          }
                        }}
                      />
                      {selectedContestData && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Contest: <span className="font-semibold">{selectedContestData.name}</span> (ID: {selectedContest})
                        </p>
                      )}
                    </div>

                    <Button onClick={handleLockContest} variant="destructive" className="w-full">
                      Lock Contest
                    </Button>
                  </div>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Unlock className="h-5 w-5 text-green-600" />
                        Unlock Contest
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Unlock a contest to allow scoring again
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="unlockContestId">Contest ID</Label>
                      <Input
                        id="unlockContestId"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={selectedContest}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || parseInt(val) >= 1) {
                            setSelectedContest(val);
                          }
                        }}
                      />
                      {selectedContestData && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Contest: <span className="font-semibold">{selectedContestData.name}</span> (ID: {selectedContest})
                          {selectedContestData.isLocked ? (
                            <span className="ml-2 text-destructive">🔒 Locked</span>
                          ) : (
                            <span className="ml-2 text-green-600">🔓 Unlocked</span>
                          )}
                        </p>
                      )}
                    </div>

                    <Button onClick={handleUnlockContest} variant="default" className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlock Contest
                    </Button>
                  </div>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Remove Contest
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Remove a contest from the system
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="removeContestId">Contest ID</Label>
                      <Input
                        id="removeContestId"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={removeContestId}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || parseInt(val) >= 1) {
                            setRemoveContestId(val);
                          }
                        }}
                      />
                      {removeContestId && removeContestData && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Contest: <span className="font-semibold">{removeContestData.name}</span> (ID: {removeContestId})
                        </p>
                      )}
                      {removeContestId && !removeContestData && (
                        <p className="text-sm text-destructive mt-1">
                          Contest with ID {removeContestId} not found
                        </p>
                      )}
                    </div>

                    <Button onClick={handleRemoveContest} variant="destructive" className="w-full">
                      Remove Contest
                    </Button>
                  </div>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Remove Contestant
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Remove a contestant from the system
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="removeContestantAddress">Contestant Address</Label>
                      <Input
                        id="removeContestantAddress"
                        placeholder="0x..."
                        value={removeContestantAddress}
                        onChange={(e) => setRemoveContestantAddress(e.target.value)}
                      />
                      {removeContestantAddress && (() => {
                        const foundContestant = contestants.find(c => c.address.toLowerCase() === removeContestantAddress.toLowerCase());
                        if (foundContestant) {
                          const contestInfo = contests.find(c => c.id === foundContestant.contestId);
                          return (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-green-600 font-medium">
                                ✓ Contestant found in system
                              </p>
                              {contestInfo && (
                                <p className="text-sm text-muted-foreground">
                                  Contest: <span className="font-semibold">{contestInfo.name}</span> (ID: {foundContestant.contestId})
                                </p>
                              )}
                            </div>
                          );
                        } else {
                          return (
                            <p className="text-xs text-destructive mt-1">
                              ⚠ Contestant not found in system
                            </p>
                          );
                        }
                      })()}
                    </div>

                    <Button onClick={handleRemoveContestant} variant="destructive" className="w-full">
                      Remove Contestant
                    </Button>
                  </div>
                </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
