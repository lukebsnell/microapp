import { useState } from "react";
import { AppSidebar } from "../AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Bug, Dna, FlaskConical, Microscope, Activity } from "lucide-react";

const mockTopics = [
  { id: "1", title: "Gram Positive Cocci", category: "Bacterial Infections", icon: Bug, hasPdf: true, hasAudio: true },
  { id: "2", title: "Gram Negative Bacilli", category: "Bacterial Infections", icon: Bug, hasPdf: true, hasAudio: true },
  { id: "3", title: "Mycobacterial Infections", category: "Bacterial Infections", icon: Bug, hasPdf: true, hasAudio: false },
  { id: "4", title: "RNA Viruses", category: "Viral Infections", icon: Dna, hasPdf: true, hasAudio: true },
  { id: "5", title: "DNA Viruses", category: "Viral Infections", icon: Dna, hasPdf: true, hasAudio: true },
  { id: "6", title: "Candida Species", category: "Fungal Infections", icon: FlaskConical, hasPdf: true, hasAudio: true },
  { id: "7", title: "Aspergillus Species", category: "Fungal Infections", icon: FlaskConical, hasPdf: true, hasAudio: false },
  { id: "8", title: "Protozoa", category: "Parasitology", icon: Microscope, hasPdf: true, hasAudio: true },
  { id: "9", title: "Helminths", category: "Parasitology", icon: Activity, hasPdf: true, hasAudio: true },
];

export default function AppSidebarExample() {
  const [activeTopic, setActiveTopic] = useState("1");

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar 
          topics={mockTopics}
          activeTopic={activeTopic}
          onTopicSelect={setActiveTopic}
        />
      </div>
    </SidebarProvider>
  );
}
