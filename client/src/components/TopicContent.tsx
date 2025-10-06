import { FileText, Headphones } from "lucide-react";
import { HTMLContentViewer } from "./HTMLContentViewer";
import { Badge } from "@/components/ui/badge";

import type { Topic } from "@shared/schema";

interface TopicContentProps {
  topic: Topic & { icon?: any };
}

export function TopicContent({ topic }: TopicContentProps) {
  // Use HTML path if available, fallback to PDF path for conversion
  const contentSrc = topic.htmlPath || (topic.pdfPath ? topic.pdfPath.replace('/pdf', '/html') : undefined);
  
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
