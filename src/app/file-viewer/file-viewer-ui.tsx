"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Upload, FileArchive, FileQuestion } from "lucide-react";

export function FileViewerUI() {
  const [fileContent, setFileContent] = useState<string | ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileType(file.type);
    setFileContent(null);
    
    const reader = new FileReader();

    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("text/")) {
      reader.readAsText(file);
    } else if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
      setFileContent('zip'); 
      return; 
    } else {
      setFileContent('unsupported');
      return;
    }

    reader.onload = (e) => {
      setFileContent(e.target?.result || null);
    };

    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "Error Reading File",
            description: "There was an issue opening the file.",
        });
    }
  };

  const renderContent = () => {
    if (!fileContent) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Upload className="h-12 w-12 mb-4" />
                <p>Upload a file to view its contents.</p>
                <p className="text-sm">(Images, GIFs, videos, text, and .zip archives supported)</p>
            </div>
        );
    }

    if (fileContent === 'zip') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <FileArchive className="h-12 w-12 mb-4" />
                <p className="font-semibold">{fileName}</p>
                <p className="text-sm">This is a zip archive. Viewing its contents is not supported.</p>
            </div>
        )
    }

    if (fileContent === 'unsupported') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <FileQuestion className="h-12 w-12 mb-4" />
                <p className="font-semibold">{fileName}</p>
                <p className="text-sm">This file type is not supported for viewing.</p>
            </div>
        )
    }

    if (typeof fileContent === 'string' && fileType.startsWith("image/")) {
        return <Image src={fileContent} alt={fileName} width={800} height={600} className="max-w-full max-h-[70vh] object-contain"/>
    }

    if (typeof fileContent === 'string' && fileType.startsWith("video/")) {
        return <video src={fileContent} controls className="max-w-full max-h-[70vh] rounded-md"/>
    }
    
    if (typeof fileContent === 'string') {
        return (
            <ScrollArea className="h-full">
                <pre className="text-sm p-4 whitespace-pre-wrap break-words">
                    {fileContent}
                </pre>
            </ScrollArea>
        )
    }

    // Fallback for ArrayBuffer or other non-string types
    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <FileQuestion className="h-12 w-12 mb-4" />
            <p className="font-semibold">{fileName}</p>
            <p className="text-sm">This file type cannot be displayed as text.</p>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select File</Label>
            <Input id="file-upload" type="file" onChange={handleFileChange} />
          </div>
        </CardContent>
      </Card>
      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText />
            {fileName || "File Content"}
          </CardTitle>
          {fileType && <CardDescription>{fileType}</CardDescription>}
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
            {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
