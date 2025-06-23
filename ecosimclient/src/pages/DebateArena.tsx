"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar" // Keep if sidebar is used in the debate arena
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar" // Keep if sidebar is used in the debate arena
import { Card } from "@/components/ui/card"
import { ChevronDown, Plus, RotateCcw, Copy, Maximize2, ArrowLeft, ArrowRight, Circle, X, Bot, ThumbsUp, ThumbsDown, MessageSquare, Trophy, CheckCircle, XCircle, Volume2, VolumeX } from "lucide-react"
import React from "react"
import { cn } from "@/lib/utils"

interface AssistantPanelProps {
  title: string;
  content: string;
  streaming: boolean;
  showQuestion: boolean; // Potentially remove if not used
  isLoading: boolean;
  isHighlighted?: boolean;
  highlightType?: 'green' | 'red' | 'yellow' | 'purple' | 'orange' | null;
  onTextToSpeech?: (text: string, agentName: string) => void;
  isAudioPlaying?: boolean;
  audioUrl?: string;
  sources?: Array<{ title: string; uri: string }>;
  searchQueries?: string[];
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({ title, content, streaming, isLoading, isHighlighted, highlightType, onTextToSpeech, isAudioPlaying, audioUrl, sources, searchQueries }) => {
  const isProAdvocate = title === "Pro Advocate";
  
  return (
    <Card className={cn(
      "border rounded-2xl p-6 flex flex-col shadow-lg transition-all duration-300 min-h-[400px] md:min-h-[500px]", // Increased min-height and rounded corners
      isHighlighted && highlightType === 'green' && "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700 shadow-green-100 dark:shadow-green-900/20",
      isHighlighted && highlightType === 'red' && "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 shadow-red-100 dark:shadow-red-900/20",
      isHighlighted && highlightType === 'yellow' && "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-700 shadow-yellow-100 dark:shadow-yellow-900/20",
      isHighlighted && highlightType === 'purple' && "bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700 shadow-purple-100 dark:shadow-purple-900/20",
      isHighlighted && highlightType === 'orange' && "bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-700 shadow-orange-100 dark:shadow-orange-900/20",
      !isHighlighted && "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none" // Adjusted neutral background/shadow
    )}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-3"> {/* Increased font size and gap */}
              <div className={cn(
                "relative w-8 h-8 rounded-full flex items-center justify-center",
                isProAdvocate 
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                  : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              )}>
                {isProAdvocate ? (
                  <CheckCircle className="h-5 w-5 animate-pulse" />
                ) : (
                  <XCircle className="h-5 w-5 animate-pulse" />
                )}
                {streaming && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                )}
              </div>
              {title}
              {(sources && sources.length > 0) && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                  🔍 Sources
                </span>
              )}
            </h3>
            <div className="flex gap-2"> {/* Increased gap */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg"
                  onClick={() => onTextToSpeech?.(content, title)}
                  disabled={!content || isLoading}
                  title="Listen to response"
                >
                  {isAudioPlaying ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg"> {/* Slightly larger, rounded */}
                    <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg"> {/* Slightly larger, rounded */}
                    <Maximize2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
        <div className="flex-grow space-y-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed overflow-y-auto custom-scrollbar pr-2"> {/* Added custom-scrollbar */}
            {isLoading ? (
              <LoadingAnimation />
            ) : (
              <div className="whitespace-pre-wrap">
                  {content}
                  {streaming && <span className="animate-pulse text-blue-600 dark:text-blue-400">▌</span>}
              </div>
            )}
        </div>
        
        {/* Sources and Search Queries */}
        {(sources && sources.length > 0) || (searchQueries && searchQueries.length > 0) ? (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {searchQueries && searchQueries.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Research Queries
                </h4>
                <div className="flex flex-wrap gap-1">
                  {searchQueries.map((query, index) => (
                    <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                      {query}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {sources && sources.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Sources Referenced
                </h4>
                <div className="space-y-2">
                  {sources.map((source, index) => (
                    <div key={index} className="text-xs">
                      <a 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {source.title || source.uri}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
    </Card>
  );
};

interface VoteButtonProps {
    onClick: () => void;
    isSelected: boolean;
    children: React.ReactNode;
    icon: React.ElementType;
    onHover?: (vote: string | null) => void;
    voteType: string;
}

const VoteButton: React.FC<VoteButtonProps> = ({ onClick, isSelected, children, icon: Icon, onHover, voteType }) => (
  <Button
      variant="outline"
      className={cn(
        "gap-2 text-base font-medium h-12 px-6 rounded-full transition-all duration-200", // Rounded full
        "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600",
        isSelected && "bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-600 dark:border-indigo-500 hover:from-blue-700 hover:to-indigo-800 shadow-md" // Gradient for selected
      )}
      onClick={onClick}
      onMouseEnter={() => onHover?.(voteType)}
      onMouseLeave={() => onHover?.(null)}
  >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
  </Button>
);

interface VotingPollProps {
  selectedVote: string | null;
  isVisible: boolean;
}

const VotingPoll: React.FC<VotingPollProps> = ({ selectedVote, isVisible }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Generate random vote results
  const generateRandomVotes = () => {
    const totalVotes = Math.floor(Math.random() * 200) + 50; // 50-250 votes
    const undecidedPercentage = Math.random() * 0.2; // 0-20% undecided
    const undecided = Math.floor(totalVotes * undecidedPercentage);
    const remainingVotes = totalVotes - undecided;
    
    const left = Math.floor(Math.random() * (remainingVotes * 0.8)) + Math.floor(remainingVotes * 0.1); // 10-90% of remaining
    const right = remainingVotes - left;
    const tie = 0; // No tie votes in this simplified version
    const bad = 0; // No bad votes in this simplified version
    
    return { left, right, tie, bad, total: totalVotes };
  };

  const [mockVotes, setMockVotes] = useState(generateRandomVotes());

  // Regenerate random votes when poll becomes visible
  useEffect(() => {
    if (isVisible) {
      setMockVotes(generateRandomVotes());
    }
  }, [isVisible]);
  
  const agentAlphaPercentage = Math.round((mockVotes.left / mockVotes.total) * 100);
  const agentBetaPercentage = Math.round((mockVotes.right / mockVotes.total) * 100);
  const undecidedPercentage = 100 - agentAlphaPercentage - agentBetaPercentage;
  
  const getVoteLabel = (vote: string) => {
    switch(vote) {
      case 'left': return 'Pro Advocate Won';
      case 'right': return 'Con Advocate Won';
      case 'tie': return "It's a Tie";
      case 'bad': return 'Both were Bad';
      default: return '';
    }
  };

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm dark:shadow-none">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-t-xl transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-red-500 rounded-lg flex items-center justify-center">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Community Results</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{mockVotes.total} total votes</p>
          </div>
        </div>
        <ChevronDown className={cn(
          "h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200",
          isCollapsed && "rotate-180"
        )} />
      </div>
      
      {!isCollapsed && (
        <div className="px-4 pb-4 space-y-4">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pro Advocate</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">{agentAlphaPercentage}%</span>
            </div>
            
            <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out"
                style={{ width: `${agentAlphaPercentage}%` }}
              />
              <div 
                className="absolute top-0 h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500 ease-out"
                style={{ 
                  left: `${agentAlphaPercentage}%`, 
                  width: `${agentBetaPercentage}%` 
                }}
              />
              <div 
                className="absolute top-0 h-full bg-gray-400 dark:bg-gray-600 transition-all duration-500 ease-out"
                style={{ 
                  left: `${agentAlphaPercentage + agentBetaPercentage}%`, 
                  width: `${undecidedPercentage}%` 
                }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Con Advocate</span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">{agentBetaPercentage}%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-green-500 rounded"></div>
              <span>Pro</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-red-400 to-red-500 rounded"></div>
              <span>Con</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-600 rounded"></div>
              <span>Undecided</span>
            </div>
          </div>

          {/* User's Vote */}
          {selectedVote && (
            <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-red-50 dark:from-green-950/10 dark:to-red-950/10 border border-green-200 dark:border-green-700 rounded-lg">
              <div className="text-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your vote: </span>
                <span className="text-sm text-gray-900 dark:text-gray-100 font-semibold">{getVoteLabel(selectedVote)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ConversationHistoryProps {
  messages: ChatMessage[];
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ messages }) => {
  if (messages.length <= 1) return null; // Don't show if only initial user message

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm dark:shadow-none mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        Conversation History
      </h3>
      <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
        {messages.slice(1).map((message, index) => (
          <div key={index} className={cn(
            "p-3 rounded-lg text-sm",
            message.role === 'user' && "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800",
            message.role === 'agent_a' && "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800",
            message.role === 'agent_b' && "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
          )}>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                message.role === 'user' && "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
                message.role === 'agent_a' && "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
                message.role === 'agent_b' && "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
              )}>
                {message.role === 'user' ? 'You' : message.role === 'agent_a' ? 'Pro Advocate' : 'Con Advocate'}
              </span>
              {message.timestamp && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300">{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DebateArenaPageProps {
    prompt: string;
    onBack: () => void;
}

interface ChatMessage {
    role: 'user' | 'agent_a' | 'agent_b';
    content: string;
    timestamp?: string;
}

const LoadingAnimation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const loadingSteps = [
    "🤔 Thinking...",
    "🔍 Researching...",
    "📚 Gathering facts...",
    "💭 Forming argument...",
    "✍️ Writing response...",
    "🎯 Finalizing..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [loadingSteps.length]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-purple-400 rounded-full animate-spin"></div>
        </div>
        {/* Inner ring */}
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-orange-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        {/* Center dot */}
        <div className="absolute top-6 left-6 w-4 h-4 bg-gradient-to-br from-purple-400 to-orange-400 rounded-full animate-pulse"></div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
          {loadingSteps[currentStep]}
        </p>
        <div className="flex justify-center mt-2 space-x-1">
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default function DebateArenaPage({ prompt, onBack }: DebateArenaPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agentResponses, setAgentResponses] = useState({ agentA: '', agentB: '' });

  const [streamingA, setStreamingA] = useState(true)
  const [streamingB, setStreamingB] = useState(true)
  const [displayedA, setDisplayedA] = useState("")
  const [displayedB, setDisplayedB] = useState("")
  const [selectedVote, setSelectedVote] = useState<string | null>(null)
  const [showVoting, setShowVoting] = useState(false)
  const [hoverVote, setHoverVote] = useState<string | null>(null)

  // Chat functionality
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [isSendingFollowUp, setIsSendingFollowUp] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // Text-to-speech functionality
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentPlayingAgent, setCurrentPlayingAgent] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Sources and search queries
  const [agentASources, setAgentASources] = useState<Array<{ title: string; uri: string }>>([]);
  const [agentBSources, setAgentBSources] = useState<Array<{ title: string; uri: string }>>([]);
  const [agentASearchQueries, setAgentASearchQueries] = useState<string[]>([]);
  const [agentBSearchQueries, setAgentBSearchQueries] = useState<string[]>([]);

  useEffect(() => {
    const fetchDebate = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8000/api/debate", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        setAgentResponses({ agentA: data.agent_a_response, agentB: data.agent_b_response });
        
        // Set sources and search queries
        setAgentASources(data.agent_a_sources || []);
        setAgentBSources(data.agent_b_sources || []);
        setAgentASearchQueries(data.agent_a_search_queries || []);
        setAgentBSearchQueries(data.agent_b_search_queries || []);

        // Add initial messages to conversation history
        const initialMessages: ChatMessage[] = [
          {
            role: 'user',
            content: prompt,
            timestamp: new Date().toISOString()
          }
        ];
        setConversationHistory(initialMessages);

      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDebate();
  }, [prompt]);

  useEffect(() => {
    if (loading || error || !agentResponses.agentA) return;

    const streamText = (text: string, setter: (text: string) => void, onComplete: () => void) => {
      let index = 0
      const interval = setInterval(() => {
        if (index < text.length) {
          setter(text.slice(0, index + 1))
          index++
        } else {
          clearInterval(interval)
          onComplete()
        }
      }, 5)
      return interval
    }

    const intervalA = streamText(agentResponses.agentA, setDisplayedA, () => {
      setStreamingA(false)
      // Add Agent A response to conversation history
      setConversationHistory(prev => [...prev, {
        role: 'agent_a',
        content: agentResponses.agentA,
        timestamp: new Date().toISOString()
      }])
    })
    const intervalB = streamText(agentResponses.agentB, setDisplayedB, () => {
      setStreamingB(false)
      // Add Agent B response to conversation history
      setConversationHistory(prev => [...prev, {
        role: 'agent_b',
        content: agentResponses.agentB,
        timestamp: new Date().toISOString()
      }])
    })

    return () => {
      clearInterval(intervalA)
      clearInterval(intervalB)
    }
  }, [loading, error, agentResponses])

  useEffect(() => {
    if (!streamingA && !streamingB) {
      setShowVoting(true)
    }
  }, [streamingA, streamingB])

  // Cleanup audio when component unmounts or debate changes
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setIsAudioPlaying(false);
      setCurrentPlayingAgent(null);
    };
  }, [audioElement, prompt]);

  const handleVote = (vote: string) => {
    setSelectedVote(vote)
  }

  const handleVoteHover = (vote: string | null) => {
    setHoverVote(vote)
  }

  const handleFollowUpQuestion = async () => {
    if (!followUpQuestion.trim() || isSendingFollowUp) return;

    // Reset states at the beginning for clean transition
    setShowVoting(false);
    setSelectedVote(null);
    setHoverVote(null);
    setStreamingA(true);
    setStreamingB(true);
    setDisplayedA("");
    setDisplayedB("");
    
    // Reset sources and search queries
    setAgentASources([]);
    setAgentBSources([]);
    setAgentASearchQueries([]);
    setAgentBSearchQueries([]);

    // Store the question before clearing the input
    const question = followUpQuestion;
    
    // Clear the input immediately for better UX
    setFollowUpQuestion("");

    setIsSendingFollowUp(true);
    setChatLoading(true);

    try {
      // Add user's follow-up question to conversation history
      const updatedHistory = [...conversationHistory, {
        role: 'user' as const,
        content: question,
        timestamp: new Date().toISOString()
      }];

      const response = await fetch("http://localhost:8000/api/chat", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: updatedHistory,
          use_search: true 
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update conversation history with new responses
      const newHistory = [
        ...updatedHistory,
        {
          role: 'agent_a' as const,
          content: data.agent_a_response,
          timestamp: new Date().toISOString()
        },
        {
          role: 'agent_b' as const,
          content: data.agent_b_response,
          timestamp: new Date().toISOString()
        }
      ];
      
      setConversationHistory(newHistory);
      
      // Update displayed responses
      setAgentResponses({ 
        agentA: data.agent_a_response, 
        agentB: data.agent_b_response 
      });
      
      // Update sources and search queries
      setAgentASources(data.agent_a_sources || []);
      setAgentBSources(data.agent_b_sources || []);
      setAgentASearchQueries(data.agent_a_search_queries || []);
      setAgentBSearchQueries(data.agent_b_search_queries || []);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsSendingFollowUp(false);
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFollowUpQuestion();
    }
  };

  const handleTextToSpeech = async (text: string, agentName: string) => {
    // Stop any currently playing audio
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    // If the same agent is already playing, just stop it
    if (currentPlayingAgent === agentName && isAudioPlaying) {
      setIsAudioPlaying(false);
      setCurrentPlayingAgent(null);
      return;
    }

    try {
      setIsAudioPlaying(true);
      setCurrentPlayingAgent(agentName);

      const response = await fetch("http://localhost:8000/api/text-to-speech", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: text,
          voice_id: agentName === "Pro Advocate" ? "nova" : "shimmer", // Different voices for each agent
          model: "eleven-labs"
        }),
      });

      if (!response.ok) {
        throw new Error(`Text-to-speech API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.audio_url) {
        const audio = new Audio(data.audio_url);
        
        audio.onended = () => {
          setIsAudioPlaying(false);
          setCurrentPlayingAgent(null);
        };
        
        audio.onerror = () => {
          setIsAudioPlaying(false);
          setCurrentPlayingAgent(null);
          console.error('Audio playback error');
        };
        
        setAudioElement(audio);
        await audio.play();
      } else {
        console.error('Text-to-speech failed:', data.message);
        setIsAudioPlaying(false);
        setCurrentPlayingAgent(null);
      }
    } catch (err) {
      console.error('Text-to-speech error:', err);
      setIsAudioPlaying(false);
      setCurrentPlayingAgent(null);
    }
  };

  const getCardHighlight = () => {
    // If hovering over a vote button, show hover effects
    if (hoverVote) {
      if (hoverVote === 'left') return { agentA: 'green' as const, agentB: 'red' as const };
      if (hoverVote === 'right') return { agentA: 'red' as const, agentB: 'green' as const };
      if (hoverVote === 'bad') return { agentA: 'red' as const, agentB: 'red' as const };
      if (hoverVote === 'tie') return { agentA: 'yellow' as const, agentB: 'yellow' as const };
    }
    
    // If a vote is selected, show selection effects
    if (selectedVote === 'left') return { agentA: 'green' as const, agentB: null };
    if (selectedVote === 'right') return { agentA: null, agentB: 'green' as const };
    if (selectedVote === 'bad') return { agentA: 'red' as const, agentB: 'red' as const };
    if (selectedVote === 'tie') return { agentA: 'yellow' as const, agentB: 'yellow' as const };
    return { agentA: null, agentB: null };
  }

  const cardHighlight = getCardHighlight();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1D1D20] text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-[#1D1D20]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-9 w-9 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 rounded-lg" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hidden sm:block">PolicyPulse</h1> {/* Hidden on small screens */}
          </div>
          <div className="flex-1 px-4 sm:px-8"> {/* Adjusted padding */}
            <div className="max-w-xl mx-auto py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm dark:shadow-none">
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate px-4 text-center">{prompt}</p>
              {(agentASources.length > 0 || agentBSources.length > 0) && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600 dark:text-blue-400">Using real-time information</span>
                </div>
              )}
            </div>
          </div>
          <div className="w-9"></div> {/* Spacer to maintain layout */}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8"> {/* Adjusted padding */}
        {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg text-center mb-6">
                <p><strong className="text-red-900 dark:text-red-100">Error:</strong> {error}</p>
                <p className="text-sm mt-2">Please ensure the backend server is running and accessible.</p>
            </div>
        )}
        
        {/* Conversation History */}
        <ConversationHistory messages={conversationHistory} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AssistantPanel 
            title="Pro Advocate" 
            content={displayedA} 
            streaming={streamingA} 
            showQuestion={false} 
            isLoading={loading || chatLoading}
            isHighlighted={!!cardHighlight.agentA}
            highlightType={cardHighlight.agentA}
            onTextToSpeech={handleTextToSpeech}
            isAudioPlaying={isAudioPlaying && currentPlayingAgent === "Pro Advocate"}
            sources={agentASources}
            searchQueries={agentASearchQueries}
          />
          <AssistantPanel 
            title="Con Advocate" 
            content={displayedB} 
            streaming={streamingB} 
            showQuestion={false} 
            isLoading={loading || chatLoading}
            isHighlighted={!!cardHighlight.agentB}
            highlightType={cardHighlight.agentB}
            onTextToSpeech={handleTextToSpeech}
            isAudioPlaying={isAudioPlaying && currentPlayingAgent === "Con Advocate"}
            sources={agentBSources}
            searchQueries={agentBSearchQueries}
          />
        </div>
      </main>

      <footer className="sticky bottom-0 bg-white/80 dark:bg-[#1D1D20]/80 backdrop-blur-md z-10 border-t border-gray-200 dark:border-gray-700 p-4">
        {showVoting && !selectedVote && (
            <div className="flex flex-wrap items-center justify-center gap-4 pb-6"> {/* Added flex-wrap */}
              <VoteButton 
                onClick={() => handleVote("left")} 
                isSelected={false} 
                icon={ThumbsUp}
                onHover={handleVoteHover}
                voteType="left"
              >
                Pro Advocate Won
              </VoteButton>
              <VoteButton 
                onClick={() => handleVote("right")} 
                isSelected={false} 
                icon={ThumbsUp}
                onHover={handleVoteHover}
                voteType="right"
              >
                Con Advocate Won
              </VoteButton>
              <VoteButton 
                onClick={() => handleVote("tie")} 
                isSelected={false} 
                icon={Circle}
                onHover={handleVoteHover}
                voteType="tie"
              >
                It's a Tie
              </VoteButton>
              <VoteButton 
                onClick={() => handleVote("bad")} 
                isSelected={false} 
                icon={ThumbsDown}
                onHover={handleVoteHover}
                voteType="bad"
              >
                Both were Bad
              </VoteButton>
            </div>
        )}
        {showVoting && selectedVote && (
            <div className="pb-6">
              <VotingPoll selectedVote={selectedVote} isVisible={showVoting && !loading && !chatLoading} />
            </div>
        )}
        <div className="max-w-3xl mx-auto relative">
            <Input
                placeholder={isSendingFollowUp ? "Sending..." : "Ask a follow-up question..."}
                className="w-full h-14 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-6 pr-14 text-base focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 shadow-sm dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                value={followUpQuestion}
                onChange={(e) => setFollowUpQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isSendingFollowUp || chatLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                <Button 
                    size="icon" 
                    variant="default" 
                    className="h-10 w-10 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white rounded-lg shadow-md disabled:opacity-50" 
                    onClick={handleFollowUpQuestion}
                    disabled={isSendingFollowUp || chatLoading || !followUpQuestion.trim()}
                >
                    {isSendingFollowUp ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    ) : (
                        <ArrowRight className="h-5 w-5" />
                    )}
                </Button>
            </div>
        </div>
      </footer>
    </div>
  )
}