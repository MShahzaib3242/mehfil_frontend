import api from "../api";

export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const updateProfile = async (data: FormData) => {
  const res = await api.put("/users/me", data);

  return res.data;
};

export const getUserProfile = async (userId: string) => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};

export const changePassword = (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  return api.post("/users/change-password", data);
};

export const deactivateAccount = () => {
  return api.post("/users/deactivate");
};
