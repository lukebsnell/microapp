import { TopicContent } from "../TopicContent";
import { Bug } from "lucide-react";

const mockTopic = {
  id: "gram-positive-cocci",
  title: "Gram Positive Cocci",
  category: "Bacterial Infections",
  folderPath: "gram-positive-cocci",
  pdfPath: undefined,
  audioPath: undefined,
  hasPdf: false,
  hasAudio: false,
  icon: Bug,
};

export default function TopicContentExample() {
  return (
    <div className="h-screen">
      <TopicContent topic={mockTopic} />
    </div>
  );
}
