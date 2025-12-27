"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Music } from "lucide-react";

export function AudioPlayerUI() {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
        toast({
            variant: "destructive",
            title: "Unsupported File Type",
            description: "Please upload a valid audio file (e.g., MP3, WAV, OGG).",
        });
        return;
    }

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      setAudioSrc(e.target?.result as string);
    };

    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "Error Reading File",
            description: "There was an issue opening the audio file.",
        });
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <Label htmlFor="audio-upload">Select Audio File</Label>
            <Input id="audio-upload" type="file" accept="audio/*" onChange={handleFileChange} />
             <p className="text-sm text-muted-foreground">Supports MP3, WAV, OGG, and other browser-supported audio formats.</p>
          </div>
        </CardContent>
      </Card>
      <Card className="min-h-[250px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music />
            {fileName || "Audio Player"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full flex items-center justify-center p-6">
            {!audioSrc ? (
                 <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Upload className="h-12 w-12 mb-4" />
                    <p>Upload an audio file to begin playback.</p>
                </div>
            ) : (
                <audio controls src={audioSrc} className="w-full">
                    Your browser does not support the audio element.
                </audio>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
