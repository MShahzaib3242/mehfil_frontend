import React from "react";
import PostComposer from "./PostComposer";
import { motion } from "framer-motion";
import PostCard from "./PostCard";
import { useFeed } from "../hooks/useFeed";
import Loader from "./ui/Loader";
import SuggestedUsers from "./SuggestedUsers";
import EmptyFeed from "./ui/EmptyFeed";

function FeedContainer() {
  const { data, isLoading, isError } = useFeed();

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <Loader size={24} />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Failed to laod feed</div>;
  }

  if (!data?.hasFollowing) {
    return (
      <>
        <PostComposer />

        <div className="flex flex-col gap-4">
          {data?.posts?.length > 0 ? (
            data?.posts.map((post: any) => (
              <PostCard key={post._id} {...post} />
            ))
          ) : (
            <EmptyFeed />
          )}
        </div>
      </>
    );
  }

  return (
    <div className="w-full">
      <PostComposer />
      <div className="flex flex-col gap-4">
        {data?.posts?.length > 0 ? (
          data?.posts?.map((post: any, index: number) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.25,
                delay: index * 0.05,
              }}
            >
              <PostCard post={post} />
            </motion.div>
          ))
        ) : (
          <EmptyFeed />
        )}
      </div>
    </div>
  );
}

export default FeedContainer;
