import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Mail, Sparkles } from "lucide-react";

export const ParticipantDetailsModal = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Please enter both name and email");
      return;
    }

    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      const id = Math.random().toString(36).substr(2, 9).toUpperCase();
      onSubmit(id, name, email);
      setIsGenerating(false);
      onOpenChange(false);
      setName("");
      setEmail("");
    }, 1000);
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
          <DialogTitle className="text-center font-arcade text-2xl text-white  mb-4">
             JOIN Now
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
          <div className="space-y-2">
            <label htmlFor="modal-name" className="text-gray-200 font-digital block text-center">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[hsl(210,100%,60%)]" />
              <Input
                id="modal-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-12 bg-background-card border-glow-primary text-gray-200 placeholder-gray-400 font-digital text-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
                  border: '1px solid hsl(210, 100%, 60%)',
                  boxShadow: '0 0 10px hsl(210, 100%, 60% / 0.3)'
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="modal-email" className="text-gray-200 font-digital block text-center">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[hsl(210,100%,60%)]" />
              <Input
                id="modal-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            type="submit"
            disabled={isGenerating}
            className="w-full bg-gradient-card border-2 border-glow-primary glow-neon hover-glow ripple font-arcade text-lg py-6 relative overflow-hidden flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
              border: '2px solid hsl(210, 100%, 60%)',
              boxShadow: '0 0 15px hsl(210, 100%, 60% / 0.5), 0 0 30px hsl(210, 100%, 60% / 0.3), 0 0 60px hsl(210, 100%, 60% / 0.1)',
              fontFamily: 'Orbitron, monospace'
            }}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                GENERATING ID...
              </>
            ) : (
             
               <p className="text-gray-300">GENERATE ID</p>
            
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
