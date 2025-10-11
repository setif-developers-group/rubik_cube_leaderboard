import { useState, useEffect, useCallback } from "react";
import { Play, Square, RotateCcw } from "lucide-react";
import { AdminValidationModal } from "@/components/AdminValidationModal";
import { QRCodeModal } from "@/components/QRCodeModal";

export const Timer = ({
  cubeType,
  participantId,
  participantName,
  onTimerComplete,
  onPhaseChange,
}) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);


  useEffect(() => {
    const handleKeyPress = (event) => {
      
      if (event.code === 'Space' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();

        if (!isRunning && !isFinished) {
        
          startTimer();
        } else if (isRunning) {
          
          stopTimer();
        } else if (isFinished) {
         
          resetTimer();
        }
      }
    };

   
    window.addEventListener('keydown', handleKeyPress);

    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isRunning, isFinished]);

  const formatTime = useCallback((milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  }, []);

  const startTimer = () => {
    setIsRunning(true);
    onPhaseChange("solving");
  };

  const stopTimer = () => {
    setIsRunning(false);
    setShowValidationModal(true);
  };

  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
    setIsFinished(false);
    setShowValidationModal(false);
    onPhaseChange("ready");
  };

  const handleValidation = (isValidated, adminEmail) => {
    if (isValidated) {
      setIsFinished(true);
      onTimerComplete(time, adminEmail);
      onPhaseChange("finished");
    } else {

      setTime(0);
      setIsRunning(false);
      setIsFinished(false);
      setShowValidationModal(false);
      onPhaseChange("start");
    }
  };

  const getCubeThemeClass = () => {
    switch (cubeType) {
      case "2x2":
        return "glow-2x2";
      case "3x3":
        return "glow-3x3";
      case "4x4":
        return "glow-4x4";
      default:
        return "glow-neon";
    }
  };

  const getCubeColorClass = () => {
    switch (cubeType) {
      case "2x2":
        return "text-blue-500";
      case "3x3":
        return "text-green-500";
      case "4x4":
        return "text-red-500";
      default:
        return "text-glow-primary";
    }
  };

  return (
    <div className="text-center space-y-8">
      {/* Participant Info */}
      <div className="animate-slide-up">
        <div
          onClick={() => setShowQRModal(true)}
          className={`inline-block px-6 border-2 border-gray-300 py-3 rounded-sm border ${getCubeThemeClass()} cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-lg`}
          style={{
            boxShadow: '0 0 10px currentColor / 0.3'
          }}
        >
          <div className="text-2xl font-arcade font-bold text-gray-100">
            #{participantId}
          </div>
          {participantName && (
            <div className="text-lg font-digital text-[hsl(220,13%,60%)]">
              {participantName}
            </div>
          )}
          <div className={`text-sm font-digital text-gray-600 ${getCubeColorClass()}`}>
            {cubeType.toUpperCase()} CUBE
          </div>
          <div className="text-xs text-gray-500 font-digital mt-1 text-center">
            Click to view QR Code
          </div>
        </div>
      </div>

      {/* Timer Display */}
      <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className={`relative inline-block ${getCubeThemeClass()}`}>
          <div
            className={`text-8xl md:text-9xl p-2 font-digital font-bold ${getCubeColorClass()} text-neon`}
          >
            {formatTime(time)}
          </div>
          {isRunning && (
            <div className="absolute inset-0 animate-pulse-glow pointer-events-none"></div>
          )}
        </div>
      </div>

      {/* Timer Controls */}
      <div
        className="flex justify-center gap-6 animate-slide-up"
        style={{ animationDelay: "0.4s" }}
      >
        {!isRunning && !isFinished && (
          <button
            onClick={startTimer}
            className={`text-gray-300 border-2 border-gray-300 ${getCubeThemeClass()} hover-glow ripple font-arcade text-xl px-8 py-4 transition-all duration-200 ${!isRunning && !isFinished ? 'animate-pulse-glow' : ''}`}
          >
            <div className="flex">
              <Play className="w-6 h-6 mr-2" />
              START
            </div>
          </button>
        )}

        {isRunning && (
          <button
            onClick={stopTimer}
            className="border-2 border-red-500 hover-glow ripple font-arcade text-xl px-8 py-4 text-gray-200 animate-pulse"
          >
            <Square className="w-6 h-6 mr-2" />
            STOP
          </button>
        )}

        {(isRunning || isFinished) && (
          <button
            onClick={resetTimer}
            className="border border-muted hover-glow ripple font-arcade text-gray-200 text-lg px-6 py-4"
          >
            <RotateCcw className="w-5 h-5 mr-2 text-gray-200" />
            RESET
          </button>
        )}
      </div>

      {/* Instructions */}
      {!isRunning && !isFinished && (
        <div className="animate-slide-up text-[hsl(220,13%,60%)] font-digital space-y-2">
          <p>
            Get ready with your {cubeType} cube and click START when you're
            ready to begin!
          </p>
          <p className="text-sm text-gray-400">
            💡 <span className="text-glow-primary font-bold">Press SPACEBAR</span> to start/stop the timer
          </p>
        </div>
      )}

     {isRunning && (
       <div className="animate-slide-up text-glow-secondary font-digital text-lg space-y-1">
         <p className="animate-pulse-glow text-gray-400">SOLVING IN PROGRESS...</p>
        
       </div>
     )}

     {isFinished && (
       <div className="animate-slide-up text-glow-success font-digital text-lg space-y-1">
         <p className="text-green-400">TIMER COMPLETE!</p>
       
       </div>
     )}

      <AdminValidationModal
        open={showValidationModal}
        onOpenChange={setShowValidationModal}
        onValidation={handleValidation}
        time={time}
        participantName={participantName}
        participantId={participantId}
        cubeType={cubeType}
      />

      <QRCodeModal
        open={showQRModal}
        onOpenChange={setShowQRModal}
        participantId={participantId}
        participantName={participantName}
      />
    </div>
  );
};
