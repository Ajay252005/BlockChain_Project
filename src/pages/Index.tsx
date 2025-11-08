import { WalletConnect } from '@/components/WalletConnect';
import { AdminPanel } from '@/components/AdminPanel';
import { JudgePanel } from '@/components/JudgePanel';
import { Leaderboard } from '@/components/Leaderboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Award, Trophy } from 'lucide-react';
import { useAccount } from 'wagmi';

const Index = () => {
  const { isConnected } = useAccount();

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
          <WalletConnect />

          {isConnected && (
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
                <Leaderboard />
              </TabsContent>

              <TabsContent value="judge" className="mt-6">
                <JudgePanel />
              </TabsContent>

              <TabsContent value="admin" className="mt-6">
                <AdminPanel />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
