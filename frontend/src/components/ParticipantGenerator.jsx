import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ParticipantDetailsModal } from "@/components/ParticipantDetailsModal";
import { User } from "lucide-react";

export const ParticipantGenerator = ({
  onParticipantGenerated
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="text-center space-y-6 relative overflow-hidden">
     
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-pulse-glow absolute top-10 left-1/4 w-3 h-3 rounded-full bg-glow-primary blur-md"></div>
        <div className="animate-pulse-glow absolute bottom-12 right-1/3 w-4 h-4 rounded-full bg-glow-secondary blur-lg"></div>
        <div className="animate-pulse-glow absolute top-1/3 right-10 w-2 h-2 rounded-full bg-neon-red blur-md"></div>
      </div>

      <div className="animate-slide-up">
        <div className="mb-8">
          <h3 className="text-2xl mt-2 font-arcade text-gray-200 mb-4">
            Ready to Compete?
          </h3>
          <p className="text-gray-400 font-digital text-lg">
            Click below to enter your details and generate your unique participant ID
          </p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="border-spin hover-glow ripple text-xl px-12 py-6 relative mb-4"
          style={{
            background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
            boxShadow: '0 0 10px hsl(210, 100%, 60% / 0.5), 0 0 20px hsl(210, 100%, 60% / 0.3), 0 0 40px hsl(210, 100%, 60% / 0.1)',
            fontFamily: 'Orbitron, monospace',
            animation:'glow-rainbow 3s ease-in-out infinite', 
          }}
        >
          <User className="w-6 h-6 mr-3 text-gray-200" />
         <p className="text-gray-300">JOIN COMPETITION</p> 
        </Button>
      </div>

      <ParticipantDetailsModal
        open={showModal}
        onOpenChange={setShowModal}
        onSubmit={onParticipantGenerated}
      />
    </div>
  );
};


