import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import getApiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { User, UpdateProfileDto } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Skeleton } from '@/components/ui/skeleton-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/error-handler';
import { UserStats } from '@/components/UserStats';

// ---- FILLED REACT ICONS ----
import {
  MdPerson,
  MdEmail,
  MdLanguage,
  MdLocationOn,
  MdEdit,
  MdSave,
  MdClose,
  MdInfo,
  MdLink,
  MdPublic,
} from "react-icons/md";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { CopyIcon } from 'lucide-react';

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileDto>({
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
      country: '',
      website: '',
      github: '',
      linkedin: '',
      skills: [],
    },
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getApiClient().get<User>(API_ENDPOINTS.USERS.ME);
      const userData = response.data;
      setUser(userData);

      const profile = userData.profile;
      reset({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        bio: profile?.bio || '',
        country: profile?.country || '',
        website: profile?.website || '',
        github: profile?.github || '',
        linkedin: profile?.linkedin || '',
        skills: profile?.skills || [],
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UpdateProfileDto) => {
    try {
      setSaving(true);
      await getApiClient().patch(API_ENDPOINTS.USERS.ME, data);

      toast.success('Profile updated successfully!');
      setEditing(false);

      await fetchUserProfile(); // Refresh data
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);

    if (user?.profile) {
      const profile = user.profile;
      reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        bio: profile.bio || '',
        country: profile.country || '',
        website: profile.website || '',
        github: profile.github || '',
        linkedin: profile.linkedin || '',
        skills: profile.skills || [],
      });
    }
  };

  // ---- SKELETON LOADING ----
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton height={200} />
        <Skeleton height={300} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8 text-gray-400">
        Failed to load profile
      </div>
    );
  }

  const CopyProfile = async (id: string) => {
    const urlText = `${location.origin}/profile/${id}`;

    try {
      // ✅ If device supports native sharing (mostly mobile)
      if (navigator.share) {
        await navigator.share({
          title: "Profile Link",
          text: "Check out this profile:",
          url: urlText,
        });
        toast.success("Link shared ✅");
        return true;
      }
      // ✅ Desktop or browsers without share support
      await navigator.clipboard.writeText(urlText);
      toast.success("Profile link copied ✅");
      return true;

    } catch (error) {
      console.error(error);
      toast.error("Action failed ❌");
      return false;
    }
  };


  return (
    <div className="space-y-6">

      {/* ---- Profile Header ---- */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg border-none py-10 border-white/20 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {user.profile?.avatarUrl ? (
              <img
                src={user.profile.avatarUrl}
                alt={user.username}
                className="w-20 h-20 rounded-full border-2 border-white/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-white/20">
                <MdPerson className="w-10 h-10 text-blue-400" />
              </div>
            )}

            <div>
              <h1 className="text-2xl font-bold text-white flex gap-3">
                {user.profile?.firstName && user.profile?.lastName
                  ? `${user.profile.firstName} ${user.profile.lastName}`
                  : user.username}
                <p onClick={() => CopyProfile(user.id)} className='text-sm flex gap-1 items-center text-zinc-500 hover:text-white font-normal' title='Copy profile link'> <CopyIcon className='size-3' /> Share</p>
              </h1>

              <p className="text-gray-400">@{user.username}</p>

              {user.email && (
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                  <MdEmail className="w-4 h-4" />
                  {user.email}
                </div>
              )}
            </div>
          </div>

          {!editing && (
            <Button
              onClick={() => setEditing(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MdEdit className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* ---- Edit Mode ---- */}
        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* FIRST NAME */}
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative mt-2">
                  <MdPerson className="absolute left-3 top-[60%] -translate-y-1/2 text-gray-400 text-xl" />
                  <Input
                    id="firstName"
                    className="pl-10 mt-2 border-none!"
                    {...register("firstName")}
                  />
                </div>
              </div>

              {/* LAST NAME */}
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative mt-2">
                  <MdPerson className="absolute left-3 top-[60%] -translate-y-1/2 text-gray-400 text-xl" />
                  <Input
                    id="lastName"
                    className="pl-10 mt-2 border-none!"
                    {...register("lastName")}
                  />
                </div>
              </div>
            </div>

            {/* BIO */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <div className="relative mt-2">
                <MdInfo className="absolute left-3 top-3 text-gray-400 text-xl" />
                <Textarea
                  id="bio"
                  rows={4}
                  className="pl-10 mt-2 border-none!"
                  {...register("bio")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* COUNTRY */}
              <div>
                <Label htmlFor="country">Country</Label>
                <div className="relative mt-2">
                  <MdPublic className="absolute left-3 top-[60%] -translate-y-1/2 text-gray-400 text-xl" />
                  <Input
                    id="country"
                    className="pl-10 mt-2 border-none!"
                    {...register("country")}
                  />
                </div>
              </div>

              {/* WEBSITE */}
              <div>
                <Label htmlFor="website">Website</Label>
                <div className="relative mt-2">
                  <MdLanguage className="absolute left-3 top-[60%] -translate-y-1/2 text-gray-400 text-xl" />
                  <Input
                    id="website"
                    type="url"
                    className="pl-10 mt-2 border-none!"
                    {...register("website")}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* GITHUB */}
              <div>
                <Label htmlFor="github">GitHub</Label>
                <div className="relative mt-2">
                  <MdLink className="absolute left-3 top-[60%] -translate-y-1/2 text-gray-400 text-xl" />
                  <Input
                    id="github"
                    className="pl-10 mt-2 border-none!"
                    {...register("github")}
                  />
                </div>
              </div>

              {/* LINKEDIN */}
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative mt-2">
                  <MdLink className="absolute left-3 top-[60%] -translate-y-1/2 text-gray-400 text-xl" />
                  <Input
                    id="linkedin"
                    className="pl-10 mt-2 border-none!"
                    {...register("linkedin")}
                  />
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                <MdClose className="w-4 h-4 mr-2" />
                Cancel
              </Button>

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <MdSave className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          // ---- VIEW MODE ----
          <div className="mt-4 space-y-3">
            {user.profile?.bio && (
              <p className="text-gray-300">{user.profile.bio}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              {user.profile?.country && (
                <div className="flex items-center gap-2 text-gray-400">
                  <MdLocationOn className="w-4 h-4" />
                  {user.profile.country}
                </div>
              )}

              {user.profile?.website && (
                <a
                  href={user.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                >
                  <MdLanguage className="w-4 h-4" />
                  Website
                </a>
              )}

              {user.profile?.github && (
                <a
                  href={`https://github.com/${user.profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                >
                  <FaGithub className="w-4 h-4" />
                  GitHub
                </a>
              )}

              {user.profile?.linkedin && (
                <a
                  href={`https://linkedin.com/in/${user.profile.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                >
                  <FaLinkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
            </div>

            {user.profile?.skills && user.profile.skills.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---- User Stats ---- */}
      <UserStats />
    </div>
  );
}
