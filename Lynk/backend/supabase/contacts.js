import { supabase } from '../browser-client.js';

const getDbColumnName = (columnId) => {
  const dbColumnMap = {
    'name': 'name',
    'email': 'email',
    'phone_number': 'phone_number',
    'socials_linkedin': 'socials->>linkedin',
    'socials_twitter': 'socials->>twitter',
    'socials_instagram': 'socials->>instagram',
    'relationship_type': 'relationship_type',
    'industry': 'industry',
    'company': 'company',
    'role': 'role',
    'last_contact_at': 'last_contact_at',
    'interactions_count': 'interactions_count',
    'tags': 'tags'
  };
  return dbColumnMap[columnId] || columnId;
};

export const fetchContacts = async (userId) => {
  try {
    // First get all user's connections with relationship data
    const { data: userConnections, error: userError } = await supabase
      .from('user_to_connections')
      .select(`
        where_met,
        notes,
        last_contact_at,
        interactions_count,
        relationship_type,
        tags,
        connection_score,
        added_at,
        updated_at,
        connection_id
      `)
      .eq('user_id', userId);

    if (userError) throw userError;
    if (userConnections.length === 0) return { success: true, data: [] };

    // Get all connection IDs
    const connectionIds = userConnections.map(row => row.connection_id);

    // Get connection details
    const { data: connections, error: connectionsError } = await supabase
      .from('connections')
      .select(`
        id,
        name,
        email,
        phone_number,
        socials,
        company,
        role,
        industry,
        school,
        avatar_url,
        gender,
        location,
        interests,
        created_at
      `)
      .in('id', connectionIds);

    if (connectionsError) throw connectionsError;

    // Combine the data
    const contacts = userConnections.map(userConn => {
      const connection = connections.find(c => c.id === userConn.connection_id);
      
      return {
        // Connection data
        id: connection.id,
        name: connection.name,
        email: connection.email,
        phone_number: connection.phone_number,
        socials: connection.socials,
        company: connection.company,
        role: connection.role,
        industry: connection.industry,
        school: connection.school,
        avatar_url: connection.avatar_url,
        gender: connection.gender,
        location: connection.location,
        interests: connection.interests,
        created_at: connection.created_at,
        
        // Relationship data (user-specific)
        where_met: userConn.where_met,
        notes: userConn.notes,
        last_contact_at: userConn.last_contact_at,
        interactions_count: userConn.interactions_count || 0,
        relationship_type: userConn.relationship_type || [],
        tags: userConn.tags || [],
        connection_score: userConn.connection_score,
        added_at: userConn.added_at,
        updated_at: userConn.updated_at,
      };
    });

    return { success: true, data: contacts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createContact = async (contactData, userId) => {
  try {
    // Data for connections table
    const connectionData = {
      name: contactData.name,
      email: contactData.email,
      phone_number: contactData.phone_number,
      socials: contactData.socials,
      company: contactData.company,
      role: contactData.role,
      industry: contactData.industry,
      school: contactData.school,
      avatar_url: contactData.avatar_url || null,
      
    };

    // Data for user_to_connections table
    const relationshipData = {
      where_met: contactData.where_met,
      notes: contactData.notes,
      last_contact_at: contactData.last_contact_at,
      relationship_type: contactData.relationship_type || [],
      tags: contactData.tags || [],
      interactions_count: contactData.interactions_count || 0,
      connection_score: contactData.connection_score || null,
    };

    // First, try to find existing connection by email
    let connection;
    if (connectionData.email) {
      const { data: existingConnection } = await supabase
        .from('connections')
        .select('id, *')
        .eq('email', connectionData.email)
        .single();
      
      connection = existingConnection;
    }

    // If no existing connection found, create new one
    if (!connection) {
      const { data: newConnection, error: connectionError } = await supabase
        .from('connections')
        .insert(connectionData)
        .select()
        .single();
      
      if (connectionError) throw connectionError;
      connection = newConnection;
    }

    // Create the relationship in user_to_connections
    const { error: linkError } = await supabase
      .from('user_to_connections')
      .insert({
        user_id: userId,
        connection_id: connection.id,
        ...relationshipData,
      });

    if (linkError) throw linkError;

    // Return the combined data
    return { 
      success: true, 
      data: { 
        ...connection, 
        ...relationshipData,
        id: connection.id 
      } 
    };

  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateContact = async (contactId, contactData, userId) => {
  try {
    // Split the data between the two tables
    const connectionFields = {
      name: contactData.name,
      email: contactData.email,
      phone_number: contactData.phone_number,
      socials: contactData.socials,
      company: contactData.company,
      role: contactData.role,
      industry: contactData.industry,
      school: contactData.school,
      avatar_url: contactData.avatar_url,
      gender: contactData.gender,
      location: contactData.location,
      interests: contactData.interests,
      updated_at: new Date().toISOString(),
    };

    const relationshipFields = {
      where_met: contactData.where_met,
      notes: contactData.notes,
      last_contact_at: contactData.last_contact_at,
      relationship_type: contactData.relationship_type,
      tags: contactData.tags,
      interactions_count: contactData.interactions_count,
      connection_score: contactData.connection_score,
      updated_at: new Date().toISOString(),
    };

    // Remove undefined fields to avoid overwriting with null
    Object.keys(connectionFields).forEach(key => {
      if (connectionFields[key] === undefined) {
        delete connectionFields[key];
      }
    });

    Object.keys(relationshipFields).forEach(key => {
      if (relationshipFields[key] === undefined) {
        delete relationshipFields[key];
      }
    });

    // Update the connection info (affects all users connected to this contact)
    const { data: connectionData, error: connectionError } = await supabase
      .from('connections')
      .update(connectionFields)
      .eq('id', contactId)
      .select()
      .single();

    if (connectionError) throw connectionError;

    // Update the relationship-specific info (only for this user)
    const { data: relationshipData, error: relationshipError } = await supabase
      .from('user_to_connections')
      .update(relationshipFields)
      .eq('connection_id', contactId)
      .eq('user_id', userId)
      .select()
      .single();

    if (relationshipError) throw relationshipError;

    // Return combined data for frontend compatibility
    return { 
      success: true, 
      data: { 
        ...connectionData, 
        ...relationshipData,
        id: connectionData.id 
      } 
    };

  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteContact = async (contactId, userId) => {
  try {
    const { error: unlinkError } = await supabase
      .from('user_to_connections')
      .delete()
      .eq('user_id', userId)
      .eq('connection_id', contactId);
    if (unlinkError) throw unlinkError;
    const { count, error: countError } = await supabase
      .from('user_to_connections')
      .select('*', { count: 'exact', head: true })
      .eq('connection_id', contactId);
    if (countError) throw countError;
    if (count === 0) {
      await supabase.from('connections').delete().eq('id', contactId);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fetchInitialContactsForSearch = async (userId, firstChar) => {
  const { data: userConnections, error } = await supabase
    .from('user_to_connections')
    .select('connection_id')
    .eq('user_id', userId);
  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }

  const connectionIds = userConnections.map(row => row.connection_id);
  if (connectionIds.length === 0) return [];

  const { data: contacts, error: contactsError } = await supabase
    .from('connections')
    .select('*')
    .in('id', connectionIds);
  if (contactsError) {
    console.error('Error fetching contacts:', contactsError);
    return [];
  }

  return contacts.filter(c => c.name && c.name.toLowerCase().startsWith(firstChar.toLowerCase()));
}; 