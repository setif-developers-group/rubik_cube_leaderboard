import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode, Copy, Check } from "lucide-react";
import { useState } from "react";

export const QRCodeModal = ({
  open,
  onOpenChange,
  participantId,
  participantName
}) => {
  const [copied, setCopied] = useState(false);

  // Generate QR code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`ID: ${participantId} - ${participantName}`)}`;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(participantId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy ID:', err);
    }
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
            PARTICIPANT QR CODE
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 flex-1 flex flex-col items-center justify-center">
          {/* Participant Info */}
          <div className="text-center space-y-2">
            <div className="text-gray-200 font-digital text-lg">
              {participantName}
            </div>
            <div className="text-2xl font-arcade font-bold text-[hsl(210,100%,60%)] text-neon">
              #{participantId}
            </div>
          </div>


          <div className="bg-white p-4 rounded-lg">
            <img
              src={qrCodeUrl}
              alt={`QR Code for ${participantName}`}
              className="w-48 h-48 mx-auto"
            />
          </div>


          <div className="flex items-center gap-2 bg-black/30 p-3 rounded-lg border border-gray-600">
            <span className="font-digital text-gray-300">ID:</span>
            <span className="font-arcade text-lg text-[hsl(210,100%,60%)] font-bold">
              {participantId}
            </span>
            <button
              onClick={handleCopyId}
              className="ml-auto p-2 hover:bg-gray-600 rounded transition-colors"
              title="Copy ID"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center text-gray-400 font-digital text-sm">
            <p>Scan this QR code or use the ID above</p>
            <p>to identify this participant</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};