import { PageHeader } from "@/components/page-header";
import { QAToolUI } from "./qa-tool-ui";
import { Suspense } from "react";

export default function QAToolPage() {
  return (
    <div>
      <PageHeader
        title="AI Q&A Tool"
        description="Ask any question and get an answer from an advanced AI model."
      />
      <div className="mt-8">
        <Suspense fallback={<div>Loading...</div>}>
          <QAToolUI />
        </Suspense>
      </div>
    </div>
  );
}
