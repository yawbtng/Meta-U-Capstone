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
    let query = supabase
      .from("connections")
      .select("*")
      .eq("user_id", userId);


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

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createContact = async (contactData) => {
  try {
    const { data, error } = await supabase
      .from("connections")
      .insert(contactData);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateContact = async (contactId, contactData) => {
  try {
    const { data, error } = await supabase
      .from("connections")
      .update(contactData)
      .eq("id", contactId)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteContact = async (contactId) => {
  try {
    const { error } = await supabase
      .from("connections")
      .delete()
      .eq("id", contactId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


export const fetchInitialContactsForSearch = async (firstChar) => {
  const { data, error } = await supabase
    .from('connections')
    .select("*")
    .ilike('name', `${firstChar}%`);
  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }
  return data;
}; 