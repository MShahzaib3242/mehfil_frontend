import { Heart, MessageCircle, MoreVertical } from "lucide-react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useDeletePost, useUpdatePost } from "../hooks/Posts/usePostActions";
import ConfirmDialog from "./ui/ConfirmDialog";

type Props = {
  username: string;
  avatar?: string;
  content: string;
  image?: string;
};

function PostCard(post: any) {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [content, setContent] = React.useState(post.content);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const { mutate: deleteMutate } = useDeletePost();
  const { mutate: updateMutate } = useUpdatePost();

  const isOwner = user?._id === post.author?._id;

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.15 }}
        className="flex gap-3 p-4 border-b cursor-pointer bg-white border shadow-sm rounded-2xl relative"
      >
        <div className="absolute top-3 right-3">
          {isOwner && (
            <div className="relative">
              <button onClick={() => setOpen(!open)}>
                <MoreVertical size={18} />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-md z-50"
                  >
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirm(true);
                        setOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        {/* Avatar */}
        <img
          src={post.avatar || "https://i.pravatar.cc/150"}
          className="w-9 h-9 rounded-full object-cover"
        />

        {/* Post Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm mb-1">
            <span className="font-semibold">{post.username}</span>
            <span className="text-gray-500">• 2h</span>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm"
              />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-sm px-3 py-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateMutate({ id: post._id, data: { content } });
                    setIsEditing(false);
                  }}
                  className="text-sm px-3 py-1 bg-mehfil-primary text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-800 leading-relaxed">
              {post.content}
            </p>
          )}

          {post.image && (
            <img
              src={post.image}
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
      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          deleteMutate(post._id);
          setShowConfirm(false);
        }}
        title="Delete Post"
        description="Are you sure you want to delete this post?"
      />
    </>
  );
}

export default PostCard;
