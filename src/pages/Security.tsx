import React from "react";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import BlockedUsersModal from "../components/BlockedUsersModal";
import { useDeactivateAccount } from "../hooks/User/useDeactivateAccount";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useChangePassword } from "../hooks/User/useChangePassword";
import z from "zod";
import Input from "../components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "../components/ui/Loader";

const schema = z
  .object({
    oldPassword: z.string().min(6, "Old password is required"),
    newPassword: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password did not match.",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

function Security() {
  const [openBlocked, setOpenBlocked] = React.useState(false);

  const [confirmDeactivate, setConfirmDeactivate] = React.useState(false);
  const { mutate: deactivate, isPending } = useDeactivateAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending: changePasswordPending } = useChangePassword();

  const onSubmit = (data: FormData) => {
    mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border rounded-xl p-6 shadow-sm relative"
        >
          <h2 className="text-xl font-semibold mb-4">Security</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-6 w-full flex flex-col gap-3"
          >
            <Input
              type="password"
              placeholder="Enter your old password"
              register={register("oldPassword")}
              error={errors.oldPassword?.message}
            />
            <Input
              type="password"
              placeholder="Enter New Password"
              register={register("newPassword")}
              error={errors.newPassword?.message}
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              register={register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
            <button
              type="submit"
              disabled={changePasswordPending}
              className="text-center bg-black text-white px-4 py-2 text-sm rounded-md flex items-center justify-center"
            >
              {changePasswordPending ? <Loader size={18} /> : "Update Password"}
            </button>
          </form>

          <div className="w-full flex items-center justify-between">
            <button
              onClick={() => setOpenBlocked(true)}
              className="bg-red-500/10 text-red-500 border border-red-500 px-4 py-2 rounded-md text-sm hover:bg-red-500 hover:text-white"
            >
              Blocked Users
            </button>
            <button
              onClick={() => setConfirmDeactivate(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-500 hover:text-white"
            >
              Deactivate Account
            </button>
          </div>
        </motion.div>
      </div>
      <BlockedUsersModal
        open={openBlocked}
        onClose={() => setOpenBlocked(false)}
      />
      <ConfirmDialog
        open={confirmDeactivate}
        onClose={() => setConfirmDeactivate(false)}
        onConfirm={() => {
          deactivate();
          setConfirmDeactivate(false);
        }}
        title="Deactivate Account?"
        description="Your account will be hidden and you will be logged out. This action can be reversed by contacting support."
      />
    </MainLayout>
  );
}

export default Security;
