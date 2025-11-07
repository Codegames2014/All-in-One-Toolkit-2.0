import { PageHeader } from "@/components/page-header";
import { UnitConverterUI } from "./unit-converter-ui";
import { Suspense } from "react";

export default function UnitConverterPage() {
  return (
    <div>
      <PageHeader
        title="Unit Converter"
        description="Convert between various units of measurement like length, weight, and temperature."
      />
      <div className="mt-8">
        <Suspense fallback={<div>Loading...</div>}>
          <UnitConverterUI />
        </Suspense>
      </div>
    </div>
  );
}
