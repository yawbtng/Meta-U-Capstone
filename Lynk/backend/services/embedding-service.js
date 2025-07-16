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


// Generate embeddings for a connection's profile
export async function generateConnectionEmbedding(connectionProfile, model = 'togethercomputer/e5-mistral-7b-instruct') {
    try {
      // Validate connection profile
      const validation = validateProfileForEmbedding(connectionProfile, 'connection');
      if (!validation.success) {
        return { success: false, error: validation.error };
      }
  
      // Compose text for embedding
      const profileText = composeProfileText(connectionProfile);
      
      // Generate embedding
      const embedding = await generateEmbedding(profileText, model);
      
      return { 
        success: true, 
        embedding,
        profileText // Return for debugging/logging
      };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to generate connection embedding: ${error.message}` 
      };
    }
  }


  // Generate embeddings for a batch of user profiles
export async function generateUserEmbeddingsBatch(userProfiles, model = 'togethercomputer/e5-mistral-7b-instruct') {
    try {
      if (!Array.isArray(userProfiles) || userProfiles.length === 0) {
        return { success: false, error: 'User profiles array is required and cannot be empty' };
      }
  
      // Filter and validate profiles
      const validProfiles = [];
      const invalidProfiles = [];
      
      for (let i = 0; i < userProfiles.length; i++) {
        const profile = userProfiles[i];
        const validation = validateProfileForEmbedding(profile, 'user');
        
        if (validation.success) {
          validProfiles.push({ profile, index: i });
        } else {
          invalidProfiles.push({ profile, index: i, error: validation.error });
        }
      }
  
      if (validProfiles.length === 0) {
        return { 
          success: false, 
          error: 'No valid user profiles found for embedding generation',
          invalidProfiles 
        };
      }
  
      // Compose texts for valid profiles
      const profileTexts = validProfiles.map(({ profile }) => composeProfileText(profile));
      
      // Generate embeddings in batch
      const embeddings = await generateEmbeddingsBatch(profileTexts, model);
      
      // Map results back to original indices
      const results = new Array(userProfiles.length);
      validProfiles.forEach(({ index }, batchIndex) => {
        results[index] = {
          success: true,
          embedding: embeddings[batchIndex],
          profileText: profileTexts[batchIndex]
        };
      });
      
      invalidProfiles.forEach(({ index, error }) => {
        results[index] = {
          success: false,
          error: `Invalid profile: ${error}`
        };
      });
  
      return { 
        success: true, 
        results,
        summary: {
          total: userProfiles.length,
          successful: validProfiles.length,
          failed: invalidProfiles.length
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to generate user embeddings batch: ${error.message}` 
      };
    }
  }

// Generate embeddings for multiple connection profiles
export async function generateConnectionEmbeddingsBatch(connectionProfiles, model = 'togethercomputer/e5-mistral-7b-instruct') {
    try {
      if (!Array.isArray(connectionProfiles) || connectionProfiles.length === 0) {
        return { success: false, error: 'Connection profiles array is required and cannot be empty' };
      }
  
      // Filter and validate profiles
      const validProfiles = [];
      const invalidProfiles = [];
      
      for (let i = 0; i < connectionProfiles.length; i++) {
        const profile = connectionProfiles[i];
        const validation = validateProfileForEmbedding(profile, 'connection');
        
        if (validation.success) {
          validProfiles.push({ profile, index: i });
        } else {
          invalidProfiles.push({ profile, index: i, error: validation.error });
        }
      }
  
      if (validProfiles.length === 0) {
        return { 
          success: false, 
          error: 'No valid connection profiles found for embedding generation',
          invalidProfiles 
        };
      }
  
      // Compose texts for valid profiles
      const profileTexts = validProfiles.map(({ profile }) => composeProfileText(profile));
      
      // Generate embeddings in batch
      const embeddings = await generateEmbeddingsBatch(profileTexts, model);
      
      // Map results back to original indices
      const results = new Array(connectionProfiles.length);
      validProfiles.forEach(({ index }, batchIndex) => {
        results[index] = {
          success: true,
          embedding: embeddings[batchIndex],
          profileText: profileTexts[batchIndex]
        };
      });
      
      invalidProfiles.forEach(({ index, error }) => {
        results[index] = {
          success: false,
          error: `Invalid profile: ${error}`
        };
      });
  
      return { 
        success: true, 
        results,
        summary: {
          total: connectionProfiles.length,
          successful: validProfiles.length,
          failed: invalidProfiles.length
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to generate connection embeddings batch: ${error.message}` 
      };
    }
}




export { composeProfileText, validateProfileForEmbedding };