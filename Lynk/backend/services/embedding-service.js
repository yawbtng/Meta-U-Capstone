import { generateEmbedding, generateEmbeddingsBatch } from "./together-ai-client.js";

// Setting up profile text for embedding
function composeProfileText(profile) {
    // Extract relevant profile information from object
    const {role = '', company = '', location = '', interests = []} = profile;

    // Conger interests array into space-separated string
    const interestText = Array.isArray(interests) ? interests.join(' ') : '';

    // Input text in order of importance for similar matching
    const textParts = [
        role,
        company,
        location,
        interestText,
    ].filter(part => part && part.trim().length > 0);

    return textParts.join(' ').trim();
}


// Validate profile for embedding generation
function validateProfileForEmbedding(profile, profileType) {
    if (!profile) {
        return { success: false, error: `${profileType} profile is required`};
    }

    const { role, company, location, interests } = profile;
  
    // Check if we have at least some meaningful data to embed
    const hasRole = role && role.trim().length > 0;
    const hasCompany = company && company.trim().length > 0;
    const hasLocation = location && location.trim().length > 0;
    const hasInterests = interests && Array.isArray(interests) && interests.length > 0;
    
    if (!hasRole && !hasCompany && !hasLocation && !hasInterests) {
        return { 
        success: false, 
        error: `${profileType} profile must have at least one of: role, company, location, or interests` 
        };
    }
  
  return { success: true };
}

// Generate embeddings for a user's profile
export async function generateUserEmbedding(userProfile, model = 'togethercomputer/e5-mistral-7b-instruct') {
    try {

      const validation = validateProfileForEmbedding(userProfile, 'user');
      if (!validation.success) {
        return { success: false, error: validation.error };
      }
  

      const profileText = composeProfileText(userProfile);

      const embedding = await generateEmbedding(profileText, model);
      
      return { 
        success: true, 
        embedding,
        profileText // Return for debugging/logging
      };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to generate user embedding: ${error.message}` 
      };
    }
  }








export { composeProfileText, validateProfileForEmbedding };