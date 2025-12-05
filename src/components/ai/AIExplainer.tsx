import { 
  Brain, 
  Send, 
  Sparkles, 
  Loader2, 
  Satellite, 
  Rocket, 
  Globe,  // Changed from Planet to Globe
  Telescope, 
  SatelliteDish,
  Zap,
  Cpu,
  Database,
  Cloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

// API Configuration for different providers
const API_CONFIGS = {
  openai: {
    name: "OpenAI GPT-4",
    endpoint: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4",
    icon: <Cpu className="w-4 h-4" />,
    color: "text-green-400",
    bgColor: "from-green-500/20 to-emerald-600/20",
  },
  anthropic: {
    name: "Anthropic Claude",
    endpoint: "https://api.anthropic.com/v1/messages",
    model: "claude-3-opus-20240229",
    icon: <Brain className="w-4 h-4" />,
    color: "text-blue-400",
    bgColor: "from-blue-500/20 to-cyan-600/20",
  },
  replicate: {
    name: "Replicate Llama 3",
    endpoint: "https://api.replicate.com/v1/models/meta/meta-llama-3-70b-instruct/predictions",
    model: "meta-llama-3-70b-instruct",
    icon: <Database className="w-4 h-4" />,
    color: "text-orange-400",
    bgColor: "from-orange-500/20 to-red-600/20",
  },
  groq: {
    name: "Groq Mixtral",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    model: "mixtral-8x7b-32768",
    icon: <Zap className="w-4 h-4" />,
    color: "text-purple-400",
    bgColor: "from-purple-500/20 to-pink-600/20",
  }
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
  const [selectedApi, setSelectedApi] = useState<keyof typeof API_CONFIGS>("openai");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

  // Get API key from environment variables
  const getApiKey = () => {
    const config = API_CONFIGS[selectedApi];
    const envKey = `VITE_${selectedApi.toUpperCase()}_API_KEY`;
    return import.meta.env[envKey] || "your-api-key-here";
  };

  // Handle API call based on selected provider
  const callAIAPI = async (prompt: string): Promise<string> => {
    const apiKey = getApiKey();
    const config = API_CONFIGS[selectedApi];

    switch (selectedApi) {
      case "openai":
      case "groq":
        return await callOpenAICompatible(config.endpoint, apiKey, config.model, prompt);
      
      case "anthropic":
        return await callAnthropicAPI(apiKey, config.model, prompt);
      
      case "replicate":
        return await callReplicateAPI(apiKey, config.model, prompt);
      
      default:
        throw new Error(`Unsupported API: ${selectedApi}`);
    }
  };

  // OpenAI/Groq compatible API call
  const callOpenAICompatible = async (endpoint: string, apiKey: string, model: string, prompt: string): Promise<string> => {
    const systemPrompt = `You are AstroNexus AI, an enthusiastic space science expert. 
    Explain space concepts clearly and engagingly. Include fascinating facts and analogies.
    Keep responses under 300 words. Always maintain scientific accuracy.`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
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
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  // Anthropic API call
  const callAnthropicAPI = async (apiKey: string, model: string, prompt: string): Promise<string> => {
    const systemPrompt = `You are AstroNexus AI, an enthusiastic space science expert. 
    Explain space concepts clearly and engagingly. Include fascinating facts and analogies.
    Keep responses under 300 words. Always maintain scientific accuracy.`;

    const response = await fetch(API_CONFIGS.anthropic.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "user", content: prompt }
        ],
        system: systemPrompt,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  };

  // Replicate API call
  const callReplicateAPI = async (apiKey: string, model: string, prompt: string): Promise<string> => {
    const response = await fetch(API_CONFIGS.replicate.endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          prompt: `You are AstroNexus AI, a space science expert. Answer this question about space, astronomy, or space missions in a clear and engaging way (max 300 words): ${prompt}`,
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const prediction = await response.json();
    
    // Poll for completion
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const statusRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { "Authorization": `Token ${apiKey}` },
      });
      
      if (!statusRes.ok) {
        throw new Error(`Failed to check prediction status: ${statusRes.status}`);
      }
      
      const statusData = await statusRes.json();
      
      if (statusData.status === "succeeded") {
        const output = statusData.output;
        return Array.isArray(output) 
          ? output.join("") 
          : typeof output === "string" 
            ? output 
            : "I couldn't generate a response. Please try again.";
      } else if (statusData.status === "failed" || statusData.status === "canceled") {
        throw new Error(statusData.error || "Prediction failed");
      }
      attempts++;
    }

    throw new Error("Request timed out after 30 seconds");
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
      const aiResponse = await callAIAPI(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        model: API_CONFIGS[selectedApi].name,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (err) {
      console.error("AI API error:", err);
      
      // Fallback responses
      const fallbackResponses = [
        `While connecting to the cosmic knowledge network, here's what I can tell you: "${input}" is a fascinating space topic! The universe is full of wonders like ${getRandomSpaceFact()}.`,
        
        `I'm experiencing cosmic interference! Meanwhile, did you know that ${getRandomSpaceFact()}? The cosmos never ceases to amaze!`,
        
        `Temporary connection issue to the deep space network. Space fact: ${getRandomSpaceFact()}. Try rephrasing your question or switching AI models!`
      ];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        timestamp: new Date(),
        model: "AstroNexus (Offline Mode)",
      };
      setMessages((prev) => [...prev, assistantMessage]);
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

  const handleSuggestion = (question: string) => {
    setInput(question);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Chat cleared! I'm ready to explore new cosmic mysteries with you. What shall we discuss? 🌌",
        timestamp: new Date(),
        model: "AstroNexus AI"
      },
    ]);
  };

  return (
    <section className="glass-panel p-6 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${API_CONFIGS[selectedApi].bgColor} flex items-center justify-center`}>
            {API_CONFIGS[selectedApi].icon}
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
            <Sparkles className={`w-4 h-4 ${API_CONFIGS[selectedApi].color} animate-pulse`} />
            <span className="text-xs text-muted-foreground">{API_CONFIGS[selectedApi].name}</span>
          </div>
        </div>
      </div>

      {/* API Selector */}
      <div className="mb-4">
        <Select value={selectedApi} onValueChange={(value: keyof typeof API_CONFIGS) => setSelectedApi(value)}>
          <SelectTrigger className="w-full bg-secondary/30 border-border/50">
            <SelectValue placeholder="Select AI Model" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(API_CONFIGS).map(([key, config]) => (
              <SelectItem key={key} value={key} className="flex items-center gap-2">
                <span className={config.color}>{config.icon}</span>
                <span>{config.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2">
          Set API keys in .env file: VITE_{selectedApi.toUpperCase()}_API_KEY
        </p>
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
                  <div className={`w-8 h-8 rounded-full border-2 ${API_CONFIGS[selectedApi].color}/30`}></div>
                  <div className={`absolute inset-0 w-8 h-8 rounded-full border-2 ${API_CONFIGS[selectedApi].color} border-t-transparent animate-spin`}></div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-foreground">Analyzing with {API_CONFIGS[selectedApi].name}...</span>
                  <div className="flex gap-1">
                    <div className={`w-1 h-1 ${API_CONFIGS[selectedApi].color} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-1 h-1 ${API_CONFIGS[selectedApi].color} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
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