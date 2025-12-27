import { PageHeader } from "@/components/page-header";
import { FileViewerUI } from "./file-viewer-ui";
import { Suspense } from "react";

export default function FileViewerPage() {
  return (
    <div>
      <PageHeader
        title="File Viewer"
        description="Select a local file from your computer to view its content."
      />
      <div className="mt-8">
        <Suspense fallback={<div>Loading...</div>}>
          <FileViewerUI />
        </Suspense>
      </div>
    </div>
  );
}
