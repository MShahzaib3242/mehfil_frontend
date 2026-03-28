import api from "./api";

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const markAsRead = (id: string) =>
  api.patch(`/notifications/${id}/read`);

export const markAllAsRead = () => api.patch(`/notifications/read-all`);
