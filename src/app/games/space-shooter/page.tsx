import { PageHeader } from "@/components/page-header";
import { SpaceShooterUI } from "./space-shooter-ui";
import { Suspense } from "react";

export default function SpaceShooterPage() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="w-full max-w-4xl text-center">
        <PageHeader
          title="Space Shooter"
          description="Use arrow keys to move and space to shoot. Defend the galaxy!"
        />
        <div className="mt-8">
          <Suspense fallback={<div>Loading Game...</div>}>
            <SpaceShooterUI />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
