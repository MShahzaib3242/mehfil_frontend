import api from "./api";

export const getUserPosts = async (userId: string) => {
  const res = await api.get(`/posts/user/${userId}`);
  return res.data;
};

export const createPost = async (data: FormData) => {
  const res = await api.post("/posts", data);
  return res.data;
};

export const deletePost = async (id: string) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

export const updatePost = async (id: string, data: any) => {
  const res = await api.put(`/posts/${id}`, data);
  return res.data;
};
