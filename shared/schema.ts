import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jokes = pgTable("jokes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  author: text("author").notNull(),
});

export const insertJokeSchema = createInsertSchema(jokes).omit({
  id: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
});

export type InsertJoke = z.infer<typeof insertJokeSchema>;
export type Joke = typeof jokes.$inferSelect;

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;
