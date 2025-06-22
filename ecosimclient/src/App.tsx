import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Mic, Trophy, ChevronDown, Play, MessageSquare, Users, Volume2, Moon, Sun, X, Info, ExternalLink } from "lucide-react";
import DebateArenaPage from "@/pages/DebateArena";

// Add type declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function PolicyPulse() {
  const [debateStarted, setDebateStarted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [debateLength, setDebateLength] = useState("Full Debate (5 minutes)");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleStartDebate = () => {
    if (prompt.trim()) {
      setDebateStarted(true);
    }
  };

  const handleEndDebate = () => {
    setDebateStarted(false);
    setPrompt("");
  };

  const handleTopicClick = (topic: string) => {
    setPrompt(topic);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const handleDebateLengthSelect = (length: string) => {
    setDebateLength(length);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send feedback to your backend
    alert('Thank you for your feedback! We\'ll review it shortly.');
    setShowFeedback(false);
  };

  if (debateStarted) {
    return <DebateArenaPage prompt={prompt} onBack={handleEndDebate} />;
  }
  
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-neutral-50 dark:bg-[#1D1D20] text-gray-900 dark:text-gray-100">
          {/* Top Navigation */}
          <header className="flex items-center justify-between p-4 bg-white/80 dark:bg-[#1D1D20]/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 ${isListening ? 'bg-red-100 dark:bg-red-900' : ''}`}
                onClick={handleVoiceInput}
                title="Voice input"
              >
                <Mic className={`h-4 w-4 ${isListening ? 'text-red-600 dark:text-red-400' : ''}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowLeaderboard(true)}
                title="Leaderboard"
              >
                <Trophy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="font-medium">🎭 Debate</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
                  <DropdownMenuItem 
                    className="dark:hover:bg-gray-700 dark:text-gray-200"
                    onClick={() => setPrompt("")}
                  >
                    Start New Debate
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="dark:hover:bg-gray-700 dark:text-gray-200"
                    onClick={() => alert('Previous debates feature coming soon!')}
                  >
                    Watch Previous Debates
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="dark:hover:bg-gray-700 dark:text-gray-200"
                    onClick={() => alert('Debate history feature coming soon!')}
                  >
                    Debate History
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="ghost" 
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowFeedback(true)}
              >
                Leave Feedback
              </Button>
              
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleDarkMode}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </header>

          {/* Welcome Notice */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-800 px-4 py-2 text-center text-sm text-blue-700 dark:text-blue-300">
            🎉 Welcome to PolicyPulse! AI agents debate policies to help you understand complex issues.
          </div>

          {/* Main Content */}
          <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-12">
            <div className="w-full max-w-4xl text-center space-y-10">
              {/* Logo and Branding */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-2xl font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      P
                    </div>
                    <span className="text-gray-900 dark:text-gray-100">PolicyPulse</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
                  The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">AI Policy Debate Arena</span>
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Transform complex policies into engaging debates. Two AI agents argue different sides, <br className="hidden md:block" />
                  helping you understand intricate issues from multiple perspectives.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-5 py-2"
                  onClick={() => setShowLeaderboard(true)}
                >
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Leaderboard
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-5 py-2"
                  onClick={() => setShowHowItWorks(true)}
                >
                  <MessageSquare className="h-4 w-4 text-emerald-500" />
                  How it works
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-5 py-2"
                  onClick={() => window.open('https://github.com/bradenstitt/EcoSim', '_blank')}
                >
                  <Users className="h-4 w-4 text-purple-500" />
                  View on GitHub
                </Button>
              </div>

              {/* Policy Input Interface */}
              <div className="w-full max-w-3xl mx-auto space-y-4 pt-4">
                <div className="relative">
                  <Input
                    placeholder="Enter a policy or topic to debate (e.g., 'Should we have universal healthcare?')"
                    className="w-full h-16 text-lg px-6 pr-32 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl shadow-md dark:shadow-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleStartDebate()}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className={`h-9 w-9 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full ${isListening ? 'bg-red-100 dark:bg-red-900' : ''}`}
                      onClick={handleVoiceInput}
                      title="Voice input"
                    >
                      <Volume2 className={`h-4 w-4 ${isListening ? 'text-red-600 dark:text-red-400' : ''}`} />
                    </Button>
                    <Button 
                      className="gap-2 h-10 px-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 rounded-lg shadow-md"
                      onClick={handleStartDebate}
                    >
                      <Play className="h-4 w-4" />
                      Start Debate
                    </Button>
                  </div>
                </div>
                
                {/* Example Topics */}
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  <p className="mb-2">Popular debate topics:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="text-xs h-8 px-3 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 border-0"
                      onClick={() => handleTopicClick("Should we implement Universal Basic Income?")}
                    >
                      Universal Basic Income
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="text-xs h-8 px-3 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-300 border-0"
                      onClick={() => handleTopicClick("What policies should we implement to address climate change?")}
                    >
                      Climate Change Policy
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="text-xs h-8 px-3 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-300 border-0"
                      onClick={() => handleTopicClick("Should we implement stricter gun control laws?")}
                    >
                      Gun Control
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="text-xs h-8 px-3 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-300 border-0"
                      onClick={() => handleTopicClick("How should we reform the education system?")}
                    >
                      Education Reform
                    </Button>
                  </div>
                </div>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-none">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mb-4 mx-auto shadow-inner dark:shadow-none">
                    <Mic className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 text-center">AI Voices</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Listen to AI agents debate with natural, high-quality voices powered by LMNT.</p>
                </div>
                
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-none">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mb-4 mx-auto shadow-inner dark:shadow-none">
                    <MessageSquare className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 text-center">Smart Arguments</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Powered by Google Gemini, our AI agents generate compelling, fact-based arguments.</p>
                </div>
                
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-none">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center mb-4 mx-auto shadow-inner dark:shadow-none">
                    <Trophy className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 text-center">Vote & Learn</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Vote on who made the better argument and see how others voted on similar topics.</p>
                </div>
              </div>
            </div>
          </main>

          {/* Modals */}
          {showLeaderboard && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">🏆 Leaderboard</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowLeaderboard(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🥇</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Climate Change Debate</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">1,234 votes</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🥈</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Universal Basic Income</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">987 votes</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🥉</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Gun Control Laws</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">756 votes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showHowItWorks && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">ℹ️ How PolicyPulse Works</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowHowItWorks(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Enter a Policy Topic</h3>
                      <p>Type or speak your policy question. You can use voice input by clicking the microphone button.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-semibold text-sm">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI Agents Debate</h3>
                      <p>Two AI agents with different perspectives will argue for and against your policy, using Google Gemini for intelligent arguments.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold text-sm">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Listen & Vote</h3>
                      <p>Listen to the debate with natural AI voices powered by LMNT, then vote on which argument was more convincing.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-950 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 font-semibold text-sm">4</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Learn & Share</h3>
                      <p>See how others voted and gain insights from multiple perspectives on complex policy issues.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showFeedback && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">💬 Leave Feedback</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowFeedback(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Feedback</label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                      rows={4}
                      placeholder="Tell us what you think about PolicyPulse..."
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      Submit Feedback
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowFeedback(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}