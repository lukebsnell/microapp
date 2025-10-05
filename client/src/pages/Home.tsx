import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopicContent } from "@/components/TopicContent";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bug, Dna, FlaskConical, Microscope, Activity } from "lucide-react";

const mockTopics = [
  { 
    id: "1", 
    title: "Gram Positive Cocci", 
    category: "Bacterial Infections", 
    icon: Bug, 
    hasPdf: false, 
    hasAudio: true,
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  { 
    id: "2", 
    title: "Gram Negative Bacilli", 
    category: "Bacterial Infections", 
    icon: Bug, 
    hasPdf: false, 
    hasAudio: false 
  },
  { 
    id: "3", 
    title: "Mycobacterial Infections", 
    category: "Bacterial Infections", 
    icon: Bug, 
    hasPdf: false, 
    hasAudio: false 
  },
  { 
    id: "4", 
    title: "RNA Viruses", 
    category: "Viral Infections", 
    icon: Dna, 
    hasPdf: false, 
    hasAudio: false 
  },
  { 
    id: "5", 
    title: "DNA Viruses", 
    category: "Viral Infections", 
    icon: Dna, 
    hasPdf: false, 
    hasAudio: false 
  },
  { 
    id: "6", 
    title: "Candida Species", 
    category: "Fungal Infections", 
    icon: FlaskConical, 
    hasPdf: false, 
    hasAudio: false 
  },
  { 
    id: "7", 
    title: "Aspergillus Species", 
    category: "Fungal Infections", 
    icon: FlaskConical, 
    hasPdf: false, 
    hasAudio: false 
  },
  { 
    id: "8", 
    title: "Protozoa", 
    category: "Parasitology", 
    icon: Microscope, 
    hasPdf: false, 
    hasAudio: false 
  },
  { 
    id: "9", 
    title: "Helminths", 
    category: "Parasitology", 
    icon: Activity, 
    hasPdf: false, 
    hasAudio: false 
  },
];

export default function Home() {
  const [activeTopic, setActiveTopic] = useState("1");

  const currentTopic = mockTopics.find((t) => t.id === activeTopic) || mockTopics[0];

  const sidebarStyle = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          topics={mockTopics}
          activeTopic={activeTopic}
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
        audioSrc={currentTopic.audioSrc}
      />
    </SidebarProvider>
  );
}
