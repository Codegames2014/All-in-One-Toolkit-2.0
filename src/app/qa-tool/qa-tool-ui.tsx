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
import { handleQuestion } from "./actions";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, HelpCircle } from "lucide-react";

const FormSchema = z.object({
  prompt: z
    .string()
    .min(5, "Please enter a question of at least 5 characters."),
});

type FormValues = z.infer<typeof FormSchema>;

export function QAToolUI() {
  const [answer, setAnswer] = useState("");
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
        setAnswer("");
      const result = await handleQuestion(data);
      if (result.success) {
        setAnswer(result.data!);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to get an answer",
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
              <CardTitle>Your Question</CardTitle>
              <CardDescription>
                Ask a clear question that you want the AI to answer.
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
                        placeholder='e.g., "What is the distance between the Earth and the Moon?"'
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
                  "Get Answer"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HelpCircle /> Answer</CardTitle>
          <CardDescription>The AI's answer will appear below.</CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && !answer && (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <p className="whitespace-pre-wrap">{answer}</p>
        </CardContent>
      </Card>
    </div>
  );
}
