"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar" // Keep if sidebar is used in the debate arena
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar" // Keep if sidebar is used in the debate arena
import { Card } from "@/components/ui/card"
import { ChevronDown, Plus, RotateCcw, Copy, Maximize2, ArrowLeft, ArrowRight, Circle, X, Bot, ThumbsUp, ThumbsDown } from "lucide-react"
import React from "react"
import { cn } from "@/lib/utils"

interface AssistantPanelProps {
  title: string;
  content: string;
  streaming: boolean;
  showQuestion: boolean; // Potentially remove if not used
  isLoading: boolean;
  isHighlighted?: boolean;
  highlightType?: 'green' | 'red' | null;
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({ title, content, streaming, isLoading, isHighlighted, highlightType }) => ( // Removed showQuestion as it's always false
  <Card className={cn(
    "border rounded-2xl p-6 flex flex-col shadow-lg transition-all duration-300 min-h-[400px] md:min-h-[500px]", // Increased min-height and rounded corners
    isHighlighted && highlightType === 'green' && "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700 shadow-green-100 dark:shadow-green-900/20",
    isHighlighted && highlightType === 'red' && "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 shadow-red-100 dark:shadow-red-900/20",
    !isHighlighted && "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none" // Adjusted neutral background/shadow
  )}>
      <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-3"> {/* Increased font size and gap */}
            <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" /> {/* Increased icon size */}
            {title}
          </h3>
          <div className="flex gap-2"> {/* Increased gap */}
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
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
                {content}
                {streaming && <span className="animate-pulse text-blue-600 dark:text-blue-400">▌</span>}
            </div>
          )}
      </div>
      {/* Removed showQuestion as it's always false and not used */}
  </Card>
);

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
}

const VotingPoll: React.FC<VotingPollProps> = ({ selectedVote }) => {
  const mockVotes = {
    left: 42,  // Agent Alpha
    right: 38, // Agent Beta
    tie: 12,
    bad: 8
  };

  const totalVotes = mockVotes.left + mockVotes.right + mockVotes.tie + mockVotes.bad;
  
  const agentAlphaPercentage = Math.round((mockVotes.left / totalVotes) * 100);
  const agentBetaPercentage = Math.round((mockVotes.right / totalVotes) * 100);
  const undecidedPercentage = 100 - agentAlphaPercentage - agentBetaPercentage;
  
  const getVoteLabel = (vote: string) => {
    switch(vote) {
      case 'left': return 'Agent Alpha Won';
      case 'right': return 'Agent Beta Won';
      case 'tie': return "It's a Tie";
      case 'bad': return 'Both were Bad';
      default: return '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm dark:shadow-none"> {/* Rounded-xl and shadow adjustment */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">Community Poll Results</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-base font-medium text-gray-700 dark:text-gray-300">Agent Alpha</span>
          <span className="text-base font-semibold text-blue-600 dark:text-blue-400">{agentAlphaPercentage}%</span>
        </div>
        
        <div className="relative w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${agentAlphaPercentage}%` }}
          />
          <div 
            className="absolute top-0 h-full bg-red-500 transition-all duration-500 ease-out"
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
          <span className="text-base font-medium text-gray-700 dark:text-gray-300">Agent Beta</span>
          <span className="text-base font-semibold text-red-600 dark:text-red-400">{agentBetaPercentage}%</span>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"> {/* Increased font size for legend */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Agent Alpha</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Agent Beta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded"></div>
          <span>Undecided</span>
        </div>
      </div>

      {selectedVote && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg"> {/* Adjusted padding and colors */}
          <div className="text-center">
            <span className="text-base font-medium text-blue-900 dark:text-blue-100">Your vote: </span>
            <span className="text-base text-blue-700 dark:text-blue-300 font-semibold">{getVoteLabel(selectedVote)}</span>
          </div>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Total votes: {totalVotes}
      </div>
    </div>
  );
};

interface DebateArenaPageProps {
    prompt: string;
    onBack: () => void;
}

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

    const intervalA = streamText(agentResponses.agentA, setDisplayedA, () => setStreamingA(false))
    const intervalB = streamText(agentResponses.agentB, setDisplayedB, () => setStreamingB(false))

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

  const handleVote = (vote: string) => {
    setSelectedVote(vote)
  }

  const handleVoteHover = (vote: string | null) => {
    setHoverVote(vote)
  }

  const getCardHighlight = () => {
    // If hovering over a vote button, show hover effects
    if (hoverVote) {
      if (hoverVote === 'left') return { agentA: 'green' as const, agentB: 'red' as const };
      if (hoverVote === 'right') return { agentA: 'red' as const, agentB: 'green' as const };
      if (hoverVote === 'bad') return { agentA: 'red' as const, agentB: 'red' as const };
      if (hoverVote === 'tie') return { agentA: null, agentB: null };
    }
    
    // If a vote is selected, show selection effects
    if (selectedVote === 'left') return { agentA: 'green' as const, agentB: null };
    if (selectedVote === 'right') return { agentA: null, agentB: 'green' as const };
    if (selectedVote === 'bad') return { agentA: 'red' as const, agentB: 'red' as const };
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
            </div>
          </div>
          <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Leave Feedback
              </Button>
          </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8"> {/* Adjusted padding */}
        {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg text-center mb-6">
                <p><strong className="text-red-900 dark:text-red-100">Error:</strong> {error}</p>
                <p className="text-sm mt-2">Please ensure the backend server is running and accessible.</p>
            </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AssistantPanel 
            title="Agent Alpha (Pro)" 
            content={displayedA} 
            streaming={streamingA} 
            showQuestion={false} 
            isLoading={loading}
            isHighlighted={!!cardHighlight.agentA}
            highlightType={cardHighlight.agentA}
          />
          <AssistantPanel 
            title="Agent Beta (Con)" 
            content={displayedB} 
            streaming={streamingB} 
            showQuestion={false} 
            isLoading={loading}
            isHighlighted={!!cardHighlight.agentB}
            highlightType={cardHighlight.agentB}
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
                Agent Alpha Won
              </VoteButton>
              <VoteButton 
                onClick={() => handleVote("right")} 
                isSelected={false} 
                icon={ThumbsUp}
                onHover={handleVoteHover}
                voteType="right"
              >
                Agent Beta Won
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
              <VotingPoll selectedVote={selectedVote} />
            </div>
        )}
        <div className="max-w-3xl mx-auto relative">
            <Input
                placeholder="Ask a follow-up question..."
                className="w-full h-14 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-6 pr-14 text-base focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 shadow-sm dark:shadow-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                <Button size="icon" variant="default" className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg shadow-md"> {/* Gradient button */}
                    <ArrowRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </footer>
    </div>
  )
}