import { supabase } from '../browser-client.js';

export const uploadAvatar = async (userId, file) => {
  try {
    const filePath = `${userId}/${Date.now()}_${file.name}`;
    const { error: uploadErr } = await supabase.storage
      .from("user-avatars")
      .upload(filePath, file, { upsert: true });
    
    if (uploadErr) throw uploadErr;

    const { data: { publicUrl } } = supabase.storage
      .from("user-avatars")
      .getPublicUrl(filePath);

    return { success: true, publicUrl };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


export const uploadContactAvatar = async (userId, file) => {
  try {
    const filePath = `contacts/${userId}/${Date.now()}_${file.name}`;
    const { error: uploadErr } = await supabase.storage
      .from("user-avatars") // Reusing same bucket but different folder
      .upload(filePath, file, { upsert: true });
    
    if (uploadErr) throw uploadErr;

    const { data: { publicUrl } } = supabase.storage
      .from("user-avatars")
      .getPublicUrl(filePath);

    return { success: true, publicUrl };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 