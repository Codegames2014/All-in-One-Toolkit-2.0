import { PageHeader } from "@/components/page-header";
import { SoundPlayerUI } from "./sound-player-ui";
import { Suspense } from "react";

export default function SoundPlayerPage() {
  return (
    <div>
      <PageHeader
        title="Sound Player"
        description="Select a local audio file from your computer to play it."
      />
      <div className="mt-8">
        <Suspense fallback={<div>Loading...</div>}>
          <SoundPlayerUI />
        </Suspense>
      </div>
    </div>
  );
}
