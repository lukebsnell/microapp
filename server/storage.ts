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

    const categoryFolders = await fs.readdir(topicsDir, { withFileTypes: true });
    const topics: Topic[] = [];

    for (const categoryFolder of categoryFolders) {
      if (!categoryFolder.isDirectory()) continue;

      const categoryPath = path.join(topicsDir, categoryFolder.name);
      const topicFolders = await fs.readdir(categoryPath, { withFileTypes: true });

      const categoryTitle = categoryFolder.name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      for (const topicFolder of topicFolders) {
        if (!topicFolder.isDirectory()) continue;

        const topicPath = path.join(categoryPath, topicFolder.name);
        const files = await fs.readdir(topicPath);
        
        // Prioritize DOCX over PDF for content
        const docxFile = files.find(f => f.toLowerCase().endsWith('.docx'));
        const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));
        const htmlFile = files.find(f => f.toLowerCase().endsWith('.html'));
        
        // Support both MP3 and WAV audio files
        const audioFile = files.find(f => 
          f.toLowerCase().endsWith('.mp3') || 
          f.toLowerCase().endsWith('.wav')
        );

        // Support image files
        const imageFile = files.find(f => 
          f.toLowerCase().endsWith('.jpg') || 
          f.toLowerCase().endsWith('.jpeg') ||
          f.toLowerCase().endsWith('.png') || 
          f.toLowerCase().endsWith('.webp')
        );

        const title = topicFolder.name
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const topicId = `${categoryFolder.name}/${topicFolder.name}`;

        topics.push({
          id: topicId,
          title,
          category: categoryTitle,
          folderPath: topicId,
          docxPath: docxFile ? `/api/topics/${topicId}/docx` : undefined,
          pdfPath: pdfFile ? `/api/topics/${topicId}/pdf` : undefined,
          htmlPath: htmlFile ? `/api/topics/${topicId}/html` : undefined,
          audioPath: audioFile ? `/api/topics/${topicId}/audio` : undefined,
          imagePath: imageFile ? `/api/topics/${topicId}/image` : undefined,
          hasDocx: !!docxFile,
          hasPdf: !!pdfFile,
          hasHtml: !!htmlFile,
          hasAudio: !!audioFile,
          hasImage: !!imageFile,
        });
      }
    }

    return topics.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.title.localeCompare(b.title);
    });
  }

}

export const storage = new MemStorage();
