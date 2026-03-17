import { Heart, MessageCircle } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

type Props = {
  username: string;
  avatar?: string;
  content: string;
  image?: string;
};

function PostCard({ username, content, image, avatar }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      className="flex gap-3 p-4 border-b cursor-pointer"
    >
      {/* Avatar */}
      <img src={avatar} className="w-9 h-9 rounded-full object-cover" />

      {/* Post Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm mb-1">
          <span className="font-semibold">{username}</span>
          <span className="text-gray-500">• 2h</span>
        </div>

        <p className="text-sm text-gray-800 leading-relaxed">{content}</p>

        {image && (
          <img
            src={image}
            className="mt-3 rounded-lg max-h-56 w-full object-cover"
          />
        )}

        <div className="flex gap-6 mt-3 text-gray-500 text-sm">
          <span className="flex items-center gap-1 hover:text-red-500 cursor-pointer">
            <Heart size={16} /> 24
          </span>

          <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
            <MessageCircle size={16} /> 8
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default PostCard;
