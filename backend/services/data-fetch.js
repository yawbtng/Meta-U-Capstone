import { supabase } from "../browser-client";

export async function fetchAllUsers() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, name, email, role, company, location, interests');
  
    if (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
    
    return data || [];
  }

export async function fetchAllConnections() {
  const { data: connections, error: connError } = await supabase
    .from('connections')
    .select('id, name, email, company, location, role, interests');

  if (connError) {
    throw new Error(`Error fetching connections: ${connError.message}`);
  }

  // Fetch all user_to_connections
  const { data: userToConnections, error: utcError } = await supabase
    .from('user_to_connections')
    .select('user_id, connection_id');

  if (utcError) {
    throw new Error(`Error fetching user_to_connections: ${utcError.message}`);
  }

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
  
  return result;
}