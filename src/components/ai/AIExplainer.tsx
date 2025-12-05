import { 
  Brain, 
  Send, 
  Sparkles, 
  Loader2, 
  Satellite, 
  Rocket, 
  Globe,
  Telescope, 
  SatelliteDish,
  Zap,
  Cloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
}

const suggestedQuestions = [
  "What are black holes and how are they formed?",
  "Explain the life cycle of a star",
  "How do satellites stay in orbit?",
  "What is dark matter and dark energy?",
  "How do solar flares affect Earth?",
  "What is the James Webb Telescope discovering?",
  "How do astronauts live on the ISS?",
  "What are exoplanets and how do we find them?",
  "Explain the theory of relativity in simple terms",
  "What is the future of space exploration?",
  "How does gravity work in space?",
  "What is a light-year?",
  "Explain the Big Bang theory",
  "How do rockets launch into space?",
  "What are asteroids made of?",
];

// Groq API Configuration
const GROQ_CONFIG = {
  name: "Groq Llama 3.3",
  endpoint: "https://api.groq.com/openai/v1/chat/completions",
  model: "llama-3.3-70b-versatile", // Current active model
  icon: <Zap className="w-4 h-4" />,
  color: "text-purple-400",
  borderColor: "border-purple-400",
  borderColorOpacity: "border-purple-400/30",
  bgColor: "from-purple-500/20 to-pink-600/20",
  dotColor: "bg-purple-400",
};

// Space icons mapping
const spaceIcons = {
  "black hole": <Satellite className="w-4 h-4" />,
  "star": <Sparkles className="w-4 h-4" />,
  "satellite": <SatelliteDish className="w-4 h-4" />,
  "telescope": <Telescope className="w-4 h-4" />,
  "planet": <Globe className="w-4 h-4" />, // Using Globe instead of Planet
  "rocket": <Rocket className="w-4 h-4" />,
  "asteroid": <Cloud className="w-4 h-4" />,
  "default": <Brain className="w-4 h-4" />,
};

export const AIExplainer = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm AstroNexus AI, your space science companion. I can explain black holes, discuss space missions, analyze astronomical data, and help you understand the mysteries of the universe. What cosmic topic shall we explore today? 🚀",
      timestamp: new Date(),
      model: "AstroNexus AI"
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages (optimized to prevent stutters)
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages.length, isLoading]);

  // Get appropriate space icon for a question
  const getSpaceIcon = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("black hole") || lowerQuestion.includes("neutron star") || lowerQuestion.includes("wormhole")) 
      return spaceIcons["black hole"];
    if (lowerQuestion.includes("star") || lowerQuestion.includes("supernova") || lowerQuestion.includes("nebula")) 
      return spaceIcons["star"];
    if (lowerQuestion.includes("satellite") || lowerQuestion.includes("orbit") || lowerQuestion.includes("gps")) 
      return spaceIcons["satellite"];
    if (lowerQuestion.includes("telescope") || lowerQuestion.includes("james webb") || lowerQuestion.includes("hubble") || lowerQuestion.includes("observatory")) 
      return spaceIcons["telescope"];
    if (lowerQuestion.includes("planet") || lowerQuestion.includes("exoplanet") || lowerQuestion.includes("mars") || lowerQuestion.includes("jupiter")) 
      return spaceIcons["planet"];
    if (lowerQuestion.includes("rocket") || lowerQuestion.includes("mission") || lowerQuestion.includes("launch") || lowerQuestion.includes("spacex")) 
      return spaceIcons["rocket"];
    if (lowerQuestion.includes("asteroid") || lowerQuestion.includes("comet") || lowerQuestion.includes("meteor")) 
      return spaceIcons["asteroid"];
    
    return spaceIcons["default"];
  };

  // Get Groq API key from environment variables
  const getApiKey = () => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    // Trim whitespace and return
    return apiKey ? String(apiKey).trim() : null;
  };

  // Fallback AI response generator (works without API keys)
  const generateFallbackResponse = async (prompt: string): Promise<string> => {
    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const lowerPrompt = prompt.toLowerCase();
    const spaceFacts = getRandomSpaceFact();
    
    // Generate contextual responses based on keywords
    if (lowerPrompt.includes("black hole")) {
      return `Black holes are fascinating cosmic objects! They form when massive stars collapse at the end of their lives. The gravity is so intense that not even light can escape once it crosses the event horizon. Did you know that ${spaceFacts}? Scientists study black holes through their effects on nearby matter and gravitational waves.`;
    } else if (lowerPrompt.includes("star") || lowerPrompt.includes("supernova")) {
      return `Stars are incredible! They form from clouds of gas and dust, and their life cycle depends on their mass. Massive stars end in spectacular supernovae, while smaller stars like our Sun become white dwarfs. Fun fact: ${spaceFacts}. The light we see from stars may have traveled for millions of years to reach us!`;
    } else if (lowerPrompt.includes("planet") || lowerPrompt.includes("mars") || lowerPrompt.includes("jupiter")) {
      return `Planets are diverse worlds! Each planet in our solar system is unique. Mars has the largest volcano, Jupiter has a Great Red Spot storm larger than Earth, and Venus has a day longer than its year. Did you know that ${spaceFacts}? Scientists are discovering thousands of exoplanets around other stars!`;
    } else if (lowerPrompt.includes("satellite") || lowerPrompt.includes("orbit")) {
      return `Satellites stay in orbit through a balance between gravity pulling them down and their forward velocity. The International Space Station orbits Earth every 90 minutes at about 17,500 mph! Satellites enable GPS, weather forecasting, and global communications. Fun fact: ${spaceFacts}`;
    } else if (lowerPrompt.includes("telescope") || lowerPrompt.includes("james webb") || lowerPrompt.includes("hubble")) {
      return `Telescopes are our windows to the universe! The James Webb Space Telescope can see back in time to the early universe, while Hubble has revolutionized our understanding of space. These incredible instruments reveal galaxies, nebulae, and cosmic phenomena. Did you know that ${spaceFacts}?`;
    } else if (lowerPrompt.includes("rocket") || lowerPrompt.includes("mission") || lowerPrompt.includes("spacex")) {
      return `Rocket launches are engineering marvels! Rockets overcome Earth's gravity using powerful engines and carefully calculated trajectories. Modern missions explore Mars, study asteroids, and even plan for human settlements. Space exploration continues to push boundaries. Fun fact: ${spaceFacts}`;
    } else if (lowerPrompt.includes("asteroid") || lowerPrompt.includes("comet")) {
      return `Asteroids and comets are remnants from the early solar system! Asteroids are rocky, while comets are icy. They can provide clues about how planets formed. Some asteroids have even been visited by spacecraft. Did you know that ${spaceFacts}?`;
    } else if (lowerPrompt.includes("gravity")) {
      return `Gravity is the force that holds the universe together! It's what keeps planets in orbit around stars and moons around planets. In space, objects experience microgravity, creating the weightless environment astronauts experience. Fun fact: ${spaceFacts}`;
    } else if (lowerPrompt.includes("light-year") || lowerPrompt.includes("distance")) {
      return `A light-year is the distance light travels in one year - about 5.88 trillion miles! It's used to measure vast cosmic distances. The nearest star to us, Proxima Centauri, is about 4.24 light-years away. Did you know that ${spaceFacts}?`;
    } else if (lowerPrompt.includes("big bang")) {
      return `The Big Bang theory describes how our universe began about 13.8 billion years ago from an extremely hot, dense state. It expanded rapidly, and continues expanding today. This theory explains the cosmic microwave background and the distribution of galaxies. Fun fact: ${spaceFacts}`;
    } else {
      return `That's a great question about space! The universe is full of mysteries and wonders. ${spaceFacts}. Space exploration continues to reveal amazing discoveries about our cosmos, from black holes to exoplanets to the search for life beyond Earth. What specific aspect interests you most?`;
    }
  };

  // Handle Groq API call
  const callAIAPI = async (prompt: string): Promise<string> => {
    const apiKey = getApiKey();

    // Check if API key is valid (not a placeholder)
    const trimmedKey = apiKey ? String(apiKey).trim() : "";
    const isValidKey = trimmedKey && 
                       trimmedKey !== "your-api-key-here" && 
                       trimmedKey.length > 10 && // Basic validation - real keys are longer
                       trimmedKey !== "your_groq_api_key_here";

    // Debug logging
    console.log("Groq API Key check:", {
      hasKey: !!apiKey,
      keyLength: trimmedKey.length,
      keyPrefix: trimmedKey.substring(0, 10) + "...",
      isValid: isValidKey
    });

    // If no valid API key, use enhanced local fallback
    if (!isValidKey) {
      console.warn("Invalid API key detected, using fallback mode");
      return await generateFallbackResponse(prompt);
    }

    try {
      // Try multiple Groq models if one fails
      const groqModels = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant", 
        "llama-3.1-70b-versatile",
        "mixtral-8x7b-32768"
      ];
      
      // Try each model until one works
      for (const model of groqModels) {
        try {
          console.log(`Trying Groq model: ${model}`);
          return await callGroqAPI(apiKey, model, prompt);
        } catch (modelError: any) {
          const errorMsg = modelError?.message || String(modelError);
          if (errorMsg.includes("decommissioned") || errorMsg.includes("no longer supported")) {
            console.warn(`Model ${model} is deprecated, trying next...`);
            continue; // Try next model
          }
          throw modelError; // If it's a different error, throw it
        }
      }
      throw new Error("All Groq models failed. Please check Groq documentation for current models.");
    } catch (error) {
      // If API call fails, fall back to enhanced local response
      console.warn("API call failed, using enhanced local fallback:", error);
      return await generateFallbackResponse(prompt);
    }
  };

  // Groq API call
  const callGroqAPI = async (apiKey: string, model: string, prompt: string): Promise<string> => {
    const systemPrompt = `You are AstroNexus AI, an enthusiastic space science expert. 
    Explain space concepts clearly and engagingly. Include fascinating facts and analogies.
    Keep responses under 300 words. Always maintain scientific accuracy.`;

    // Trim the API key to remove any whitespace
    const cleanApiKey = String(apiKey).trim();
    console.log("Making Groq API call with model:", model, "key length:", cleanApiKey.length);

    const response = await fetch(GROQ_CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cleanApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      // Check for common API key errors
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Invalid Groq API key. Please check your API key in the .env file.`);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid API response format");
    }
    return data.choices[0].message.content;
  };


  // Main send handler
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = getApiKey();
      const hasValidKey = apiKey && apiKey !== "your-api-key-here" && apiKey.trim() !== "";
      
      const aiResponse = await callAIAPI(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        model: hasValidKey ? GROQ_CONFIG.name : "AstroNexus (Local Mode)",
      };
      
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (err) {
      console.error("AI API error:", err);
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      const apiKey = getApiKey();
      const hasKey = apiKey && apiKey !== "your-api-key-here" && apiKey.trim() !== "" && 
                     apiKey !== "your_groq_api_key_here" && apiKey !== "your_replicate_api_key_here";
      
      // If API key error, show helpful message
      if (errorMessage.includes("Invalid API key") || errorMessage.includes("401") || errorMessage.includes("403")) {
        const errorContent = `🔑 API Key Issue Detected

The API key for ${GROQ_CONFIG.name} appears to be invalid or expired.

**Quick Fix - Get a FREE Groq API Key (Recommended):**
1. Visit: https://console.groq.com/
2. Sign up (free, no credit card needed)
3. Go to API Keys section
4. Create a new key
5. Copy it and add to your .env file:
   VITE_GROQ_API_KEY=your-key-here
6. Switch to "Groq Mixtral" in the dropdown above
7. Restart your dev server

**Or fix your current key:**
- Check your Groq API key at console.groq.com
- Make sure there are no extra spaces in your .env file
- Restart your dev server after updating

For now, I'll use local mode to answer your question:`;

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: errorContent,
          timestamp: new Date(),
          model: "AstroNexus (API Key Error)",
        };
        setMessages((prev) => [...prev, assistantMessage]);
        
        // Also provide a fallback answer
        const fallbackResponse = await generateFallbackResponse(input);
        const fallbackMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: fallbackResponse,
          timestamp: new Date(),
          model: "AstroNexus (Local Mode)",
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      } else {
        // Other errors - use fallback
        const fallbackResponse = await generateFallbackResponse(input);
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallbackResponse,
          timestamp: new Date(),
          model: "AstroNexus (Local Mode)",
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get random space fact
  const getRandomSpaceFact = () => {
    const facts = [
      "a day on Venus is longer than a year on Venus",
      "neutron stars are so dense that a sugar-cube-sized amount would weigh about a billion tons",
      "there are more stars in the universe than grains of sand on all Earth's beaches",
      "the largest known star, UY Scuti, is 1,700 times larger than our Sun",
      "space is completely silent because there's no air to carry sound waves",
      "the footprints on the Moon will stay there for millions of years since there's no wind to blow them away",
      "one million Earths could fit inside the Sun",
      "there is a planet made of diamonds called 55 Cancri e",
      "the Hubble Telescope can see back in time by observing light from billions of years ago",
      "Mars has the largest volcano in the solar system, Olympus Mons"
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  };

  const handleSuggestion = useCallback((question: string) => {
    setInput(question);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Chat cleared! I'm ready to explore new cosmic mysteries with you. What shall we discuss? 🌌",
        timestamp: new Date(),
        model: "AstroNexus AI"
      },
    ]);
  }, []);

  return (
    <section className="glass-panel p-6 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${GROQ_CONFIG.bgColor} flex items-center justify-center`}>
            {GROQ_CONFIG.icon}
          </div>
          <div>
            <h2 className="font-display text-lg font-bold tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ASTRONEXUS AI
            </h2>
            <p className="text-xs text-muted-foreground">
              Space Science Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearChat}
            className="text-xs px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear Chat
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${GROQ_CONFIG.color} animate-pulse`} />
            <span className="text-xs text-muted-foreground">{GROQ_CONFIG.name}</span>
          </div>
        </div>
      </div>

      {/* API Key Warning */}
      <div className="mb-4">
        {(!getApiKey() || getApiKey() === "your-api-key-here" || getApiKey()?.trim() === "" || 
          getApiKey() === "your_groq_api_key_here") && (
          <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 text-sm">⚠️</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-yellow-400 mb-1">API Key Not Configured</p>
                <p className="text-xs text-yellow-300/80 mb-2">
                  Currently using local mode. Get a <strong>FREE Groq API key</strong> for real AI responses:
                </p>
                <ol className="text-xs text-yellow-300/70 list-decimal list-inside space-y-1 mb-2">
                  <li>Visit <a href="https://console.groq.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">console.groq.com</a> (free, no credit card)</li>
                  <li>Sign up and create an API key</li>
                  <li>Add to .env: <code className="bg-black/20 px-1 py-0.5 rounded">VITE_GROQ_API_KEY=your-key</code></li>
                  <li>Select "Groq Mixtral" above and restart server</li>
                </ol>
                <p className="text-xs text-yellow-300/60">
                  See <code className="bg-black/20 px-1 py-0.5 rounded">GET_API_KEY.md</code> for detailed instructions
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSuggestion(q)}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors group"
            title={`Ask: ${q}`}
          >
            <span className="text-blue-400 group-hover:scale-110 transition-transform">
              {getSpaceIcon(q)}
            </span>
            <span className="truncate max-w-[150px]">{q}</span>
          </button>
        ))}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } animate-in fade-in-50`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-4 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground"
                  : "bg-secondary/50 backdrop-blur-sm border border-border/50"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-display bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {message.model || "AstroNexus AI"}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
              {message.role === "user" && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-display text-primary-foreground/80">You</span>
                  <span className="text-[10px] text-primary-foreground/70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
              <div className="text-sm whitespace-pre-line leading-relaxed">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full border-2 ${GROQ_CONFIG.borderColorOpacity}`}></div>
                  <div className={`absolute inset-0 w-8 h-8 rounded-full border-2 ${GROQ_CONFIG.borderColor} border-t-transparent animate-spin`}></div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-foreground">Analyzing with {GROQ_CONFIG.name}...</span>
                  <div className="flex gap-1">
                    <div className={`w-1 h-1 ${GROQ_CONFIG.dotColor} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-1 h-1 ${GROQ_CONFIG.dotColor} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2 pt-4 border-t border-border/50">
        <div className="relative flex-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about black holes, space missions, or cosmic phenomena..."
            className="flex-1 bg-secondary/50 border-border/50 pl-10 pr-4"
            disabled={isLoading}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Satellite className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <Button 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Quick Tips */}
      <div className="mt-3 text-xs text-muted-foreground text-center">
        <span className="inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Tip: Different AI models may provide different perspectives on space topics!
        </span>
      </div>

      {/* Add these styles to your global CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 100, 255, 0.5);
        }
      `}</style>
    </section>
  );
};