import React from "react";
import { useParams } from "react-router-dom";
import { useGetPost } from "../hooks/Posts/usePostActions";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/ui/Loader";
import PostCard from "../components/PostCard";

function PostDetails() {
  const { id } = useParams();

  const { data: post, isLoading } = useGetPost(id!);

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {isLoading && (
          <div className="flex justify-center p-10">
            <Loader />
          </div>
        )}

        {!isLoading && post && <PostCard post={post} defaultShowComments />}

        {!isLoading && !post && (
          <div className="text-center p-10 text-gray-400">Post not found</div>
        )}
      </div>
    </MainLayout>
  );
}

export default PostDetails;
