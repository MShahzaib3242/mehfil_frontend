import api from "./api";

export const getFeed = async () => {
  const response = await api.get("/feed");
  return response.data;
};
