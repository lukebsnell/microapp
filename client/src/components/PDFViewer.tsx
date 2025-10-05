import { FileText } from "lucide-react";

interface PDFViewerProps {
  pdfSrc?: string;
  topicTitle: string;
}

export function PDFViewer({ pdfSrc, topicTitle }: PDFViewerProps) {
  if (!pdfSrc) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No PDF uploaded yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload a PDF file to view the content for {topicTitle}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full" data-testid="pdf-viewer">
      <iframe
        src={pdfSrc}
        className="w-full h-full border-0"
        title={`PDF content for ${topicTitle}`}
      />
    </div>
  );
}
