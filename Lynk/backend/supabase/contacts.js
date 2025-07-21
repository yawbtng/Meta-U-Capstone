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

export const fetchContacts = async (userId, filters = []) => {
  try {
    const { data: userConnections, error } = await supabase
      .from('user_to_connections')
      .select('connection_id')
      .eq('user_id', userId);
    if (error) throw error;

    const connectionIds = userConnections.map(row => row.connection_id);
    if (connectionIds.length === 0) return { success: true, data: [] };

    let query = supabase
      .from('connections')
      .select('*')
      .in('id', connectionIds);

    filters.forEach(filter => {
      if (!filter.column || !filter.condition || 
          (filter.condition !== 'is_empty' && filter.condition !== 'is_not_empty' && !filter.value)) {
        return;
      }

      const { column, condition, value } = filter;
      const dbColumn = getDbColumnName(column);
      const arrayColumns = ['relationship_type', 'tags'];
      const isArrayColumn = arrayColumns.includes(column);

      switch (condition) {
        case 'contains':
          if (isArrayColumn) {
            query = query.cs(dbColumn, [value]);
          } else {
            query = query.ilike(dbColumn, `%${value}%`);
          }
          break;
        case 'does_not_contain':
          if (isArrayColumn) {
            query = query.not(dbColumn, 'cs', [value]);
          } else {
            query = query.not(dbColumn, 'ilike', `%${value}%`);
          }
          break;
        case 'is':
          if (isArrayColumn) {
            query = query.eq(dbColumn, [value]);
          } else {
            query = query.eq(dbColumn, value);
          }
          break;
        case 'is_not':
          if (isArrayColumn) {
            query = query.neq(dbColumn, [value]);
          } else {
            query = query.neq(dbColumn, value);
          }
          break;
        case 'is_empty':
          if (isArrayColumn) {
            query = query.or(`${dbColumn}.is.null,${dbColumn}.eq.{}`);
          } else {
            query = query.or(`${dbColumn}.is.null,${dbColumn}.eq.`);
          }
          break;
        case 'is_not_empty':
          if (isArrayColumn) {
            query = query.not(dbColumn, 'is', null).neq(dbColumn, '{}');
          } else {
            query = query.not(dbColumn, 'is', null).neq(dbColumn, '');
          }
          break;
        default:
          console.warn(`Unknown filter condition: ${condition}`);
          break;
      }
    });

    const { data: contacts, error: contactsError } = await query;
    if (contactsError) throw contactsError;
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

export const updateContact = async (contactId, contactData) => {
  try {
    const { data, error } = await supabase
      .from('connections')
      .update(contactData)
      .eq('id', contactId)
      .select()
      .single();
    if (error) throw error;
    return { success: true, data };
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