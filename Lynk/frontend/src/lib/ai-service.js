import { streamText, generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { google } from '@ai-sdk/google';

export async function generateRelationshipGuidanceStream(contact, userProfile) {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
    }

    const prompt = `
You are a relationship advisor helping someone strengthen their professional and personal connections. 

Based on the following contact information and relationship context, provide concise, actionable guidance on how the user can strengthen their relationship with this contact.

CONTACT INFORMATION:
- Name: ${contact.name}
- Company: ${contact.company || 'Not specified'}
- Role: ${contact.role || 'Not specified'}
- Industry: ${contact.industry || 'Not specified'}
- Location: ${contact.location || 'Not specified'}
- School: ${contact.school || 'Not specified'}
- Where met: ${contact.where_met || 'Not specified'}
- Interests: ${contact.interests?.join(', ') || 'Not specified'}
- Relationship type: ${contact.relationship_type?.join(', ') || 'Not specified'}
- Tags: ${contact.tags?.join(', ') || 'Not specified'}
- Connection score: ${contact.connection_score || 'Not specified'}
- Interactions count: ${contact.interactions_count || 'Not specified'}
- Last contact: ${contact.last_contact_at ? new Date(contact.last_contact_at).toLocaleDateString() : 'Not specified'}
- Notes: ${contact.notes || 'Not specified'}

USER PROFILE:
- Name: ${userProfile?.name || 'Not specified'}
- Industry: ${userProfile?.industry || 'Not specified'}
- Interests: ${userProfile?.interests?.join(', ') || 'Not specified'}

Please provide your guidance in the following structured format with clear markdown headers:

## Immediate Actions
Provide 2-3 specific, actionable steps they can take this week to strengthen the relationship.

## Relationship Building Strategies
Suggest 2-3 medium-term strategies to strengthen the connection.

## Value Proposition
Explain how they can provide value to this contact in 1-2 sentences.

## Communication Approach
Suggest 2-3 specific ways to reach out and maintain contact.

## Follow-up Plan
Provide a brief timeline and methods for staying connected.

Keep your advice concise, practical, and tailored to their relationship context. 
Focus on mutual value creation and genuine relationship building. 
Use clear markdown formatting.
Keep each section brief and to the point - avoid lengthy explanations.

IMPORTANT: Use Google Search to find current information about the contact's company, industry trends, recent news, 
interests or relevant events that could provide valuable context for relationship building. 
Search for recent developments, company updates, industry insights, or current events that 
could be conversation starters or value-add opportunities. Specify how the information
is relevant and how it can be used in a conversation.

If you find relevant current information through search, include it in your guidance and cite the sources.
`;

    const googleAI = createGoogleGenerativeAI({
      apiKey: apiKey,
    });
    
    // For tools, we need to use generateText instead of streamText
    const result = await generateText({
      model: googleAI('gemini-2.5-flash'),
      tools: {
        google_search: googleAI.tools.googleSearch({}),
      },
      prompt,
      temperature: 0.7,
      maxTokens: 8000,
    });

    console.log('Result:', result)
    
    // Extract sources from the result
    const sources = result.sources || [];
    console.log('Sources:', sources);

    // Return the result with sources
    return {
      text: result.text,
      sources,
      // Create a mock textStream for compatibility
      textStream: (async function* () {
        yield result.text;
      })(),
    };
  } catch (error) {
    console.error('Error generating relationship guidance:', error);
    throw new Error('Failed to generate relationship guidance');
  }
}
