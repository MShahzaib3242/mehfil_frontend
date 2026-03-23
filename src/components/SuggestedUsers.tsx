import React from "react";
import api from "../api/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const fetchSuggestedUsers = async () => {
  const res = await api.get("/users/suggested");
  return res.data;
};

function SuggestedUsers() {
  const { data, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: fetchSuggestedUsers,
  });

  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      {/* Header  */}
      <div className="text-sm font-semibold mb-4">Suggested for you</div>

      {/* LOADING  */}
      {isLoading && (
        <div className="text-sm text-gray-400">Loading Suggestions...</div>
      )}

      {/* Empty  */}
      {!isLoading && data?.length === 0 && (
        <div className="text-sm text-gray-400">No Suggestions Available</div>
      )}

      {/* USERS LIST  */}
      <div className="flex flex-col gap-3">
        {data?.map((user: any) => (
          <motion.div
            key={user?._id}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || import.meta.env.VITE_STATIC_IMAGE_URL}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-gray-500">@{user.username}</span>
              </div>
            </div>

            {/* FOLLOW BUTTON  */}
            <button className="text-xs px-3 py-1.5 bg-mehfil-primary text-white rounded-full hover:opacity-90 transition">
              Follow
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default SuggestedUsers;
