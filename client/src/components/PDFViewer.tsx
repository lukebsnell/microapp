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
      <object
        data={pdfSrc}
        type="application/pdf"
        className="w-full h-full"
        aria-label={`PDF content for ${topicTitle}`}
      >
        <div className="flex items-center justify-center h-full p-4">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Unable to display PDF</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your browser may not support inline PDF viewing
            </p>
            <a
              href={pdfSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Open PDF in new tab
            </a>
          </div>
        </div>
      </object>
    </div>
  );
}
