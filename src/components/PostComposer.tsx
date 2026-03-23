import React from "react";
import { useCreatePost } from "../hooks/Posts/useCreatePost";
import Loader from "./ui/Loader";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function PostComposer() {
  const [content, setContent] = React.useState("");
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { mutate, isPending } = useCreatePost();

  const [images, setImages] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);

  const handleImageChange = (e: any) => {
    const files = Array.from(e.target.files);

    const newImages: any = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map((file: any) => URL.createObjectURL(file));

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    if (!content.trim() && images.length === 0) {
      toast.error("Post cannot be empty.");
      return;
    }

    const formData = new FormData();

    formData.append("content", content);

    images.forEach((img) => {
      formData.append("images", img);
    });

    mutate(formData, {
      onSuccess: () => {
        setContent("");
        setImages([]);
        setPreviews([]);

        toast.success("Post created successfully.");

        queryClient.invalidateQueries({
          queryKey: ["userPosts", user?._id],
        });

        queryClient.invalidateQueries({
          queryKey: ["feed"],
        });
      },

      onError: () => {
        toast.error("Failed to create Post.");
      },
    });
  };

  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <textarea
        placeholder="Share something with Mehfil..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full resize-none outline-none text-sm"
        rows={3}
        id="post-input"
      />
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {previews.map((src, index) => (
            <div key={index} className="relative">
              <img src={src} className="w-full h-24 object-cover rounded-md" />

              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center mt-3">
        <label className="cursor-pointer text-sm text-mehfil-primary">
          📷 Add Image
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
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
