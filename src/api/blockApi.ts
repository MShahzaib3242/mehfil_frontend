import api from "./api";

export const blockUser = (userId: string) => api.post(`/block/${userId}/block`);

export const unblockUser = (userId: string) =>
  api.delete(`/block/${userId}/unblock`);

export const getBlockedUsers = () => api.get(`/block`);

export const getBlockStatus = async (userId: string) => {
  const res = await api.get(`/block/status/${userId}`);
  return res.data;
};
