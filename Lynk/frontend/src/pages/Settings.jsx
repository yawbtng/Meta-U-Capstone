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
import { Camera, Mail, MapPin, Building, User, Linkedin, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { fetchUserProfile, uploadAvatar } from "../../../backend/index.js";
import { UserAuth } from "../context/AuthContext";

// ProfileHeader – shows avatar + basic info and lets user pick a new avatar image
function ProfileHeader({ profile, onAvatarSelect, uploading }) {
  const displayName = profile?.name ?? "";
  const email = profile?.email ?? "";
  const avatarUrl = profile?.avatar_url ?? "";
  const location = profile?.location ?? "San Francisco, CA";
  const role = profile?.role ?? "";
  const company = profile?.company ?? "";

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onAvatarSelect(file);
  };

  return (
    <Card className="scale-100 mt-20">
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

          {/* Name & details */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold">{displayName}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
            {role && company && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{role} at {company}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// AccountSettings – editable form with all profile fields
function AccountSettings({ form, onChange, onSubmit, loading }) {
  const handleInterestsChange = (value) => {
    // Convert comma-separated string to array
    const interests = value.split(',').map(interest => interest.trim()).filter(interest => interest !== '');
    onChange({ interests });
  };

  return (
    <Card className="my-5 scale-100">
      <CardHeader>
        <CardTitle className="text-2xl">Account Settings</CardTitle>
        <CardDescription>Update your account information and profile details.</CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          {/* --- Basic Information --- */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => onChange({ name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange({ email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={3}
                value={form.bio}
                onChange={(e) => onChange({ bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => onChange({ location: e.target.value })}
                placeholder="City, State/Country"
              />
            </div>
          </div>

          <Separator />

          {/* --- Professional Information --- */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building className="h-5 w-5" />
              Professional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role/Position</Label>
                <Input
                  id="role"
                  value={form.role}
                  onChange={(e) => onChange({ role: e.target.value })}
                  placeholder="Software Engineer, Designer, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => onChange({ company: e.target.value })}
                  placeholder="Company name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                type="url"
                value={form.linkedin_url}
                onChange={(e) => onChange({ linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          <Separator />

          {/* --- Interests --- */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Interests
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="interests">Interests (comma-separated)</Label>
              <Input
                id="interests"
                value={form.interests?.join(', ') || ''}
                onChange={(e) => handleInterestsChange(e.target.value)}
                placeholder="Technology, Photography, Travel, Music"
              />
              <p className="text-sm text-muted-foreground">
                Separate interests with commas. These help others find common ground with you.
              </p>
              {form.interests && form.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* --- Password change --- */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Change Password</h3>
            <p className="text-sm text-muted-foreground">Leave blank to keep current password</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => onChange({ password: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={form.confirm}
                  onChange={(e) => onChange({ confirm: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
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
    location: "",
    role: "",
    company: "",
    linkedin_url: "",
    interests: [],
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
      const result = await fetchUserProfile(uid);

      if (result.success) {
        setProfile(result.data);
        patch({
          name: result.data.name ?? "",
          email: result.data.email ?? "",
          bio: result.data.bio ?? "",
          location: result.data.location ?? "San Francisco, CA",
          role: result.data.role ?? "",
          company: result.data.company ?? "",
          linkedin_url: result.data.linkedin_url ?? "",
          interests: result.data.interests ?? [],
          avatarUrl: result.data.avatar_url ?? ""
        });
      }
    };
    fetch();
  }, [uid]);

  // Handle avatar file upload to Storage
  const handleAvatarSelect = async (file) => {
    try {
      setUploading(true);
      const result = await uploadAvatar(uid, file);
      
      if (!result.success) throw new Error(result.error);

      patch({ avatarUrl: result.publicUrl });
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
        email: form.email !== profile?.email ? form.email : undefined,
        password: form.password || undefined,
        bio: form.bio,
        location: form.location,
        role: form.role,
        company: form.company,
        linkedin_url: form.linkedin_url,
        interests: form.interests,
        avatarUrl: form.avatarUrl
      });
      toast.success("Profile updated ✅");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-5 space-y-8 max-w-4xl">
      <h1 className="font-bold text-3xl">Profile & Settings</h1>

      {/* Header with avatar + basic info */}
      <ProfileHeader
        profile={{ 
          ...profile, 
          avatar_url: form.avatarUrl,
          location: form.location,
          role: form.role,
          company: form.company
        }}
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
        <Button 
          className="text-lg font-bold py-2 px-4 rounded scale-125"
          onClick={() => navigate("/home")}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
