import { MessageSquare, Home } from "lucide-react";
import { HTMLContentViewer } from "./HTMLContentViewer";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

import type { Topic } from "@shared/schema";

interface TopicContentProps {
  topic: Topic & { icon?: any };
  onNavigateHome: () => void;
}

export function TopicContent({ topic, onNavigateHome }: TopicContentProps) {
  const [, navigate] = useLocation();
  
  // Use HTML path if available, fallback to PDF or DOCX path for conversion
  const contentSrc = topic.htmlPath || 
    topic.pdfPath?.replace('/pdf', '/html') || 
    topic.docxPath?.replace('/docx', '/html');
  
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateHome}
            className="gap-2"
            data-testid="button-home"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
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
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <HTMLContentViewer htmlSrc={contentSrc} topicTitle={topic.title} />
      </div>
    </div>
  );
}
