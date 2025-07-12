import { supabase } from '../browser-client.js';


export const fetchUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async ({ userId, email, password, name, avatarUrl, bio }) => {
  try {

    const { data: authUser, error: authErr } = await supabase.auth.updateUser({
      ...(email ? { email } : {}),
      ...(password ? { password } : {}),
      data: {
        ...(name && { display_name: name }),
      }
    });

    if (authErr) throw authErr;


    const { error: profileErr } = await supabase
      .from('user_profiles')
      .update({
        ...(name && { name }),
        ...(avatarUrl && { avatar_url: avatarUrl }),
        ...(bio && { bio }),
        email: authUser.user.email
      })
      .eq('id', userId);

    if (profileErr) throw profileErr;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 