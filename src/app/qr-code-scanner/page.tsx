import { QRCodeScannerUI } from "./qr-code-scanner-ui";
import { Suspense } from "react";

export default function QRCodeScannerPage() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mt-8 flex-1 flex flex-col">
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading Scanner...</div>}>
          <QRCodeScannerUI />
        </Suspense>
      </div>
    </div>
  );
}
