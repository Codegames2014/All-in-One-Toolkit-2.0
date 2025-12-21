"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { handleLogoGeneration } from "./actions";
import { Download, Loader2, Wand2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

export function LogoGeneratorUI() {
  const [prompt, setPrompt] = useState("");
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const onGenerate = () => {
    if (!prompt) {
      toast({
        variant: "destructive",
        title: "No Prompt",
        description: "Please enter a prompt to generate a logo.",
      });
      return;
    }

    startTransition(async () => {
      setGeneratedLogos([]);
      // Generate 4 logos in parallel
      const promises = Array(4)
        .fill(null)
        .map(() => handleLogoGeneration({ prompt }));
      const results = await Promise.all(promises);
      
      const successfulCreations = results
        .filter(r => r.success && r.data)
        .map(r => r.data!);

      if (successfulCreations.length > 0) {
        setGeneratedLogos(successfulCreations);
      } else {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: results[0]?.error || "An unknown error occurred.",
        });
      }
    });
  };

  const downloadImage = (dataUri: string) => {
    const link = document.createElement("a");
    link.href = dataUri;
    link.download = "generated-logo.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
            <CardTitle>Logo Description</CardTitle>
            <CardDescription>Describe your brand or idea, and the AI will generate logo concepts for you.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-end gap-4">
          <div className="w-full space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="e.g., 'A coffee shop named \"The Daily Grind\" with a minimalist mountain logo' or 'A tech startup called \"Innovate AI\" with a brain and circuit icon'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isPending}
              className="min-h-[100px]"
            />
          </div>
          <Button
            onClick={onGenerate}
            disabled={isPending || !prompt}
            className="w-full md:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Logos
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {(isPending || generatedLogos.length > 0) && (
        <Card>
            <CardHeader>
                <CardTitle>Generated Logos</CardTitle>
                <CardDescription>Click on a logo to download it.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {isPending && generatedLogos.length === 0 && (
                        Array(4).fill(null).map((_, i) => <Skeleton key={i} className="w-full aspect-square rounded-lg" />)
                    )}
                    {generatedLogos.map((logo, index) => (
                        <div key={index} className="relative group cursor-pointer" onClick={() => downloadImage(logo)}>
                            <Image
                                src={logo}
                                alt={`Generated Logo ${index + 1}`}
                                width={250}
                                height={250}
                                className="w-full h-auto object-contain rounded-lg border bg-white"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Download className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}