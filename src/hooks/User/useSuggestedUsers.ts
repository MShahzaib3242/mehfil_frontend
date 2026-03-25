import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";

const fetchSuggestedUsers = async () => {
  const res = await api.get("/users/suggested");
  return res.data;
};

export const useSuggestedUsers = () => {
  return useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: fetchSuggestedUsers,
  });
};
