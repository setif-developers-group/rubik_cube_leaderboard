import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, CameraOff, Check, X, AlertCircle, Play } from "lucide-react";
import { toast } from "sonner";

export const QRScanner = ({
  open,
  onOpenChange,
  onScanSuccess,
  onScanError,
  title = "SCAN QR CODE"
}) => {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState('unknown');

  useEffect(() => {
    
    checkCameraAvailability();

    return () => {
     
      if (scannerRef.current) {
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (open) {
      checkCameraAvailability();
      // Auto-start scanning if camera is available and permission is granted
      setTimeout(() => {
        if (hasCamera && cameraPermission === 'granted') {
          startScanning();
        }
      }, 500);
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [open, hasCamera, cameraPermission]);

  const checkCameraAvailability = async () => {
    try {
      // Check if camera is available
      const hasCam = await QrScanner.hasCamera();
      setHasCamera(hasCam);

      if (hasCam) {
        // Check  permission
        if (navigator.permissions) {
          try {
            const permissionStatus = await navigator.permissions.query({ name: 'camera' });
            setCameraPermission(permissionStatus.state);

           
            permissionStatus.addEventListener('change', () => {
              setCameraPermission(permissionStatus.state);
            });
          } catch (permError) {
            console.log('Permission API not available:', permError);
         
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
              });
              stream.getTracks().forEach(track => track.stop());
              setCameraPermission('granted');
            } catch (streamError) {
              console.log('Camera permission status:', streamError.name);
              setCameraPermission(streamError.name);
            }
          }
        } else {
         
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: 'environment' }
            });
            stream.getTracks().forEach(track => track.stop());
            setCameraPermission('granted');
          } catch (streamError) {
            console.log('Camera permission status:', streamError.name);
            setCameraPermission(streamError.name);
          }
        }
      } else {
        setCameraPermission('not-available');
      }
    } catch (error) {
      console.error('Error checking camera:', error);
      setHasCamera(false);
      setCameraPermission('error');
    }
  };

  const startScanning = async () => {
    if (!videoRef.current || !hasCamera || cameraPermission !== 'granted') {
      setError('Camera not available or permission not granted');
      return;
    }

    try {
      setError(null);
      setIsScanning(true);

   
      const videoElement = videoRef.current;
      videoElement.style.display = 'block';

      const scanner = new QrScanner(
        videoElement,
        (result) => {
          handleScanSuccess(result.data);
        },
        {
          onDecodeError: (err) => {
            
            console.debug('QR decode error:', err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true,
          preferredCamera: 'environment',
        }
      );

      scannerRef.current = scanner;

    
      await new Promise(resolve => setTimeout(resolve, 100));

      await scanner.start();
      console.log('QR Scanner started successfully');

    } catch (error) {
      console.error('Error starting scanner:', error);
      setError(`Failed to start camera: ${error.message}`);
      setIsScanning(false);

   
      if (scannerRef.current) {
        try {
          scannerRef.current.destroy();
        } catch (cleanupError) {
          console.error('Error cleaning up scanner:', cleanupError);
        }
        scannerRef.current = null;
      }
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanSuccess = (data) => {
    try {
      // Try to parse the QR code data as JSON
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch {
        // If not JSON, treat as plain text
        parsedData = { rawData: data };
      }

      // Validate QR code structure
      if (parsedData.type === 'admin_session') {
        onScanSuccess(parsedData);
        stopScanning();
        onOpenChange(false);
      } else {
        toast.error("Invalid QR code. Please scan a valid admin QR code.");
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      toast.error("Error processing QR code data.");
      onScanError?.(error);
    }
  };

  const handleClose = () => {
    stopScanning();
    onOpenChange(false);
    setError(null);
  };


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md grid-lines max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
          border: '2px solid hsl(210, 100%, 60%)',
          boxShadow: '0 0 15px hsl(210, 100%, 60% / 0.5), 0 0 30px hsl(210, 100%, 60% / 0.3), 0 0 60px hsl(210, 100%, 60% / 0.1)'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-center font-arcade text-2xl text-white">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 flex-1 flex flex-col">
        
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              {hasCamera && cameraPermission === 'granted' ? (
                <Camera className="w-5 h-5 text-green-400" />
              ) : hasCamera && (cameraPermission === 'NotAllowedError' || cameraPermission === 'denied') ? (
                <CameraOff className="w-5 h-5 text-yellow-400" />
              ) : hasCamera && cameraPermission === 'prompt' ? (
                <Camera className="w-5 h-5 text-blue-400" />
              ) : (
                <CameraOff className="w-5 h-5 text-red-400" />
              )}
              <span className="text-gray-200 font-digital">
                {hasCamera && cameraPermission === 'granted'
                  ? 'Camera Ready - Auto-starting...'
                  : hasCamera && (cameraPermission === 'NotAllowedError' || cameraPermission === 'denied')
                  ? 'Camera Permission Denied'
                  : hasCamera && cameraPermission === 'prompt'
                  ? 'Requesting Camera Permission...'
                  : 'Camera Not Available'
                }
              </span>
            </div>

            {isScanning && (
              <div className="text-green-400 font-digital animate-pulse">
                Scanning...
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="font-digital text-sm">{error}</span>
              </div>
            </div>
          )}


          <div className="flex-1 flex items-center justify-center">
            {hasCamera && cameraPermission === 'granted' ? (
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ width: '300px', height: '300px' }}>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  style={{ transform: 'scaleX(-1)' }} // Mirror the video for better UX
                />
                {/* QR Scanner overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-48 h-48 border-2 border-green-400 rounded-lg opacity-50">
                      <div className="absolute inset-2 border border-green-400 rounded opacity-75"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-48 h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                <CameraOff className="w-12 h-12 text-gray-600" />
              </div>
            )}
          </div>

          
          <div className="text-center space-y-2">
            <p className="text-gray-300 font-digital text-sm">
              {hasCamera && cameraPermission === 'granted'
                ? 'Position the QR code within the green frame'
                : hasCamera && (cameraPermission === 'NotAllowedError' || cameraPermission === 'denied')
                ? 'Camera access denied. Please allow camera permission in your browser settings.'
                : hasCamera && cameraPermission === 'prompt'
                ? 'Click "Allow" when your browser asks for camera permission'
                : 'Checking camera availability...'
              }
            </p>
            <p className="text-gray-400 font-digital text-xs">
              {hasCamera && cameraPermission === 'granted'
                ? 'Make sure the QR code is well-lit and clearly visible'
                : 'Camera permission is required to scan QR codes'
              }
            </p>
          </div>

       
          <div className="flex gap-3 flex-shrink-0">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 font-arcade"
              style={{
                border: '1px solid hsl(210, 100%, 60%)',
                color: 'hsl(210, 100%, 60%)'
              }}
            >
              <X className="w-4 h-4 mr-2 text-gray-200" />
              CANCEL
            </Button>

            {hasCamera && cameraPermission === 'granted' && !isScanning && (
              <Button
                onClick={startScanning}
                className="flex-1 bg-gradient-card border-2 border-glow-primary glow-neon hover-glow ripple font-arcade"
                style={{
                  background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
                  border: '2px solid hsl(120, 100%, 50%)',
                  boxShadow: '0 0 15px hsl(120, 100%, 50% / 0.5), 0 0 30px hsl(120, 100%, 50% / 0.3), 0 0 60px hsl(120, 100%, 50% / 0.1)',
                  fontFamily: 'Orbitron, monospace'
                }}
              >
                <Play className="w-4 h-4 mr-2 text-gray-200" />
                <p className="text-gray-200">START SCAN</p>
              </Button>
            )}

            {!hasCamera && (
              <Button
                onClick={checkCameraAvailability}
                className="flex-1 bg-gradient-card border-2 border-glow-primary glow-neon hover-glow ripple font-arcade"
                style={{
                  background: 'linear-gradient(135deg, hsl(220, 13%, 10%), hsl(220, 13%, 8%))',
                  border: '2px solid hsl(210, 100%, 60%)',
                  boxShadow: '0 0 15px hsl(210, 100%, 60% / 0.5), 0 0 30px hsl(210, 100%, 60% / 0.3), 0 0 60px hsl(210, 100%, 60% / 0.1)',
                  fontFamily: 'Orbitron, monospace'
                }}
              >
                <Camera className="w-4 h-4 mr-2 text-gray-200" />
                <p className="text-gray-200">CHECK CAMERA</p>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};