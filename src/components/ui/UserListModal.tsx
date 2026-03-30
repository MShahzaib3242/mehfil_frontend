import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import { dummyImage } from "../../utils/constants";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  data: any[];
  type: "followers" | "following";
  renderAction?: (user: any) => React.ReactNode;
};

function UserListModal({
  open,
  onClose,
  title,
  data,
  type,
  renderAction,
}: Props) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onClose}
          >
            <div
              className="bg-white rounded-2xl w-[400px] max-h-[500px] overflow-y-auto p-4 shadow-xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4 capitalize">{title}</h2>

              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-black"
              >
                x
              </button>

              {data?.map((item: any) => {
                const user =
                  type === "followers" ? item.follower : item.following;

                return (
                  <div
                    className="flex w-full items-center justify-between hover:bg-gray-50"
                    key={user._id}
                  >
                    <div
                      className="flex items-center gap-3 p-2 rounded-lg cursor-pointer"
                      onClick={() => navigate(`/user/${user?._id}`)}
                    >
                      <img
                        src={user.avatar || dummyImage}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    {renderAction && renderAction(user)}
                  </div>
                );
              })}

              {data?.length === 0 && (
                <div className="text-center text-sm text-gray-400 py-6">
                  No users yet
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default UserListModal;
