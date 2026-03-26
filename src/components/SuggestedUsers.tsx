import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSuggestedUsers } from "../hooks/User/useSuggestedUsers";
import { useToggleFollow } from "../hooks/Impressions/useToggleFollow";
import { useNavigate } from "react-router-dom";

function SuggestedUsers() {
  const { data, isLoading } = useSuggestedUsers();
  const { mutate: toggleFollow, isPending } = useToggleFollow();
  const [openUserId, setOpenUserId] = React.useState<string | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpenUserId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div className="text-sm text-gray-400">
          You're following everyone 🎉
        </div>
      )}

      {/* USERS LIST  */}
      <div className="flex flex-col gap-3">
        {data?.map((user: any) => (
          <motion.div
            key={user?._id}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition"
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/user/${user._id}`)}
            >
              <img
                src={user.avatar || import.meta.env.VITE_STATIC_IMAGE_URL}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-gray-500">@{user.username}</span>
              </div>
            </div>

            <div className="relative flex items-center justify-between">
              {/* FOLLOW BUTTON  */}
              <button
                onClick={() =>
                  user.isFollowing
                    ? setOpenUserId((prev) =>
                        prev === user._id ? null : user._id,
                      )
                    : toggleFollow({
                        userId: user._id,
                        isFollowing: false,
                      })
                }
                className={`text-xs px-3 py-1.5 rounded-full hover:opacity-90 transition ${user.isFollowing ? "bg-mehfil-primary text-white" : "border border-mehfil-primary text-mehfil-primary"}`}
                disabled={isPending}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </button>
              <AnimatePresence>
                {openUserId === user._id && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-10 bg-white border rounded-lg shadow-md p-2 z-50 w-36"
                    ref={popoverRef}
                  >
                    <button
                      onClick={() => navigate(`/user/${user._id}`)}
                      className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm rounded-md"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        toggleFollow({ userId: user._id, isFollowing: true });
                        setOpenUserId(null);
                      }}
                      className="block w-full text-left px-3 py-1 text-red-500 hover:bg-red-50 text-sm rounded-md"
                    >
                      Unfollow
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default SuggestedUsers;
