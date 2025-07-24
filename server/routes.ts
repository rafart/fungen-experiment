import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all jokes
  app.get("/api/jokes", async (req, res) => {
    try {
      const jokes = await storage.getAllJokes();
      res.json(jokes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jokes" });
    }
  });

  // Get all quotes
  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getAllQuotes();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
