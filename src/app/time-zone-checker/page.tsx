import { PageHeader } from "@/components/page-header";
import { TimeZoneCheckerUI } from "./time-zone-checker-ui";
import { Suspense } from "react";

export default function TimeZoneCheckerPage() {
  return (
    <div>
      <PageHeader
        title="Time Zone Checker"
        description="View the current time in different cities around the world."
      />
      <div className="mt-8">
        <Suspense fallback={<div>Loading...</div>}>
          <TimeZoneCheckerUI />
        </Suspense>
      </div>
    </div>
  );
}
