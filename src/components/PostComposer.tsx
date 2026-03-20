import React from "react";
import { useCreatePost } from "../hooks/Posts/useCreatePost";
import Loader from "./ui/Loader";

function PostComposer() {
  const [content, setContent] = React.useState("");
  const { mutate, isPending } = useCreatePost();

  const handlePost = () => {
    if (!content.trim()) return;

    mutate(
      { content },
      {
        onSuccess: () => {
          setContent("");
        },
      },
    );
  };

  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <textarea
        placeholder="Share something with Mehfil..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full resize-none outline-none text-sm"
        rows={3}
      />
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-500">Keep it throughtful</span>
        <button
          className="bg-mehfil-primary text-white text-sm px-4 py-1 rounded-md hover:opacity-90"
          onClick={handlePost}
          disabled={isPending}
        >
          {isPending ? <Loader /> : "Post"}
        </button>
      </div>
    </div>
  );
}

export default PostComposer;
