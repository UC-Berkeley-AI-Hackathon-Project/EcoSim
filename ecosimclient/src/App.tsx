import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Mic, Trophy, ChevronDown, Play, MessageSquare, Users, Volume2 } from "lucide-react"

export default function PolicyPulse() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Top Navigation */}
          <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trophy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    🎭 Debate
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Start New Debate</DropdownMenuItem>
                  <DropdownMenuItem>Watch Previous Debates</DropdownMenuItem>
                  <DropdownMenuItem>Debate History</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost">Leave Feedback</Button>
            </div>
          </header>

          {/* Welcome Notice */}
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-center text-sm text-blue-800">
            🎉 Welcome to PolicyPulse! AI agents debate policies to help you understand complex issues.
          </div>

          {/* Main Content */}
          <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
            <div className="w-full max-w-4xl text-center space-y-8">
              {/* Logo and Branding */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-2xl font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      P
                    </div>
                    PolicyPulse
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">AI Debate Arena</h1>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Transform boring policies into engaging debates. Two AI agents argue different sides
                  <br />
                  so you can understand complex issues from multiple perspectives.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button variant="outline" className="gap-2 bg-white">
                  <Trophy className="h-4 w-4" />
                  Leaderboard
                </Button>
                <Button variant="outline" className="gap-2 bg-white">
                  <MessageSquare className="h-4 w-4" />
                  How it works
                </Button>
                <Button variant="outline" className="gap-2 bg-white">
                  <Users className="h-4 w-4" />
                  Join the Team
                </Button>
              </div>

              {/* Policy Input Interface */}
              <div className="w-full max-w-3xl mx-auto space-y-4">
                <div className="relative">
                  <Input
                    placeholder="Enter a policy or topic to debate (e.g., 'Should we have universal healthcare?')"
                    className="w-full h-16 text-lg px-6 pr-32 bg-white border-gray-300 rounded-xl shadow-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="gap-2 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
                          <Play className="h-4 w-4" />
                          Start Debate
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Quick Debate (2 minutes)</DropdownMenuItem>
                        <DropdownMenuItem>Full Debate (5 minutes)</DropdownMenuItem>
                        <DropdownMenuItem>Custom Length</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Example Topics */}
                <div className="text-sm text-gray-500">
                  <p className="mb-2">Popular debate topics:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                      Universal Basic Income
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                      Climate Change Policy
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                      Gun Control
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                      Education Reform
                    </Button>
                  </div>
                </div>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Mic className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI Voices</h3>
                  <p className="text-sm text-gray-600">Listen to AI agents debate with natural, high-quality voices powered by LMNT.</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Smart Arguments</h3>
                  <p className="text-sm text-gray-600">Powered by Google Gemini, our AI agents generate compelling, fact-based arguments.</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Vote & Learn</h3>
                  <p className="text-sm text-gray-600">Vote on who made the better argument and see how others voted on similar topics.</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
