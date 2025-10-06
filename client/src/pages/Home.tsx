import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopicContent } from "@/components/TopicContent";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bug, Dna, FlaskConical, Microscope, Activity } from "lucide-react";
import type { Topic } from "@shared/schema";

const getIconForCategory = (category: string) => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes("bacteria")) return Bug;
  if (lowerCategory.includes("virus")) return Dna;
  if (lowerCategory.includes("fung")) return FlaskConical;
  if (lowerCategory.includes("parasit")) return Microscope;
  if (lowerCategory.includes("laboratory")) return Activity;
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

  const currentTopic = topicsWithIcons.find((t) => t.id === activeTopic);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading topics...</p>
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
            {currentTopic ? (
              <TopicContent topic={currentTopic} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔬</div>
                  <h1 className="text-4xl font-bold mb-2" data-testid="text-app-title">MicroApp</h1>
                  <p className="text-muted-foreground">Select a topic from the sidebar to begin</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      {currentTopic && (
        <AudioPlayer
          topicId={currentTopic.id}
          topicTitle={currentTopic.title}
          audioSrc={currentTopic.audioPath}
        />
      )}
    </SidebarProvider>
  );
}
