import React from "react";
import { useBlockedUsers } from "../hooks/User/useBlockedUsers";
import { useBlockUser } from "../hooks/User/useBlock";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./ui/ConfirmDialog";

function BlockedUsersModal({ open, onClose }: any) {
  const navigate = useNavigate();
  const [unblockedIds, setUnblockedIds] = React.useState<string[]>([]);
  const { data = [] } = useBlockedUsers();
  const { mutate } = useBlockUser();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl w-[400px] p-4 max-h-[500px] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold mb-4">Blocked Users</h2>

            {data.length === 0 && (
              <p className="text-sm text-gray-400 text-center">
                No Blocked Users
              </p>
            )}

            {data.map((u: any) => (
              <div
                key={u._id}
                className="flex items-center justify-between p-2"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/user/${u.blocked._id}`)}
                >
                  <img
                    src={
                      u.blocked.avatar || import.meta.env.VITE_STATIC_IMAGE_URL
                    }
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">{u.blocked.name}</p>
                    <p className="text-xs text-gray-500">
                      @{u.blocked.username}
                    </p>
                  </div>
                </div>
                {unblockedIds.includes(u.blocked._id) ? (
                  <button
                    onClick={() => navigate(`/user/${u.blocked._id}`)}
                    className="text-xs px-3 py-1 border border-mehfil-primary text-mehfil-primary rounded-full hover:bg-mehfil-primary hover:text-white"
                  >
                    View Profile
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setConfirmOpen(true);
                    }}
                    className="text-xs px-3 py-1 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white"
                  >
                    Unblock
                  </button>
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={() => {
          if (!selectedUser) return;

          mutate(
            {
              userId: selectedUser.blocked._id,
              isBlocked: true,
            },
            {
              onSuccess: () => {
                setUnblockedIds((prev) => [...prev, selectedUser.blocked._id]);
              },
            },
          );
          setConfirmOpen(false);
          setSelectedUser(null);
        }}
        title="Unblock User?"
        description="They will be able to see your profile and interact with you again."
      />
    </AnimatePresence>
  );
}

export default BlockedUsersModal;
