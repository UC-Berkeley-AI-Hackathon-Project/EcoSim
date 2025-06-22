"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { ChevronDown, Plus, RotateCcw, Copy, Maximize2, ArrowLeft, ArrowRight, Circle, X, Bot, ThumbsUp, ThumbsDown } from "lucide-react"
import React from "react"
import { cn } from "@/lib/utils"

interface AssistantPanelProps {
  title: string;
  content: string;
  streaming: boolean;
  showQuestion: boolean;
  isLoading: boolean;
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({ title, content, streaming, showQuestion, isLoading }) => (
  <Card className="bg-black border border-blue-500/20 rounded-xl p-6 flex flex-col shadow-lg shadow-blue-500/5 min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bot className="text-blue-400" />
            {title}
          </h3>
          <div className="flex gap-1 text-zinc-400">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-800 hover:text-white">
                  <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-800 hover:text-white">
                  <Maximize2 className="h-4 w-4" />
              </Button>
          </div>
      </div>
      <div className="flex-grow space-y-4 text-zinc-300 font-light prose prose-invert prose-p:text-zinc-300 prose-strong:text-white leading-relaxed">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
                {content}
                {streaming && <span className="animate-pulse">▌</span>}
            </div>
          )}
      </div>
      {showQuestion && (
          <div className="mt-6 text-sm text-zinc-500 border-t border-zinc-800 pt-4">
              What's your pick, and why?
          </div>
      )}
  </Card>
);

interface VoteButtonProps {
    onClick: () => void;
    isSelected: boolean;
    children: React.ReactNode;
    icon: React.ElementType;
}

const VoteButton: React.FC<VoteButtonProps> = ({ onClick, isSelected, children, icon: Icon }) => (
  <Button
      variant="outline"
      className={cn(
        "gap-2 text-base font-normal h-12 px-6 rounded-full transition-all duration-200 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700 hover:text-white",
        isSelected && "bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
      )}
      onClick={onClick}
  >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
  </Button>
);

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

  // Fetch debate arguments from the backend
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

  // Simulate streaming text once data is fetched
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
      }, 20)
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
      setTimeout(() => setShowVoting(true), 1000)
    }
  }, [streamingA, streamingB])

  const handleVote = (vote: string) => {
    setSelectedVote(vote)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <header className="flex items-center justify-between p-4 border-b border-zinc-800 sticky top-0 bg-black/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-9 w-9 text-white bg-transparent border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-medium">PolicyPulse</h1>
          </div>
          <div className="flex-1 px-8">
            <div className="max-w-xl mx-auto text-center py-1.5 border border-zinc-800 rounded-full bg-zinc-900/50">
              <p className="text-sm text-zinc-300 truncate">{prompt}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-900">
                  Leave Feedback
              </Button>
          </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-8">
        {error && (
            <div className="bg-red-900/50 border border-red-500/30 text-red-300 p-4 rounded-lg text-center">
                <p><strong>Error:</strong> {error}</p>
                <p className="text-sm mt-2">Please ensure the backend server is running and accessible.</p>
            </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AssistantPanel title="Agent Alpha (Pro)" content={displayedA} streaming={streamingA} showQuestion={!streamingA && !streamingB && !error} isLoading={loading} />
          <AssistantPanel title="Agent Beta (Con)" content={displayedB} streaming={streamingB} showQuestion={false} isLoading={loading} />
        </div>
      </main>

      <footer className="sticky bottom-0 bg-black/50 backdrop-blur-md z-10 border-t border-zinc-800 p-4">
        {showVoting && (
            <div className="flex items-center justify-center gap-4 pb-6">
              <VoteButton onClick={() => handleVote("left")} isSelected={selectedVote === 'left'} icon={ThumbsUp}>Agent Alpha Won</VoteButton>
              <VoteButton onClick={() => handleVote("right")} isSelected={selectedVote === 'right'} icon={ThumbsUp}>Agent Beta Won</VoteButton>
              <VoteButton onClick={() => handleVote("tie")} isSelected={selectedVote === 'tie'} icon={Circle}>It's a Tie</VoteButton>
              <VoteButton onClick={() => handleVote("bad")} isSelected={selectedVote === 'bad'} icon={ThumbsDown}>Both were Bad</VoteButton>
            </div>
        )}
        <div className="max-w-3xl mx-auto relative">
            <Input
                placeholder="Ask a follow-up question..."
                className="w-full h-14 bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500 rounded-full pl-6 pr-14 text-base"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                <Button size="icon" variant="default" className="h-9 w-9 bg-blue-600 hover:bg-blue-700 rounded-full">
                    <ArrowRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </footer>
    </div>
  )
}
