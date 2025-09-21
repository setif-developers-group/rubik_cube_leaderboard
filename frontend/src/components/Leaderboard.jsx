import { Trophy, Medal, Award, Clock, User, Box } from "lucide-react";

export const Leaderboard = ({ data, selectedCubeType = 'all', onCubeTypeChange }) => {
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (position) => {
    switch (position) {
      case 1: return <Trophy className="w-6 h-6 text-[hsl(60,94%,28%)]" />;
      case 2: return <Medal className="w-6 h-6 text-[hsl(220,33%,71%)]" />;
      case 3: return <Award className="w-6 h-6 text-[hsl(35,85%,35%)]" />;
      default: return <div className="w-6 h-6 flex items-center justify-center text-[hsl(220,13%,60%)] text-sm font-bold">#{position}</div>;
    }
  };

  const getCubeColorClass = (cubeType) => {
    switch (cubeType) {
      case '2x2': return 'text-blue-500';
      case '3x3': return 'text-green-500';
      case '4x4': return 'text-red-500';
      default: return 'text-gray-300';
    }
  };

  const getCubeGlowClass = (cubeType) => {
    switch (cubeType) {
      case '2x2': return 'glow-2x2';
      case '3x3': return 'glow-3x3';
      case '4x4': return 'glow-4x4';
      default: return 'glow-neon';
    }
  };

  // Group data by cube type for better visualization
  const groupedData = data.reduce((acc, participant) => {
    if (!acc[participant.cubeType]) {
      acc[participant.cubeType] = [];
    }
    acc[participant.cubeType].push(participant);
    return acc;
  }, {});

  // Filter data based on selected cube type
  const filteredData = selectedCubeType === 'all'
    ? data
    : data.filter(participant => participant.cubeType === selectedCubeType);

  const allTimeTop20 = [...filteredData]
    .sort((a, b) => a.time - b.time)
    .slice(0, 20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-arcade  text-white font-bold text-glow-primary text-neon mb-6">
          LEADERBOARD
        </h2>
        <div className="flex items-center justify-center gap-2 text-[hsl(220,13%,60%)] font-digital mb-4">
          <Trophy className="w-5 h-5" />
          <span>
            {selectedCubeType === 'all'
              ? `${data.length} Total Attempts`
              : `${filteredData.length} ${selectedCubeType.toUpperCase()} Attempts`
            }
          </span>
        </div>
        {selectedCubeType !== 'all' && (
          <div className="text-center mb-4">
            <span className={`inline-block px-4 py-2 rounded-full font-arcade text-sm ${getCubeColorClass(selectedCubeType)} bg-black/50 border border-current/30`}>
              🏆 TOP 20 {selectedCubeType.toUpperCase()} 🏆
            </span>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button
            onClick={() => onCubeTypeChange('all')}
            className={`font-arcade text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedCubeType === 'all'
                ? 'bg-[hsl(210,100%,60%)] text-black shadow-[0_0_15px_hsl(210,100%,60%)]'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🏆 All Categories
          </button>
          <button
            onClick={() => onCubeTypeChange('2x2')}
            className={`font-arcade text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedCubeType === '2x2'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgb(37,99,235)]'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🔵 2x2
          </button>
          <button
            onClick={() => onCubeTypeChange('3x3')}
            className={`font-arcade text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedCubeType === '3x3'
                ? 'bg-green-600 text-white shadow-[0_0_15px_rgb(34,197,94)]'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🟢 3x3
          </button>
          <button
            onClick={() => onCubeTypeChange('4x4')}
            className={`font-arcade text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedCubeType === '4x4'
                ? 'bg-red-600 text-white shadow-[0_0_15px_rgb(239,68,68)]'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🔴 4x4
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <Box className="w-16 h-16 text-[hsl(220,13%,60%)] mx-auto mb-4 opacity-50" />
          <p className="text-[hsl(220,13%,60%)] font-digital text-lg">
            No records yet. Be the first to compete!
          </p>
        </div>
      ) : (
        <>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 glow-neon">
            <h3 className="text-2xl text-gray-300 font-arcade  mb-6 text-center">
              🏆  {selectedCubeType === 'all' ? 'Top 10 Overall' : `Top 20 ${selectedCubeType.toUpperCase()}`}
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-hide">
              {allTimeTop20.map((participant, index) => {
                const position = index + 1;
                const isTopThree = position <= 3;
                
                return (
                  <div
                    key={`${participant.id}-${participant.timestamp}`}
                    className={`
                      flex items-center text-xl text-gray-300 gap-4 p-4 rounded-lg border border-gray-400 transition-all duration-300
                      ${isTopThree
                        ? 'bg-black'
                        : 'border-muted bg-background/30'
                      }
                      ${position === 1 ? 'animate-pulse-glow' : ''}
                      animate-slide-in
                    `}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {getRankIcon(position)}
                    </div>

                    {/* Participant Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-[hsl(220,13%,60%)]" />
                        <span className="font-digital text-xl font-bold text-foreground truncate">
                          {participant.name}
                        </span>
                        <span className="text-sm text-[hsl(220,13%,60%)] font-digital">
                          #{participant.id}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Box className={`w-4 h-4 ${getCubeColorClass(participant.cubeType)}`} />
                          <span className={`font-digital ${getCubeColorClass(participant.cubeType)}`}>
                            {participant.cubeType.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-[hsl(220,13%,60%)]">
                          <Clock className="w-4 h-4" />
                          <span className="font-digital text-xs">
                            {new Date(participant.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex-shrink-0">
                      <div className={`
                        text-2xl font-digital font-bold
                        ${isTopThree ? getCubeColorClass(participant.cubeType) + ' text-neon' : 'text-foreground'}
                      `}>
                        {formatTime(participant.time)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Records by Cube Type */}
          {Object.entries(groupedData).map(([cubeType, participants]) => {
            const bestTime = Math.min(...participants.map(p => p.time));
            const bestParticipant = participants.find(p => p.time === bestTime);
            
            return (
              <div key={cubeType} className="bg-gradient-card border border-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`text-xl font-arcade ${getCubeColorClass(cubeType)}`}>
                    {cubeType.toUpperCase()} RECORDS
                  </h4>
                  <span className="text-sm text-[hsl(220,13%,60%)] font-digital">
                    {participants.length} attempts
                  </span>
                </div>
                
                {bestParticipant && (
                  <div className={`p-3 rounded border ${getCubeGlowClass(cubeType)} border-current/50`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-digital font-bold text-foreground">
                          {bestParticipant.name}
                        </div>
                        <div className="text-sm text-[hsl(220,13%,60%)] font-digital">
                          #{bestParticipant.id}
                        </div>
                      </div>
                      <div className={`text-xl font-digital font-bold ${getCubeColorClass(cubeType)}`}>
                        {formatTime(bestTime)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
