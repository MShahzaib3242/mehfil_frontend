import api from "./api";

export const createComment = async (postId: string, content: string) => {
  const res = await api.post(`/comments/${postId}/comments`, {
    content,
  });
  return res.data.comment;
};

export const getPostComments = async (postId: string) => {
  const res = await api.get(`/comments/${postId}/comments`);
  return res.data;
};

export const deleteComment = async (commentId: string) => {
  const res = await api.delete(`/comments/comment/${commentId}`);
  return res.data;
};

export const updateComment = async (commentId: string, content: string) => {
  const res = await api.put(`/comments/comment/${commentId}`, { content });
  return res.data;
};
