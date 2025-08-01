import { useState, useEffect, memo, useRef } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { generateRelationshipGuidanceStream } from "@/lib/ai-service"
import { UserAuth } from "@/context/AuthContext"
import { Lightbulb, Sparkles, RefreshCw, Brain, Zap, GripVertical } from "lucide-react"
import ReactMarkdown from 'react-markdown'

// Memoized markdown component for better performance, with extra vertical spacing and larger text for readability
const MemoizedMarkdown = memo(({ content }) => {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-5 flex items-left gap-2">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold text-gray-800 mt-7 mb-3 flex items-left gap-2">
            {children}
          </h3>
        ),
        ul: ({ children }) => (
          <ul className="space-y-4 my-5 text-lg">
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-2 mb-2 text-lg">
            <span className="text-blue-500 mt-1">•</span>
            <span>{children}</span>
          </li>
        ),
        p: ({ children }) => (
          <p className="text-gray-700 leading-relaxed mb-5 text-lg">
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900 text-lg">
            {children}
          </strong>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
})

MemoizedMarkdown.displayName = 'MemoizedMarkdown'

export default function RelationshipGuidanceSheet({ 
  open, 
  onOpenChange, 
  contact, 
  userProfile 
}) {
  const [guidance, setGuidance] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [sheetWidth, setSheetWidth] = useState(600)
  const isResizing = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  useEffect(() => {
    if (open && contact) {
      // Clear previous guidance when a new contact is selected
      setGuidance('')
      setError('')
      setLoading(false)
      setIsGenerating(false)
      
      // Generate new guidance for the current contact
      generateGuidance()
    }
  }, [open, contact])

  const generateGuidance = async () => {
    if (!contact) return
    
    setLoading(true)
    setError('')
    setIsGenerating(true)
    setGuidance('')
    
    try {
      const result = await generateRelationshipGuidanceStream(contact, userProfile)
      
      // Stream the response using the correct AI SDK v5 pattern
      for await (const chunk of result.textStream) {
        setGuidance(prev => prev + chunk);
      }
    } catch (err) {
      setError('Failed to generate guidance. Please try again.')
      console.error('Error generating guidance:', err)
    } finally {
      setLoading(false)
      setIsGenerating(false)
    }
  }

  const handleRefresh = () => {
    setGuidance('')
    generateGuidance()
  }

  const handleMouseDown = (e) => {
    isResizing.current = true
    startX.current = e.clientX
    startWidth.current = sheetWidth
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const handleMouseMove = (e) => {
    if (!isResizing.current) return
    
    const deltaX = e.clientX - startX.current
    const newWidth = Math.max(500, Math.min(1200, startWidth.current + deltaX))
    setSheetWidth(newWidth)
  }

  const handleMouseUp = () => {
    isResizing.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [sheetWidth])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="p-0"
        style={{ width: `${sheetWidth}px`, maxWidth: '90vw', minWidth: '500px' }}
      >
        {/* Resize Handle */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize z-50"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <GripVertical className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white">
          <SheetHeader className="pb-4 border-b border-white/20 relative">
            <SheetTitle className="text-2xl font-bold flex items-center gap-3">
              <Brain className="w-6 h-6" />
              AI Relationship Guidance
            </SheetTitle>
            <SheetDescription className="text-white/90 mt-2">
              Personalized suggestions to strengthen your relationship with {contact?.name}
            </SheetDescription>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI Active</span>
            </div>
          </SheetHeader>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto scrollbar-hide">
          {loading && (
            <div className="flex flex-col items-center justify-center py-4 px-6">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-base font-semibold mb-1">Analyzing Your Relationship</h3>
                <p className="text-gray-600 text-sm max-w-md">
                  AI is analyzing your connection with {contact?.name}...
                </p>
              </div>
              <div className="mt-2 flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8 px-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Generation Failed</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button 
                  onClick={generateGuidance} 
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {guidance && (
            <div className="p-6">
              <div className="space-y-2">
                {/* Personalized Header */}
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        💡 Personalized Guidance for {contact?.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Based on your relationship context and shared interests
                      </p>
                    </div>
                  </div>
                </div>

                {/* Markdown Content */}
                <div className="prose-container">
                  <MemoizedMarkdown content={guidance} />
                </div>

                {/* Generating Indicator */}
                {isGenerating && (
                  <div className="flex items-center gap-3 text-gray-500 bg-gray-50 rounded-lg p-4">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Generating additional suggestions...</span>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-6 border-t border-gray-200">
                  <Button 
                    onClick={handleRefresh} 
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isGenerating}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate New Suggestions'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 