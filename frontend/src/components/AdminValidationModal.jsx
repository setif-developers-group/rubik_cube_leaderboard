import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, User, QrCode, Loader2 } from "lucide-react";
import { QRScanner } from "@/components/QRScanner";
import { toast } from "sonner";

export const AdminValidationModal = ({
  open,
  onOpenChange,
  onValidation,
  time,
  participantName,
  participantId,
  cubeType
}) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [adminData, setAdminData] = useState(null);

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

  const handleQRScanSuccess = async (qrData) => {
    setIsValidating(true);

    try {
      // Send QR data to backend for validation
      const response = await fetch('/api/admin/validate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrData,
          participantId,
          participantName,
          time,
          scramble: "Generated scramble" // Vous pouvez ajouter un vrai scramble si disponible
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setAdminData(result);
        toast.success("QR code validated successfully!");
        onValidation(true, result.adminEmail);
        onOpenChange(false);
      } else {
        toast.error(result.message || "QR code validation failed");
        onValidation(false, null);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error validating QR code:', error);
      toast.error("Error validating QR code");
      onValidation(false, null);
      onOpenChange(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleQRScanError = (error) => {
    console.error('QR scan error:', error);
    toast.error("Error scanning QR code");
  };

  const handleCancel = () => {
    onValidation(false, null);
    onOpenChange(false);
    setAdminData(null);
  };

  const handleScanQR = () => {
    setShowQRScanner(true);
  };

  return (
    <>
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
             <p className='text-gray-200'>QR VALIDATION</p>
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

            {/* Admin Info */}
            {adminData && (
              <div className="text-center space-y-2 bg-green-900/20 border border-green-500/50 rounded-lg p-3">
                <div className="text-green-400 font-digital text-sm">Validated by</div>
                <div className="text-gray-200 font-digital">{adminData.adminEmail}</div>
                <div className="text-gray-400 font-digital text-xs">Session: {adminData.sessionId}</div>
              </div>
            )}

            {/* Instructions */}
            <div className="text-center space-y-2">
              <p className="text-gray-300 font-digital">
                Scan the admin QR code to validate this time
              </p>
              <p className="text-gray-400 font-digital text-sm">
                The QR code should have been sent to the admin's email
              </p>
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
                onClick={handleScanQR}
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
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <p className="text-gray-200" >VALIDATING...</p>
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5 mr-2 text-gray-200" />
                   <p className="text-gray-200"> SCAN QR</p>
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <QRScanner
        open={showQRScanner}
        onOpenChange={setShowQRScanner}
        onScanSuccess={handleQRScanSuccess}
        onScanError={handleQRScanError}
        title="SCAN ADMIN QR CODE"
      />
    </>
  );
};