import React from "react";

const cubeTypes = [
  { type: "2x2", label: "2x2", description: "Pocket Cube" },
  { type: "3x3", label: "3x3", description: "Classic Rubik's" },
  { type: "4x4", label: "4x4", description: "Revenge Cube" },
];

export const CubeSelector = ({ selectedCube, onCubeSelect, disabled = false }) => {
  const getCubeThemeClass = (cubeType) => {
    switch (cubeType) {
      case "2x2":
        return "glow-2x2 border-cube-2x2";
      case "3x3":
        return "glow-3x3 border-cube-3x3";
      case "4x4":
        return "glow-4x4 border-cube-4x4";
      default:
        return "glow-neon border-glow-primary";
    }
  };

  const getCubeColorClass = (cubeType) => {
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
    <div className="text-center space-y-6">
      <div>
        
        <h5 className="text-[hsl(220,13%,60%)] font-digital text-[1.2rem]">
          Choose your challenge level
        </h5>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {cubeTypes.map(({ type, label, description }) => {
          const isSelected = selectedCube === type;

          return (
            <button
              key={type}
              onClick={() => onCubeSelect(type)}
              disabled={disabled}
              className={`
                relative group
                bg-gradient-card border-2 rounded-sm p-6 
                font-arcade text-xl
                hover-glow ripple
                transition-all duration-300
                ${isSelected 
                  ? `${getCubeThemeClass(type)} scale-110` 
                  : "text-gray-400 hover:border-glow-primary/50"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`
                    text-4xl font-bold
                    ${isSelected ? getCubeColorClass(type) + " text-neon" : "text-foreground"}
                  `}
                >
                  {label}
                </div>
                <div
                  className={`
                    text-sm font-digital
                    ${isSelected ? "text-white" : "text-[hsl(220,13%,60%)]"}
                  `}
                >
                  {description}
                </div>
              </div>

              
              {isSelected && (
                <div className="absolute inset-0 rounded-xl animate-pulse-glow pointer-events-none"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
