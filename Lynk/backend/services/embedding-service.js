import { generateEmbedding, generateEmbeddingsBatch } from "./together-ai-client.js";

// Setting up profile text for embedding
function composeProfileText(profile) {
    // Extract relevant profile information from object
    const {role = '', company = '', location = '', interests = []} = profile;

    // Convert interests array into space-separated string
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
      return { success: false, error: `${profileType} profile is required` };
    }
  
    if (typeof profile !== 'object') {
      return { success: false, error: `${profileType} profile must be an object` };
    }
  
    const { role, company, location, interests } = profile;
    
    // Validate individual fields
    const fieldValidations = [];
    
    if (role !== undefined && role !== null && typeof role !== 'string') {
      fieldValidations.push('role must be a string');
    }
    
    if (company !== undefined && company !== null && typeof company !== 'string') {
      fieldValidations.push('company must be a string');
    }
    
    if (location !== undefined && location !== null && typeof location !== 'string') {
      fieldValidations.push('location must be a string');
    }
    
    if (interests !== undefined && interests !== null && !Array.isArray(interests)) {
      fieldValidations.push('interests must be an array');
    }
    
    if (interests && Array.isArray(interests)) {
      const invalidInterests = interests.filter(interest => 
        typeof interest !== 'string' || interest.trim().length === 0
      );
      if (invalidInterests.length > 0) {
        fieldValidations.push('interests array must contain non-empty strings');
      }
    }
    
    if (fieldValidations.length > 0) {
      return { 
        success: false, 
        error: `${profileType} profile validation failed: ${fieldValidations.join(', ')}` 
      };
    }
    
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

// Prepare metadata for user profile vector storage
export function prepareUserMetadata(userProfile) {
    const { id, name, email } = userProfile;
    
    if (!id) {
      throw new Error('User ID is required for metadata preparation');
    }
    
    return {
      id: id,
      name: name || 'Unknown User',
      email: email || '',
      type: 'user',
      created_at: new Date().toISOString()
    };
}

// Prepare metadata for connection profile vector storage
export function prepareConnectionMetadata(connectionProfile, userIds) {
    const { id, name, email } = connectionProfile;
    
    if (!id) {
      throw new Error('Connection ID is required for metadata preparation');
    }
    
    if (!userIds) {
      throw new Error('User ID(s) are required for connection metadata preparation');
    }
    
    const userIdArray = Array.isArray(userIds) ? userIds : [userIds];
    
    if (userIdArray.length === 0) {
      throw new Error('At least one user ID is required for connection metadata preparation');
    }
    
    return {
      id: id,
      name: name || 'Unknown Connection',
      email: email || '',
      type: 'connection',
      user_ids: userIdArray, // Array of user IDs for many-to-many relationships
      created_at: new Date().toISOString()
    };
}

// Setting up vector point for storage
export function createVectorPoint(embedding, metadata) {
    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error('Valid embedding array is required');
    }
    
    // Add dimension validation for e5-mistral-7b-instruct (1536 dimensions)
    if (embedding.length !== 1536) {
      throw new Error(`Expected embedding dimension 1536, got ${embedding.length}`);
    }
    
    if (!metadata || !metadata.id) {
      throw new Error('Valid metadata with ID is required');
    }
    
    return {
      id: metadata.id,
      vector: embedding,
      payload: metadata
    };
}

// Validate vector point for storage
export function validateVectorPoint(vectorPoint) {
    if (!vectorPoint) {
      return { success: false, error: 'Vector point is required' };
    }
    
    if (!vectorPoint.id) {
      return { success: false, error: 'Vector point must have an ID' };
    }
    
    if (!Array.isArray(vectorPoint.vector) || vectorPoint.vector.length === 0) {
      return { success: false, error: 'Vector point must have a valid embedding array' };
    }
    
    if (!vectorPoint.payload) {
      return { success: false, error: 'Vector point must have payload metadata' };
    }
    
    if (!vectorPoint.payload.type || !['user', 'connection'].includes(vectorPoint.payload.type)) {
      return { success: false, error: 'Vector point payload must have valid type (user or connection)' };
    }
    
    return { success: true };
}


export { composeProfileText, validateProfileForEmbedding };