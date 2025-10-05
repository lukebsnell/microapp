import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopicContent } from "@/components/TopicContent";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bug, Dna, FlaskConical, Microscope, Activity } from "lucide-react";
import type { Topic } from "@shared/schema";

const getIconForCategory = (category: string) => {
  if (category === "Bacterial Infections") return Bug;
  if (category === "Viral Infections") return Dna;
  if (category === "Fungal Infections") return FlaskConical;
  if (category === "Parasitology") return Microscope;
  return Activity;
};

export default function Home() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const { data: topics = [], isLoading } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  const topicsWithIcons = topics.map(topic => ({
    ...topic,
    icon: getIconForCategory(topic.category),
  }));

  const currentTopic = topicsWithIcons.find((t) => t.id === activeTopic) || topicsWithIcons[0];

  if (!activeTopic && topicsWithIcons.length > 0) {
    setActiveTopic(topicsWithIcons[0].id);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading topics...</p>
      </div>
    );
  }

  if (!currentTopic) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Microscope className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No topics found</h2>
          <p className="text-sm text-muted-foreground">
            Upload your study materials to get started
          </p>
        </div>
      </div>
    );
  }

  const sidebarStyle = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          topics={topicsWithIcons}
          activeTopic={activeTopic || ""}
          onTopicSelect={setActiveTopic}
        />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-2 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-hidden pb-20">
            <TopicContent topic={currentTopic} />
          </main>
        </div>
      </div>
      <AudioPlayer
        topicTitle={currentTopic.title}
        audioSrc={currentTopic.audioPath}
      />
    </SidebarProvider>
  );
}
