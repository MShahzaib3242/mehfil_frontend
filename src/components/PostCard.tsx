import { Heart, MessageCircle, MoreVertical } from "lucide-react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useDeletePost, useUpdatePost } from "../hooks/Posts/usePostActions";
import ConfirmDialog from "./ui/ConfirmDialog";
import Loader from "./ui/Loader";
import toast from "react-hot-toast";
import { useToggleLike } from "../hooks/Impressions/useToggleLike";
import CommentSection from "./CommentSection";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";
import { dummyImage } from "../utils/constants";

function PostCard({ post, defaultShowComments = false }: any) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [showHeart, setShowHeart] = React.useState(false);
  const [showComments, setShowComments] = React.useState(defaultShowComments);

  const [content, setContent] = React.useState(post?.content || "");
  const [showConfirm, setShowConfirm] = React.useState(false);

  const [existingImages, setExistingImages] = React.useState<string[]>(
    post?.images || [],
  );
  const [newImages, setNewImages] = React.useState<File[]>([]);
  const [newPreviews, setNewPreviews] = React.useState<string[]>([]);

  const { mutate: deleteMutate } = useDeletePost();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdatePost();
  const { mutate: toggleLikeMutate } = useToggleLike();

  const isOwner = user?._id === post?.author?._id;

  React.useEffect(() => {
    setExistingImages(post?.images || []);
  }, [post?.images]);

  const handleEditStart = () => {
    setIsEditing(true);
    setOpen(false);
    setContent(post.content || "");

    setExistingImages(post.images || []);
    setNewImages([]);
    setNewPreviews([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];

    if (!files.length) return;

    setNewImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));

    setNewPreviews((prev) => [...prev, ...previews]);
  };

  const handleUpdatePost = () => {
    const formData = new FormData();

    formData.append("content", content);

    const uniqueExisting = Array.from(new Set(existingImages));

    formData.append("existingImages", JSON.stringify(uniqueExisting));

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    updateMutate(
      { id: post._id, data: formData },
      {
        onSuccess: () => {
          toast.success("Post updated successfully");

          setIsEditing(false);
          setNewImages([]);
          setNewPreviews([]);
        },
        onError: () => {
          toast.error("Failed to update Post.");
        },
      },
    );
  };

  return (
    <>
      <motion.div className="flex gap-3 p-4 border-b bg-white border shadow-sm rounded-2xl relative overflow-hidden">
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
                      onClick={handleEditStart}
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
          onClick={() => navigate(`/user/${post?.author?._id}`)}
          src={post?.author?.avatar || dummyImage}
          className="w-9 h-9 rounded-full object-cover"
        />

        {/* Post Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm mb-1">
            <span
              className="font-semibold hover:underline cursor-pointer"
              onClick={() => navigate(`/user/${post?.author?._id}`)}
            >
              {post?.author?.username}
            </span>
            <span
              className="text-gray-500 cursor-pointer hover:underline"
              onClick={() => navigate(`/post/${post?._id}`)}
            >
              • {timeAgo(post?.createdAt)}
            </span>
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
                  onClick={handleUpdatePost}
                  className="text-sm px-3 py-1 bg-mehfil-primary text-white rounded"
                >
                  {isUpdating ? <Loader /> : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-800 leading-relaxed">
              {post.content}
            </p>
          )}

          {existingImages?.length > 0 && (
            <div
              className={`grid ${isEditing ? "grid-cols-5" : "grid-cols-2"} gap-2 mt-3`}
            >
              {existingImages.map((img: string, i: number) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    className={` rounded-lg object-cover ${isEditing ? "h-20 w-20" : "h-auto w-full"}`}
                  />
                  {isEditing && (
                    <button
                      onClick={() =>
                        setExistingImages((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {newPreviews.length > 0 && (
            <div
              className={`grid ${isEditing ? "grid-cols-5" : "grid-cols-2"} gap-2 mt-3`}
            >
              {newPreviews.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt=""
                    className={`rounded-lg object-cover ${isEditing ? "h-20 w-20" : "h-auto w-full"}`}
                  />

                  <button
                    onClick={() => {
                      setNewImages((prev) =>
                        prev.filter((_, idx) => idx !== i),
                      );
                      setNewPreviews((prev) =>
                        prev.filter((_, idx) => idx !== i),
                      );
                    }}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}

          {isEditing && (
            <label className="cursor-pointer text-sm text-mehfil-primary mt-2 block">
              + Add Image
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}

          <div className="flex gap-6 mt-3 text-gray-500 text-sm">
            <span
              onClick={() => {
                toggleLikeMutate(post._id);

                if (!post.isLiked) {
                  setShowHeart(true);

                  setTimeout(() => {
                    setShowHeart(false);
                  }, 600);
                }
              }}
              className={`flex items-center gap-1 hover:text-red-500 cursor-pointer ${post.isLiked ? "text-red-500" : "text-gray-500"}`}
            >
              <Heart
                size={16}
                fill={post.isLiked ? "red" : "none"}
                className="transition-all duration-200 hover:scale-110 active:scale-95"
              />{" "}
              {post.likesCount || 0}
            </span>

            <span
              onClick={() => setShowComments((prev: boolean) => !prev)}
              className="flex items-center gap-1 hover:text-blue-500 cursor-pointer"
            >
              <MessageCircle size={16} /> {post.commentsCount || 0}
            </span>
          </div>
          {showComments && (
            <CommentSection postId={post._id} postAuthorId={post.author?._id} />
          )}
        </div>

        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.8, opacity: 1 }}
              exit={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Heart size={80} fill="red" className="text-red-500" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
