import { MessageSquare, Home } from "lucide-react";
import { HTMLContentViewer } from "./HTMLContentViewer";
import { ImageViewer } from "./ImageViewer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

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
        {topic.hasImage ? (
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="mx-4 mt-2">
              <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
              <TabsTrigger value="images" data-testid="tab-images">Images</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="flex-1 overflow-hidden mt-0">
              <HTMLContentViewer htmlSrc={contentSrc} topicTitle={topic.title} />
            </TabsContent>
            <TabsContent value="images" className="flex-1 overflow-hidden mt-0">
              <ImageViewer imageSrc={topic.imagePath!} alt={topic.title} />
            </TabsContent>
          </Tabs>
        ) : (
          <HTMLContentViewer htmlSrc={contentSrc} topicTitle={topic.title} />
        )}
      </div>
    </div>
  );
}
