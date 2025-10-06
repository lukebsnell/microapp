import { FileText, Headphones, MessageSquare } from "lucide-react";
import { HTMLContentViewer } from "./HTMLContentViewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

import type { Topic } from "@shared/schema";

interface TopicContentProps {
  topic: Topic & { icon?: any };
}

export function TopicContent({ topic }: TopicContentProps) {
  const [, navigate] = useLocation();
  
  // Use HTML path if available, fallback to PDF path for conversion
  const contentSrc = topic.htmlPath || (topic.pdfPath ? topic.pdfPath.replace('/pdf', '/html') : undefined);
  
  const handleFeedback = () => {
    const params = new URLSearchParams({
      type: 'feedback',
      topicId: topic.id,
      topicTitle: topic.title,
      category: topic.category,
    });
    navigate(`/feedback?${params.toString()}`);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold truncate" data-testid="text-topic-title">
            {topic.title}
          </h1>
          <p className="text-sm text-muted-foreground">{topic.category}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFeedback}
            className="gap-2"
            data-testid="button-feedback"
          >
            <MessageSquare className="h-4 w-4" />
            Feedback
          </Button>
          {topic.hasPdf && (
            <Badge variant="outline" className="gap-1">
              <FileText className="h-3 w-3" />
              Content
            </Badge>
          )}
          {topic.hasAudio && (
            <Badge variant="outline" className="gap-1">
              <Headphones className="h-3 w-3" />
              Audio
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <HTMLContentViewer htmlSrc={contentSrc} topicTitle={topic.title} />
      </div>
    </div>
  );
}
