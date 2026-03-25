import React from "react";
import PostComposer from "./PostComposer";
import { motion } from "framer-motion";
import PostCard from "./PostCard";
import { useFeed } from "../hooks/useFeed";
import Loader from "./ui/Loader";
import SuggestedUsers from "./SuggestedUsers";

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
          {data?.posts.map((post: any) => (
            <PostCard key={post._id} {...post} />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="w-full">
      <PostComposer />
      <div className="bg-white border rounded-xl overflow-hidden">
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center "
            >
              <motion.svg
                viewBox="0 0 24 24"
                className={"w-8 h-8 text-green-600"}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <motion.path d="M5 13l4 4L19 7" />
              </motion.svg>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-500"
            >
              You all caught up for today 🎉
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default FeedContainer;
