import { PageHeader } from "@/components/page-header";
import { AudioPlayerUI } from "./audio-player-ui";
import { Suspense } from "react";

export default function AudioPlayerPage() {
  return (
    <div>
      <PageHeader
        title="Audio Player"
        description="Select a local audio file from your computer to play it."
      />
      <div className="mt-8">
        <Suspense fallback={<div>Loading...</div>}>
          <AudioPlayerUI />
        </Suspense>
      </div>
    </div>
  );
}
