import { supabase } from "../browser-client";

export async function fetchAllUsers() {
    console.log('Fetching users from user_profiles table...');
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, name, email, role, company, location, interests');
  
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    console.log('Raw user data from Supabase:', data);
    console.log(`Found ${data?.length || 0} users`);
    
    return data || [];
  }

export async function fetchAllConnections() {
  console.log('Fetching connections from connections table...');
  
  const { data: connections, error: connError } = await supabase
    .from('connections')
    .select('id, name, email, company, location, role, interests');

  if (connError) {
    console.error('Error fetching connections:', connError);
    return [];
  }

  console.log('Raw connections data from Supabase:', connections);
  console.log(`Found ${connections?.length || 0} connections`);

  // Fetch all user_to_connections
  console.log('Fetching user_to_connections relationships...');
  const { data: userToConnections, error: utcError } = await supabase
    .from('user_to_connections')
    .select('user_id, connection_id');

  if (utcError) {
    console.error('Error fetching user_to_connections:', utcError);
    return connections; // Return connections without user_ids
  }

  console.log('User to connections data:', userToConnections);
  console.log(`Found ${userToConnections?.length || 0} user-connection relationships`);

  const connectionToUsers = {};
  for (const row of userToConnections) {
    if (!connectionToUsers[row.connection_id]) {
      connectionToUsers[row.connection_id] = [];
    }
    connectionToUsers[row.connection_id].push(row.user_id);
  }

  // Attach user_ids to each connection
  const result = connections.map(conn => ({
    ...conn,
    user_ids: connectionToUsers[conn.id] || []
  }));
  
  console.log('Final connections with user_ids:', result);
  return result;
}