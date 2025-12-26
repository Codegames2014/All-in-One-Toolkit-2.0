import { QRCodeScannerUI } from "./qr-code-scanner-ui";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";

export default function QRCodeScannerPage() {
  return (
    <div className="w-full h-full flex flex-col">
       <PageHeader
        title="QR Code Scanner"
        description="Point your camera at a QR code to scan it."
      />
      <div className="mt-8 flex-1 flex flex-col">
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading Scanner...</div>}>
          <QRCodeScannerUI />
        </Suspense>
      </div>
    </div>
  );
}
