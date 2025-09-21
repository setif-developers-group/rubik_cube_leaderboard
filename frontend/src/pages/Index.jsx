import { useState, useEffect } from "react";
import { ParticipantGenerator } from "@/components/ParticipantGenerator";
import { Timer } from "@/components/Timer";
import { CubeSelector } from "@/components/CubeSelector";
import { Leaderboard } from "@/components/Leaderboard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, RotateCcw } from "lucide-react";

const Index = () => {
  const [participantId, setParticipantId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [selectedCube, setSelectedCube] = useState("3x3");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("start");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isTyped, setIsTyped] = useState(false);
  const [selectedLeaderboardFilter, setSelectedLeaderboardFilter] = useState('all');
  // valeurs possibles: "start" | "ready" | "solving" | "finished"

  
  useEffect(() => {
    const stored = localStorage.getItem("rubiks-leaderboard");
    if (stored) {
      setLeaderboardData(JSON.parse(stored));
    }
  }, []);

 
  useEffect(() => {
    if (leaderboardData.length > 0) {
      localStorage.setItem("rubiks-leaderboard", JSON.stringify(leaderboardData));
    }
  }, [leaderboardData]);

  const handleParticipantGenerated = (id, name, email) => {
    setParticipantId(id);
    setParticipantName(name);
    setCurrentPhase("ready");
    setShowNameInput(false);
  };

  const handleTimerComplete = (time) => {
    const newEntry = {
      id: participantId,
      name: participantName || `Anonymous ${participantId}`,
      cubeType: selectedCube,
      time,
      timestamp: Date.now(),
    };

    setLeaderboardData((prev) =>
      [...prev, newEntry].sort((a, b) => a.time - b.time)
    );
    setCurrentPhase("finished");
    setShowLeaderboard(true);
  };

  const resetCompetition = () => {
    setParticipantId("");
    setParticipantName("");
    setCurrentPhase("start");
  };

  const clearLeaderboard = () => {
    setLeaderboardData([]);
    localStorage.removeItem("rubiks-leaderboard");
  };

  return (
    <div className="min-h-screen bg-gradient-bg particles-bg grid-lines">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center text-red mb-12 animate-slide-up">
          <h1 className="text-6xl md:text-8xl font-arcade font-bold text-white text-neon mb-4">
            RUBIK&apos;S CUBE
          </h1>
          <h2
            className={`text-2xl md:text-4xl font-arcade text-white ${isTyped ? '' : 'typing-effect'}`}
            onAnimationEnd={() => setIsTyped(true)}
          >
            SPEED COMPETITION
          </h2>
          <div className="mt-6 flex justify-center gap-4">
            <div className="w-4 h-4 rounded-full animate-pulse-glow bg-[hsl(0,100%,60%)] shadow-[0_0_10px_hsl(0,100%,60%)]"></div>
            <div
              className="w-4 h-4 rounded-full animate-pulse-glow bg-[hsl(120,100%,50%)] shadow-[0_0_10px_hsl(120,100%,50%)]"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="w-4 h-4 rounded-full animate-pulse-glow bg-[hsl(210,100%,60%)] shadow-[0_0_10px_hsl(210,100%,60%)]"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid gap-8">
         
          <div className="space-y-8">
            {/* Cube Selector */}
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <CubeSelector
                selectedCube={selectedCube}
                onCubeSelect={setSelectedCube}
                disabled={currentPhase !== "start"}
              />
            </div>

            {/* Participant Generator or Timer */}
            <div className="flex flex-col items-center space-y-8">
              {currentPhase === "start" && (
                <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
                  <ParticipantGenerator
                    onParticipantGenerated={handleParticipantGenerated}
                  />
                </div>
              )}

              {(currentPhase === "ready" || currentPhase === "solving") &&
                participantId && (
                  <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
                    <Timer
                      cubeType={selectedCube}
                      participantId={participantId}
                      participantName={participantName}
                      onTimerComplete={handleTimerComplete}
                      onPhaseChange={setCurrentPhase}
                    />
                  </div>
                )}

              {currentPhase === "finished" && (
                <div className="text-center animate-slide-up">
                  <div className="mb-6">
                    <Trophy className="w-16 h-16 text-amber-200 mx-auto mb-4 animate-pulse-glow" />
                    <h3 className="text-3xl font-arcade text-white text-neon">
                      TIME RECORDED!
                    </h3>
                  </div>
                  <Button
                    onClick={resetCompetition}
                    className="hover-glow ripple font-arcade text-lg px-8 py-3"
                    style={{
                      background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
                      border: '1px solid hsl(210, 100%, 60%)',
                      boxShadow: '0 0 10px hsl(210, 100%, 60% / 0.5), 0 0 20px hsl(210, 100%, 60% / 0.3), 0 0 40px hsl(210, 100%, 60% / 0.1)',
                      fontFamily: 'Orbitron, monospace'
                    }}
                  >
                    <RotateCcw className="w-5 h-5 mr-2 text-gray-400" />
                   <p className="text-gray-400">NEW ATTEMPT</p> 
                  </Button>
                </div>
              )}
            </div>


            {/* Control Buttons */}
            <div className="text-center animate-slide-up flex gap-4 justify-center">
              {leaderboardData.length > 0 && (
                <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
                  <DialogTrigger asChild>
                    <Button
                      className="hover-glow ripple font-arcade"
                      style={{
                        background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
                        border: '1px solid hsl(210, 100%, 60%)',
                        boxShadow: '0 0 10px hsl(210, 100%, 60% / 0.5), 0 0 20px hsl(210, 100%, 60% / 0.3), 0 0 40px hsl(210, 100%, 60% / 0.1)',
                        fontFamily: 'Orbitron, monospace'
                      }}
                    >
                      <Trophy className="w-5 h-5 mr-2 text-blue-400" />
                     <p className="text-blue-400"> View Leaderboard</p> 
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="max-w-4xl grid-lines max-h-[80vh] overflow-hidden flex flex-col"
                    style={{
                      background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
                      border: '1px solid hsl(210, 100%, 60%)',
                      boxShadow: '0 0 10px hsl(210, 100%, 60% / 0.5), 0 0 20px hsl(210, 100%, 60% / 0.3), 0 0 40px hsl(210, 100%, 60% / 0.1)'
                    }}
                  >
                    <DialogHeader className="flex-shrink-0">
                      <DialogTitle className="text-center font-arcade text-3xl text-neon-white text-neon mb-4">
                      
                      </DialogTitle>
                    </DialogHeader>
                    <div className="particles-bg p-4 rounded-lg overflow-y-auto flex-1 min-h-0 scrollbar-hide">
                      <Leaderboard
                        data={leaderboardData}
                        selectedCubeType={selectedLeaderboardFilter}
                        onCubeTypeChange={setSelectedLeaderboardFilter}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {leaderboardData.length > 0 && (
                <Button
                  onClick={clearLeaderboard}
                  variant="destructive"
                  className="font-arcade text-gray-400 hover-glow ripple"
                >
                  Clear All Records
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
