import React from "react";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";
import { useUserPosts } from "../hooks/useUserPosts";
import Loader from "../components/ui/Loader";
import PostCard from "../components/PostCard";

function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const { data, isLoading } = useUserPosts(user?._id);

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
          <div className="flex justify-end">
            <button className="flex items-center gap-2 text-sm px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
              <Edit2 size={16} />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* USER INFO  */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold">{user?.name}</h2>

            <p className="text-gray-500 text-sm">@{user?.username}</p>

            {/* BIO  */}
            <p className="text-sm text-gray-700 mt-3">
              {user?.bio || "No bio yet"}
            </p>

            {/* EMAIL  */}
            <p className="text-xs text-gray-400 mt-2">{user?.email}</p>
          </div>

          <div className="flex gap-6 mt-6 text-sm">
            <div>
              <span className="font-semibold">12</span>
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
        <div className="mt-6 bg-white border rounded-xl p-3 flex gap-6 text-sm">
          <button className="font-medium border-b-2 border-mehfil-primary pb-1">
            Posts
          </button>
          <button className="text-gray-500 hover:text-black">Likes</button>
        </div>
        {/* CONTENT PLACEHOLDER  */}
        <div className="mt-4 bg-white border rounded-xl overflow-hidden">
          {isLoading && (
            <div className="flex justify-center p-6">
              <Loader />
            </div>
          )}
          {data?.posts?.map((post: any) => (
            <PostCard
              key={post._id}
              username={post.author.name}
              avatar={post.author.avatar || "https://i.pravatar.cc/150"}
              content={post.content}
              image={post.image}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;
