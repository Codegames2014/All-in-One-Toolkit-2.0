import { PageHeader } from "@/components/page-header";
import { QuestionMakerUI } from "./question-maker-ui";
import { Suspense } from "react";

export default function QuestionMakerPage() {
  return (
    <div>
      <PageHeader
        title="AI Question Maker"
        description="Provide a topic or a block of text, and the AI will generate questions for you."
      />
      <div className="mt-8">
        <Suspense fallback={<div>Loading...</div>}>
          <QuestionMakerUI />
        </Suspense>
      </div>
    </div>
  );
}
