import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";

interface HTMLContentViewerProps {
  htmlSrc?: string;
  topicTitle: string;
}

export function HTMLContentViewer({ htmlSrc, topicTitle }: HTMLContentViewerProps) {
  const { data: htmlContent, isLoading, error } = useQuery<string>({
    queryKey: [htmlSrc],
    enabled: !!htmlSrc,
    queryFn: async () => {
      if (!htmlSrc) return '';
      const response = await fetch(htmlSrc);
      if (!response.ok) throw new Error('Failed to load content');
      return response.text();
    },
  });

  if (!htmlSrc) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No content uploaded yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload a PDF file to view the content for {topicTitle}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-medium mb-2">Failed to load content</h3>
          <p className="text-sm text-muted-foreground">
            There was an error loading the content for {topicTitle}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-full w-full overflow-auto px-8 py-6 prose prose-slate dark:prose-invert max-w-none" 
      data-testid="html-content-viewer"
      dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
    />
  );
}
