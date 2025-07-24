import { jokes, quotes, type Joke, type Quote, type InsertJoke, type InsertQuote } from "@shared/schema";

export interface IStorage {
  getAllJokes(): Promise<Joke[]>;
  getAllQuotes(): Promise<Quote[]>;
  createJoke(joke: InsertJoke): Promise<Joke>;
  createQuote(quote: InsertQuote): Promise<Quote>;
}

export class MemStorage implements IStorage {
  private jokes: Map<number, Joke>;
  private quotes: Map<number, Quote>;
  private currentJokeId: number;
  private currentQuoteId: number;

  constructor() {
    this.jokes = new Map();
    this.quotes = new Map();
    this.currentJokeId = 1;
    this.currentQuoteId = 1;

    // Initialize with some jokes
    const initialJokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Why did the scarecrow win an award? He was outstanding in his field!",
      "I'm reading a book about anti-gravity. It's impossible to put down!",
      "Why don't eggs tell jokes? They'd crack each other up!",
      "What do you call a fake noodle? An impasta!",
      "Why did the math book look so sad? Because it had too many problems!",
      "What do you call a bear with no teeth? A gummy bear!",
      "Why don't skeletons fight each other? They don't have the guts!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus!"
    ];

    initialJokes.forEach(text => {
      const joke: Joke = { id: this.currentJokeId++, text };
      this.jokes.set(joke.id, joke);
    });

    // Initialize with some quotes
    const initialQuotes = [
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
      { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
      { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
      { text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.", author: "Unknown" },
      { text: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.", author: "Steve Jobs" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
    ];

    initialQuotes.forEach(({ text, author }) => {
      const quote: Quote = { id: this.currentQuoteId++, text, author };
      this.quotes.set(quote.id, quote);
    });
  }

  async getAllJokes(): Promise<Joke[]> {
    return Array.from(this.jokes.values());
  }

  async getAllQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values());
  }

  async createJoke(insertJoke: InsertJoke): Promise<Joke> {
    const id = this.currentJokeId++;
    const joke: Joke = { ...insertJoke, id };
    this.jokes.set(id, joke);
    return joke;
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = this.currentQuoteId++;
    const quote: Quote = { ...insertQuote, id };
    this.quotes.set(id, quote);
    return quote;
  }
}

export const storage = new MemStorage();
