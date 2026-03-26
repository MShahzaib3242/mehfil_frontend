import React from "react";
import { useParams } from "react-router-dom";
import { useUserProfile } from "../hooks/User/useUserProfile";
import { useUserPosts } from "../hooks/Posts/useUserPosts";
import { useToggleFollow } from "../hooks/Impressions/useToggleFollow";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/ui/Loader";
import { motion } from "framer-motion";
import PostCard from "../components/PostCard";

function UserProfile() {
  const { id } = useParams();

  const { data: user, isLoading } = useUserProfile(id!);
  const { data, isLoading: postsLoading } = useUserPosts(id!);

  const { mutate: toggleFollow, isPending } = useToggleFollow();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center p-10">
          <Loader />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border rounded-xl p-6 -mt-16 shadow-sm relative"
        >
          <div className="flex justify-between items-start">
            <div>
              <img
                src={user.avatar || import.meta.env.VITE_STATIC_IMAGE_URL}
                alt=""
                className="w-20 h-20 rounded-lg object-cover"
              />
            </div>
            <button
              onClick={() =>
                toggleFollow({
                  userId: user._id,
                  isFollowing: user.isFollowing,
                })
              }
              disabled={isPending}
              className={`px-4 py-2 text-sm rounded-lg ${
                user.isFollowing
                  ? "bg-mehfil-primary text-white"
                  : "border border-mehfil-primary text-mehfil-primary"
              }`}
            >
              {user.isFollowing ? "Following" : "Follow"}
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">@{user.username}</p>

            <p className="text-sm text-gray-700 mt-3">
              {user.bio || "No bio available"}
            </p>
          </div>

          <div className="flex gap-6 mt-6 text-sm">
            <div>
              <span className="font-semibold">{data?.posts?.length || 0}</span>
              <span className="text-gray-500 ml-1">Posts</span>
            </div>
            <div>
              <span className="font-semibold">{user.followersCount || 0}</span>
              <span className="text-gray-500 ml-1">Followers</span>
            </div>
            <div>
              <span className="font-semibold">{user.followingCount || 0}</span>
              <span className="text-gray-500 ml-1">Following</span>
            </div>
          </div>
        </motion.div>

        <div className="mt-4 bg-white border rounded-xl p-3 flex gap-6 text-sm">
          <button className="font-medium border-b-2 border-mehfil-primary pb-1">
            Posts
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {postsLoading && (
            <div className="flex justify-center p-6">
              <Loader />
            </div>
          )}

          {!postsLoading &&
            data?.length > 0 &&
            data.map((post: any) => <PostCard key={post._id} post={post} />)}

          {!postsLoading && (!data || data?.length === 0) && (
            <div className="bg-white border rounded-xl p-8 text-center">
              <p className="text-gray-500 text-sm">No posts yet</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default UserProfile;
