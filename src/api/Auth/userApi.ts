import api from "../api";

export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const updateProfile = async (data: FormData) => {
  const res = await api.put("/users/me", data);

  return res.data;
};
