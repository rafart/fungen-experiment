import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, Laugh, Quote, Hash, Cat, Heart, AlertTriangle, RotateCcw, Sparkles, Zap, Star, Smile, Coffee } from "lucide-react";
import type { Joke, Quote as QuoteType } from "@shared/schema";

type ContentType = 'welcome' | 'joke' | 'quote' | 'number' | 'cat' | 'error';

export default function Home() {
  const [contentType, setContentType] = useState<ContentType>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [currentJoke, setCurrentJoke] = useState<string>('');
  const [currentQuote, setCurrentQuote] = useState<QuoteType | null>(null);
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [currentCatImage, setCurrentCatImage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Random positive sentiment that changes each page load
  const randomSentiment = useMemo(() => {
    const sentiments = [
      { text: "love", icon: Heart, color: "text-red-400" },
      { text: "joy", icon: Smile, color: "text-yellow-400" },
      { text: "passion", icon: Sparkles, color: "text-purple-400" },
      { text: "enthusiasm", icon: Zap, color: "text-blue-400" },
      { text: "excitement", icon: Star, color: "text-green-400" },
      { text: "energy", icon: Coffee, color: "text-orange-400" }
    ];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  }, []);

  const { data: jokes } = useQuery<Joke[]>({
    queryKey: ['/api/jokes'],
  });

  const { data: quotes } = useQuery<QuoteType[]>({
    queryKey: ['/api/quotes'],
  });

  const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;

  const generateRandomContent = async () => {
    setIsLoading(true);
    setError('');
    
    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    const contentTypes: ContentType[] = ['joke', 'quote', 'number', 'cat'];
    const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];

    try {
      switch (randomType) {
        case 'joke':
          if (jokes && jokes.length > 0) {
            const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
            setCurrentJoke(randomJoke.text);
            setContentType('joke');
          } else {
            throw new Error('No jokes available');
          }
          break;

        case 'quote':
          if (quotes && quotes.length > 0) {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            setCurrentQuote(randomQuote);
            setContentType('quote');
          } else {
            throw new Error('No quotes available');
          }
          break;

        case 'number':
          const randomNum = generateRandomNumber();
          setCurrentNumber(randomNum);
          setContentType('number');
          break;

        case 'cat':
          try {
            const catResponse = await fetch('https://cataas.com/cat');
            if (catResponse.ok) {
              setCurrentCatImage(catResponse.url);
              setContentType('cat');
            } else {
              throw new Error('Failed to load cat image');
            }
          } catch (catError) {
            throw new Error('Failed to load cat image');
          }
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setContentType('error');
    }

    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-accent mb-4"></div>
          <p className="text-white text-lg">Generating something awesome...</p>
        </div>
      );
    }

    switch (contentType) {
      case 'welcome':
        return (
          <Card className="content-card rounded-2xl shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎲</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ready for Some Fun?</h3>
              <p className="text-gray-600">Click the button above to get started with your random content adventure!</p>
            </CardContent>
          </Card>
        );

      case 'joke':
        return (
          <Card className="content-card rounded-2xl shadow-2xl animate-bounce-in">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-accent rounded-full p-3 mr-4">
                  <Laugh className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Random Joke</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-lg text-gray-700 leading-relaxed">{currentJoke}</p>
              </div>
            </CardContent>
          </Card>
        );

      case 'quote':
        return (
          <Card className="content-card rounded-2xl shadow-2xl animate-bounce-in">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-primary rounded-full p-3 mr-4">
                  <Quote className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Motivational Quote</h3>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-4">
                  "{currentQuote?.text}"
                </blockquote>
                <cite className="text-primary font-semibold">- {currentQuote?.author}</cite>
              </div>
            </CardContent>
          </Card>
        );

      case 'number':
        return (
          <Card className="content-card rounded-2xl shadow-2xl animate-bounce-in">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-secondary rounded-full p-3 mr-4">
                  <Hash className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Random Number</h3>
              </div>
              <div className="bg-pink-50 rounded-xl p-6 text-center">
                <div className="text-6xl font-bold text-secondary mb-4">{currentNumber}</div>
                <p className="text-gray-600">Your lucky number between 1 and 100!</p>
              </div>
            </CardContent>
          </Card>
        );

      case 'cat':
        return (
          <Card className="content-card rounded-2xl shadow-2xl animate-bounce-in">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-accent rounded-full p-3 mr-4">
                  <Cat className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Random Cat</h3>
              </div>
              <div className="bg-yellow-50 rounded-xl p-6">
                <img 
                  src={currentCatImage} 
                  alt="Random cat" 
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
                <p className="text-center text-gray-600 mt-4">Enjoy this adorable feline friend! 🐱</p>
              </div>
            </CardContent>
          </Card>
        );

      case 'error':
        return (
          <Card className="content-card rounded-2xl shadow-2xl border-l-4 border-red-500">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="bg-red-500 rounded-full p-3 mr-4">
                  <AlertTriangle className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Oops!</h3>
              </div>
              <div className="bg-red-50 rounded-xl p-6">
                <p className="text-gray-700">{error || 'Something went wrong while fetching your content. Please try again!'}</p>
                <Button 
                  onClick={generateRandomContent}
                  className="mt-4 bg-red-500 text-white hover:bg-red-600"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gradient-bg">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-4">
          <Wand2 className="inline mr-4 text-accent" />
          Random Fun Generator
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
          Click the button below for a surprise! Get random jokes, motivational quotes, numbers, or adorable cat pictures.
        </p>
      </div>

      {/* Main Action Button */}
      <div className="mb-8">
        <Button 
          onClick={generateRandomContent}
          disabled={isLoading}
          className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 hover:from-purple-500 hover:via-blue-500 hover:via-green-500 hover:via-yellow-500 hover:to-red-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
        >
          <Wand2 className="mr-3" />
          Generate Something Fun!
        </Button>
      </div>

      {/* Content Display */}
      <div className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-blue-100">
        <p className="text-sm opacity-75">
          Made with <randomSentiment.icon className={`inline h-4 w-4 ${randomSentiment.color}`} /> {randomSentiment.text} for random fun
        </p>
      </div>
    </div>
  );
}
