import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/Notifications/useNotifications";
import Loader from "../components/ui/Loader";
import MainLayout from "../layouts/MainLayout";
import { useMarkNotification } from "../hooks/Notifications/useMarkNotification";
import { CheckCheck } from "lucide-react";
import { dummyImage } from "../utils/constants";

function Notifications() {
  const navigate = useNavigate();
  const { data = [], isLoading } = useNotifications();
  const { markOne, markAll } = useMarkNotification();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <div className="max-w-full bg-white p-4 border border-gray-200 rounded-xl min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <button className="text-xs flex items-center gap-1 text-gray-500 hover:text-black">
            <CheckCheck size={14} /> Mark all as read
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {data.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 text-sm p-10"
            >
              🎉 You're all caught up!
            </motion.div>
          )}

          {data.map((n: any, index: number) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => {
                markOne.mutate(n._id);

                if (n.post) {
                  navigate(`/post/${n.post}`);
                } else {
                  navigate(`/user/${n.sender._id}`);
                }
              }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition border bg-white hover:bg-gray-50 relative`}
            >
              <img
                src={n.sender.avatar || dummyImage}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="flex-1 text-sm">
                <span className="font-medium">{n.sender.name}</span>{" "}
                {n.type === "follow" && "started following you"}
                {n.type === "like" && "liked your post"}
                {n.type === "comment" && "commented on your post"}
                {n.type === "commentLike" && "liked your comment"}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>

              {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default Notifications;
