import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Camera, Mail, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "../providers/supabaseClient";
import { UserAuth } from "../context/AuthContext";


// ProfileHeader – shows avatar + basic info and lets user pick a new avatar image
function ProfileHeader({ profile, onAvatarSelect, uploading }) {
  const displayName = profile?.name ?? "";
  const email = profile?.email ?? "";
  const avatarUrl = profile?.avatar_url ?? "";

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onAvatarSelect(file);
  };

  return (
    <Card className="scale-125 mt-20">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="User" />
              <AvatarFallback>
                {displayName.slice(0, 2).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full flex items-center justify-center bg-background border cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">Change avatar</span>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="sr-only"
              disabled={uploading}
            />
          </div>

          {/* Name & email */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold">{displayName}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
            {/* Example location – replace with real field if you add it */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// AccountSettings – editable form (name, email, bio, password)
function AccountSettings({ form, onChange, onSubmit, loading }) {
  return (
    <Card className="my-35 scale-125">
      <CardHeader>
        <CardTitle className="text-2xl">Account Settings</CardTitle>
        <CardDescription>Update your account information.</CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          {/* --- Name + Email + Bio --- */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => onChange({ name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => onChange({ email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                rows={3}
                className="w-full border rounded-md p-2"
                value={form.bio}
                onChange={(e) => onChange({ bio: e.target.value })}
              />
            </div>
          </div>

          <Separator />

          {/* --- Password change --- */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={form.password}
                onChange={(e) => onChange({ password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={form.confirm}
                onChange={(e) => onChange({ confirm: e.target.value })}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full mt-5">
            {loading ? "Saving…" : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}


// UserProfile – container that ties everything together
export default function UserProfile() {
  const { session, updateProfile } = UserAuth();
  const navigate = useNavigate();
  const uid = session?.user.id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    password: "",
    confirm: "",
    avatarUrl: ""
  });

  // helper to update part of the form state
  const patch = (obj) => setForm((f) => ({ ...f, ...obj }));


  // Fetch the current profile on mount / uid change
  useEffect(() => {
    if (!uid) return;
    const fetch = async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("name, email, bio, avatar_url")
        .eq("id", uid)
        .single();

      if (!error) {
        setProfile(data);
        patch({
          name: data.name ?? "",
          email: data.email ?? "",
          bio: data.bio ?? "",
          avatarUrl: data.avatar_url ?? ""
        });
      }
    };
    fetch();
  }, [uid]);


  // Handle avatar file upload to Storage
  const handleAvatarSelect = async (file) => {
    try {
      setUploading(true);
      const filePath = `${uid}/${Date.now()}_${file.name}`;
      const { error: uploadErr } = await supabase
        .storage
        .from("user-avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase
        .storage
        .from("user-avatars")
        .getPublicUrl(filePath);

      patch({ avatarUrl: publicUrl });
      toast.success("Avatar uploaded ✨");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Form submit → call updateProfile helper from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await updateProfile({
        name: form.name,
        email: form.email !== profile.email ? form.email : undefined,
        password: form.password || undefined,
        bio: form.bio,
        avatarUrl: form.avatarUrl
      });
      toast.success("Profile updated ✅");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  //----------------------------------------------------------------
  // Render
  //----------------------------------------------------------------
  return (
    <div className="container mx-auto py-5 space-y-8">
      <h1 className="font-bold">Profile & Settings</h1>

      {/* Header with avatar + basic info */}
      <ProfileHeader
        profile={{ ...profile, avatar_url: form.avatarUrl }}
        onAvatarSelect={handleAvatarSelect}
        uploading={uploading}
      />

      {/* Editable settings form */}
      <section id="account">
        <AccountSettings
          form={form}
          onChange={patch}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </section>

      <div className="flex justify-center">
        <Button className=""
        onClick={() => navigate("/home")}>Return to Dashboard</Button>
      </div>
    </div>
  );
}
