import api from "./api";

export const getMessages = async (userId: string) => {
  const res = await api.get(`/messages/${userId}`);
  return res.data;
};

export const getConversations = async () => {
  const res = await api.get("/messages");
  return res.data;
};

export const deleteConversation = async (userId: string) => {
  const res = await api.delete(`/messages/${userId}`);
  return res.data;
};
