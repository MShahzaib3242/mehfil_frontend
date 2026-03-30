import React from "react";
import { useActiveUsers } from "../hooks/User/useActiveUsers";
import { useNavigate } from "react-router-dom";
import { dummyImage } from "../utils/constants";
import { timeAgo } from "../utils/timeAgo";
import { useActiveUsersRealtime } from "../hooks/User/useActiveUsersRealtime";
import Loader from "./ui/Loader";
import { useChat } from "../context/ChatContext";

function ActiveUsers() {
  const { data = [], isLoading } = useActiveUsers();
  const navigate = useNavigate();
  const { openChat } = useChat();

  useActiveUsersRealtime();

  if (isLoading) {
    return (
      <div className="bg-white border rounded-xl p-4 flex items-center justify-center h-32">
        <Loader size={18} />
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3">Active Users</h3>

      <div className="flex flex-col gap-3">
        {data.map((u: any) => (
          <div
            key={u._id}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() =>
              openChat({
                _id: u._id,
                name: u.name,
                username: u.username,
                avatar: u.avatar,
              })
            }
          >
            <div className="relative">
              <img
                src={u.avatar || dummyImage}
                alt=""
                className="w-10 h-10 rounded-full"
              />

              {/* Online Dot  */}
              {u.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            {/* Info  */}
            <div className="flex-1">
              <p className="text-sm font-medium">{u.name}</p>

              <p className="text-xs text-gray-500">
                {u.isOnline ? "Online" : `Last seen ${timeAgo(u.lastSeen)}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveUsers;
