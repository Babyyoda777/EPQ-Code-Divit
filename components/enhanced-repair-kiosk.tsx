'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircleIcon, WrenchIcon, CodeIcon, ClipboardListIcon, UploadIcon, DownloadIcon, PlayIcon, BellIcon, PackageIcon, MessageSquareIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"


export function EnhancedRepairKiosk() {
  const [projects, setProjects] = useState([
    { id: 1, name: "iPhone 12 Screen Repair", status: "In Progress", type: "hardware", progress: 60, customer: "John Doe", priority: "high" },
    { id: 2, name: "MacBook Pro Battery Replacement", status: "Waiting for Parts", type: "hardware", progress: 20, customer: "Jane Smith", priority: "medium" },
    { id: 3, name: "Samsung Galaxy S21 Software Debug", status: "Code Analysis", type: "software", progress: 40, customer: "Bob Johnson", priority: "low" },
  ])
  const [selectedProject, setSelectedProject] = useState(projects[0].id)
  const [newProject, setNewProject] = useState({ name: "", type: "hardware", customer: "", priority: "medium" })
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [aiGeneratedCode, setAiGeneratedCode] = useState<string | null>(null)
  const [codeEditorContent, setCodeEditorContent] = useState("// Your code here")
  const [codeOutput, setCodeOutput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New part arrived for MacBook Pro repair", read: false },
    { id: 2, message: "Customer requested update on iPhone 12 repair", read: false },
  ])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inventory, setInventory] = useState([
    { id: 1, name: "iPhone 12 Screen", quantity: 5 },
    { id: 2, name: "MacBook Pro Battery", quantity: 2 },
    { id: 3, name: "Samsung Galaxy S21 Logic Board", quantity: 1 },
  ])
  const [customerMessages, setCustomerMessages] = useState([
    { id: 1, customer: "John Doe", message: "Any update on my iPhone repair?", read: false },
    { id: 2, customer: "Jane Smith", message: "When will the new battery arrive?", read: true },
  ])
  const [currentStep, setCurrentStep] = useState(0)
  const [isWorkspaceOptionsOpen, setIsWorkspaceOptionsOpen] = useState(true)
  const [activeWorkspace, setActiveWorkspace] = useState("guide")
  const stepSelectorRef = useRef<HTMLDivElement>(null)

  const addProject = () => {
    if (newProject.name && newProject.customer) {
      const newProjectItem = { 
        id: projects.length + 1, 
        name: newProject.name, 
        status: "New", 
        type: newProject.type, 
        progress: 0, 
        customer: newProject.customer,
        priority: newProject.priority
      }
      setProjects([...projects, newProjectItem])
      setSelectedProject(newProjectItem.id)
      setNewProject({ name: "", type: "hardware", customer: "", priority: "medium" })
    }
  }

  const simulateFileUpload = () => {
    setTimeout(() => setUploadedFile("user_code.js"), 1000)
  }

  const simulateCodeDownload = () => {
    setAiGeneratedCode("Generating...")
    setTimeout(() => setAiGeneratedCode("ai_suggestion.js"), 2000)
  }

  const simulateCodeRun = () => {
    setCodeOutput("Running...")
    setTimeout(() => setCodeOutput("Code executed successfully!\nOutput: Hello, Repair Shop!"), 1500)
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.customer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRepairSteps = (projectName: string) => {
    if (projectName.includes("iPhone")) {
      return [
        { id: "step1", title: "Preparation", content: "Power off the iPhone 12 and gather all necessary tools: screwdriver set, suction cup, pry tool, and new screen assembly." },
        { id: "step2", title: "Remove Screws", content: "Remove the two pentalobe screws at the bottom of the iPhone using the appropriate screwdriver." },
        { id: "step3", title: "Separate Screen", content: "Use the suction cup to lift the screen slightly, then use the pry tool to carefully separate the screen from the body." },
        { id: "step4", title: "Disconnect Battery", content: "Locate and disconnect the battery connector to prevent any short circuits during the repair process." },
        { id: "step5", title: "Remove Display", content: "Disconnect the display cables and remove the old screen assembly from the iPhone body." },
      ]
    } else if (projectName.includes("MacBook")) {
      return [
        { id: "step1", title: "Preparation", content: "Shut down the MacBook Pro and unplug all cables. Gather necessary tools: screwdriver set and replacement battery." },
        { id: "step2", title: "Remove Bottom Case", content: "Remove the screws securing the bottom case and carefully lift it off." },
        { id: "step3", title: "Disconnect Battery", content: "Locate the battery connector on the logic board and carefully disconnect it." },
        { id: "step4", title: "Remove Battery", content: "Remove the screws securing the battery and carefully lift it out of the MacBook." },
        { id: "step5", title: "Install New Battery", content: "Place the new battery in the MacBook and secure it with the screws." },
      ]
    } else {
      return [
        { id: "step1", title: "Identify Issue", content: "Run diagnostics to identify the specific software issue on the Samsung Galaxy S21." },
        { id: "step2", title: "Backup Data", content: "Perform a full backup of the device data before proceeding with any software changes." },
        { id: "step3", title: "Update Software", content: "Check for and install any available system updates that might resolve the issue." },
        { id: "step4", title: "Clear Cache", content: "Clear the cache partition to remove temporary files that might be causing issues." },
        { id: "step5", title: "Factory Reset", content: "If previous steps don't resolve the issue, perform a factory reset as a last resort." },
      ]
    }
  }

  const selectedProjectDetails = projects.find(p => p.id === selectedProject)
  const repairSteps = selectedProjectDetails ? getRepairSteps(selectedProjectDetails.name) : []

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markMessageAsRead = (id: number) => {
    setCustomerMessages(customerMessages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ))
  }

  const unreadNotificationsCount = notifications.filter(n => !n.read).length
  const unreadMessagesCount = customerMessages.filter(m => !m.read).length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleStepChange = (direction: 'prev' | 'next') => {
    if (direction === 'next' && currentStep < repairSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else if (direction === 'prev' && currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (stepSelectorRef.current && stepSelectorRef.current.contains(e.target as Node)) {
        if (e.deltaY > 0 && currentStep < repairSteps.length - 1) {
          setCurrentStep(currentStep + 1)
        } else if (e.deltaY < 0 && currentStep > 0) {
          setCurrentStep(currentStep - 1)
        }
      }
    }

    window.addEventListener('wheel', handleWheel)
    return () => window.removeEventListener('wheel', handleWheel)
  }, [currentStep, repairSteps.length])

  const renderWorkspaceContent = () => {
    switch (activeWorkspace) {
      case "guide":
        return (
          <div className="p-4 border rounded mt-4">
            <h3 className="font-bold mb-4 text-sm sm:text-base">{selectedProjectDetails?.name} Guide</h3>
            <div className="flex justify-between mb-4">
              <Button onClick={() => handleStepChange('prev')} disabled={currentStep === 0}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <span>Step {currentStep + 1} of {repairSteps.length}</span>
              <Button onClick={() => handleStepChange('next')} disabled={currentStep === repairSteps.length - 1}>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6">
              {repairSteps.map((step, index) => (
                <div key={step.id} className={index === currentStep ? '' : 'hidden'}>
                  <div className="p-4 border rounded">
                    <h4 className="font-bold mb-2 text-sm">{step.title}</h4>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <p className="text-sm">{step.content}</p>
                      </div>
                      <div className="flex-1">
                        <Image
                          src={`/placeholder.svg?height=200&width=300`}
                          alt={`Illustration for ${step.title}`}
                          width={300}
                          height={200}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case "code":
        return (
          <div className="p-4 border rounded mt-4 space-y-4">
            <h3 className="font-bold mb-2 text-sm sm:text-base">Code Editor</h3>
            <Textarea
              value={codeEditorContent}
              onChange={(e) => setCodeEditorContent(e.target.value)}
              placeholder="Type your code here..."
              className="font-mono h-[200px] text-sm"
            />
            <div className="flex justify-between items-center">
              <Button onClick={simulateCodeRun} size="sm">
                <PlayIcon className="mr-2 h-4 w-4" /> Run Code
              </Button>
              <span className="text-xs sm:text-sm text-muted-foreground">Language: JavaScript</span>
            </div>
            {codeOutput && (
              <div className="mt-4 p-2 bg-muted rounded">
                <h4 className="font-bold mb-2 text-sm">Output:</h4>
                <pre className="whitespace-pre-wrap text-xs sm:text-sm">{codeOutput}</pre>
              </div>
            )}
          </div>
        )
      case "ai":
        return (
          <div className="p-4 border rounded mt-4">
            <h3 className="font-bold mb-2 text-sm sm:text-base">AI Assistant</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button onClick={simulateFileUpload} size="sm">
                  <UploadIcon className="mr-2 h-4 w-4" /> Upload Code
                </Button>
                {uploadedFile && <span className="text-xs sm:text-sm text-muted-foreground">Uploaded: {uploadedFile}</span>}
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={simulateCodeDownload} disabled={!uploadedFile} size="sm">
                  <DownloadIcon className="mr-2 h-4 w-4" /> Get AI Suggestion
                </Button>
                {aiGeneratedCode && <span className="text-xs sm:text-sm text-muted-foreground">
                  {aiGeneratedCode === "Generating..." ? aiGeneratedCode : `Generated: ${aiGeneratedCode}`}
                </span>}
              </div>
              <p className="text-xs sm:text-sm">AI-powered suggestions and code iterations will be displayed in this area.</p>
            </div>
          </div>
        )
      case "inventory":
        return (
          <div className="p-4 border rounded mt-4">
            <h3 className="font-bold mb-2 text-sm sm:text-base">Parts Inventory</h3>
            <div className="space-y-4">
              {inventory.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm">{item.name}</span>
                  <Badge variant={item.quantity > 0 ? "default" : "destructive"} className="text-xs">
                    {item.quantity} in stock
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4 bg-background">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Repair Shop Kiosk</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <div className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="w-10 h-10 relative">
                  <BellIcon className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">{unreadNotificationsCount}</span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-white">
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                  <SheetDescription>Recent updates and alerts</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-10rem)] mt-4">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-2 ${notif.read ? 'opacity-50' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`rounded-full p-2 ${notif.read ? 'bg-green-500' : 'bg-gray-500'}`}
                        >
                          <BellIcon className="h-6 w-6" />
                        </button>
                        <span>{notif.message}</span>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="w-10 h-10 relative">
                <MessageSquareIcon className="h-5 w-5" />
                {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">{unreadMessagesCount}</span>
                )}
                <span className="sr-only">Customer Messages</span>
              </Button>
              </SheetTrigger>
              <SheetContent className="bg-white">
              <SheetHeader>
                <SheetTitle>Customer Communication</SheetTitle>
                <SheetDescription>Recent messages from customers</SheetDescription>
              </SheetHeader>
                <ScrollArea className="h-[calc(100vh-10rem)] mt-4">
                  {customerMessages.map((msg) => (
                    <div key={msg.id} className={`p-2 ${msg.read ? 'opacity-50' : ''}`} onClick={() => markMessageAsRead(msg.id)}>
                      <div className="flex items-center space-x-2">
                        {!msg.read && (
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        <Avatar>
                          <AvatarFallback>{msg.customer[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{msg.customer}</p>
                          <p className="text-sm text-muted-foreground">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusCircleIcon className="mr-2 h-4 w-4" /> New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>Enter the details for your new repair project.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project-name" className="text-right">Project Name</Label>
                    <Input
                      id="project-name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project-type" className="text-right">Type</Label>
                    <select
                      id="project-type"
                      value={newProject.type}
                      onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                      className="col-span-3 p-2 border rounded"
                    >
                      <option value="hardware">Hardware</option>
                      <option value="software">Software</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer-name" className="text-right">Customer Name</Label>
                    <Input
                      id="customer-name"
                      value={newProject.customer}
                      onChange={(e) => setNewProject({ ...newProject, customer: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project-priority" className="text-right">Priority</Label>
                    <select
                      id="project-priority"
                      value={newProject.priority}
                      onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                      className="col-span-3 p-2 border rounded"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option> 
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button onClick={() => { addProject() }}>Create Project</Button>
                  </DialogClose>  
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Overview of active projects and tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className={`cursor-pointer hover:bg-accent transition-colors ${project.id === selectedProject ? 'bg-accent' : ''}`} 
                  onClick={() => setSelectedProject(project.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <CardTitle className="text-base sm:text-lg line-clamp-2">{project.name}</CardTitle>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)} flex-shrink-0`} title={`Priority: ${project.priority}`} />
                    </div>
                    <CardDescription className="text-sm line-clamp-1">{project.customer}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant={project.status === "In Progress" ? "default" : "secondary"} className="text-xs whitespace-nowrap">
                        {project.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{project.progress}% complete</span>
                    </div>
                    <Progress value={project.progress} className="w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Workspace</CardTitle>
            <CardDescription>Access repair guides and AI assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="md:hidden">
              <Collapsible open={isWorkspaceOptionsOpen} onOpenChange={setIsWorkspaceOptionsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="flex justify-between w-full mb-4">
                    Workspace Options
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isWorkspaceOptionsOpen ? 'transform rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mb-4">
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" className="justify-start" onClick={() => setActiveWorkspace("guide")}><WrenchIcon className="mr-2 h-4 w-4" /> Repair Guide</Button>
                    <Button variant="ghost" className="justify-start" onClick={() => setActiveWorkspace("code")}><CodeIcon className="mr-2 h-4 w-4" /> Code Editor</Button>
                    <Button variant="ghost" className="justify-start" onClick={() => setActiveWorkspace("ai")}><ClipboardListIcon className="mr-2 h-4 w-4" /> AI Assistant</Button>
                    <Button variant="ghost" className="justify-start" onClick={() => setActiveWorkspace("inventory")}><PackageIcon className="mr-2 h-4 w-4" /> Inventory</Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              {renderWorkspaceContent()}
            </div>
            <Tabs defaultValue="guide" className="hidden md:block" onValueChange={setActiveWorkspace}>
              <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="guide" className="bg-white"><WrenchIcon className="mr-2 h-4 w-4" /> Repair Guide</TabsTrigger>
              <TabsTrigger value="code" className="bg-white"><CodeIcon className="mr-2 h-4 w-4" /> Code Editor</TabsTrigger>
              <TabsTrigger value="ai" className="bg-white"><ClipboardListIcon className="mr-2 h-4 w-4" /> AI Assistant</TabsTrigger>
              <TabsTrigger value="inventory" className="bg-white"><PackageIcon className="mr-2 h-4 w-4" /> Inventory</TabsTrigger>
              </TabsList>
              <TabsContent value="guide">
              {renderWorkspaceContent()}
              </TabsContent>
              <TabsContent value="code">
              {renderWorkspaceContent()}
              </TabsContent>
              <TabsContent value="ai">
              {renderWorkspaceContent()}
              </TabsContent>
              <TabsContent value="inventory">
              {renderWorkspaceContent()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}