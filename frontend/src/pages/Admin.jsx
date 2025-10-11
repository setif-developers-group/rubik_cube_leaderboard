import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, QrCode, Trash2, Check, X, Shield } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const generateQRCode = async () => {
    if (!adminEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsGenerating(true);

    try {
      // Generate unique admin session ID
      const sessionId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const qrData = {
        type: 'admin_session',
        email: adminEmail,
        sessionId: sessionId,
        timestamp: Date.now()
      };

      // Send email with QR code
      const response = await fetch('/api/admin/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminEmail,
          qrData: qrData
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setQrCodeData(qrData);
        setQrCodeImage(result.qrCodeImage); // Utiliser l'image du backend
        toast.success("QR code generated successfully!");
      } else {
        toast.error("Failed to generate QR code. Please try again.");
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error("Error generating QR code");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearAllRecords = async () => {
    try {
      // Require admin email for clearing records
      if (!adminEmail.trim()) {
        toast.error("Please enter your admin email first");
        setShowClearDialog(false);
        return;
      }

      const response = await fetch('/api/admin/clear-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail: adminEmail
        }),
      });

      if (response.ok) {
        toast.success("All records cleared successfully!");
        setShowClearDialog(false);
        // Clear local storage
        localStorage.removeItem("rubiks-leaderboard");
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to clear records. Please try again.");
      }
    } catch (error) {
      console.error('Error clearing records:', error);
      toast.error("Error clearing records");
    }
  };

  const resetAdmin = () => {
    setAdminEmail("");
    setQrCodeData(null);
    setQrCodeImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-bg particles-bg grid-lines">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center text-red mb-12 animate-slide-up">
          <h1 className="text-6xl md:text-8xl font-arcade font-bold text-white text-neon mb-4">
            ADMIN PANEL
          </h1>
          <h2 className="text-2xl md:text-4xl font-arcade text-white">
            VALIDATION & MANAGEMENT
          </h2>
        </header>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Admin Email Input */}
          <Card className="animate-slide-up" style={{
            background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
            border: '2px solid hsl(210, 100%, 60%)',
            boxShadow: '0 0 15px hsl(210, 100%, 60% / 0.5), 0 0 30px hsl(210, 100%, 60% / 0.3), 0 0 60px hsl(210, 100%, 60% / 0.1)'
          }}>
            <CardHeader>
              <CardTitle className="text-center font-arcade text-2xl text-white flex items-center justify-center gap-2">
                <Shield className="w-6 h-6 text-blue-400" />
                ADMIN ACCESS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="admin-email" className="text-gray-200 font-digital block text-center">
                  Enter Your Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[hsl(210,100%,60%)]" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
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

              <Button
                onClick={generateQRCode}
                disabled={isGenerating || !adminEmail.trim()}
                className="w-full bg-gradient-card border-2 border-glow-primary glow-neon hover-glow ripple font-arcade text-lg py-6"
                style={{
                  background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
                  border: '2px solid hsl(210, 100%, 60%)',
                  boxShadow: '0 0 15px hsl(210, 100%, 60% / 0.5), 0 0 30px hsl(210, 100%, 60% / 0.3), 0 0 60px hsl(210, 100%, 60% / 0.1)',
                  fontFamily: 'Orbitron, monospace'
                }}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full"></div>
                    GENERATING...
                  </>
                ) : (
                  <>
                    <QrCode className="w-6 h-6 mr-2 text-gray-100" />
                    <p className="text-gray-100">GENERATE QR CODE</p>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {qrCodeData && (
            <Card className="animate-slide-up" style={{
              background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
              border: '2px solid hsl(120, 100%, 50%)',
              boxShadow: '0 0 15px hsl(120, 100%, 50% / 0.5), 0 0 30px hsl(120, 100%, 50% / 0.3), 0 0 60px hsl(120, 100%, 50% / 0.1)'
            }}>
              <CardHeader>
                <CardTitle className="text-center font-arcade text-2xl text-green-500">
                  <p className="text-gray-200">QR CODE GENERATED</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div className="bg-white p-6 rounded-lg inline-block">
                  <img
                    src={qrCodeImage || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrCodeData))}`}
                    alt="Admin QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-gray-300 font-digital">
                    QR code sent to: <span className="text-green-500 font-bold">{adminEmail}</span>
                  </p>
                  <p className="text-gray-400 font-digital text-sm">
                    Use this QR code to validate participant times
                  </p>
                </div>

                <Button
                  onClick={resetAdmin}
                  variant="outline"
                  className="font-arcade"
                  style={{
                    border: '1px solid hsl(0, 100%, 50%)',
                    color: 'hsl(0, 100%, 50%)'
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  RESET
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="animate-slide-up" style={{
            background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
            border: '2px solid hsl(0, 100%, 60%)',
            boxShadow: '0 0 15px hsl(0, 100%, 60% / 0.5), 0 0 30px hsl(0, 100%, 60% / 0.3), 0 0 60px hsl(0, 100%, 60% / 0.1)'
          }}>
            <CardHeader>
              <CardTitle className="text-center font-arcade text-2xl text-gray-200 flex items-center justify-center gap-2">
                <Trash2 className="w-6 h-6 text-red-500" />
                ADMIN CONTROLS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 font-digital text-center">
                Manage competition records and data
              </p>
            

              <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full font-arcade text-lg py-6"
                    style={{
                      background: 'linear-gradient(135deg, hsl(0, 50%, 10%), hsl(0, 50%, 8%))',
                      border: '2px solid hsl(0, 100%, 50%)',
                      boxShadow: '0 0 15px hsl(0, 100%, 50% / 0.5), 0 0 30px hsl(0, 100%, 50% / 0.3), 0 0 60px hsl(0, 100%, 50% / 0.1)'
                    }}
                  >
                    <Trash2 className="w-5 h-5 mr-2 text-red-400" />
                    <p className="text-red-400">CLEAR ALL RECORDS</p>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md" style={{
                  background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
                  border: '2px solid hsl(0, 100%, 50%)',
                  boxShadow: '0 0 15px hsl(0, 100%, 50% / 0.5), 0 0 30px hsl(0, 100%, 50% / 0.3), 0 0 60px hsl(0, 100%, 50% / 0.1)'
                }}>
                  <DialogHeader>
                    <DialogTitle className="text-center font-arcade text-2xl text-red-400">
                      CONFIRM CLEAR RECORDS
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-300 font-digital text-center">
                      This will permanently delete all competition records. This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setShowClearDialog(false)}
                        variant="outline"
                        className="flex-1 font-arcade"
                        style={{
                          border: '1px solid hsl(210, 100%, 60%)',
                          color: 'hsl(210, 100%, 60%)'
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        CANCEL
                      </Button>
                      <Button
                        onClick={clearAllRecords}
                        variant="destructive"
                        className="flex-1 font-arcade"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        CONFIRM
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;