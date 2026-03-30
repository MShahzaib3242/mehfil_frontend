import React from "react";
import { useComments } from "../hooks/Impressions/useComments";
import { useAddComment } from "../hooks/Impressions/useAddComment";
import { AnimatePresence, motion } from "framer-motion";
import { useDeleteComment } from "../hooks/Impressions/useDeleteComment";
import { useUpdateComment } from "../hooks/Impressions/useUpdateComment";
import { Heart, Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "./ui/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { toggleCommentLike } from "../api/commentApi";
import { useToggleCommentLike } from "../hooks/Impressions/useToggleCommentLike";
import { dummyImage } from "../utils/constants";

function CommentSection({
  postId,
  postAuthorId,
}: {
  postId: string;
  postAuthorId: string;
}) {
  const [text, setText] = React.useState("");

  const { user } = useAuth();
  const { data: comments, isLoading } = useComments(postId);
  const { mutate: addComment, isPending } = useAddComment();
  const { mutate: deleteCommentMutate } = useDeleteComment();
  const { mutate: updateCommentMutate } = useUpdateComment();
  const { mutate: toggleCommentLikeMutate } = useToggleCommentLike();

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedCommentId, setSelectedCommentId] = React.useState<
    string | null
  >(null);

  const handleSubmit = () => {
    if (!text.trim()) return;

    addComment({ postId, content: text });
    setText("");
  };

  return (
    <div className="mt-3 border-t pt-3">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-mehfil-primary text-white px-4 py-2 rounded-lg text-sm"
        >
          Post
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2 max-h-60 overflow-y-auto">
        {isLoading && <div className="text-sm text-gray-400">Loading...</div>}

        <AnimatePresence>
          {comments?.length > 0 ? (
            comments?.map((c: any) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2 text-sm group"
              >
                <img
                  src={c.author?.avatar || dummyImage}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />

                <div className="flex-1">
                  {editingId === c._id ? (
                    <div className="flex gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 border rounded px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => {
                          updateCommentMutate({
                            commentId: c._id,
                            content: editText,
                            postId,
                          });
                          setEditingId(null);
                        }}
                        className="text-xs bg-mehfil-primary text-white px-2 rounded"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                        }}
                        className="text-xs border border-mehfil-primary text-mehfil-primary hover:bg-mehfil-primary hover:text-white px-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-2 rounded-lg w-full flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium mr-1 text-xs text-gray-400">
                          @{c.author?.username}
                        </span>
                        {c.content}
                      </div>
                      <div className="flex gap-2 ml-3 opacity- group-hover:opacity-100 transition">
                        {c.author?._id === user?._id && (
                          <button
                            onClick={() => {
                              setEditingId(c._id);
                              setEditText(c.content);
                            }}
                          >
                            <Pencil size={14} className="text-mehfil-primary" />
                          </button>
                        )}

                        {(c.author?._id === user?._id ||
                          postAuthorId === user?._id) && (
                          <button
                            onClick={() => {
                              setSelectedCommentId(c._id);
                              setConfirmOpen(true);
                            }}
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        )}

                        <button
                          onClick={() => toggleCommentLikeMutate(c._id)}
                          className={`flex items-center gap-1 ${c.isLiked ? "text-red-500" : "hover:text-red-500"}`}
                        >
                          <Heart
                            size={14}
                            fill={c.isLiked ? "red" : "none"}
                            className="transition-all duration-200"
                          />
                          {c.likesCount > 0 && (
                            <span className="text-xs">{c.likesCount}</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2 text-sm w-full items-center"
            >
              <div className="bg-gray-100 px-3 py-4 w-full text-center rounded-lg">
                No Comments Found
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onConfirm={() => {
          if (!selectedCommentId) return;

          deleteCommentMutate({
            commentId: selectedCommentId,
            postId,
          });
        }}
        onClose={() => {
          setConfirmOpen(false);
          setSelectedCommentId(null);
        }}
        title="Delete Comment?"
        description="This action cannot be undone."
      />
    </div>
  );
}

export default CommentSection;
