import { useState, useEffect } from 'react'
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
import { Lightbulb, Target, Heart, MessageCircle, Calendar, Sparkles, RefreshCw } from "lucide-react"

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

  useEffect(() => {
    if (open && contact && !guidance) {
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

  const formatMarkdown = (text) => {
    if (!text) return null

    // Split by markdown headers
    const sections = text.split(/(## .*)/)
    return sections.map((section, index) => {
      if (section.startsWith('## ')) {
        // This is a header
        const headerText = section.replace('## ', '')
        return (
          <div key={index} className="mt-8 mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              {getIconForSection(headerText)}
              {headerText}
            </h3>
          </div>
        )
      } else if (section.trim()) {
        // This is content
        return (
          <div key={index} className="text-gray-700 leading-relaxed mb-4">
            {section.split('\n').map((line, lineIndex) => {
              const trimmedLine = line.trim()
              if (trimmedLine.startsWith('- ')) {
                // Bullet point
                return (
                  <div key={lineIndex} className="flex items-start gap-2 mb-2">
                    <span className="text-gray-400 mt-2">•</span>
                    <span>{trimmedLine.substring(2)}</span>
                  </div>
                )
              } else if (trimmedLine) {
                return (
                  <p key={lineIndex} className="mb-2">
                    {trimmedLine}
                  </p>
                )
              }
              return null
            })}
          </div>
        )
      }
      return null
    })
  }

  const getIconForSection = (section) => {
    const lowerSection = section.toLowerCase()
    if (lowerSection.includes('immediate') || lowerSection.includes('action')) {
      return <Target className="w-5 h-5 text-blue-500" />
    } else if (lowerSection.includes('strategy') || lowerSection.includes('building')) {
      return <Sparkles className="w-5 h-5 text-purple-500" />
    } else if (lowerSection.includes('value') || lowerSection.includes('proposition')) {
      return <Heart className="w-5 h-5 text-red-500" />
    } else if (lowerSection.includes('communication') || lowerSection.includes('approach')) {
      return <MessageCircle className="w-5 h-5 text-green-500" />
    } else if (lowerSection.includes('follow') || lowerSection.includes('plan')) {
      return <Calendar className="w-5 h-5 text-orange-500" />
    }
    return <Lightbulb className="w-5 h-5 text-yellow-500" />
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-gray-200">
          <SheetTitle className="text-2xl font-bold text-gray-900">
            Relationship Guidance
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            AI-powered suggestions to strengthen your relationship with {contact?.name}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-gray-600 text-center">
                Analyzing your relationship with {contact?.name}...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={generateGuidance} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {guidance && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  💡 Personalized Guidance for {contact?.name}
                </h4>
                <p className="text-sm text-gray-600">
                  Based on your relationship context and shared interests
                </p>
              </div>

              <div className="max-w-none">
                {formatMarkdown(guidance)}
              </div>

              {isGenerating && (
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-4">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating suggestions...
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button 
                  onClick={handleRefresh} 
                  variant="outline" 
                  className="w-full"
                  disabled={isGenerating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate New Suggestions'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 