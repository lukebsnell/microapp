import { TopicContent } from "../TopicContent";

const mockTopic = {
  id: "1",
  title: "Gram Positive Cocci",
  category: "Bacterial Infections",
  pdfSrc: undefined,
  audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
};

export default function TopicContentExample() {
  return (
    <div className="h-screen">
      <TopicContent topic={mockTopic} />
    </div>
  );
}
