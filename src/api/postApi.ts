import api from "./api";

export const getUserPosts = async (userId: string) => {
  const res = await api.get(`/posts/user/${userId}`);
  return res.data;
};
