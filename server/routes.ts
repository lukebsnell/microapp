import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import { promises as fs } from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getTopics();
      res.json(topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  });

  app.get("/api/topics/:topicId(*)/pdf", async (req, res) => {
    try {
      const { topicId } = req.params;
      
      // topicId should be in format: category/topic
      const parts = topicId.split('/');
      if (parts.length !== 2) {
        return res.status(400).json({ error: "Invalid topic ID format" });
      }

      const [category, topic] = parts;
      
      // Sanitize both parts to prevent directory traversal
      const sanitizedCategory = path.basename(category);
      const sanitizedTopic = path.basename(topic);
      
      if (sanitizedCategory !== category || sanitizedTopic !== topic || 
          category.includes('..') || topic.includes('..')) {
        return res.status(400).json({ error: "Invalid topic ID" });
      }

      const topicsRoot = path.join(process.cwd(), "uploads", "topics");
      const topicDir = path.join(topicsRoot, sanitizedCategory, sanitizedTopic);
      
      // Verify resolved path is within topics root
      const resolvedPath = path.resolve(topicDir);
      if (!resolvedPath.startsWith(path.resolve(topicsRoot))) {
        return res.status(400).json({ error: "Invalid topic ID" });
      }

      try {
        const files = await fs.readdir(topicDir);
        const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));
        
        if (!pdfFile) {
          return res.status(404).json({ error: "PDF not found" });
        }

        const pdfPath = path.join(topicDir, pdfFile);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.sendFile(pdfPath);
      } catch (err: any) {
        if (err.code === 'ENOENT') {
          return res.status(404).json({ error: "Topic not found" });
        }
        throw err;
      }
    } catch (error) {
      console.error("Error serving PDF:", error);
      res.status(500).json({ error: "Failed to serve PDF" });
    }
  });

  app.get("/api/topics/:topicId(*)/audio", async (req, res) => {
    try {
      const { topicId } = req.params;
      
      // topicId should be in format: category/topic
      const parts = topicId.split('/');
      if (parts.length !== 2) {
        return res.status(400).json({ error: "Invalid topic ID format" });
      }

      const [category, topic] = parts;
      
      // Sanitize both parts to prevent directory traversal
      const sanitizedCategory = path.basename(category);
      const sanitizedTopic = path.basename(topic);
      
      if (sanitizedCategory !== category || sanitizedTopic !== topic || 
          category.includes('..') || topic.includes('..')) {
        return res.status(400).json({ error: "Invalid topic ID" });
      }

      const topicsRoot = path.join(process.cwd(), "uploads", "topics");
      const topicDir = path.join(topicsRoot, sanitizedCategory, sanitizedTopic);
      
      // Verify resolved path is within topics root
      const resolvedPath = path.resolve(topicDir);
      if (!resolvedPath.startsWith(path.resolve(topicsRoot))) {
        return res.status(400).json({ error: "Invalid topic ID" });
      }

      try {
        const files = await fs.readdir(topicDir);
        const audioFile = files.find(f => f.toLowerCase().endsWith('.wav'));
        
        if (!audioFile) {
          return res.status(404).json({ error: "Audio file not found" });
        }

        const audioPath = path.join(topicDir, audioFile);
        res.setHeader('Content-Type', 'audio/wav');
        res.sendFile(audioPath);
      } catch (err: any) {
        if (err.code === 'ENOENT') {
          return res.status(404).json({ error: "Topic not found" });
        }
        throw err;
      }
    } catch (error) {
      console.error("Error serving audio:", error);
      res.status(500).json({ error: "Failed to serve audio" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
