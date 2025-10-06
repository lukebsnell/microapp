import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MessageSquare, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const feedbackFormSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export default function FeedbackPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const searchParams = new URLSearchParams(window.location.search);
  const type = searchParams.get('type') || 'feedback';
  const topicId = searchParams.get('topicId') || undefined;
  const topicTitle = searchParams.get('topicTitle') || undefined;
  const category = searchParams.get('category') || undefined;

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      message: '',
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: async (data: FeedbackFormValues) => {
      return apiRequest('POST', '/api/feedback', {
        type,
        message: data.message,
        topicId,
        topicTitle,
        category,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: type === 'feedback' 
          ? "Your feedback has been sent. Thank you!"
          : "Your topic request has been submitted.",
      });
      form.reset();
      navigate('/');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FeedbackFormValues) => {
    feedbackMutation.mutate(data);
  };

  const isFeedback = type === 'feedback';
  const title = isFeedback ? 'Submit Feedback' : 'Request a Topic';
  const description = isFeedback 
    ? 'Share your thoughts about this topic to help us improve'
    : 'Tell us what topic you would like to see added';
  const icon = isFeedback ? MessageSquare : FileText;
  const Icon = icon;

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-4"
        data-testid="button-back"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {topicTitle && (
            <div className="mb-6 p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground mb-1">Topic</p>
              <p className="font-medium" data-testid="text-topic-title">{topicTitle}</p>
              {category && (
                <p className="text-sm text-muted-foreground mt-1" data-testid="text-category">
                  Category: {category}
                </p>
              )}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isFeedback ? 'Your Feedback' : 'Topic Details'}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          isFeedback
                            ? "What did you think about this topic? Any suggestions for improvement?"
                            : "Please describe the topic you would like to see added..."
                        }
                        className="min-h-[200px] resize-none"
                        data-testid="input-message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={feedbackMutation.isPending}
                  data-testid="button-submit"
                >
                  {feedbackMutation.isPending ? 'Sending...' : 'Submit'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
