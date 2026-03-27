import React from "react";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import BlockedUsersModal from "../components/BlockedUsersModal";

function Security() {
  const [openBlocked, setOpenBlocked] = React.useState(false);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border rounded-xl p-6 shadow-sm relative"
        >
          <h2 className="text-xl font-semibold mb-4">Security</h2>

          <div className="mb-6 w-full flex flex-col gap-4 items-end">
            <input placeholder="New Password" className="border p-2 w-full" />
            <button className=" bg-black text-white px-4 py-2 text-sm rounded-md">
              Update Password
            </button>
          </div>

          <div className="w-full flex items-center justify-between">
            <button
              onClick={() => setOpenBlocked(true)}
              className="bg-red-500/10 text-red-500 border border-red-500 px-4 py-2 rounded-md text-sm hover:bg-red-500 hover:text-white"
            >
              Blocked Users
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-500 hover:text-white">
              Deactivate Account
            </button>
          </div>
        </motion.div>
      </div>
      <BlockedUsersModal
        open={openBlocked}
        onClose={() => setOpenBlocked(false)}
      />
    </MainLayout>
  );
}

export default Security;
