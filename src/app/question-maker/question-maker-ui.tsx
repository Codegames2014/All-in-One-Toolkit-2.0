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
import { handleQuestionGeneration } from "./actions";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Clipboard, Check } from "lucide-react";

const FormSchema = z.object({
  text: z
    .string()
    .min(10, "Please enter at least 10 characters of text or a topic."),
});

type FormValues = z.infer<typeof FormSchema>;

export function QuestionMakerUI() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    startTransition(async () => {
      setQuestions([]);
      const result = await handleQuestionGeneration(data);
      if (result.success) {
        setQuestions(result.data!);
      } else {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: result.error,
        });
      }
    });
  };

  const copyToClipboard = () => {
    if (questions.length === 0) return;
    const textToCopy = questions.join("\n");
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      toast({ title: "Copied questions to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Topic or Text</CardTitle>
              <CardDescription>
                Enter a subject or paste a block of text for the AI to analyze.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder='e.g., "The history of the Roman Empire" or paste a full article here.'
                        className="min-h-[300px] resize-y"
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
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Questions
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card className="bg-muted">
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
                <CardTitle>Generated Questions</CardTitle>
                <CardDescription>The AI's questions will appear below.</CardDescription>
            </div>
            {questions.length > 0 && (
                <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
            )}
        </CardHeader>
        <CardContent>
          {isPending && questions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Thinking up some great questions...</p>
            </div>
          )}
          {questions.length > 0 && (
            <ul className="space-y-3 list-decimal list-inside">
              {questions.map((q, index) => (
                <li key={index}>{q}</li>
              ))}
            </ul>
          )}
           {!isPending && questions.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <p>Your generated questions will show up here.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
