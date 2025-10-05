import { type User, type InsertUser, type Topic } from "@shared/schema";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getTopics(): Promise<Topic[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTopics(): Promise<Topic[]> {
    const topicsDir = path.join(process.cwd(), "uploads", "topics");
    
    try {
      await fs.access(topicsDir);
    } catch {
      return [];
    }

    const folders = await fs.readdir(topicsDir, { withFileTypes: true });
    const topics: Topic[] = [];

    for (const folder of folders) {
      if (!folder.isDirectory()) continue;

      const folderPath = path.join(topicsDir, folder.name);
      const files = await fs.readdir(folderPath);
      
      const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));
      const audioFile = files.find(f => f.toLowerCase().endsWith('.wav'));

      const title = folder.name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const category = this.categorizeTopicByName(folder.name);

      topics.push({
        id: folder.name,
        title,
        category,
        folderPath: folder.name,
        pdfPath: pdfFile ? `/api/topics/${folder.name}/pdf` : undefined,
        audioPath: audioFile ? `/api/topics/${folder.name}/audio` : undefined,
        hasPdf: !!pdfFile,
        hasAudio: !!audioFile,
      });
    }

    return topics.sort((a, b) => a.title.localeCompare(b.title));
  }

  private categorizeTopicByName(folderName: string): string {
    if (folderName.includes('cocci') || folderName.includes('bacilli') || folderName.includes('mycobacterial')) {
      return 'Bacterial Infections';
    }
    if (folderName.includes('virus')) {
      return 'Viral Infections';
    }
    if (folderName.includes('candida') || folderName.includes('aspergillus') || folderName.includes('fungal')) {
      return 'Fungal Infections';
    }
    if (folderName.includes('protozoa') || folderName.includes('helminth') || folderName.includes('parasit')) {
      return 'Parasitology';
    }
    return 'Other Topics';
  }
}

export const storage = new MemStorage();
