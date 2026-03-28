import api from "./api";

export const followUser = async (userId: string) => {
  const res = await api.post(`/follow/${userId}/follow`);
  return res.data;
};

export const unfollowUser = async (userId: string) => {
  const res = await api.delete(`/follow/${userId}/unfollow`);
  return res.data;
};

export const removeFollower = async (followerId: string) => {
  const res = await api.delete(`/follow/remove/${followerId}`);
  return res.data;
};
