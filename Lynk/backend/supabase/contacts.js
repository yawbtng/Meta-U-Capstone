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

// Fetch all contacts for a user using the join table
export const fetchContacts = async (userId, filters = []) => {
  try {
    let query = supabase
      .from('user_to_connections')
      .select('connections:*')
      .eq('user_id', userId);

    // filters are applied to the joined connections table
    filters.forEach(filter => {
      if (!filter.column || !filter.condition || 
          (filter.condition !== 'is_empty' && filter.condition !== 'is_not_empty' && !filter.value)) {
        return;
      }

      const { column, condition, value } = filter;
      const dbColumn = getDbColumnName(column);
      const arrayColumns = ['relationship_type', 'tags'];
      const isArrayColumn = arrayColumns.includes(column);
      const joinedCol = `connections.${dbColumn}`;

      switch (condition) {
        case 'contains':
          if (isArrayColumn) {
            query = query.cs(joinedCol, [value]);
          } else {
            query = query.ilike(joinedCol, `%${value}%`);
          }
          break;
        case 'does_not_contain':
          if (isArrayColumn) {
            query = query.not(joinedCol, 'cs', [value]);
          } else {
            query = query.not(joinedCol, 'ilike', `%${value}%`);
          }
          break;
        case 'is':
          if (isArrayColumn) {
            query = query.eq(joinedCol, [value]);
          } else {
            query = query.eq(joinedCol, value);
          }
          break;
        case 'is_not':
          if (isArrayColumn) {
            query = query.neq(joinedCol, [value]);
          } else {
            query = query.neq(joinedCol, value);
          }
          break;
        case 'is_empty':
          if (isArrayColumn) {
            query = query.or(`${joinedCol}.is.null,${joinedCol}.eq.{}`);
          } else {
            query = query.or(`${joinedCol}.is.null,${joinedCol}.eq.`);
          }
          break;
        case 'is_not_empty':
          if (isArrayColumn) {
            query = query.not(joinedCol, 'is', null).neq(joinedCol, '{}');
          } else {
            query = query.not(joinedCol, 'is', null).neq(joinedCol, '');
          }
          break;
        default:
          console.warn(`Unknown filter condition: ${condition}`);
          break;
      }
    });

    const { data, error } = await query;
    if (error) throw error;
    const contacts = data.map(row => row.connections);
    return { success: true, data: contacts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Create a contact and link it to the user in user_to_connections
export const createContact = async (contactData, userId) => {
  try {
    // Insert contact (without user_id)
    const { data: contact, error } = await supabase
      .from('connections')
      .insert(contactData)
      .select()
      .single();
    if (error) throw error;
    // Link to user in user_to_connections
    const { error: linkError } = await supabase
      .from('user_to_connections')
      .insert({ user_id: userId, connection_id: contact.id });
    if (linkError) throw linkError;
    return { success: true, data: contact };
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

// Delete a contact for a user (removes from user_to_connections, and optionally deletes the contact if no owners remain)
export const deleteContact = async (contactId, userId) => {
  try {
    // Remove from user_to_connections
    const { error: unlinkError } = await supabase
      .from('user_to_connections')
      .delete()
      .eq('user_id', userId)
      .eq('connection_id', contactId);
    if (unlinkError) throw unlinkError;
    // Optionally, check if the contact has any other owners
    const { count, error: countError } = await supabase
      .from('user_to_connections')
      .select('*', { count: 'exact', head: true })
      .eq('connection_id', contactId);
    if (countError) throw countError;
    if (count === 0) {
      // No more owners, delete the contact
      await supabase.from('connections').delete().eq('id', contactId);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


export const fetchInitialContactsForSearch = async (userId, firstChar) => {
  const { data, error } = await supabase
    .from('user_to_connections')
    .select('connections:*')
    .eq('user_id', userId);
  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }
  const contacts = data.map(row => row.connections).filter(c => c.name && c.name.toLowerCase().startsWith(firstChar.toLowerCase()));
  return contacts;
}; 