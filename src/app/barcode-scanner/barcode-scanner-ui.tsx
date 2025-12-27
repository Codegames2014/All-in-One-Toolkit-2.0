
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, CameraOff, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export function BarcodeScannerUI() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const barcodeDetectorRef = useRef<any | null>(null);
  const { toast } = useToast();

  const initializeBarcodeDetector = useCallback(async () => {
    if ('BarcodeDetector' in window) {
      try {
        const detector = new (window as any).BarcodeDetector({
          formats: [
            'aztec', 'code_128', 'code_39', 'code_93', 'codabar',
            'data_matrix', 'ean_13', 'ean_8', 'itf', 'pdf417',
            'qr_code', 'upc_a', 'upc_e'
          ],
        });
        await detector.detect(document.createElement('canvas')); // Pre-warm the detector
        barcodeDetectorRef.current = detector;
      } catch (error) {
        console.error('Barcode Detector not supported by this browser.', error);
        toast({
          variant: 'destructive',
          title: 'Scanner Not Supported',
          description: 'Your browser does not support barcode scanning.',
        });
      }
    } else {
      console.error('Barcode Detector API not available.');
      toast({
        variant: 'destructive',
        title: 'Scanner Not Available',
        description: 'Barcode scanning is not available in your browser.',
      });
    }
  }, [toast]);
  

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsScanning(true);
        await initializeBarcodeDetector();
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions to use the scanner.",
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if(videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast, initializeBarcodeDetector]);

  useEffect(() => {
    let animationFrameId: number;

    const tick = async () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && isScanning && barcodeDetectorRef.current) {
        try {
            const barcodes = await barcodeDetectorRef.current.detect(videoRef.current);
            if (barcodes.length > 0) {
              setScanResult(barcodes[0].rawValue);
              setIsScanning(false);
              toast({ title: "Barcode Detected!", description: "Scan successful."});
            }
        } catch (error) {
            console.error('Barcode detection failed:', error)
        }
      }
      if (isScanning) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    if (isScanning) {
        animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScanning, toast]);
  
  const resetScanner = () => {
    setScanResult(null);
    if(hasCameraPermission){
        setIsScanning(true);
    }
  }

  const copyToClipboard = () => {
    if(scanResult) {
        navigator.clipboard.writeText(scanResult);
        toast({ title: "Copied to clipboard!"});
    }
  }

  const isUrl = (text: string | null): text is string => {
    if (!text) return false;
    try {
        new URL(text);
        return true;
    } catch (_) {
        return false;
    }
  }


  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full bg-black flex items-center justify-center rounded-lg overflow-hidden">
          {hasCameraPermission === null && (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Camera className="w-12 h-12" />
                  <p>Requesting camera permission...</p>
              </div>
          )}
           {hasCameraPermission === false && (
              <div className="flex flex-col items-center gap-2 text-destructive">
                  <CameraOff className="w-12 h-12" />
                  <p>Camera access denied.</p>
              </div>
          )}
          <video
              ref={videoRef}
              className={hasCameraPermission ? "w-full h-full object-cover" : "hidden"}
              autoPlay
              muted
              playsInline
          />
           {isScanning && hasCameraPermission && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 max-w-md h-1/2 border-4 border-primary/50 rounded-md animate-pulse" />
              </div>
          )}
      </div>

      <Dialog open={!!scanResult} onOpenChange={(isOpen) => !isOpen && resetScanner()}>
          <DialogContent>
            <DialogHeader>
                <DialogTitle>Scan Result</DialogTitle>
                <DialogDescription>The content of the barcode is displayed below.</DialogDescription>
            </DialogHeader>
            <div>
              <p className="p-4 bg-muted rounded-md break-words font-mono text-sm">{scanResult}</p>
            </div>
            <DialogFooter className="sm:justify-start gap-2">
                <Button onClick={copyToClipboard} variant="outline"><Copy className="mr-2"/>Copy</Button>
                {isUrl(scanResult) && (
                    <Button asChild>
                        <a href={scanResult} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2"/>Open Link
                        </a>
                    </Button>
                )}
                 <Button onClick={resetScanner}><RefreshCw className="mr-2"/>Scan Again</Button>
            </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
