import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Check, X, User } from "lucide-react";

export const AdminValidationModal = ({
  open,
  onOpenChange,
  onValidation,
  time,
  participantName,
  participantId,
  cubeType
}) => {
  const [adminEmail, setAdminEmail] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
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

  const handleValidate = async () => {
    if (!adminEmail.trim()) {
      alert("Please enter admin email");
      return;
    }

    setIsValidating(true);

    // Simulate validation process
    setTimeout(() => {
      onValidation(true, adminEmail);
      setIsValidating(false);
      onOpenChange(false);
      setAdminEmail("");
    }, 1000);
  };

  const handleCancel = () => {
    onValidation(false, null);
    onOpenChange(false);
    setAdminEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md grid-lines max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
          border: '2px solid hsl(210, 100%, 60%)',
          boxShadow: '0 0 15px hsl(210, 100%, 60% / 0.5), 0 0 30px hsl(210, 100%, 60% / 0.3), 0 0 60px hsl(210, 100%, 60% / 0.1)'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-center font-arcade text-2xl text-white mb-4">
           <p className='text-gray-200'>VALIDATOR</p>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 flex-1 flex flex-col">
          {/* Participant Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <User className="w-5 h-5 text-[hsl(210,100%,60%)]" />
              <span className="text-gray-200 font-digital text-lg">
                {participantName}
              </span>
              <span className="text-gray-400 font-digital">
                #{participantId}
              </span>
            </div>
            <div className={`font-digital text-sm ${getCubeColorClass()}`}>
              {cubeType.toUpperCase()} CUBE
            </div>
          </div>

          {/* Time Display */}
          <div className="text-center">
            <div className="text-sm text-gray-400 font-digital mb-2">Time Achieved</div>
            <div className={`text-3xl font-digital font-bold ${getCubeColorClass()} text-neon`}>
              {formatTime(time)}
            </div>
          </div>

          
          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-gray-200 font-digital block text-center">
              Admin Email (Required for Validation)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[hsl(210,100%,60%)]" />
              <Input
                id="admin-email"
                type="email"
                placeholder="Enter admin email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="pl-12 bg-background-card border-glow-primary text-gray-200 placeholder-gray-400 font-digital text-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
                  border: '1px solid hsl(210, 100%, 60%)',
                  boxShadow: '0 0 10px hsl(210, 100%, 60% / 0.3)'
                }}
              />
            </div>
          </div>


          <div className="flex gap-3 flex-shrink-0">
            <Button
              onClick={handleCancel}
              disabled={isValidating}
              variant="destructive"
              className="flex-1 font-arcade text-lg py-6"
              style={{
                background: 'linear-gradient(135deg, hsl(0, 50%, 10%), hsl(0, 50%, 8%))',
                border: '1px solid hsl(0, 100%, 50%)',
                boxShadow: '0 0 10px hsl(0, 100%, 50% / 0.3)'
              }}
            >
              <X className="w-5 h-5 mr-2" />
             <p className="text-gray-200">CANCEL</p> 
            </Button>

            <Button
              onClick={handleValidate}
              disabled={isValidating}
              className="flex-1 bg-gradient-card border-2 border-glow-primary glow-neon hover-glow ripple font-arcade text-lg py-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
                border: '2px solid hsl(210, 100%, 60%)',
                boxShadow: '0 0 15px hsl(210, 100%, 60% / 0.5), 0 0 30px hsl(210, 100%, 60% / 0.3), 0 0 60px hsl(210, 100%, 60% / 0.1)',
                fontFamily: 'Orbitron, monospace'
              }}
            >
              {isValidating ? (
                <>
                  <div className="w-5 h-5 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full"></div>
                  <p className="text-gray-200" >VALIDATING...</p>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2 text-gray-200" />
                 <p className="text-gray-200"> VALIDATE</p> 
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};