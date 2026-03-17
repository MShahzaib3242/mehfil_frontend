import React from "react";
import PostComposer from "./PostComposer";
import { motion } from "framer-motion";
import PostCard from "./PostCard";
import { useFeed } from "../hooks/useFeed";

function FeedContainer() {
  const { data, isLoading, isError } = useFeed();

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading Feed...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Failed to laod feed</div>;
  }

  const mockPosts = [
    {
      id: 1,
      username: "Shahzaib Chand",
      avatar: "https://i.pravatar.cc/150?img=1",
      content: "AI is transforming backend development",
    },
    {
      id: 2,
      username: "Sara Dev",
      avatar: "https://i.pravatar.cc/150?img=2",
      content: "Beautiful sunset today.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    },
    {
      id: 3,
      username: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=3",
      content: "Working on Mehfil UI today. Loving the compact feed idea.",
    },
  ];

  return (
    <div className="w-full">
      <PostComposer />
      <div className="bg-white border rounded-xl overflow-hidden">
        {data?.posts?.map((post: any, index: number) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              delay: index * 0.05,
            }}
          >
            <PostCard
              username={post.author.username}
              avatar={post.author.avatar || "https://i.pravatar.cc/150"}
              content={post.content}
              image={post.image}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default FeedContainer;
