import { FileText, Microscope, Bug, Dna, FlaskConical, BookOpen, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

interface Topic {
  id: string;
  title: string;
  category: string;
  icon?: any;
  hasPdf?: boolean;
  hasAudio?: boolean;
}

interface AppSidebarProps {
  topics: Topic[];
  activeTopic?: string;
  onTopicSelect: (topicId: string) => void;
}

export function AppSidebar({ topics, activeTopic, onTopicSelect }: AppSidebarProps) {
  const groupedTopics = topics.reduce((acc, topic) => {
    if (!acc[topic.category]) {
      acc[topic.category] = [];
    }
    acc[topic.category].push(topic);
    return acc;
  }, {} as Record<string, Topic[]>);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Microscope className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-semibold text-base">FRCPath Part 2</h2>
            <p className="text-xs text-muted-foreground">Microbiology</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search topics..."
            className="pl-9"
            data-testid="input-search-topics"
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {Object.entries(groupedTopics).map(([category, categoryTopics]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel>{category}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {categoryTopics.map((topic) => {
                  const Icon = topic.icon || FileText;
                  return (
                    <SidebarMenuItem key={topic.id}>
                      <SidebarMenuButton
                        onClick={() => onTopicSelect(topic.id)}
                        isActive={activeTopic === topic.id}
                        data-testid={`button-topic-${topic.id}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{topic.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
