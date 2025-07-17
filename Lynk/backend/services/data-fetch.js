import { supabase } from "../browser-client";

export async function fetchAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, company, location, interests');
  
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    return data || [];
  }

export async function fetchAllConnections() {
  const { data: connections, error: connError } = await supabase
    .from('connections')
    .select('id, name, email, company, location, role, interests');

  if (connError) {
    console.error('Error fetching connections:', connError);
    return [];
  }

  // Fetch all user_to_connections
  const { data: userToConnections, error: utcError } = await supabase
    .from('user_to_connections')
    .select('user_id, connection_id');

  if (utcError) {
    console.error('Error fetching user_to_connections:', utcError);
    return connections; // Return connections without user_ids
  }

  // Map connection.id => [user_id, ...]
  const connectionToUsers = {};
  for (const row of userToConnections) {
    if (!connectionToUsers[row.connection_id]) {
      connectionToUsers[row.connection_id] = [];
    }
    connectionToUsers[row.connection_id].push(row.user_id);
  }

  // Attach user_ids to each connection
  return connections.map(conn => ({
    ...conn,
    user_ids: connectionToUsers[conn.id] || []
  }));
}