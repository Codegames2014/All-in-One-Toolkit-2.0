import { PageHeader } from "@/components/page-header";
import { StoryWriterUI } from "./story-writer-ui";
import { Suspense } from "react";

export default function StoryWriterPage() {
  return (
    <div>
      <PageHeader
        title="AI Story Writer"
        description="Craft compelling narratives from a simple prompt and let your imagination run wild."
      />
      <div className="mt-8">
        <Suspense fallback={<div>Loading...</div>}>
          <StoryWriterUI />
        </Suspense>
      </div>
    </div>
  );
}
