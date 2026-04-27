"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Shield,
  School,
  Loader2,
  Camera,
  CheckCircle2,
  UserCircle,
  UploadCloud,
} from "lucide-react";

export default function ProfilePage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select(`*, classes (name)`)
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        setAvatarUrl(data.avatar_url);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [supabase]);

  // Download the public URL for the avatar
  const getPublicAvatarUrl = (path: string) => {
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    return data.publicUrl;
  };

  // Handle Avatar Upload Logic
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setUploading(true);
      setMessage("");

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `user_avatars/${fileName}`;

      // 1. Upload the file to Supabase Storage Bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. If the user already has an avatar, delete the old one to save space
      if (profile.avatar_url) {
        await supabase.storage.from("avatars").remove([profile.avatar_url]);
      }

      // 3. Update the profiles table with the new filePath
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      // 4. Update local state
      setAvatarUrl(filePath);
      setProfile({ ...profile, avatar_url: filePath });
      setMessage("Profile picture updated successfully!");
    } catch (error: any) {
      console.error("Upload Error:", error.message);
      setMessage(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Handle Personal Details Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
      })
      .eq("id", profile.id);

    if (error) {
      setMessage("Error updating profile.");
    } else {
      setMessage("Profile details updated successfully!");
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
          Loading Account...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <UserCircle className="text-blue-600 h-8 w-8" /> My Profile
        </h1>
        <p className="text-slate-500 font-medium">
          Manage your personal information and profile picture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Avatar Upload & Quick Info */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden self-start">
          <div className="h-24 bg-blue-600 w-full" />
          <CardContent className="flex flex-col items-center -mt-12 p-6">
            {/* The Avatar Display */}
            <div className="relative group">
              <div className="h-28 w-28 bg-white rounded-full p-1.5 shadow-2xl shadow-blue-900/10">
                {avatarUrl ? (
                  <img
                    src={getPublicAvatarUrl(avatarUrl)}
                    alt="Avatar"
                    className="h-full w-full rounded-full object-cover border-2 border-slate-50"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100 rounded-full flex items-center justify-center text-slate-300 border-2 border-slate-50">
                    <User className="h-14 w-14" />
                  </div>
                )}
              </div>

              {/* The Upload Button (Trigger for hidden file input) */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-slate-100 text-blue-600 hover:scale-110 active:scale-95 transition-transform disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />

            <h3 className="mt-5 text-xl font-bold text-slate-900 uppercase tracking-tight">
              {profile?.first_name} {profile?.last_name}
            </h3>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase mt-2.5 tracking-widest border border-blue-100 shadow-inner">
              {profile?.user_type}
            </span>
          </CardContent>
        </Card>

        {/* Right: Detailed Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardHeader className="border-b border-slate-50 py-5">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form
                onSubmit={handleUpdate}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-300" />
                    <input
                      className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-medium text-slate-700 shadow-sm"
                      value={profile?.first_name || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, first_name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-300" />
                    <input
                      className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-medium text-slate-700 shadow-sm"
                      value={profile?.last_name || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, last_name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-300" />
                    <input
                      className="w-full pl-11 pr-4 py-3 border border-slate-100 bg-slate-50 rounded-xl text-slate-400 cursor-not-allowed font-medium shadow-inner"
                      value={profile?.email || ""}
                      disabled
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-center justify-between pt-4 gap-4">
                  {message && (
                    <div className="flex items-center gap-2 text-emerald-600 text-[11px] font-bold uppercase">
                      <CheckCircle2 className="h-4 w-4" /> {message}
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={updating || uploading}
                    className="ml-auto bg-slate-900 hover:bg-blue-600 text-white font-bold px-10 py-3 h-auto rounded-xl transition-all shadow-lg shadow-slate-200 active:scale-95"
                  >
                    {updating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save Details"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Academic Info (Conditional) */}
          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardHeader className="border-b border-slate-50 py-5">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">
                Academic Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-7 pb-7 px-8">
              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-slate-100 rounded-2xl text-slate-400 border border-slate-200 shadow-inner">
                  <Shield className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                    Account Role
                  </p>
                  <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                    {profile?.user_type}
                  </p>
                </div>
              </div>

              {profile?.user_type === "student" && (
                <div className="flex items-center gap-5">
                  <div className="p-3.5 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100 shadow-inner">
                    <School className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1.5">
                      Current Class
                    </p>
                    <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                      {profile?.classes?.name || "Not Assigned"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
