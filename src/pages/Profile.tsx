import React from "react";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";
import { useUserPosts } from "../hooks/Posts/useUserPosts";
import Loader from "../components/ui/Loader";
import PostCard from "../components/PostCard";
import { useUpdateProfile } from "../hooks/User/useUpdateProfile";
import toast from "react-hot-toast";
import PostComposer from "../components/PostComposer";

function Profile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const { data, isLoading } = useUserPosts(user?._id);
  const { mutate, isPending } = useUpdateProfile();
  const [form, setForm] = React.useState<{
    name: string;
    username: string;
    bio: string;
    avatar: string;
    avatarFile: File | null;
  }>({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    avatarFile: null,
  });

  React.useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        avatarFile: null,
      });
    }
  }, [user]);

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];

    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      avatarFile: file,
      avatar: previewUrl,
    }));
  };

  const handleSaveProfile = () => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("username", form.username);
    formData.append("bio", form.bio);

    if (form.avatarFile) {
      formData.append("avatar", form.avatarFile);
    }

    mutate(formData, {
      onSuccess: (updatedUser) => {
        setUser(updatedUser);
        setIsEditing(false);

        toast.success("Profile Updated Successfully.");

        setForm((prev) => ({
          ...prev,
          avatarFile: null,
        }));
      },
      onError: () => {
        toast.error("Failed to update Profile");
      },
    });
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        {/* COVER  */}
        <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border rounded-xl p-6 -mt-16 shadow-sm relative"
        >
          {/* ACTION BUTTON  */}
          <div className="flex justify-between items-start">
            <div className="w-auto">
              <img
                src={form.avatar || import.meta.env.VITE_STATIC_IMAGE_URL}
                alt="User Avatar"
                className="w-20 h-20 rounded-lg object-cover"
              />

              {isEditing && (
                <label className="mt-2 inline-block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="text-xs px-3 py-1 5 border rounded-md hover:bg-gray-100 transition text-center">
                    Change Avatar
                  </div>
                </label>
              )}
            </div>
            {/* ACTION BUTTONS  */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 text-sm bg-mehfil-primary text-white rounded-lg hover:opacity-90"
                  >
                    {isPending ? <Loader /> : "Save"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-sm px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* USER INFO  */}
          <div className="mt-4 flex items-start gap-4">
            {/* Info  */}
            <div className="flex-1">
              {isEditing ? (
                <>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border rounded px-2 py-1 text-sm w-full mb-2"
                    placeholder="Full Name"
                  />
                  <input
                    value={form.username}
                    onChange={(e) => {
                      setForm({ ...form, username: e.target.value });
                    }}
                    className="border rounded px-2 py-1 text-sm w-full mb-2"
                    placeholder="Username"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{user?.name}</h2>
                  <p className="text-gray-500 text-sm">@{user?.username}</p>
                </>
              )}

              {/* BIO  */}
              <div className="mt-3">
                {isEditing ? (
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full border rounded p-2 text-sm"
                    placeholder="Write your bio..."
                  />
                ) : (
                  <p className="text-sm text=gray-700">
                    {user?.bio || "No bio yet"}
                  </p>
                )}
              </div>

              {/* EMAIL  */}
              <p className="text-xs text-gray-400 mt-2">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-6 mt-6 text-sm">
            <div>
              <span className="font-semibold">{data?.length || 0}</span>
              <span className="text-gray-500 ml-1">Posts</span>
            </div>
            <div>
              <span className="font-semibold">340</span>
              <span className="text-gray-500 ml-1">Followers</span>
            </div>
            <div>
              <span className="font-semibold">180</span>
              <span className="text-gray-500 ml-1">Following</span>
            </div>
          </div>
        </motion.div>
        <div className="mt-4 bg-white border rounded-xl p-3 flex gap-6 text-sm">
          <button className="font-medium border-b-2 border-mehfil-primary pb-1">
            Posts
          </button>
          <button className="text-gray-500 hover:text-black">Likes</button>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <PostComposer />

          {/* CONTENT PLACEHOLDER  */}
          {isLoading && (
            <div className="flex justify-center p-6">
              <Loader />
            </div>
          )}
          {!isLoading &&
            data?.length > 0 &&
            data?.map((post: any) => <PostCard key={post._id} post={post} />)}

          {!isLoading && (!data || data?.length === 0) && (
            <div className="bg-white border rounded-xl p-8 text-center">
              <p className="text-gray-500 text-sm mb-4">
                You haven't posted anything yet
              </p>

              <button
                onClick={() => {
                  document.getElementById("post-input")?.focus();
                }}
                className="px-4 py-2 text-sm bg-mehfil-primary text-white rounded-lg hover:opacity-90 transition"
              >
                Create First Post
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;
