"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { handleStoryGeneration } from "./actions";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BookOpen } from "lucide-react";

const FormSchema = z.object({
  prompt: z
    .string()
    .min(10, "Please enter a prompt of at least 10 characters."),
});

type FormValues = z.infer<typeof FormSchema>;

export function StoryWriterUI() {
  const [generatedStory, setGeneratedStory] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    startTransition(async () => {
        setGeneratedStory("");
      const result = await handleStoryGeneration(data);
      if (result.success) {
        setGeneratedStory(result.data!);
      } else {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Story Prompt</CardTitle>
              <CardDescription>
                Describe the story you want the AI to write. Mention characters, setting, genre, plot points, etc.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder='e.g., "A sci-fi story about a lone astronaut discovering an ancient alien artifact on Mars."'
                        className="min-h-[200px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Write Story"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen /> Your Story</CardTitle>
          <CardDescription>The AI's masterpiece will appear below.</CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && !generatedStory && (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <p className="whitespace-pre-wrap">{generatedStory}</p>
        </CardContent>
      </Card>
    </div>
  );
}
