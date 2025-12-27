import { BarcodeScannerUI } from "./barcode-scanner-ui";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";

export default function BarcodeScannerPage() {
  return (
    <div className="w-full h-full flex flex-col">
       <PageHeader
        title="Barcode Scanner"
        description="Point your camera at a barcode to scan it."
      />
      <div className="mt-8 flex-1 flex flex-col">
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading Scanner...</div>}>
          <BarcodeScannerUI />
        </Suspense>
      </div>
    </div>
  );
}
